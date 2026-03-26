import { useState, useEffect, useCallback, useMemo, useContext } from "react";
import { AdminContext } from "../../../contexts/adminContext/adminContext";
import { UserContext } from "../../../contexts/userContext/userContext";
import { notifySucess, notifyError } from "../../../Toastfy";
import { normalizeListItem, mapPerson } from "../utils/benefitsHelpers";
import { formatCardNumberInput, formatSearchInput } from "../utils/benefitsFormatters";
import { useConfirmModal } from "./useConfirmModal";

const ALLOWED_LEVELS = ["benefitsadmin", "admin", "benefitsoperator"];

export const useBenefitsPortal = () => {
  const { userInfo, navigate, loading } = useContext(UserContext);
  const {
    clients,
    benefitsSelectedCompany,
    setBenefitsSelectedCompany,
    benefitsSearch,
    setBenefitsSearch,
    filterBenefitsBeneficiaries,
    getBenefitsBeneficiaries,
    beneficiariesFetching,
    beneficiariesMeta,
    goBeneficiariesNextPage,
    goBeneficiariesPrevPage,
    getBenefitBeneficiaryDetail,
    markBeneficiaryRegistered,
    setBeneficiaryCardNumber,
    filterBenefitsExclusions,
    getBenefitsExclusions,
    benefitsFetching,
    benefitsMeta,
    goBenefitsNextPage,
    goBenefitsPrevPage,
    sendExclusionReminder,
    markExclusionResolved,
    setExclusionCardNumber,
    loadBenefitsForCompany,
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

  // ─── Guards ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!loading && userLevel && !ALLOWED_LEVELS.includes(userLevel)) {
      navigate("/");
    }
  }, [userLevel, loading, navigate]);

  useEffect(() => {
    if (!benefitsSelectedCompany) setCompanyModalOpen(true);
  }, [benefitsSelectedCompany]);

  useEffect(() => {
    if (benefitsSelectedCompany && companyPick !== benefitsSelectedCompany) {
      setCompanyPick(benefitsSelectedCompany);
    }
  }, [benefitsSelectedCompany, companyPick]);

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const hydrateCardDrafts = (treeData) => {
    const root = mapPerson(treeData);
    const nextDrafts = {
      [root.id]: {
        health: root.CARTEIRINHA_SAUDE || "",
        dental: root.CARTEIRINHA_DENTAL || "",
      },
    };
    (root.DEPENDENTES || []).forEach((dep) => {
      const parsed = mapPerson(dep);
      nextDrafts[parsed.id] = {
        health: parsed.CARTEIRINHA_SAUDE || "",
        dental: parsed.CARTEIRINHA_DENTAL || "",
      };
    });
    setCardDrafts(nextDrafts);
  };

  const getCardDraftValue = (beneficiaryId, cardType) =>
    cardDrafts?.[beneficiaryId]?.[cardType] || "";

  // ─── Derived data ─────────────────────────────────────────────────────────

  const companiesOptions = useMemo(() => {
    const list = Array.isArray(clients) ? clients : [];
    return list
      .filter((c) => c?.active !== false)
      .map((c) => ({ id: c.id, name: c.client_name }))
      .sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }, [clients]);

  const titularList = useMemo(() => {
    let list = [...(filterBenefitsBeneficiaries || [])].map(normalizeListItem);
    if (benefPlanFilter !== "all")
      list = list.filter(
        (item) =>
          String(item.CODIGO_DO_PLANO || "").toUpperCase() ===
          String(benefPlanFilter).toUpperCase()
      );
    if (benefRegistrationFilter !== "all")
      list = list.filter(
        (item) =>
          String(item.PLAN_REGISTRATION_STATUS || "").toLowerCase() ===
          String(benefRegistrationFilter).toLowerCase()
      );
    return list;
  }, [filterBenefitsBeneficiaries, benefPlanFilter, benefRegistrationFilter]);

  const exclusionRows = useMemo(() => {
    let list = [...(filterBenefitsExclusions || [])];
    if (exclStatus !== "all")
      list = list.filter(
        (item) =>
          String(item.status || "").toLowerCase() === String(exclStatus).toLowerCase()
      );
    if (exclPlano)
      list = list.filter(
        (item) =>
          String(item.plan_name || "").toUpperCase() === String(exclPlano).toUpperCase()
      );
    return list;
  }, [filterBenefitsExclusions, exclStatus, exclPlano]);

  const benefitPlanOptions = useMemo(() => {
    const set = new Set();
    (filterBenefitsBeneficiaries || []).forEach((item) => {
      const n = normalizeListItem(item);
      if (n.CODIGO_DO_PLANO) set.add(n.CODIGO_DO_PLANO);
    });
    return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
  }, [filterBenefitsBeneficiaries]);

  const exclusionPlanOptions = useMemo(() => {
    const set = new Set();
    (filterBenefitsExclusions || []).forEach((item) => {
      if (item.plan_name) set.add(item.plan_name);
    });
    return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
  }, [filterBenefitsExclusions]);

  const currentRoot = useMemo(
    () => (selectedTree ? mapPerson(selectedTree) : null),
    [selectedTree]
  );

  // ─── Tree selection ───────────────────────────────────────────────────────

  const handleSelectRoot = useCallback(
    async (rootId) => {
      if (!rootId || !benefitsSelectedCompany) return;
      setSelectedRootId(rootId);
      setSelectedTreeLoading(true);
      try {
        const payload = await getBenefitBeneficiaryDetail(
          rootId,
          benefitsSelectedCompany
        );
        if (!payload?.detail) { setSelectedTree(null); return; }
        setSelectedTree(payload.detail);
        hydrateCardDrafts(payload.detail);
      } catch (error) {
        console.error(error);
        setSelectedTree(null);
      } finally {
        setSelectedTreeLoading(false);
      }
    },
    [benefitsSelectedCompany, getBenefitBeneficiaryDetail]
  );

  useEffect(() => {
    if (!benefitsSelectedCompany || activeTab !== "beneficiaries") return;
    if (!titularList.length) {
      setSelectedRootId(null);
      setSelectedTree(null);
      setCardDrafts({});
      return;
    }
    const stillExists = titularList.some(
      (item) => String(item.id) === String(selectedRootId)
    );
    if (!selectedRootId || !stillExists) handleSelectRoot(titularList[0].id);
  }, [titularList, selectedRootId, benefitsSelectedCompany, activeTab, handleSelectRoot]);

  // ─── Actions ──────────────────────────────────────────────────────────────

  const onConfirmCompany = async () => {
    if (!companyPick) { notifyError("Selecione uma empresa."); return; }
    try {
      await loadBenefitsForCompany(companyPick, "Carregar");
      setBenefitsSelectedCompany(companyPick);
      setSelectedRootId(null);
      setSelectedTree(null);
      setCompanyModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onLoadCompany = async () => {
    if (!benefitsSelectedCompany) { notifyError("Selecione uma empresa."); return; }
    await loadBenefitsForCompany(benefitsSelectedCompany, "Carregar");
    setSelectedRootId(null);
    setSelectedTree(null);
  };

  const onSearch = async () => {
    if (!benefitsSelectedCompany) {
      notifyError("Selecione uma empresa primeiro.");
      return;
    }
    try {
      await Promise.all([
        getBenefitsBeneficiaries("Buscar", benefitsSelectedCompany),
        getBenefitsExclusions("Buscar", benefitsSelectedCompany),
      ]);
      notifySucess("Busca aplicada!");
    } catch (error) {
      console.error(error);
      notifyError("Falha ao buscar no backend.");
    }
  };

  const onCardChange = (beneficiaryId, cardType, value) => {
    setCardDrafts((prev) => ({
      ...prev,
      [beneficiaryId]: {
        ...(prev?.[beneficiaryId] || {}),
        [cardType]: formatCardNumberInput(value),
      },
    }));
  };

  const copyToClipboard = async (text, key) => {
    try {
      const finalText =
        text === null || text === undefined || text === "" ? "" : String(text);
      await navigator.clipboard.writeText(finalText);
      setCopiedKey(key);
      notifySucess("Informação copiada!");
      setTimeout(
        () => setCopiedKey((prev) => (prev === key ? "" : prev)),
        1500
      );
    } catch (error) {
      console.error(error);
      notifyError("Não foi possível copiar.");
    }
  };

  // ─── Card actions (open confirm modal) ────────────────────────────────────

  const handleSavePersonCard = (personRaw, cardType) => {
    const person = mapPerson(personRaw);
    if (!benefitsSelectedCompany) { notifyError("Selecione uma empresa."); return; }
    const value = formatCardNumberInput(getCardDraftValue(person.id, cardType));
    if (!value) {
      notifyError(
        cardType === "health"
          ? "Informe o número da carteirinha de saúde."
          : "Informe o número da carteirinha dental."
      );
      return;
    }
    const labelPerson =
      String(person.TIPO || "").toUpperCase() === "DEPENDENTE"
        ? "dependente"
        : "colaborador";
    const labelCard = cardType === "health" ? "saúde" : "dental";

    confirmModal.open({
      title: `Confirmar carteirinha ${labelCard}`,
      message: `Você tem certeza que a carteirinha ${labelCard} do ${labelPerson} ${person.NOME || "-"} é de número ${value}?`,
      confirmText: "Confirmar carteirinha",
      cancelText: "Cancelar",
      variant: "primary",
      onConfirm: async () => {
        const updatedTree = await setBeneficiaryCardNumber(
          person.id,
          { card_type: cardType, action: "save", card_number: value },
          benefitsSelectedCompany,
          `Salvar carteirinha ${labelCard}`
        );
        if (updatedTree) { setSelectedTree(updatedTree); hydrateCardDrafts(updatedTree); }
      },
    });
  };

  const handleMarkCardMissing = (personRaw, cardType) => {
    const person = mapPerson(personRaw);
    if (!benefitsSelectedCompany) { notifyError("Selecione uma empresa."); return; }
    const labelPerson =
      String(person.TIPO || "").toUpperCase() === "DEPENDENTE"
        ? "dependente"
        : "colaborador";
    const labelCard = cardType === "health" ? "saúde" : "dental";

    confirmModal.open({
      title: `Confirmar ausência de ${labelCard}`,
      message: `Deseja marcar que não existe carteirinha ${labelCard} para o ${labelPerson} ${person.NOME || "-"}?`,
      confirmText: "Sim, marcar",
      cancelText: "Cancelar",
      variant: "ghost",
      onConfirm: async () => {
        const updatedTree = await setBeneficiaryCardNumber(
          person.id,
          { card_type: cardType, action: "mark_missing" },
          benefitsSelectedCompany,
          `Marcar sem ${labelCard}`
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
      message: `Deseja reativar o campo da carteirinha ${labelCard} para ${person.NOME || "-"}? Após isso você poderá digitar novamente a carteirinha.`,
      confirmText: "Reativar campo",
      cancelText: "Cancelar",
      variant: "primary",
      onConfirm: async () => {
        const updatedTree = await setBeneficiaryCardNumber(
          person.id,
          { card_type: cardType, action: "reactivate" },
          benefitsSelectedCompany,
          `Reativar ${labelCard}`
        );
        if (updatedTree) { setSelectedTree(updatedTree); hydrateCardDrafts(updatedTree); }
      },
    });
  };

  const handleMarkRegistered = (personRaw) => {
    const person = mapPerson(personRaw);
    if (!benefitsSelectedCompany) { notifyError("Selecione uma empresa."); return; }
    const labelPerson =
      String(person.TIPO || "").toUpperCase() === "DEPENDENTE"
        ? "dependente"
        : "colaborador";

    confirmModal.open({
      title: "Confirmar cadastro",
      message: `Você deseja confirmar que realizou o cadastro do ${labelPerson} ${person.NOME || "-"}?`,
      confirmText: "Sim, confirmar",
      cancelText: "Cancelar",
      variant: "ghost",
      onConfirm: async () => {
        const updatedTree = await markBeneficiaryRegistered(
          person.id,
          benefitsSelectedCompany,
          "Marcar cadastrado"
        );
        if (updatedTree) { setSelectedTree(updatedTree); hydrateCardDrafts(updatedTree); }
      },
    });
  };

  // ─── Return ───────────────────────────────────────────────────────────────

  return {
    // Context passthrough
    benefitsSelectedCompany,
    setBenefitsSelectedCompany,
    benefitsSearch,
    setBenefitsSearch: (v) => setBenefitsSearch(formatSearchInput(v)),
    sendExclusionReminder,
    markExclusionResolved,
    setExclusionCardNumber,
    // UI state
    activeTab, setActiveTab,
    companyModalOpen, setCompanyModalOpen,
    companyPick, setCompanyPick,
    selectedRootId,
    selectedTreeLoading,
    copiedKey,
    // Filters
    benefPlanFilter, setBenefPlanFilter,
    benefRegistrationFilter, setBenefRegistrationFilter,
    exclStatus, setExclStatus,
    exclPlano, setExclPlano,
    // Derived
    companiesOptions,
    titularList,
    exclusionRows,
    benefitPlanOptions,
    exclusionPlanOptions,
    currentRoot,
    // Pagination
    beneficiariesFetching, beneficiariesMeta,
    goBeneficiariesNextPage, goBeneficiariesPrevPage,
    benefitsFetching, benefitsMeta,
    goBenefitsNextPage, goBenefitsPrevPage,
    // Actions
    handleSelectRoot,
    onConfirmCompany,
    onLoadCompany,
    onSearch,
    onCardChange,
    getCardDraftValue,
    copyToClipboard,
    handleSavePersonCard,
    handleMarkCardMissing,
    handleReactivateCardInput,
    handleMarkRegistered,
    // Modal
    confirmModal,
  };
};