// src/pages/BenefitsPortal/hooks/useBenefitsPortal.js
import { useState, useEffect, useCallback, useMemo, useContext, useRef } from "react";
import { AdminContext } from "../../../contexts/adminContext/adminContext";
import { UserContext } from "../../../contexts/userContext/userContext";
import { api } from "../../../services/api";
import { notifySucess, notifyError } from "../../../Toastfy";
import { normalizeListItem, mapPerson } from "../utils/benefitsHelpers";
import { formatCardNumberInput, formatSearchInput, isValidCardNumber, formatDateTimeBR, sanitizeForCopy } from "../utils/benefitsFormatters";
import { useConfirmModal } from "./useConfirmModal";

const ALLOWED_LEVELS = ["benefitsadmin", "admin", "benefitsoperator"];

export const useBenefitsPortal = () => {
  const { userInfo, navigate, loading, user } = useContext(UserContext);
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
    refreshBenefitsLists, fetchBeneficiariesWithSearch,
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
  const [toRegisterOpen, setToRegisterOpen] = useState(false);
  const [toRegisterLoading, setToRegisterLoading] = useState(false);
  const [toRegisterItems, setToRegisterItems] = useState([]);
  const [toRegisterTotal, setToRegisterTotal] = useState(0);
  // ID a ser destacado na aba de exclusões quando navegado por notificação
  const [highlightExclusionId, setHighlightExclusionId] = useState(null);

  const pendingHighlightRef = useRef(null);
  const handleSelectRootRef = useRef(null);

  // Guards
  useEffect(() => {
    if (!loading && userLevel && !ALLOWED_LEVELS.includes(userLevel) && !user?.perm_benefits) navigate("/");
  }, [userLevel, loading, user, navigate]);

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

  useEffect(() => { handleSelectRootRef.current = handleSelectRoot; }, [handleSelectRoot]);

  useEffect(() => {
    if (!benefitsSelectedCompany || activeTab !== "beneficiaries") return;
    if (!titularList.length) {
      setSelectedRootId(null); setSelectedTree(null); setCardDrafts({});
      return;
    }
    const stillExists = titularList.some((item) => String(item.id) === String(selectedRootId));
    if (!selectedRootId || !stillExists) handleSelectRootRef.current(titularList[0].id);
  }, [titularList, selectedRootId, benefitsSelectedCompany, activeTab]);

  // ── "A cadastrar" — contagem total (titulares + dependentes) e dropdown ──────
  const _calcToRegisterTotal = (results) => {
    // Soma 1 (o próprio titular) + número de dependentes de cada titular
    return results.reduce((acc, item) => acc + 1 + Number(item.dependent_count || 0), 0);
  };

  useEffect(() => {
    setToRegisterItems([]);
    if (!benefitsSelectedCompany) { setToRegisterTotal(0); setToRegisterOpen(false); return; }
    // Busca até 500 titulares para ter os dependent_counts e calcular o total real
    api.get("benefits/beneficiaries/", {
      params: { client_id: benefitsSelectedCompany, plan_registration_status: "to_register", page_size: 500 },
      skipGlobalLoader: true,
    }).then((res) => {
      const results = res.data?.results || [];
      setToRegisterTotal(_calcToRegisterTotal(results));
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benefitsSelectedCompany, filterBenefitsBeneficiaries]);

  const handleOpenToRegister = useCallback(async () => {
    if (toRegisterOpen) { setToRegisterOpen(false); return; }
    setToRegisterOpen(true);
    if (!benefitsSelectedCompany) return;
    setToRegisterLoading(true);
    try {
      const res = await api.get("benefits/beneficiaries/", {
        params: { client_id: benefitsSelectedCompany, plan_registration_status: "to_register", page_size: 100 },
        skipGlobalLoader: true,
      });
      const items = (res.data?.results || []).map(normalizeListItem);
      setToRegisterItems(items);
      setToRegisterTotal(_calcToRegisterTotal(items));
    } catch {
      notifyError("Erro ao carregar pendências.");
    } finally {
      setToRegisterLoading(false);
    }
  }, [benefitsSelectedCompany, toRegisterOpen]);

  // ── Auto-refresh em tempo real ao receber novos webhooks ─────────────────────
  const handleNewNotification = useCallback(async () => {
    if (!benefitsSelectedCompany) return;
    try {
      await refreshBenefitsLists(benefitsSelectedCompany);
      // Se tem um titular selecionado, atualiza a árvore dele também
      if (selectedRootId) {
        const payload = await getBenefitBeneficiaryDetail(selectedRootId, benefitsSelectedCompany);
        if (payload?.detail) {
          setSelectedTree(payload.detail);
          hydrateCardDrafts(payload.detail);
        }
      }
      notifySucess("Portal atualizado — novo evento recebido!");
    } catch (err) {
      console.error(err);
    }
  }, [benefitsSelectedCompany, refreshBenefitsLists, selectedRootId, getBenefitBeneficiaryDetail]);

  // ── Actions
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

  const onClearSearch = useCallback(async () => {
    setBenefitsSearch("");
    if (!benefitsSelectedCompany) return;
    try {
      await fetchBeneficiariesWithSearch("", benefitsSelectedCompany);
    } catch (err) { console.error(err); }
  }, [benefitsSelectedCompany, fetchBeneficiariesWithSearch]);

  const onCardChange = (beneficiaryId, cardType, value) => {
    setCardDrafts((prev) => ({
      ...prev,
      [beneficiaryId]: { ...(prev?.[beneficiaryId] || {}), [cardType]: formatCardNumberInput(value) },
    }));
  };

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(sanitizeForCopy(text));
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
    const healthOk = isValidCardNumber(healthCard) || Boolean(person.NO_HEALTH_CARD);
    const dentalOk = isValidCardNumber(dentalCard) || Boolean(person.NO_DENTAL_CARD);

    if (!healthOk || !dentalOk) {
      const missing = [];
      if (!healthOk) missing.push("saúde");
      if (!dentalOk) missing.push("dental");
      const fields = missing.join(" e ");
      notifyError(`Informe a carteirinha de ${fields} do titular ou marque-a como inexistente antes de enviar o e-mail.`);
      return;
    }

    // ── Verificar se e-mail já foi enviado anteriormente ─────────────────────
    const lastSent = person.LAST_CARD_EMAIL_SENT_AT;
    if (lastSent) {
      const sentFormatted = formatDateTimeBR(lastSent);
      confirmModal.open({
        title: "E-mail já enviado anteriormente",
        message: `Já foi enviado um e-mail de carteirinhas para ${person.EMAIL_DO_COLABORADOR} em ${sentFormatted}. Deseja enviar novamente?`,
        confirmText: "Sim, reenviar",
        cancelText: "Cancelar",
        variant: "primary",
        onConfirm: async () => {
          _openMemberSelectionOrSend(person);
        },
      });
      return;
    }

    _openMemberSelectionOrSend(person);
  };

  const _openMemberSelectionOrSend = (person) => {

    const deps = person.DEPENDENTES || [];

    // Retorna null se o membro está completo, ou a razão específica do bloqueio
    const _getBlockReason = (p) => {
      const dp = mapPerson(p);
      const healthOk = isValidCardNumber(String(dp.CARTEIRINHA_SAUDE || "").trim()) || Boolean(dp.NO_HEALTH_CARD);
      const dentalOk = isValidCardNumber(String(dp.CARTEIRINHA_DENTAL || "").trim()) || Boolean(dp.NO_DENTAL_CARD);
      if (healthOk && dentalOk) return null;
      const missing = [];
      if (!healthOk) missing.push("saúde");
      if (!dentalOk) missing.push("dental");
      const noun = missing.length === 1 ? "Carteirinha" : "Carteirinhas";
      return `${noun} de ${missing.join(" e ")} não cadastrada(s) nem marcada(s) como inexistente(s)`;
    };

    // Separar terminados (excluídos do plano) dos demais
    const terminatedDeps = deps.filter((d) => {
      return String(mapPerson(d).STATUS || "").toLowerCase() === "terminated";
    });
    const nonTerminatedDeps = deps.filter((d) => {
      return String(mapPerson(d).STATUS || "").toLowerCase() !== "terminated";
    });

    const titularBlockReason = _getBlockReason(person);

    // Montar allMembers: titular + não-terminados, desativando quem não está completo
    const allMembers = [
      {
        id: person.id,
        name: person.NOME,
        tipo: "TITULAR",
        checked: titularBlockReason === null,
        disabled: titularBlockReason !== null,
        noCard: titularBlockReason !== null,
        noCardReason: titularBlockReason,
      },
      ...nonTerminatedDeps.map((d) => {
        const dp = mapPerson(d);
        const blockReason = _getBlockReason(dp);
        return {
          id: dp.id,
          name: dp.NOME,
          tipo: "DEPENDENTE",
          checked: blockReason === null,
          disabled: blockReason !== null,
          noCard: blockReason !== null,
          noCardReason: blockReason,
        };
      }),
    ];

    // Se nenhum membro está completo, não há nada para enviar
    const anySelectable = allMembers.some((m) => !m.disabled);
    if (!anySelectable) {
      notifyError("Nenhum membro da família possui ambas as carteirinhas cadastradas ou marcadas como inexistentes.");
      return;
    }

    // Se não tem dependentes (nem terminados), enviar direto se titular tem carteirinha
    if (deps.length === 0) {
      _doSendCardEmail(person, null);
      return;
    }

    // Aviso sobre terminados
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
          m.id === memberId && !m.disabled ? { ...m, checked: !m.checked } : m
        );
      },
      onConfirm: async () => {
        const selectedIds = memberSelection.filter((m) => m.checked && !m.disabled).map((m) => m.id);
        if (selectedIds.length === 0) {
          notifyError("Selecione ao menos um membro com carteirinha.");
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
    handleNewNotification,
    toRegisterOpen, setToRegisterOpen, toRegisterLoading, toRegisterItems, toRegisterTotal,
    handleOpenToRegister,
    onClearSearch,
  };
};