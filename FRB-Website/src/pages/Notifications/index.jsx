// src/pages/Notifications/index.jsx
// Central de Notificações · 3 passos claros:
//  1) Destinatários (quem recebe)  2) Campanhas de Saúde (planejar o ano)
//  3) Aviso de Dashboard (texto do e-mail automático).
import { useState, useEffect, useCallback, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft, FiBriefcase, FiCalendar, FiBell, FiSend, FiClock,
  FiLoader, FiEye, FiMail, FiUsers, FiBarChart2, FiTrash2, FiInfo,
  FiSave, FiCheckCircle, FiEdit2, FiPlus, FiRotateCcw, FiImage, FiX,
} from "react-icons/fi";
import { UserContext } from "../../contexts/userContext/userContext";
import { api } from "../../services/api";
import { notifySucess, notifyError } from "../../Toastfy";
import FRB from "../../assets/img/logoBranca.webp";
import { PageWrapper, Topbar, TopbarLogo, TopbarTitle, BackBtn, Content } from "../BillingOrganization/style";
import {
  Bar, BarLabel, Select, Tabs, Tab, Split, Panel, PanelTitle,
  PreviewFrame, EmptyPreview, Field, Label, Textarea, Input,
  Recipients, Row, Btn, Loading, TabHelp,
  PlanControls, PlanRow, PlanMonth, MiniSelect, IconBtn, AgendaItem,
  UTableWrap, UTable, Switch, UCount,
} from "./style";
import { TimeWheel } from "./WheelPicker";

const MONTHS = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const errMsg = (e, fb) =>
  e?.response?.data?.detail || e?.response?.data?.message ||
  (typeof e?.response?.data === "string" ? e.response.data : null) || fb;

// Variáveis disponíveis para o texto (substituídas no envio)
const VARS_DASH = [
  { k: "{empresa}",  d: "nome da empresa" },
  { k: "{mes}",      d: "mês do faturamento (ex.: Junho)" },
  { k: "{ano}",      d: "ano (ex.: 2026)" },
  { k: "{produto}",  d: "Saúde ou Dental" },
];
const VARS_CAMP = [
  { k: "{empresa}",  d: "nome da empresa" },
  { k: "{mes}",      d: "mês da campanha" },
  { k: "{titulo}",   d: "nome da campanha" },
  { k: "{tema}",     d: "tema da campanha" },
];

// Texto PADRÃO do aviso de dashboard (espelha o backend em emails.py).
// Quando a empresa não tem mensagem personalizada, o editor mostra este texto
// e o "Restaurar padrão" volta para ele.
const DASH_DEFAULT =
  "O dashboard analítico do plano {produto} referente a {mes}/{ano} já está disponível no portal FRB.";

// Barra de variáveis: clique para inserir no texto, com legenda do que cada uma vira.
const VarBar = ({ vars, onInsert }) => (
  <div style={{ marginTop: 8 }}>
    <div style={{ fontSize: ".68rem", color: "rgba(255,255,255,.4)", marginBottom: 6 }}>
      Clique para inserir uma variável (ela vira o valor real no e-mail):
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {vars.map(v => (
        <button key={v.k} type="button" title={`Vira: ${v.d}`} onClick={() => onInsert(v.k)}
          style={{
            background: "rgba(4,173,224,.12)", border: "1px solid rgba(4,173,224,.28)",
            color: "#7fd6f0", borderRadius: 999, padding: "4px 10px", cursor: "pointer",
            fontSize: ".74rem", fontWeight: 700,
          }}>
          {v.k}
        </button>
      ))}
    </div>
    <div style={{ fontSize: ".68rem", color: "rgba(255,255,255,.35)", marginTop: 6, lineHeight: 1.5 }}>
      {vars.map(v => `${v.k} = ${v.d}`).join("  ·  ")}
    </div>
  </div>
);

