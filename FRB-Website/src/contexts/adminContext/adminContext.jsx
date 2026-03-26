// eslint-disable-next-line react/prop-types
import { createContext, useState, useEffect, useContext, useRef } from "react";
import { notifySucess, notifyError } from "../../Toastfy";
import { UserContext } from "../userContext/userContext";
import { api } from "../../services/api";
import "react-toastify/dist/ReactToastify.css";

export const AdminContext = createContext({});

export const AdminProvider = ({ children }) => {
  const { user, setLoading, setClientModal, setCompanyModal, setSpinner } =
    useContext(UserContext);

  const [clients, setClients] = useState(null);
  const [users, setUsers] = useState(null);
  const [filterClient, setFilterClient] = useState([]);
  const [filter, setFilter] = useState([]);
  const [target, setTarget] = useState("");
  const [document, setDocument] = useState(null);
  const [spinnerPost, setSpinnerPost] = useState(false);
  const [filterDocument, setFilterDocument] = useState([]);
  const [subinvoices, setSubinvoices] = useState([]);
  const [filterSubinvoice, setFilterSubinvoice] = useState([]);
  const [sub, setSub] = useState(null);
  const [filterSub, setFilterSub] = useState([]);
  const [shipEmail, setShipEmail] = useState(null);
  const [filterShipEmail, setFilterShipEmail] = useState([]);

  const BENEFITS_EXCLUSIONS_ENDPOINT =
    import.meta.env.VITE_BENEFITS_EXCLUSIONS_ENDPOINT || "benefits/exclusions/";
  const BENEFITS_BENEFICIARIES_ENDPOINT =
    import.meta.env.VITE_BENEFITS_BENEFICIARIES_ENDPOINT ||
    "benefits/beneficiaries/";

  const BENEFITS_BENEFICIARY_DETAIL_ENDPOINT = (id) =>
    `benefits/beneficiaries/${id}/`;
  const BENEFITS_BENEFICIARY_EVENTS_ENDPOINT = (id) =>
    `benefits/beneficiaries/${id}/events/`;
  const BENEFITS_BENEFICIARY_MARK_REGISTERED_ACTION = (id) =>
    `benefits/beneficiaries/${id}/mark-registered/`;
  const BENEFITS_BENEFICIARY_SET_CARD_ACTION = (id) =>
    `benefits/beneficiaries/${id}/set-card/`;
  const BENEFITS_EXCLUSION_SEND_REMINDER_ACTION = (id) =>
    `${BENEFITS_EXCLUSIONS_ENDPOINT}${id}/send-reminder/`;
  const BENEFITS_EXCLUSION_DETAIL_ENDPOINT = (id) =>
    `${BENEFITS_EXCLUSIONS_ENDPOINT}${id}/`;
  const BENEFITS_EXCLUSION_SET_CARD_ACTION = (id) =>
    `${BENEFITS_EXCLUSIONS_ENDPOINT}${id}/set-card/`;

  const benefitsEndpoints = {
    exclusions: BENEFITS_EXCLUSIONS_ENDPOINT,
    beneficiaries: BENEFITS_BENEFICIARIES_ENDPOINT,
  };

  const [benefitsSelectedCompany, setBenefitsSelectedCompany] = useState(null);
  const [benefitsSearch, setBenefitsSearch] = useState("");
  const [benefitsBeneficiaries, setBenefitsBeneficiaries] = useState([]);
  const [filterBenefitsBeneficiaries, setFilterBenefitsBeneficiaries] =
    useState([]);
  const [beneficiariesFetching, setBeneficiariesFetching] = useState(false);
  const [beneficiariesMeta, setBeneficiariesMeta] = useState({
    count: 0,
    next: null,
    previous: null,
    page: 1,
    page_size: 20,
  });

  const [benefitsExclusions, setBenefitsExclusions] = useState([]);
  const [filterBenefitsExclusions, setFilterBenefitsExclusions] = useState([]);
  const [benefitsFetching, setBenefitsFetching] = useState(false);
  const [benefitsMeta, setBenefitsMeta] = useState({
    count: 0,
    next: null,
    previous: null,
    page: 1,
    page_size: 50,
  });

  const beneficiariesCacheRef = useRef(new Map());
  const exclusionsCacheRef = useRef(new Map());

  const extractPageFromUrl = (url) => {
    try {
      const u = new URL(url);
      const p = Number(u.searchParams.get("page") || 1);
      return Number.isFinite(p) ? p : 1;
    } catch {
      return 1;
    }
  };

  const requireCompany = (clientIdOverride = null) => {
    const selectedClientId = clientIdOverride || benefitsSelectedCompany;
    if (!selectedClientId) {
      notifyError("Selecione uma empresa para carregar os dados.");
      return false;
    }
    return true;
  };

  const buildScopedParams = (params = {}, clientIdOverride = null) => {
    const selectedClientId = clientIdOverride || benefitsSelectedCompany;
    return {
      ...params,
      client_id: selectedClientId,
    };
  };

  const setBeneficiariesFromResponse = (results, meta) => {
    setBenefitsBeneficiaries(results);
    setFilterBenefitsBeneficiaries(results);
    setBeneficiariesMeta(meta);
  };

  const setExclusionsFromResponse = (results, meta) => {
    setBenefitsExclusions(results);
    setFilterBenefitsExclusions(results);
    setBenefitsMeta(meta);
  };

  const fetchBenefitsBeneficiaries = async ({
    page = 1,
    url = null,
    search = null,
    button_name = false,
    silent = false,
    clientId = null,
  } = {}) => {
    const selectedClientId = clientId || benefitsSelectedCompany;
    if (!requireCompany(selectedClientId)) return [];

    const finalSearch = search !== null ? search : benefitsSearch;
    const cacheKey = url
      ? `url:${url}`
      : `page:${page}|client:${selectedClientId}|q:${finalSearch || ""}`;

    if (beneficiariesCacheRef.current.has(cacheKey) && !silent) {
      const cached = beneficiariesCacheRef.current.get(cacheKey);
      setBeneficiariesFromResponse(cached.results || [], {
        count: cached.count || 0,
        next: cached.next || null,
        previous: cached.previous || null,
        page: cached.page || page,
        page_size: cached.page_size || 20,
      });
      return cached.results || [];
    }

    try {
      if (button_name) setSpinner(button_name);
      setBeneficiariesFetching(true);

      const response = url
        ? await api.get(url)
        : await api.get(BENEFITS_BENEFICIARIES_ENDPOINT, {
            params: buildScopedParams(
              {
                page,
                q: finalSearch || undefined,
              },
              selectedClientId
            ),
          });

      const data = response.data || {};
      const results = data.results || [];
      const meta = {
        count: Number(data.count || results.length || 0),
        next: data.next || null,
        previous: data.previous || null,
        page: url ? extractPageFromUrl(url) : page,
        page_size: Number(data.page_size || 20),
      };

      beneficiariesCacheRef.current.set(cacheKey, { results, ...meta });
      setBeneficiariesFromResponse(results, meta);
      return results;
    } catch (err) {
      console.error(err);
      notifyError("Não foi possível carregar beneficiários.");
      setBeneficiariesFromResponse([], {
        count: 0,
        next: null,
        previous: null,
        page: 1,
        page_size: 20,
      });
      return [];
    } finally {
      setLoading(false);
      setSpinner(false);
      setBeneficiariesFetching(false);
    }
  };

  const getBenefitsBeneficiaries = async (
    button_name = false,
    clientIdOverride = null
  ) => {
    return fetchBenefitsBeneficiaries({
      page: 1,
      search: benefitsSearch,
      button_name,
      silent: false,
      clientId: clientIdOverride,
    });
  };

  const goBeneficiariesNextPage = async (button_name = false) => {
    if (!beneficiariesMeta.next) return [];
    return fetchBenefitsBeneficiaries({
      url: beneficiariesMeta.next,
      button_name,
      silent: false,
    });
  };

  const goBeneficiariesPrevPage = async (button_name = false) => {
    if (!beneficiariesMeta.previous) return [];
    return fetchBenefitsBeneficiaries({
      url: beneficiariesMeta.previous,
      button_name,
      silent: false,
    });
  };

  const fetchBenefitsExclusions = async ({
    page = 1,
    url = null,
    search = null,
    button_name = false,
    silent = false,
    clientId = null,
  } = {}) => {
    const selectedClientId = clientId || benefitsSelectedCompany;
    if (!requireCompany(selectedClientId)) return [];

    const finalSearch = search !== null ? search : benefitsSearch;
    const cacheKey = url
      ? `url:${url}`
      : `page:${page}|client:${selectedClientId}|q:${finalSearch || ""}`;

    if (exclusionsCacheRef.current.has(cacheKey) && !silent) {
      const cached = exclusionsCacheRef.current.get(cacheKey);
      setExclusionsFromResponse(cached.results || [], {
        count: cached.count || 0,
        next: cached.next || null,
        previous: cached.previous || null,
        page: cached.page || page,
        page_size: cached.page_size || 50,
      });
      return cached.results || [];
    }

    try {
      if (button_name) setSpinner(button_name);
      setBenefitsFetching(true);

      const response = url
        ? await api.get(url)
        : await api.get(BENEFITS_EXCLUSIONS_ENDPOINT, {
            params: buildScopedParams(
              {
                page,
                q: finalSearch || undefined,
              },
              selectedClientId
            ),
          });

      const data = response.data || {};
      const results = data.results || [];
      const meta = {
        count: Number(data.count || results.length || 0),
        next: data.next || null,
        previous: data.previous || null,
        page: url ? extractPageFromUrl(url) : page,
        page_size: Number(data.page_size || 50),
      };

      exclusionsCacheRef.current.set(cacheKey, { results, ...meta });
      setExclusionsFromResponse(results, meta);
      return results;
    } catch (err) {
      console.error(err);
      notifyError("Não foi possível carregar exclusões.");
      setExclusionsFromResponse([], {
        count: 0,
        next: null,
        previous: null,
        page: 1,
        page_size: 50,
      });
      return [];
    } finally {
      setLoading(false);
      setSpinner(false);
      setBenefitsFetching(false);
    }
  };

  const getBenefitsExclusions = async (
    button_name = false,
    clientIdOverride = null
  ) => {
    return fetchBenefitsExclusions({
      page: 1,
      search: benefitsSearch,
      button_name,
      silent: false,
      clientId: clientIdOverride,
    });
  };

  const goBenefitsNextPage = async (button_name = false) => {
    if (!benefitsMeta.next) return [];
    return fetchBenefitsExclusions({
      url: benefitsMeta.next,
      button_name,
      silent: false,
    });
  };

  const goBenefitsPrevPage = async (button_name = false) => {
    if (!benefitsMeta.previous) return [];
    return fetchBenefitsExclusions({
      url: benefitsMeta.previous,
      button_name,
      silent: false,
    });
  };

  const refreshBenefitsLists = async (clientIdOverride = null) => {
    const selectedClientId = clientIdOverride || benefitsSelectedCompany;
    if (!selectedClientId) return;

    beneficiariesCacheRef.current.clear();
    exclusionsCacheRef.current.clear();

    await Promise.all([
      fetchBenefitsBeneficiaries({
        page: beneficiariesMeta.page || 1,
        search: benefitsSearch,
        silent: true,
        clientId: selectedClientId,
      }),
      fetchBenefitsExclusions({
        page: benefitsMeta.page || 1,
        search: benefitsSearch,
        silent: true,
        clientId: selectedClientId,
      }),
    ]);
  };

  const getBenefitBeneficiaryDetail = async (
    beneficiaryId,
    clientIdOverride = null
  ) => {
    const selectedClientId = clientIdOverride || benefitsSelectedCompany;
    if (!requireCompany(selectedClientId)) return null;

    try {
      const [detailRes, eventsRes] = await Promise.all([
        api.get(BENEFITS_BENEFICIARY_DETAIL_ENDPOINT(beneficiaryId), {
          params: buildScopedParams({}, selectedClientId),
        }),
        api.get(BENEFITS_BENEFICIARY_EVENTS_ENDPOINT(beneficiaryId), {
          params: buildScopedParams({}, selectedClientId),
        }),
      ]);

      return {
        detail: detailRes?.data || null,
        events: eventsRes?.data?.results || eventsRes?.data || [],
      };
    } catch (err) {
      console.error(err);
      notifyError("Não foi possível carregar os detalhes do beneficiário.");
      return null;
    }
  };

  const markBeneficiaryRegistered = async (
    beneficiaryId,
    clientIdOverride = null,
    button_name = "Cadastrar"
  ) => {
    const selectedClientId = clientIdOverride || benefitsSelectedCompany;
    if (!requireCompany(selectedClientId)) return null;

    try {
      setSpinner(button_name);
      const res = await api.post(
        BENEFITS_BENEFICIARY_MARK_REGISTERED_ACTION(beneficiaryId),
        { client_id: selectedClientId }
      );
      await refreshBenefitsLists(selectedClientId);
      notifySucess("Beneficiário marcado como cadastrado no plano!");
      return res?.data || null;
    } catch (err) {
      console.error(err);
      notifyError("Não foi possível marcar como cadastrado.");
      return null;
    } finally {
      setLoading(false);
      setSpinner(false);
    }
  };

  const setBeneficiaryCardNumber = async (
    beneficiaryId,
    payload,
    clientIdOverride = null,
    button_name = "Salvar"
  ) => {
    const selectedClientId = clientIdOverride || benefitsSelectedCompany;
    if (!requireCompany(selectedClientId)) return null;

    const action = payload?.action || "save";
    const finalPayload = {
      client_id: selectedClientId,
      card_type: payload?.card_type,
      action,
      card_number: String(payload?.card_number || "").trim(),
    };

    if (!finalPayload.card_type) {
      notifyError("Informe o tipo da carteirinha.");
      return null;
    }

    if (action === "save" && !finalPayload.card_number) {
      notifyError("Informe o número da carteirinha.");
      return null;
    }

    try {
      setSpinner(button_name);
      const res = await api.post(
        BENEFITS_BENEFICIARY_SET_CARD_ACTION(beneficiaryId),
        finalPayload
      );
      await refreshBenefitsLists(selectedClientId);

      if (action === "mark_missing") {
        notifySucess("Campo marcado como inexistente com sucesso!");
      } else if (action === "reactivate") {
        notifySucess("Campo reativado com sucesso!");
      } else {
        notifySucess("Carteirinha salva com sucesso!");
      }

      return res?.data || null;
    } catch (err) {
      console.error(err);
      notifyError(
        err?.response?.data?.detail ||
          err?.response?.data?.card_number?.[0] ||
          err?.response?.data?.card_type?.[0] ||
          err?.response?.data?.action?.[0] ||
          "Falha ao atualizar carteirinha."
      );
      return null;
    } finally {
      setLoading(false);
      setSpinner(false);
    }
  };

  const updateExclusionLocal = (id, patchOrFull) => {
    const apply = (arr) =>
      (arr || []).map((it) =>
        String(it.id) === String(id) ? { ...it, ...patchOrFull } : it
      );

    setBenefitsExclusions((prev) => apply(prev));
    setFilterBenefitsExclusions((prev) => apply(prev));
  };

  const sendExclusionReminder = async (
    exclusionId,
    button_name = "Enviar",
    clientIdOverride = null
  ) => {
    const selectedClientId = clientIdOverride || benefitsSelectedCompany;
    if (!requireCompany(selectedClientId)) return;

    try {
      setSpinner(button_name);
      await api.post(BENEFITS_EXCLUSION_SEND_REMINDER_ACTION(exclusionId), {
        client_id: selectedClientId,
      });
      await refreshBenefitsLists(selectedClientId);
      notifySucess("Lembrete enviado com sucesso!");
    } catch (err) {
      console.error(err);
      notifyError("Não foi possível enviar o lembrete.");
    } finally {
      setLoading(false);
      setSpinner(false);
    }
  };

  const markExclusionResolved = async (
    exclusionId,
    button_name = "Resolver",
    clientIdOverride = null
  ) => {
    const selectedClientId = clientIdOverride || benefitsSelectedCompany;
    if (!requireCompany(selectedClientId)) return;

    try {
      setSpinner(button_name);
      const res = await api.patch(BENEFITS_EXCLUSION_DETAIL_ENDPOINT(exclusionId), {
        client_id: selectedClientId,
      });
      updateExclusionLocal(exclusionId, res?.data || { status: "resolved" });
      await refreshBenefitsLists(selectedClientId);
      notifySucess("Exclusão marcada como resolvida!");
    } catch (err) {
      console.error(err);
      notifyError("Não foi possível marcar como resolvido.");
    } finally {
      setLoading(false);
      setSpinner(false);
    }
  };

  const setExclusionCardNumber = async (
    exclusionId,
    payload,
    button_name = "Salvar",
    clientIdOverride = null
  ) => {
    const selectedClientId = clientIdOverride || benefitsSelectedCompany;
    if (!requireCompany(selectedClientId)) return null;

    const action = payload?.action || "save";
    const finalPayload = {
      client_id: selectedClientId,
      card_type: payload?.card_type,
      action,
      card_number: String(payload?.card_number || "").trim(),
    };

    if (!finalPayload.card_type) {
      notifyError("Informe o tipo da carteirinha.");
      return null;
    }

    if (action === "save" && !finalPayload.card_number) {
      notifyError("Informe o número da carteirinha.");
      return null;
    }

    try {
      setSpinner(button_name);
      const res = await api.post(
        BENEFITS_EXCLUSION_SET_CARD_ACTION(exclusionId),
        finalPayload
      );
      updateExclusionLocal(exclusionId, res?.data || {});
      await refreshBenefitsLists(selectedClientId);

      if (action === "mark_missing") {
        notifySucess("Campo marcado como inexistente com sucesso!");
      } else if (action === "reactivate") {
        notifySucess("Campo reativado com sucesso!");
      } else {
        notifySucess("Carteirinha salva com sucesso!");
      }

      return res?.data || null;
    } catch (err) {
      console.error(err);
      notifyError(
        err?.response?.data?.detail ||
          err?.response?.data?.card_number?.[0] ||
          err?.response?.data?.card_type?.[0] ||
          err?.response?.data?.action?.[0] ||
          "Falha ao salvar carteirinha."
      );
      return null;
    } finally {
      setLoading(false);
      setSpinner(false);
    }
  };

  const loadBenefitsForCompany = async (
    clientId,
    button_name = "Carregar"
  ) => {
    if (!clientId) {
      notifyError("Selecione uma empresa.");
      return [];
    }

    setBenefitsSelectedCompany(clientId);
    beneficiariesCacheRef.current.clear();
    exclusionsCacheRef.current.clear();

    try {
      setSpinner(button_name);
      const [beneficiariesResults, exclusionsResults] = await Promise.all([
        fetchBenefitsBeneficiaries({
          page: 1,
          search: benefitsSearch,
          silent: false,
          clientId,
        }),
        fetchBenefitsExclusions({
          page: 1,
          search: benefitsSearch,
          silent: false,
          clientId,
        }),
      ]);
      notifySucess("Dados carregados!");
      return [beneficiariesResults, exclusionsResults];
    } catch (err) {
      console.error(err);
      notifyError("Não foi possível carregar os dados.");
      return [];
    } finally {
      setLoading(false);
      setSpinner(false);
    }
  };

  useEffect(() => {
    async function getClients() {
      try {
        setSpinner(true);
        const response = await api.get("clients/");
        setFilterClient(response.data.results);
        setClients(response.data.results);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        setSpinner(false);
      }
    }
    if (!user) return;
    getClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    async function getDocuments() {
      try {
        setSpinner(true);
        let allClients = [];

        const fetchPages = async (url) => {
          const response = await api.get(url);
          const newClients = response.data.results;
          allClients = [...allClients, ...newClients];
          if (response.data.next) {
            await fetchPages(response.data.next);
          }
        };

        await fetchPages("documents/");
        setDocument(allClients);
        setFilterDocument(allClients);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        setSpinner(false);
      }
    }

    if (!user) return;
    if (
      user.user_level === "benefitsadmin" ||
      user.user_level === "benefitsoperator"
    )
      return;
    getDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getSubinvoices2 = async () => {
    try {
      setSpinner(true);
      let allSubinvoices = [];

      const fetchPages = async (url) => {
        const response = await api.get(url);
        const newSubinvoices = response.data.results;
        allSubinvoices = [...allSubinvoices, ...newSubinvoices];
        if (response.data.next) {
          await fetchPages(response.data.next);
        }
      };

      await fetchPages("subinvoices/");
      setSubinvoices(allSubinvoices);
      setFilterSubinvoice(allSubinvoices);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setSpinner(false);
    }
  };

  useEffect(() => {
    async function getSubinvoices() {
      try {
        setSpinner(true);
        let allClients = [];

        const fetchPages = async (url) => {
          const response = await api.get(url);
          const newClients = response.data.results;
          allClients = [...allClients, ...newClients];
          if (response.data.next) {
            await fetchPages(response.data.next);
          }
        };

        await fetchPages("subinvoices/");
        setSubinvoices(allClients);
        setFilterSubinvoice(allClients);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        setSpinner(false);
      }
    }

    if (!user) return;
    if (
      user.user_level === "benefitsadmin" ||
      user.user_level === "benefitsoperator"
    )
      return;
    getSubinvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const filterSubinvoicesByMonthAndYear = (month, year) => {
    const filtered = subinvoices.filter((subinvoice) => {
      return subinvoice.month === month && subinvoice.year === year;
    });
    setFilterSubinvoice(filtered);
  };

  const createUser = async (body, client_id, button_name) => {
    body.username = body.email;
    body.password = body.email;
    body.client_id = client_id;
    try {
      setSpinner(button_name);
      await api.post("users/", body);
      setUsers(
        (await api.get("users/")).data.results.filter(
          (userItem) => userItem.client_id == client_id
        )
      );
      setClientModal(false);
      notifySucess("Usuário criado com sucesso!");
    } catch (err) {
      console.log(err);
      notifyError("Não foi possível criar o usuário");
    } finally {
      setLoading(false);
      setSpinner(false);
    }
  };

  const updateUser = async (body, user_id, client_id, button_name) => {
    try {
      setSpinner(button_name);
      await api.patch(`users/${user_id}/`, body);
      setUsers(
        (await api.get("users/")).data.results.filter(
          (userItem) => userItem.client_id == client_id
        )
      );
      setClientModal(false);
      notifySucess("Usuário atualizado com sucesso!");
    } catch (err) {
      console.log(err);
      notifyError("Não foi possível atualizar o usuário");
    } finally {
      setLoading(false);
      setSpinner(false);
    }
  };

  const deleteUser = async (user_id, client_id, button_name) => {
    try {
      setSpinner(button_name);
      await api.delete(`users/${user_id}/`);
      setUsers(
        (await api.get("users/")).data.results.filter(
          (userItem) => userItem.client_id == client_id
        )
      );
      setClientModal(false);
      notifySucess("Usuário deletado com sucesso!");
    } catch (err) {
      console.log(err);
      notifyError("Não foi possível deletar o usuário");
    } finally {
      setLoading(false);
      setSpinner(false);
    }
  };

  const deactivateUser = async (user_id, active, client_id) => {
    try {
      await api.patch(`users/${user_id}/`, { active: !active });
      setUsers(
        (await api.get("users/")).data.results.filter(
          (userItem) => userItem.client_id == client_id
        )
      );
      notifySucess("Usuário desativado com sucesso!");
    } catch (err) {
      console.log(err);
      notifyError("Não foi possível desativar o usuário");
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (body, button_name) => {
    try {
      setSpinner(button_name);
      setSpinnerPost(true);
      const response = await api.post("documents/", body);
      setDocument((prevFilterProvider) => [response.data, ...prevFilterProvider]);
      setClientModal(false);
      notifySucess("Envio de fatura concluído");
    } catch (err) {
      console.error(err);
      console.error("Erro do backend:", err.response?.data);
      notifyError("Não foi possível enviar a fatura");
    } finally {
      setLoading(false);
      setSpinner(false);
      setSpinnerPost(false);
    }
  };

  const createSub = async (body, button_name) => {
    try {
      setSpinner(button_name);
      const response = await api.post("subinvoices/", body);
      setSub((prevFilterProvider) => {
        if (Array.isArray(prevFilterProvider))
          return [response.data, ...prevFilterProvider];
        return [response.data];
      });
      setClientModal(false);
      notifySucess("Subfatura criada com sucesso!");
    } catch (err) {
      console.error(err);
      console.error("Erro do backend:", err.response?.data);
      notifyError("Não foi possível criar a subfatura");
    } finally {
      setLoading(false);
      setSpinner(false);
      setSpinnerPost(false);
    }
  };

  const createEmail = async (button_name) => {
    try {
      setSpinner(button_name);
      const response = await api.post("trigger-send-invoice-reminder/");
      setShipEmail((prevFilterProvider) => {
        if (Array.isArray(prevFilterProvider))
          return [response.data, ...prevFilterProvider];
        return [response.data];
      });
      notifySucess("E-mail enviado com sucesso!");
    } catch (err) {
      console.error(err);
      console.error("Erro do backend:", err.response?.data);
      notifyError("Não foi possível enviar o e-mail");
    } finally {
      setLoading(false);
      setSpinner(false);
      setSpinnerPost(false);
    }
  };

  const createClient = async (body, button_name) => {
    try {
      setSpinner(button_name);
      await api.post("clients/", body);
      setFilterClient((await api.get("clients/")).data.results);
      setCompanyModal(false);
      notifySucess("Cliente criado com sucesso!");
    } catch (err) {
      console.log(err);
      notifyError("Não foi possível criar o cliente");
    } finally {
      setLoading(false);
      setSpinner(false);
    }
  };

  const updateClient = async (body, client_id, button_name) => {
    try {
      setSpinner(button_name);
      await api.patch(`clients/${client_id}/`, body);
      setFilterClient((await api.get("clients/")).data.results);
      setCompanyModal(false);
      notifySucess("Cliente atualizado com sucesso!");
    } catch (err) {
      console.log(err);
      notifyError("Não foi possível atualizar o cliente");
    } finally {
      setLoading(false);
      setSpinner(false);
    }
  };

  const deleteClient = async (client_id, button_name) => {
    try {
      setSpinner(button_name);
      await api.delete(`clients/${client_id}/`);
      setFilterClient((await api.get("clients/")).data.results);
      setCompanyModal(false);
      notifySucess("Cliente deletado com sucesso!");
    } catch (err) {
      console.log(err);
      notifyError("Não foi possível deletar o cliente");
    } finally {
      setLoading(false);
      setSpinner(false);
    }
  };

  function filterClientOn(event) {
    setTarget(event.target.value);
    const list = Array.isArray(clients) ? clients : [];
    const filtered = list.filter((elem) =>
      String(elem.client_name || "")
        .toLowerCase()
        .includes(String(event.target.value || "").toLowerCase())
    );
    setFilter(filtered);
  }

  return (
    <AdminContext.Provider
      value={{
        clients,
        createUser,
        updateUser,
        setUsers,
        users,
        deleteUser,
        deactivateUser,
        createClient,
        updateClient,
        deleteClient,
        filterClient,
        setFilterClient,
        filterClientOn,
        filter,
        setFilter,
        target,
        setTarget,
        document,
        setDocument,
        createDocument,
        filterDocument,
        filterSubinvoice,
        setFilterSubinvoice,
        subinvoices,
        setSubinvoices,
        filterSubinvoicesByMonthAndYear,
        spinnerPost,
        setSpinnerPost,
        sub,
        setSub,
        filterSub,
        setFilterSub,
        createSub,
        getSubinvoices2,
        createEmail,
        shipEmail,
        setShipEmail,
        filterShipEmail,
        setFilterShipEmail,
        benefitsEndpoints,
        benefitsSelectedCompany,
        setBenefitsSelectedCompany,
        benefitsSearch,
        setBenefitsSearch,
        benefitsBeneficiaries,
        setBenefitsBeneficiaries,
        filterBenefitsBeneficiaries,
        setFilterBenefitsBeneficiaries,
        beneficiariesFetching,
        beneficiariesMeta,
        getBenefitsBeneficiaries,
        fetchBenefitsBeneficiaries,
        goBeneficiariesNextPage,
        goBeneficiariesPrevPage,
        getBenefitBeneficiaryDetail,
        markBeneficiaryRegistered,
        setBeneficiaryCardNumber,
        benefitsExclusions,
        setBenefitsExclusions,
        filterBenefitsExclusions,
        setFilterBenefitsExclusions,
        benefitsFetching,
        benefitsMeta,
        getBenefitsExclusions,
        fetchBenefitsExclusions,
        goBenefitsNextPage,
        goBenefitsPrevPage,
        sendExclusionReminder,
        markExclusionResolved,
        setExclusionCardNumber,
        loadBenefitsForCompany,
        refreshBenefitsLists,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};