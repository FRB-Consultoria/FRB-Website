// src/pages/BenefitsPortal/hooks/useBenefitsPortal.js
import { useState, useEffect, useCallback, useMemo, useContext, useRef } from "react";
import { AdminContext } from "../../../contexts/adminContext/adminContext";
import { UserContext } from "../../../contexts/userContext/userContext";
import { api } from "../../../services/api";
import { notifySucess, notifyError } from "../../../Toastfy";
import { normalizeListItem, mapPerson } from "../utils/benefitsHelpers";
import { formatCardNumberInput, formatSearchInput, isValidCardNumber } from "../utils/benefitsFormatters";
import { useConfirmModal } from "./useConfirmModal";

const ALLOWED_LEVELS = ["benefitsadmin", "admin", "benefitsoperator"];

export const useBenefitsPortal = () => {
  const { userInfo, navigate, loading } = useContext(UserContext);
  const {
    clients,
    benefitsSelectedCompany, setBenefitsSelectedCompany,
    benefitsSearch, setBenefitsSearch,
    filterBenefitsBeneficiaries, getBenefitsBeneficiaries,
    beneficiariesFetching, beneficiariesMeta,
    goBeneficiariesNextPage, goBeneficiariesPrevPage,
    getBenefitBeneficiaryDetail,
    markBeneficiaryRegistered, setBeneficiaryCardNumber,
    filterBenefitsExclusions, getBenefitsExclusions,
    benefitsFetching, benefitsMeta,
    goBenefitsNextPage, goBenefitsPrevPage,
    sendExclusionReminder, markExclusionResolved,
    setExclusionCardNumber, loadBenefitsForCompany,
    refreshBenefitsLists,
  } = useContext(AdminContext);

  const userLevel = userInfo?.user_level || null;
  const confirmModal = useConfirmModal();

  const [activeTab, setActiveTab] = useState("beneficiaries");
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [companyPick, setCompanyPick] = useState("");
  const [selectedRootId, setSelectedRootId] = useState(null);
  const [selectedTree, setSelectedTree] = useState(null);
  const [selectedTreeLoading, setSelectedTreeLoading] = useState(false);
  const [cardDrafts, setCardDrafts] = useState({});
  const [benefPlanFilter, setBenefPlanFilter] = useState("all");
  const [benefRegistrationFilter, setBenefRegistrationFilter] = useState("all");
  const [exclStatus, setExclStatus] = useState("all");
  const [exclPlano, setExclPlano] = useState("");
  const [copiedKey, setCopiedKey] = useState("");
  // ID a ser destacado na aba de exclusões quando navegado por notificação
  const [highlightExclusionId, setHighlightExclusionId] = useState(null);

  const pendingHighlightRef = useRef(null);

  // Guards
  useEffect(() => {
    if (!loading && userLevel && !ALLOWED_LEVELS.includes(userLevel)) navigate("/");
  }, [userLevel, loading, navigate]);

  useEffect(() => {
    if (!benefitsSelectedCompany) setCompanyModalOpen(true);
  }, [benefitsSelectedCompany]);

  useEffect(() => {
    if (benefitsSelectedCompany && companyPick !== benefitsSelectedCompany) setCompanyPick(benefitsSelectedCompany);
  }, [benefitsSelectedCompany, companyPick]);

  // Helpers
  const hydrateCardDrafts = (treeData) => {
    const root = mapPerson(treeData);
    const nextDrafts = { [root.id]: { health: root.CARTEIRINHA_SAUDE || "", dental: root.CARTEIRINHA_DENTAL || "" } };
    (root.DEPENDENTES || []).forEach((dep) => {
      const parsed = mapPerson(dep);
      nextDrafts[parsed.id] = { health: parsed.CARTEIRINHA_SAUDE || "", dental: parsed.CARTEIRINHA_DENTAL || "" };
    });
    setCardDrafts(nextDrafts);
  };

  const getCardDraftValue = (beneficiaryId, cardType) => cardDrafts?.[beneficiaryId]?.[cardType] || "";

  /**
   * Scroll até o campo exato e foca o input/botão.
   */
  const scrollToAndHighlight = useCallback((personId, fieldType) => {
    if (!personId) return;

    setTimeout(() => {
      const fieldSelector = fieldType
        ? `[data-person-id="${personId}"][data-card-type="${fieldType}"]`
        : null;

      const fieldEl = fieldSelector ? document.querySelector(fieldSelector) : null;

      if (fieldEl) {
        fieldEl.scrollIntoView({ behavior: "smooth", block: "center" });
        fieldEl.classList.add("highlight-blink");
        setTimeout(() => {
          const input = fieldEl.querySelector("input");
          if (input) {
            input.focus();
            const len = input.value.length;
            input.setSelectionRange(len, len);
          } else {
            const btn = fieldEl.querySelector("button");
            if (btn) btn.focus();
          }
          setTimeout(() => fieldEl.classList.remove("highlight-blink"), 3000);
        }, 500);
        return;
      }

      const personEl = document.querySelector(`[data-person-id="${personId}"]`);
      if (personEl) {
        personEl.scrollIntoView({ behavior: "smooth", block: "center" });
        personEl.classList.add("highlight-blink");
        setTimeout(() => {
          const input = personEl.querySelector("input:not([disabled])");
          if (input) {
            input.focus();
            const len = input.value.length;
            input.setSelectionRange(len, len);
          }
          setTimeout(() => personEl.classList.remove("highlight-blink"), 3000);
        }, 500);
      }
    }, 600);
  }, []);

  // Derived data
  const companiesOptions = useMemo(() => {
    const list = Array.isArray(clients) ? clients : [];
    return list.filter((c) => c?.active !== false)
      .map((c) => ({ id: c.id, name: c.client_name }))
      .sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }, [clients]);

  const titularList = useMemo(() => {
    let list = [...(filterBenefitsBeneficiaries || [])].map(normalizeListItem);
    if (benefPlanFilter !== "all")
      list = list.filter((item) => String(item.CODIGO_DO_PLANO || "").toUpperCase() === String(benefPlanFilter).toUpperCase());
    if (benefRegistrationFilter !== "all")
      list = list.filter((item) => String(item.PLAN_REGISTRATION_STATUS || "").toLowerCase() === String(benefRegistrationFilter).toLowerCase());
    return list;
  }, [filterBenefitsBeneficiaries, benefPlanFilter, benefRegistrationFilter]);

  const exclusionRows = useMemo(() => {
    let list = [...(filterBenefitsExclusions || [])];
    if (exclStatus !== "all")
      list = list.filter((item) => String(item.status || "").toLowerCase() === String(exclStatus).toLowerCase());
    if (exclPlano)
      list = list.filter((item) => String(item.plan_name || "").toUpperCase() === String(exclPlano).toUpperCase());
    return list;
  }, [filterBenefitsExclusions, exclStatus, exclPlano]);

  const benefitPlanOptions = useMemo(() => {
    const set = new Set();
    (filterBenefitsBeneficiaries || []).forEach((item) => { const n = normalizeListItem(item); if (n.CODIGO_DO_PLANO) set.add(n.CODIGO_DO_PLANO); });
    return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
  }, [filterBenefitsBeneficiaries]);

  const exclusionPlanOptions = useMemo(() => {
    const set = new Set();
    (filterBenefitsExclusions || []).forEach((item) => { if (item.plan_name) set.add(item.plan_name); });
    return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
  }, [filterBenefitsExclusions]);

  const currentRoot = useMemo(() => (selectedTree ? mapPerson(selectedTree) : null), [selectedTree]);

  // Tree selection
  const handleSelectRoot = useCallback(async (rootId) => {
    if (!rootId || !benefitsSelectedCompany) return;
    setSelectedRootId(rootId);
    setSelectedTreeLoading(true);
    try {
      const payload = await getBenefitBeneficiaryDetail(rootId, benefitsSelectedCompany);
      if (!payload?.detail) { setSelectedTree(null); return; }
      setSelectedTree(payload.detail);
      hydrateCardDrafts(payload.detail);
    } catch (error) {
      console.error(error);
      setSelectedTree(null);
    } finally {
      setSelectedTreeLoading(false);
    }
  }, [benefitsSelectedCompany, getBenefitBeneficiaryDetail]);

  /**
   * Navega para a aba de beneficiários e foca o campo pendente.
   */
  const navigateToBeneficiary = useCallback(async (beneficiaryId, pendingPersonId, pendingField) => {
    if (!beneficiaryId || !benefitsSelectedCompany) return;
    setActiveTab("beneficiaries");
    setHighlightExclusionId(null);

    pendingHighlightRef.current = { personId: pendingPersonId, field: pendingField };

    setSelectedRootId(beneficiaryId);
    setSelectedTreeLoading(true);
    try {
      const payload = await getBenefitBeneficiaryDetail(beneficiaryId, benefitsSelectedCompany);
      if (!payload?.detail) { setSelectedTree(null); return; }
      setSelectedTree(payload.detail);
      hydrateCardDrafts(payload.detail);

      if (pendingPersonId) {
        scrollToAndHighlight(pendingPersonId, pendingField || null);
      }
    } catch (error) {
      console.error(error);
      setSelectedTree(null);
    } finally {
      setSelectedTreeLoading(false);
      pendingHighlightRef.current = null;
    }
  }, [benefitsSelectedCompany, getBenefitBeneficiaryDetail, scrollToAndHighlight]);

  /**
   * Navega para a aba de EXCLUSÕES e destaca o card da família/beneficiário.
   * Chamado quando a notificação é do tipo intake_exclude.
   */
  const navigateToExclusion = useCallback(async (familyRootId) => {
    if (!familyRootId || !benefitsSelectedCompany) return;

    // Garantir que as exclusões estejam carregadas
    await getBenefitsExclusions(false, benefitsSelectedCompany);

    // Mudar para aba de exclusões e sinalizar o ID para highlight
    setActiveTab("exclusions");
    setHighlightExclusionId(familyRootId);

    // Limpar o highlight após alguns segundos
    setTimeout(() => setHighlightExclusionId(null), 5000);
  }, [benefitsSelectedCompany, getBenefitsExclusions]);

  useEffect(() => {
    if (!benefitsSelectedCompany || activeTab !== "beneficiaries") return;
    if (!titularList.length) {
      setSelectedRootId(null); setSelectedTree(null); setCardDrafts({});
      return;
    }
    const stillExists = titularList.some((item) => String(item.id) === String(selectedRootId));
    if (!selectedRootId || !stillExists) handleSelectRoot(titularList[0].id);
  }, [titularList, selectedRootId, benefitsSelectedCompany, activeTab, handleSelectRoot]);

  // Actions
  const onConfirmCompany = async () => {
    if (!companyPick) { notifyError("Selecione uma empresa."); return; }
    try {
      await loadBenefitsForCompany(companyPick, "Carregar");
      setBenefitsSelectedCompany(companyPick);
      setSelectedRootId(null); setSelectedTree(null);
      setCompanyModalOpen(false);
    } catch (error) { console.error(error); }
  };

  const onLoadCompany = async () => {
    if (!benefitsSelectedCompany) { notifyError("Selecione uma empresa."); return; }
    await loadBenefitsForCompany(benefitsSelectedCompany, "Carregar");
    setSelectedRootId(null); setSelectedTree(null);
  };

  const onSearch = async () => {
    if (!benefitsSelectedCompany) { notifyError("Selecione uma empresa primeiro."); return; }
    try {
      await Promise.all([
        getBenefitsBeneficiaries("Buscar", benefitsSelectedCompany),
        getBenefitsExclusions("Buscar", benefitsSelectedCompany),
      ]);
      notifySucess("Busca aplicada!");
    } catch (error) { console.error(error); notifyError("Falha ao buscar."); }
  };

  const onCardChange = (beneficiaryId, cardType, value) => {
    setCardDrafts((prev) => ({
      ...prev,
      [beneficiaryId]: { ...(prev?.[beneficiaryId] || {}), [cardType]: formatCardNumberInput(value) },
    }));
  };

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text === null || text === undefined || text === "" ? "" : String(text));
      setCopiedKey(key);
      notifySucess("Informação copiada!");
      setTimeout(() => setCopiedKey((prev) => (prev === key ? "" : prev)), 1500);
    } catch { notifyError("Não foi possível copiar."); }
  };

  // Card actions
  const handleSavePersonCard = (personRaw, cardType) => {
    const person = mapPerson(personRaw);
    if (!benefitsSelectedCompany) { notifyError("Selecione uma empresa."); return; }
    const value = formatCardNumberInput(getCardDraftValue(person.id, cardType));
    if (!isValidCardNumber(value)) {
      notifyError(`Informe um número válido para a carteirinha de ${cardType === "health" ? "saúde" : "dental"}.`);
      return;
    }
    const labelPerson = String(person.TIPO || "").toUpperCase() === "DEPENDENTE" ? "dependente" : "colaborador";
    const labelCard = cardType === "health" ? "saúde" : "dental";
    confirmModal.open({
      title: `Confirmar carteirinha ${labelCard}`,
      message: `Você tem certeza que a carteirinha ${labelCard} do ${labelPerson} ${person.NOME || "-"} é de número ${value}?`,
      confirmText: "Confirmar carteirinha", cancelText: "Cancelar", variant: "primary",
      onConfirm: async () => {
        const updatedTree = await setBeneficiaryCardNumber(
          person.id, { card_type: cardType, action: "save", card_number: value },
          benefitsSelectedCompany, `Salvar carteirinha ${labelCard}`
        );
        if (updatedTree) { setSelectedTree(updatedTree); hydrateCardDrafts(updatedTree); }
      },
    });
  };

  const handleMarkCardMissing = (personRaw, cardType) => {
    const person = mapPerson(personRaw);
    if (!benefitsSelectedCompany) { notifyError("Selecione uma empresa."); return; }
    const labelPerson = String(person.TIPO || "").toUpperCase() === "DEPENDENTE" ? "dependente" : "colaborador";
    const labelCard = cardType === "health" ? "saúde" : "dental";
    confirmModal.open({
      title: `Confirmar ausência de ${labelCard}`,
      message: `Deseja marcar que não existe carteirinha ${labelCard} para o ${labelPerson} ${person.NOME || "-"}?`,
      confirmText: "Sim, marcar", cancelText: "Cancelar", variant: "ghost",
      onConfirm: async () => {
        const updatedTree = await setBeneficiaryCardNumber(
          person.id, { card_type: cardType, action: "mark_missing" },
          benefitsSelectedCompany, `Marcar sem ${labelCard}`
        );
        if (updatedTree) { setSelectedTree(updatedTree); hydrateCardDrafts(updatedTree); }
      },
    });
  };

  const handleReactivateCardInput = (personRaw, cardType) => {
    const person = mapPerson(personRaw);
    if (!benefitsSelectedCompany) { notifyError("Selecione uma empresa."); return; }
    const labelCard = cardType === "health" ? "saúde" : "dental";
    confirmModal.open({
      title: `Reativar campo ${labelCard}`,
      message: `Deseja reativar o campo da carteirinha ${labelCard} para ${person.NOME || "-"}?`,
      confirmText: "Reativar campo", cancelText: "Cancelar", variant: "primary",
      onConfirm: async () => {
        const updatedTree = await setBeneficiaryCardNumber(
          person.id, { card_type: cardType, action: "reactivate" },
          benefitsSelectedCompany, `Reativar ${labelCard}`
        );
        if (updatedTree) { setSelectedTree(updatedTree); hydrateCardDrafts(updatedTree); }
      },
    });
  };

  const handleMarkRegistered = (personRaw) => {
    const person = mapPerson(personRaw);
    if (!benefitsSelectedCompany) { notifyError("Selecione uma empresa."); return; }
    const labelPerson = String(person.TIPO || "").toUpperCase() === "DEPENDENTE" ? "dependente" : "colaborador";
    confirmModal.open({
      title: "Confirmar cadastro",
      message: `Você deseja confirmar que realizou o cadastro do ${labelPerson} ${person.NOME || "-"}?`,
      confirmText: "Sim, confirmar", cancelText: "Cancelar", variant: "ghost",
      onConfirm: async () => {
        const updatedTree = await markBeneficiaryRegistered(person.id, benefitsSelectedCompany, "Marcar cadastrado");
        if (updatedTree) { setSelectedTree(updatedTree); hydrateCardDrafts(updatedTree); }
      },
    });
  };

  /**
   * Envio de e-mail com carteirinhas.
   * Dependentes com STATUS "terminated" são bloqueados da seleção.
   */
  const handleSendCardEmail = (personRaw) => {
    const person = mapPerson(personRaw);
    if (!benefitsSelectedCompany) { notifyError("Selecione uma empresa."); return; }

    if (String(person.TIPO || "").toUpperCase() === "DEPENDENTE") {
      notifyError("Somente o titular pode disparar o envio de e-mail.");
      return;
    }
    if (!person.EMAIL_DO_COLABORADOR) {
      notifyError("Titular não possui e-mail cadastrado.");
      return;
    }

    const healthCard = String(person.CARTEIRINHA_SAUDE || "").trim();
    const dentalCard = String(person.CARTEIRINHA_DENTAL || "").trim();
    const healthValid = isValidCardNumber(healthCard);
    const dentalValid = isValidCardNumber(dentalCard);

    if (!healthValid && !dentalValid) {
      notifyError("Informe ao menos uma carteirinha com numeração válida antes de enviar o e-mail.");
      return;
    }

    const deps = person.DEPENDENTES || [];

    // Filtrar dependentes TERMINADOS — não podem receber e-mail
    const activeDeps = deps.filter((d) => {
      const dp = mapPerson(d);
      return String(dp.STATUS || "").toLowerCase() !== "terminated";
    });
    const terminatedDeps = deps.filter((d) => {
      const dp = mapPerson(d);
      return String(dp.STATUS || "").toLowerCase() === "terminated";
    });

    const allMembers = [
      { id: person.id, name: person.NOME, tipo: "TITULAR", checked: true, disabled: false },
      ...activeDeps.map((d) => {
        const dp = mapPerson(d);
        return { id: dp.id, name: dp.NOME, tipo: "DEPENDENTE", checked: true, disabled: false };
      }),
    ];

    // Se não tem dependentes ativos, enviar direto
    if (activeDeps.length === 0 && deps.length === 0) {
      _doSendCardEmail(person, null);
      return;
    }

    // Montar aviso sobre dependentes excluídos
    const terminatedWarning = terminatedDeps.length > 0
      ? `Nota: ${terminatedDeps.map((d) => mapPerson(d).NOME).join(", ")} ${terminatedDeps.length === 1 ? "foi excluído" : "foram excluídos"} do plano e não ${terminatedDeps.length === 1 ? "será incluído" : "serão incluídos"} neste envio.`
      : null;

    let memberSelection = allMembers.map((m) => ({ ...m }));

    confirmModal.open({
      title: "Selecionar membros para o e-mail",
      message: terminatedWarning || "",
      confirmText: "Enviar e-mail",
      cancelText: "Cancelar",
      variant: "primary",
      emailTo: person.EMAIL_DO_COLABORADOR,
      memberSelection,
      onMemberToggle: (memberId) => {
        memberSelection = memberSelection.map((m) =>
          m.id === memberId ? { ...m, checked: !m.checked } : m
        );
      },
      onConfirm: async () => {
        const selectedIds = memberSelection.filter((m) => m.checked).map((m) => m.id);
        if (selectedIds.length === 0) {
          notifyError("Selecione ao menos um membro.");
          throw new Error("Nenhum membro selecionado");
        }
        await _doSendCardEmail(person, selectedIds);
      },
    });
  };

  const _doSendCardEmail = async (person, selectedMemberIds) => {
    try {
      const body = { client_id: benefitsSelectedCompany };
      if (selectedMemberIds) body.selected_member_ids = selectedMemberIds;

      const res = await api.post(
        `benefits/beneficiaries/${person.id}/send-card-email/`,
        body
      );
      if (res.data?.tree) { setSelectedTree(res.data.tree); hydrateCardDrafts(res.data.tree); }
      notifySucess(`E-mail enviado para ${res.data?.email_sent_to || person.EMAIL_DO_COLABORADOR}!`);
    } catch (err) {
      console.error(err);
      notifyError(err?.response?.data?.detail || "Falha ao enviar e-mail.");
    }
  };

  return {
    benefitsSelectedCompany, setBenefitsSelectedCompany,
    benefitsSearch, setBenefitsSearch: (v) => setBenefitsSearch(formatSearchInput(v)),
    sendExclusionReminder, markExclusionResolved, setExclusionCardNumber,
    activeTab, setActiveTab,
    companyModalOpen, setCompanyModalOpen,
    companyPick, setCompanyPick,
    selectedRootId, selectedTreeLoading, copiedKey,
    benefPlanFilter, setBenefPlanFilter,
    benefRegistrationFilter, setBenefRegistrationFilter,
    exclStatus, setExclStatus, exclPlano, setExclPlano,
    companiesOptions, titularList, exclusionRows,
    benefitPlanOptions, exclusionPlanOptions, currentRoot,
    beneficiariesFetching, beneficiariesMeta,
    goBeneficiariesNextPage, goBeneficiariesPrevPage,
    benefitsFetching, benefitsMeta,
    goBenefitsNextPage, goBenefitsPrevPage,
    handleSelectRoot, onConfirmCompany, onLoadCompany, onSearch,
    onCardChange, getCardDraftValue, copyToClipboard,
    handleSavePersonCard, handleMarkCardMissing,
    handleReactivateCardInput, handleMarkRegistered,
    handleSendCardEmail, navigateToBeneficiary, navigateToExclusion,
    confirmModal,
    highlightExclusionId,
  };
};