export const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user && !user.perm_admin && !user.is_superuser &&
        !user.perm_benefits_billing &&
        !["invoicingadmin", "benefitsadmin", "benefitsoperator"].includes(user.user_level)) {
      navigate("/user");
    }
  }, [user, navigate]);

  const CUR_MONTH = new Date().getMonth() + 1;
  const TODAY     = new Date().getDate();
  const NOW_HOUR  = new Date().getHours();
  const NOW_MINUTE = new Date().getMinutes();
  const SAMPLE_YEAR = new Date().getFullYear();

  const [clients, setClients]     = useState([]);
  const [clientId, setClientId]   = useState("");
  const [clientUsers, setClientUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [tab, setTab] = useState("destinatarios");

  // Campanhas de saúde (planejador anual)
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [plan, setPlan]         = useState({});       // { mes: {active, campaignId} }
  const [planDay, setPlanDay]   = useState(Math.min(28, new Date().getDate() + 1));
  const [planHour, setPlanHour] = useState(9);
  const [planMinute, setPlanMinute] = useState(0);
  const [savingPlan, setSavingPlan] = useState(false);
  const [schedules, setSchedules]   = useState([]);
  const [previewCampaign, setPreviewCampaign] = useState(null);
  const [campHtml, setCampHtml] = useState("");
  const [campLoading, setCampLoading] = useState(false);
  const [sending, setSending]   = useState(false);
  const [editDraft, setEditDraft] = useState(null);   // edição de campanha
  const [savingCamp, setSavingCamp] = useState(false);

  // Aviso de dashboard (texto)
  const [dashMsg, setDashMsg]   = useState("");
  const [savingMsg, setSavingMsg] = useState(false);
  const [dashHtml, setDashHtml] = useState("");
  const [dashLoading, setDashLoading] = useState(false);

  const campaignsByMonth = useMemo(() => {
    const by = {};
    allCampaigns.forEach(c => { (by[c.month] = by[c.month] || []).push(c); });
    return by;
  }, [allCampaigns]);

  const campaignById = useMemo(() => {
    const by = {};
    allCampaigns.forEach(c => { by[c.id] = c; });
    return by;
  }, [allCampaigns]);

  // ── Empresas ──
  useEffect(() => {
    api.get("clients/", { skipGlobalLoader: true })
      .then(r => {
        const list = r.data?.results ?? r.data ?? [];
        setClients(list);
        if (list.length && !clientId) setClientId(list[0].id);
      })
      .catch(e => notifyError(errMsg(e, "Não foi possível carregar as empresas.")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Todas as campanhas ──
  const loadAllCampaigns = useCallback(async () => {
    try {
      const r = await api.get("notifications/campaigns/", { skipGlobalLoader: true });
      setAllCampaigns(r.data?.results ?? r.data ?? []);
    } catch { setAllCampaigns([]); }
  }, []);
  useEffect(() => { loadAllCampaigns(); }, [loadAllCampaigns]);

  // ── Usuários + mensagem do aviso ──
  useEffect(() => {
    if (!clientId) return;
    setLoadingUsers(true);
    api.get(`clients/${clientId}/`, { skipGlobalLoader: true })
      .then(r => {
        setClientUsers(r.data?.users ?? []);
        // Em branco no banco -> mostra o texto padrão (editável) no editor.
        const saved = (r.data?.dashboard_notice_message ?? "").trim();
        setDashMsg(saved || DASH_DEFAULT);
      })
      .catch(() => { setClientUsers([]); setDashMsg(DASH_DEFAULT); })
      .finally(() => setLoadingUsers(false));
  }, [clientId]);

  const healthRecipients = clientUsers.filter(u => u.notify_health && u.active && u.email);
  const dashRecipients   = clientUsers.filter(u => u.notify_dashboard && u.active && u.email);

  // ── Agenda (schedules) ──
  const loadSchedules = useCallback(async (cid) => {
    if (!cid) { setSchedules([]); return; }
    try {
      const r = await api.get("notifications/schedules/", { params: { client_id: cid }, skipGlobalLoader: true });
      setSchedules(r.data?.results ?? r.data ?? []);
    } catch { setSchedules([]); }
  }, []);
  useEffect(() => { loadSchedules(clientId); }, [clientId, loadSchedules]);

  // ── Inicializa o plano refletindo a agenda salva ──
  useEffect(() => {
    if (!clientId || allCampaigns.length === 0) return;
    const p = {};
    for (let m = CUR_MONTH; m <= 12; m++) {
      const sch = schedules.find(s => s.campaign_month === m);
      const monthCamps = campaignsByMonth[m] || [];
      p[m] = { active: !!sch, campaignId: sch ? sch.campaign : (monthCamps[0]?.id || "") };
    }
    setPlan(p);
    if (schedules[0]) {
      setPlanDay(schedules[0].day);
      setPlanHour(schedules[0].hour);
      setPlanMinute(schedules[0].minute ?? 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, schedules, allCampaigns]);

  // No mês atual, só é "passado" se o dia já passou, OU se é hoje e o horário
  // (hora + minuto) escolhido já passou.
  const isPast = (m) => {
    if (m !== CUR_MONTH) return false;
    if (Number(planDay) < TODAY) return true;
    if (Number(planDay) > TODAY) return false;
    const pickedMin = Number(planHour) * 60 + Number(planMinute);
    const nowMin = NOW_HOUR * 60 + NOW_MINUTE;
    return pickedMin <= nowMin;
  };

  const setMonthPlan = (m, patch) =>
    setPlan(prev => ({ ...prev, [m]: { ...prev[m], ...patch } }));

  const activateAll = () =>
    setPlan(prev => {
      const next = { ...prev };
      for (let m = CUR_MONTH; m <= 12; m++) {
        if (isPast(m)) continue;
        const camps = campaignsByMonth[m] || [];
        next[m] = { active: camps.length > 0, campaignId: next[m]?.campaignId || camps[0]?.id || "" };
      }
      return next;
    });

  const previewOf = useCallback(async (campaign) => {
    if (!campaign) return;
    setEditDraft(null);
    setPreviewCampaign(campaign);
    setCampLoading(true);
    try {
      const r = await api.get(`notifications/campaigns/${campaign.id}/preview/`, { skipGlobalLoader: true });
      setCampHtml(r.data?.html ?? "");
    } catch { setCampHtml(""); }
    finally { setCampLoading(false); }
  }, []);

  // ── Edição de campanhas (texto / imagem / nova / restaurar padrão) ──
  const startEditCampaign = (c) => setEditDraft({
    id: c.id, month: c.month, title: c.title || "", theme: c.theme || "",
    description: c.description || "", color_hex: c.color_hex || "#04ade0",
    image_url: c.image_url || "", is_custom: !!c.is_custom,
  });
  const startNewCampaign = () => setEditDraft({
    id: null, month: CUR_MONTH, title: "", theme: "",
    description: "", color_hex: "#04ade0", image_url: "",
  });
  const setDraft = (patch) => setEditDraft(prev => ({ ...prev, ...patch }));

  const saveCampaign = async () => {
    if (!editDraft?.title?.trim()) { notifyError("Informe o nome da campanha."); return; }
    setSavingCamp(true);
    try {
      const payload = {
        month: Number(editDraft.month), title: editDraft.title, theme: editDraft.theme,
        description: editDraft.description, color_hex: editDraft.color_hex, image_url: editDraft.image_url,
      };
      if (editDraft.id) await api.patch(`notifications/campaigns/${editDraft.id}/`, payload, { skipGlobalLoader: true });
      else await api.post("notifications/campaigns/", payload, { skipGlobalLoader: true });
      notifySucess("Campanha salva.");
      setEditDraft(null);
      await loadAllCampaigns();
    } catch (e) { notifyError(errMsg(e, "Não foi possível salvar a campanha.")); }
    finally { setSavingCamp(false); }
  };

  const deleteCampaign = async () => {
    if (!editDraft?.id) { setEditDraft(null); return; }
    if (!window.confirm(`Excluir a campanha "${editDraft.title}"?`)) return;
    try {
      await api.delete(`notifications/campaigns/${editDraft.id}/`, { skipGlobalLoader: true });
      notifySucess("Campanha excluída.");
      setEditDraft(null);
      await loadAllCampaigns();
    } catch (e) { notifyError(errMsg(e, "Não foi possível excluir.")); }
  };

  // Restaura SOMENTE a campanha em edição ao padrão do calendário
  const restoreOneCampaign = async () => {
    if (!editDraft?.id) return;
    if (!window.confirm(`Restaurar a campanha "${editDraft.title}" ao texto/arte padrão do calendário?`)) return;
    try {
      const r = await api.post(`notifications/campaigns/${editDraft.id}/restore-default/`, {}, { skipGlobalLoader: true });
      const c = r.data;
      setEditDraft({
        id: c.id, month: c.month, title: c.title, theme: c.theme,
        description: c.description, color_hex: c.color_hex, image_url: c.image_url, is_custom: c.is_custom,
      });
      await loadAllCampaigns();
      notifySucess("Campanha restaurada ao padrão.");
    } catch (e) { notifyError(errMsg(e, "Não foi possível restaurar esta campanha.")); }
  };

  // prévia ao vivo do rascunho de edição
  const previewDraft = useCallback(async (draft) => {
    if (!draft?.id) { setCampHtml(""); return; }
    setCampLoading(true);
    try {
      const r = await api.get(`notifications/campaigns/${draft.id}/preview/`, { skipGlobalLoader: true });
      setCampHtml(r.data?.html ?? "");
    } catch { setCampHtml(""); }
    finally { setCampLoading(false); }
  }, []);

  // ── Salvar a agenda do ano (reconcilia com o que está salvo) ──
  const savePlan = async () => {
    if (!clientId) return;
    setSavingPlan(true);
    try {
      for (let m = CUR_MONTH; m <= 12; m++) {
        if (isPast(m)) continue;
        const p = plan[m] || {};
        const existing = schedules.filter(s => s.campaign_month === m);
        const want = p.active && p.campaignId;
        if (want) {
          const ok = existing.find(s => s.campaign === p.campaignId
            && s.day === Number(planDay) && s.hour === Number(planHour)
            && (s.minute ?? 0) === Number(planMinute));
          if (!ok) {
            for (const s of existing) await api.delete(`notifications/schedules/${s.id}/`, { skipGlobalLoader: true });
            await api.post("notifications/schedules/", {
              client: clientId, campaign: p.campaignId,
              day: Number(planDay), hour: Number(planHour), minute: Number(planMinute), active: true,
            }, { skipGlobalLoader: true });
          }
        } else {
          for (const s of existing) await api.delete(`notifications/schedules/${s.id}/`, { skipGlobalLoader: true });
        }
      }
      notifySucess("Agenda do ano salva com sucesso!");
      await loadSchedules(clientId);
    } catch (e) {
      notifyError(errMsg(e, "Não foi possível salvar a agenda."));
    } finally { setSavingPlan(false); }
  };

  const cancelSchedule = async (id) => {
    try {
      await api.delete(`notifications/schedules/${id}/`, { skipGlobalLoader: true });
      setSchedules(prev => prev.filter(s => s.id !== id));
      notifySucess("Agendamento cancelado.");
    } catch (e) { notifyError(errMsg(e, "Não foi possível cancelar.")); }
  };

  const sendCampaignNow = async (campaign, { confirm = false } = {}) => {
    if (!campaign || !clientId) return;
    if (healthRecipients.length === 0) {
      notifyError("Nenhum destinatário com 'campanhas de saúde' ativado. Ative na aba Destinatários.");
      return;
    }
    if (confirm && !window.confirm(`Enviar "${campaign.title}" AGORA para ${healthRecipients.length} destinatário(s)?`)) return;
    setSending(true);
    try {
      const r = await api.post(`notifications/campaigns/${campaign.id}/send/`,
        { client_id: clientId }, { skipGlobalLoader: true });
      notifySucess(`Campanha enviada agora: ${r.data.success} e-mail(s).`);
    } catch (e) { notifyError(errMsg(e, "Falha ao enviar a campanha.")); }
    finally { setSending(false); }
  };
  const sendNow = () => sendCampaignNow(previewCampaign);

  // ── Aviso de dashboard ──
  const loadDashPreview = useCallback(async (cid, msg) => {
    if (!cid) return;
    setDashLoading(true);
    try {
      const r = await api.get("notifications/dashboard-notify/preview/", {
        params: { client_id: cid, month: CUR_MONTH, year: SAMPLE_YEAR, product: "saude", message: msg ?? "" },
        skipGlobalLoader: true,
      });
      setDashHtml(r.data?.html ?? "");
    } catch { setDashHtml(""); }
    finally { setDashLoading(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (tab === "dashboard" && clientId) loadDashPreview(clientId, effectiveDashMsg(dashMsg));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, clientId]);

  // Se o texto for o padrão (ou vazio), guardamos vazio no banco — assim o padrão
  // continua dinâmico e a prévia usa o texto padrão "bonito" (com destaques).
  const effectiveDashMsg = (m) => {
    const t = (m || "").trim();
    return (!t || t === DASH_DEFAULT.trim()) ? "" : m;
  };

  const saveDashMsg = async () => {
    if (!clientId) { notifyError("Selecione uma empresa."); return; }
    const toSave = effectiveDashMsg(dashMsg);
    setSavingMsg(true);
    try {
      await api.patch(`clients/${clientId}/`, { dashboard_notice_message: toSave }, { skipGlobalLoader: true });
      setClients(prev => prev.map(c => c.id === clientId ? { ...c, dashboard_notice_message: toSave } : c));
      notifySucess(toSave
        ? `Mensagem salva para ${companyName}.`
        : `Texto padrão mantido para ${companyName}.`);
      loadDashPreview(clientId, toSave);
    } catch (e) { notifyError(errMsg(e, "Não foi possível salvar a mensagem.")); }
    finally { setSavingMsg(false); }
  };

  const restoreDashDefault = () => {
    setDashMsg(DASH_DEFAULT);
    if (clientId) loadDashPreview(clientId, "");
  };

  const toggleUserNotify = async (u, field) => {
    const next = !u[field];
    setClientUsers(prev => prev.map(x => x.id === u.id ? { ...x, [field]: next } : x));
    try {
      await api.patch(`users/${u.id}/`, { [field]: next }, { skipGlobalLoader: true });
    } catch (e) {
      setClientUsers(prev => prev.map(x => x.id === u.id ? { ...x, [field]: !next } : x));
      notifyError(errMsg(e, "Não foi possível atualizar a preferência."));
    }
  };

  const companyName = clients.find(c => c.id === clientId)?.client_name || "";

  return (
    <PageWrapper>
      <Topbar>
        <TopbarLogo src={FRB} alt="FRB" />
        <TopbarTitle>Central de Notificações</TopbarTitle>
        <BackBtn onClick={() => navigate("/admin")}><FiArrowLeft size={13} /> Voltar</BackBtn>
      </Topbar>

      <Content>
        {/* Empresa */}
        <Bar>
          <BarLabel><FiBriefcase size={14} /> Empresa</BarLabel>
          <Select value={clientId} onChange={e => setClientId(e.target.value)}>
            {clients.map(c => <option key={c.id} value={c.id}>{c.client_name}</option>)}
          </Select>
        </Bar>

        <Tabs>
          <Tab $active={tab === "destinatarios"} onClick={() => setTab("destinatarios")}>
            <FiUsers size={14} /> 1 · Destinatários
          </Tab>
          <Tab $active={tab === "saude"} onClick={() => setTab("saude")}>
            <FiCalendar size={14} /> 2 · Campanhas de Saúde
          </Tab>
          <Tab $active={tab === "dashboard"} onClick={() => setTab("dashboard")}>
            <FiBell size={14} /> 3 · Aviso de Dashboard
          </Tab>
        </Tabs>

        {/* ═══════════ 1 · DESTINATÁRIOS ═══════════ */}
        {tab === "destinatarios" && (
          <Panel>
            <TabHelp>
              <FiInfo size={16} />
              <span><strong>Quem recebe.</strong> Ligue, para cada pessoa de <strong>{companyName}</strong>,
              quais avisos ela recebe por e-mail. É o primeiro passo · sem destinatário, nada é enviado.</span>
            </TabHelp>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              <UCount><FiCalendar size={12} /> {healthRecipients.length} recebem Campanhas de Saúde</UCount>
              <UCount style={{ background: "rgba(4,173,224,.12)", color: "#04ade0", border: "1px solid rgba(4,173,224,.22)" }}>
                <FiBell size={12} /> {dashRecipients.length} recebem Aviso de Dashboard
              </UCount>
            </div>
            {loadingUsers ? (
              <Loading style={{ height: 200 }}><FiLoader size={26} className="spin" /> Carregando usuários...</Loading>
            ) : clientUsers.length === 0 ? (
              <EmptyPreview style={{ height: 200 }}><FiUsers size={36} /> Nenhum usuário nesta empresa.</EmptyPreview>
            ) : (
              <UTableWrap>
                <UTable>
                  <thead>
                    <tr>
                      <th>Usuário</th>
                      <th className="center">Campanhas de Saúde</th>
                      <th className="center">Aviso de Dashboard</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientUsers.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div className="uname">{u.name || u.email}{!u.active && " (inativo)"}</div>
                          <div className="umeta">{u.email} · <span className="lvl">{u.user_level || "·"}</span></div>
                        </td>
                        <td className="center">
                          <Switch $on={!!u.notify_health} disabled={!u.email}
                            onClick={() => toggleUserNotify(u, "notify_health")} aria-label="campanhas" />
                        </td>
                        <td className="center">
                          <Switch $on={!!u.notify_dashboard} disabled={!u.email}
                            onClick={() => toggleUserNotify(u, "notify_dashboard")} aria-label="dashboard" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </UTable>
              </UTableWrap>
            )}
          </Panel>
        )}

        {/* ═══════════ 2 · CAMPANHAS DE SAÚDE (planejador anual) ═══════════ */}
        {tab === "saude" && (
          <>
            <TabHelp>
              <FiInfo size={16} />
              <span><strong>Planeje o ano todo de uma vez.</strong> Escolha o <strong>dia, a hora e o minuto</strong>,
              ligue os meses que quer enviar e selecione a campanha de cada mês. A FRB envia a arte
              automaticamente, todo ano, no horário exato (Brasília) escolhido. Só datas futuras.</span>
            </TabHelp>
            <Split>
              <Panel>
                <PanelTitle><FiClock size={15} /> Quando enviar</PanelTitle>
                <PlanControls style={{ alignItems: "center", gap: 18 }}>
                  <TimeWheel
                    day={Number(planDay)} hour={Number(planHour)} minute={Number(planMinute)}
                    onChange={({ day, hour, minute }) => {
                      setPlanDay(day); setPlanHour(hour); setPlanMinute(minute);
                    }}
                  />
                  <Btn $ghost onClick={activateAll}><FiCheckCircle size={14} /> Ativar todos</Btn>
                </PlanControls>
                <p style={{ fontSize: ".72rem", color: "rgba(255,255,255,.4)", margin: "-2px 0 14px" }}>
                  Envio no horário de Brasília · dia {String(planDay).padStart(2, "0")} às{" "}
                  {String(planHour).padStart(2, "0")}:{String(planMinute).padStart(2, "0")}.
                </p>

                <PanelTitle><FiCalendar size={15} /> Campanha de cada mês</PanelTitle>
                {Array.from({ length: 12 - CUR_MONTH + 1 }, (_, k) => CUR_MONTH + k).map(m => {
                  const camps = campaignsByMonth[m] || [];
                  const p = plan[m] || { active: false, campaignId: "" };
                  const past = isPast(m);
                  return (
                    <PlanRow key={m} $on={p.active && !past} $disabled={past || camps.length === 0}>
                      <Switch $on={p.active && !past} disabled={past || camps.length === 0}
                        onClick={() => setMonthPlan(m, { active: !p.active })} aria-label={`ativar ${MONTHS[m]}`} />
                      <PlanMonth>
                        {MONTHS[m]}
                        {past && <small>data já passou</small>}
                        {!past && camps.length === 0 && <small>sem campanha</small>}
                      </PlanMonth>
                      <MiniSelect
                        value={p.campaignId} disabled={past || camps.length === 0}
                        onChange={e => setMonthPlan(m, { campaignId: e.target.value })}>
                        {camps.length === 0 && <option value="">·</option>}
                        {camps.map(c => <option key={c.id} value={c.id}>{c.title} · {c.theme}</option>)}
                      </MiniSelect>
                      <span style={{ display: "flex", gap: 6 }}>
                        <IconBtn title="Ver arte" disabled={!p.campaignId}
                          onClick={() => previewOf(campaignById[p.campaignId])}>
                          <FiEye size={15} />
                        </IconBtn>
                        <IconBtn title="Enviar agora" disabled={!p.campaignId || sending}
                          onClick={() => sendCampaignNow(campaignById[p.campaignId], { confirm: true })}
                          style={{ color: "#34d399", borderColor: "rgba(52,211,153,.35)" }}>
                          <FiSend size={14} />
                        </IconBtn>
                        <IconBtn title="Editar campanha" disabled={!p.campaignId}
                          onClick={() => startEditCampaign(campaignById[p.campaignId])}>
                          <FiEdit2 size={14} />
                        </IconBtn>
                      </span>
                    </PlanRow>
                  );
                })}

                <Row style={{ marginTop: 14 }}>
                  <Btn onClick={savePlan} disabled={savingPlan}>
                    {savingPlan ? <FiLoader size={14} className="spin" /> : <FiSave size={14} />} Salvar agenda do ano
                  </Btn>
                  <Btn $ghost onClick={startNewCampaign}><FiPlus size={14} /> Nova campanha</Btn>
                </Row>

                {/* Agenda salva */}
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.08)" }}>
                  <Label><FiClock size={12} style={{ verticalAlign: "-1px" }} /> Agenda salva ({schedules.length})</Label>
                  {schedules.length === 0 ? (
                    <p style={{ fontSize: ".8rem", color: "rgba(255,255,255,.4)", margin: "6px 0 0" }}>
                      Nenhuma campanha agendada ainda.
                    </p>
                  ) : (
                    [...schedules].sort((a, b) => a.campaign_month - b.campaign_month).map(s => (
                      <AgendaItem key={s.id}>
                        <span className="when">{MONTHS[s.campaign_month]?.slice(0, 3)} · dia {s.day}</span>
                        <span className="what">{s.campaign_title}<small>{String(s.hour).padStart(2, "0")}:{String(s.minute ?? 0).padStart(2, "0")} (Brasília) · todo ano</small></span>
                        <IconBtn title="Cancelar" onClick={() => cancelSchedule(s.id)}
                          style={{ color: "#fb7185", borderColor: "rgba(251,113,133,.35)" }}>
                          <FiTrash2 size={14} />
                        </IconBtn>
                      </AgendaItem>
                    ))
                  )}
                </div>

                {/* Quem vai receber nesta empresa (nome + e-mail) */}
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.08)" }}>
                  <Label>
                    <FiUsers size={12} style={{ verticalAlign: "-1px" }} /> Quem vai receber em {companyName} ({healthRecipients.length})
                  </Label>
                  {healthRecipients.length === 0 ? (
                    <p style={{ fontSize: ".8rem", color: "#fbbf24", margin: "6px 0 0" }}>
                      Ninguém com “Campanhas de Saúde” ativo. Ative na aba 1 · Destinatários.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                      {healthRecipients.map(u => (
                        <div key={u.id} style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
                          background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)",
                          borderRadius: 8, padding: "7px 12px",
                        }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: ".82rem", fontWeight: 700, color: "#fff" }}>{u.name || u.email}</div>
                            <div style={{ fontSize: ".74rem", color: "rgba(255,255,255,.5)", overflow: "hidden", textOverflow: "ellipsis" }}>{u.email}</div>
                          </div>
                          {u.user_level && (
                            <span style={{
                              fontSize: ".66rem", padding: "2px 8px", borderRadius: 999, whiteSpace: "nowrap",
                              background: "rgba(4,173,224,.12)", color: "#7fd6f0", border: "1px solid rgba(4,173,224,.22)",
                            }}>{u.user_level}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Panel>

              {editDraft ? (
                <Panel>
                  <PanelTitle>
                    <FiEdit2 size={15} /> {editDraft.id ? "Editar campanha" : "Nova campanha"}
                    <span style={{ marginLeft: "auto" }}>
                      <IconBtn title="Fechar" onClick={() => setEditDraft(null)}><FiX size={15} /></IconBtn>
                    </span>
                  </PanelTitle>
                  <Field>
                    <Label>Nome da campanha</Label>
                    <Input value={editDraft.title} onChange={e => setDraft({ title: e.target.value })}
                      placeholder="Ex.: Junho Vermelho" style={{ width: "100%" }} />
                  </Field>
                  <Row>
                    <Field style={{ flex: 1 }}>
                      <Label>Mês</Label>
                      <MiniSelect value={editDraft.month} onChange={e => setDraft({ month: Number(e.target.value) })}>
                        {MONTHS.slice(1).map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                      </MiniSelect>
                    </Field>
                    <Field>
                      <Label>Cor</Label>
                      <input type="color" value={editDraft.color_hex}
                        onChange={e => setDraft({ color_hex: e.target.value })}
                        style={{ width: 50, height: 38, border: "none", background: "none", cursor: "pointer" }} />
                    </Field>
                  </Row>
                  <Field>
                    <Label>Tema</Label>
                    <Input value={editDraft.theme} onChange={e => setDraft({ theme: e.target.value })}
                      placeholder="Ex.: Doação de Sangue" style={{ width: "100%" }} />
                  </Field>
                  <Field>
                    <Label>Texto da mensagem</Label>
                    <Textarea value={editDraft.description} onChange={e => setDraft({ description: e.target.value })}
                      style={{ minHeight: 90 }} placeholder="Texto que aparece no corpo do e-mail." />
                    <VarBar vars={VARS_CAMP} onInsert={(t) => setDraft({ description: (editDraft.description ? editDraft.description + " " : "") + t })} />
                  </Field>
                  <Field>
                    <Label><FiImage size={11} style={{ verticalAlign: "-1px" }} /> Imagem / arte (link da imagem)</Label>
                    <Input value={editDraft.image_url} onChange={e => setDraft({ image_url: e.target.value })}
                      placeholder="https://.../arte.jpg" style={{ width: "100%" }} />
                  </Field>
                  <Row style={{ marginTop: 6 }}>
                    <Btn onClick={saveCampaign} disabled={savingCamp}>
                      {savingCamp ? <FiLoader size={14} className="spin" /> : <FiSave size={14} />} Salvar campanha
                    </Btn>
                    {editDraft.id && (
                      <>
                        <Btn $ghost onClick={() => previewDraft(editDraft)}><FiEye size={14} /> Prévia</Btn>
                        {!editDraft.is_custom && (
                          <Btn $ghost onClick={restoreOneCampaign}><FiRotateCcw size={14} /> Restaurar padrão</Btn>
                        )}
                        <Btn $ghost onClick={deleteCampaign}
                          style={{ borderColor: "rgba(251,113,133,.4)", color: "#fb7185" }}>
                          <FiTrash2 size={14} /> Excluir
                        </Btn>
                      </>
                    )}
                  </Row>
                </Panel>
              ) : (
                <Panel>
                  <PanelTitle><FiMail size={15} /> Prévia da arte / e-mail</PanelTitle>
                  <Recipients style={{ marginTop: 0, marginBottom: 12 }}>
                    <FiUsers size={14} />
                    {healthRecipients.length > 0
                      ? <>Vai para <strong>{healthRecipients.length}</strong> destinatário(s)</>
                      : <span className="none">Ninguém marcado em Destinatários para campanhas.</span>}
                  </Recipients>
                  {campLoading ? (
                    <Loading><FiLoader size={26} className="spin" /> Gerando prévia...</Loading>
                  ) : campHtml ? (
                    <>
                      <PreviewFrame title="Prévia da campanha" srcDoc={campHtml} style={{ height: 600 }} />
                      <Row style={{ marginTop: 12 }}>
                        <Btn onClick={sendNow} disabled={sending || healthRecipients.length === 0}>
                          {sending ? <FiLoader size={14} className="spin" /> : <FiSend size={14} />}
                          Enviar “{previewCampaign?.title}” agora
                        </Btn>
                      </Row>
                    </>
                  ) : (
                    <EmptyPreview><FiMail size={40} /> Clique no 👁 de uma campanha para ver a arte, ou no lápis para editar.</EmptyPreview>
                  )}
                </Panel>
              )}
            </Split>
          </>
        )}

        {/* ═══════════ 3 · AVISO DE DASHBOARD ═══════════ */}
        {tab === "dashboard" && (
          <>
            <TabHelp>
              <FiInfo size={16} />
              <span><strong>Automático.</strong> Este e-mail é disparado sozinho quando um faturamento é salvo no
              histórico · com o <strong>mês e o produto do próprio faturamento</strong>. Aqui você só ajusta o texto.</span>
            </TabHelp>
            <Split>
              <Panel>
                <PanelTitle><FiBarChart2 size={15} /> Mensagem do aviso · {companyName}</PanelTitle>
                <Field>
                  <Label>Mensagem do aviso</Label>
                  <Textarea value={dashMsg} onChange={e => setDashMsg(e.target.value)} style={{ minHeight: 120 }}
                    placeholder="O texto padrão já vem preenchido. Edite à vontade ou use 'Restaurar padrão'." />
                  <VarBar vars={VARS_DASH} onInsert={(t) => setDashMsg(m => (m ? m + " " : "") + t)} />
                </Field>

                <Row>
                  <Btn onClick={saveDashMsg} disabled={savingMsg}>
                    {savingMsg ? <FiLoader size={14} className="spin" /> : <FiSave size={14} />} Salvar mensagem
                  </Btn>
                  <Btn $ghost onClick={restoreDashDefault}>
                    <FiRotateCcw size={14} /> Restaurar padrão
                  </Btn>
                  <Btn $ghost onClick={() => loadDashPreview(clientId, effectiveDashMsg(dashMsg))}>
                    <FiEye size={14} /> Atualizar prévia
                  </Btn>
                </Row>

                {/* Quem vai receber o aviso de dashboard nesta empresa (nome + e-mail) */}
                <div style={{ marginTop: 16 }}>
                  <Recipients style={{ marginBottom: dashRecipients.length ? 10 : 0 }}>
                    <FiUsers size={14} />
                    {dashRecipients.length > 0
                      ? <>Será enviado para <strong>{dashRecipients.length}</strong> destinatário(s)</>
                      : <span className="none">Ninguém marcado em Destinatários para dashboard.</span>}
                  </Recipients>
                  {dashRecipients.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {dashRecipients.map(u => (
                        <div key={u.id} style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
                          background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)",
                          borderRadius: 8, padding: "7px 12px",
                        }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: ".82rem", fontWeight: 700, color: "#fff" }}>{u.name || u.email}</div>
                            <div style={{ fontSize: ".74rem", color: "rgba(255,255,255,.5)", overflow: "hidden", textOverflow: "ellipsis" }}>{u.email}</div>
                          </div>
                          {u.user_level && (
                            <span style={{
                              fontSize: ".66rem", padding: "2px 8px", borderRadius: 999, whiteSpace: "nowrap",
                              background: "rgba(4,173,224,.12)", color: "#7fd6f0", border: "1px solid rgba(4,173,224,.22)",
                            }}>{u.user_level}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Panel>
              <Panel>
                <PanelTitle><FiMail size={15} /> Prévia do e-mail</PanelTitle>
                <p style={{ fontSize: ".74rem", color: "rgba(255,255,255,.4)", margin: "0 0 12px" }}>
                  Exemplo com {MONTHS[CUR_MONTH]}/{SAMPLE_YEAR} · Saúde. No envio real, mês e produto são os do faturamento.
                </p>
                {dashLoading ? (
                  <Loading><FiLoader size={26} className="spin" /> Gerando prévia...</Loading>
                ) : dashHtml ? (
                  <PreviewFrame title="Prévia do aviso" srcDoc={dashHtml} />
                ) : (
                  <EmptyPreview><FiMail size={40} /> Selecione uma empresa para ver a prévia.</EmptyPreview>
                )}
              </Panel>
            </Split>
          </>
        )}
      </Content>
    </PageWrapper>
  );
};
