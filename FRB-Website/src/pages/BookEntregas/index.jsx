// src/pages/BookEntregas/index.jsx
// Book de Entregas · painel de evidência de valor do cliente (RH).
// Agrega documentos, faturamentos e atividades já registrados no sistema.
import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import {
  FiArrowLeft, FiFileText, FiCheckCircle, FiUploadCloud, FiDollarSign,
  FiDownload, FiClock, FiActivity,
} from "react-icons/fi";
import { UserContext } from "../../contexts/userContext/userContext";
import { api } from "../../services/api";
import { notifyError } from "../../Toastfy";
import FRB from "../../assets/img/logoBranca.webp";
import {
  PageWrapper, Topbar, TopbarLogo, TopbarTitle, BackBtn, Content,
} from "../BillingOrganization/style";
import {
  Intro, IntroText, YearTabs, YearBtn, PrintBtn,
  KpiRow, Kpi, KpiIco, KpiLbl, KpiVal, KpiHint,
  Grid, Card, CardTitle, Progress, ProgressFill,
  SnapRow, Timeline, TimeItem, Empty,
} from "./style";
import { SkeletonKpis, SkeletonChart, SkeletonTable } from "../../components/Skeleton/Skeleton";
import { generateBookPdf } from "./bookPdf";

const MONTHS_ABBR = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const MONTHS_FULL = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const fmtBRL = v => (+(v ?? 0)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const DarkTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0d1525", border: "1px solid rgba(4,173,224,.2)", borderRadius: 10, padding: "10px 14px", fontSize: ".78rem" }}>
      {label && <div style={{ color: "rgba(255,255,255,.5)", marginBottom: 6 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "#fff", fontWeight: 700 }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

const fmtDate = iso => {
  if (!iso) return "";
  try { return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return ""; }
};

export const BookEntregas = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const CURRENT_YEAR = new Date().getFullYear();
  const [year, setYear] = useState(CURRENT_YEAR);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Guard de permissão · controlado pelo switch "Book de Entregas" no admin
  useEffect(() => {
    if (user && !user.perm_book && !user.perm_admin) {
      navigate("/user");
    }
  }, [user, navigate]);

  const clientId = user?.client_id;

  const load = useCallback(async () => {
    if (!clientId) return;
    setLoading(true);
    try {
      const res = await api.get(`clients/${clientId}/activity-summary/`, {
        params: { year },
        skipGlobalLoader: true,
      });
      setData(res.data ?? null);
    } catch {
      notifyError("Não foi possível carregar o Book de Entregas.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [clientId, year]);

  useEffect(() => { load(); }, [load]);

  const d = data;
  const docs = d?.documents;
  const bill = d?.billing;

  const completionPct = docs && docs.year_total > 0
    ? Math.round((docs.completed_year / docs.year_total) * 100)
    : 0;

  // conferências (faturas) por mês · para aparecerem no gráfico
  const confByMonth = {};
  (bill?.snapshots ?? []).forEach(s => { confByMonth[s.month] = (confByMonth[s.month] || 0) + 1; });

  const chartData = (docs?.monthly ?? []).map(m => ({
    label: MONTHS_ABBR[m.month],
    Recebidos: m.total,
    Concluídos: m.completed,
    Conferências: confByMonth[m.month] || 0,
  }));

  const YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

  return (
    <PageWrapper>
      <Topbar>
        <TopbarLogo src={FRB} alt="FRB" />
        <TopbarTitle>Book de Entregas</TopbarTitle>
        <BackBtn onClick={() => navigate("/user")}><FiArrowLeft size={13} /> Voltar</BackBtn>
      </Topbar>

      <Content>
        {loading ? (
          <>
            <SkeletonKpis count={4} />
            <SkeletonChart height={250} />
            <SkeletonTable rows={5} />
          </>
        ) : !d ? (
          <Empty>Nenhum dado disponível para este período.</Empty>
        ) : (
          <>
            <Intro>
              <IntroText>
                <h2>Book de Entregas  {d.client?.client_name}</h2>
                <p>
                  Registro automático de tudo o que a <strong>FRB</strong> processou para a sua
                  empresa em <strong>{year}</strong>: documentos, conferências de fatura e movimentações.
                  Transparência total do serviço entregue.
                </p>
              </IntroText>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <YearTabs>
                  {YEARS.map(y => (
                    <YearBtn key={y} $active={year === y} onClick={() => setYear(y)}>{y}</YearBtn>
                  ))}
                </YearTabs>
                <PrintBtn onClick={() => generateBookPdf({ data: d, year })}>
                  <FiDownload size={14} /> Baixar PDF
                </PrintBtn>
              </div>
            </Intro>

            {/* KPIs */}
            <KpiRow>
              <Kpi title="Quantos documentos (faturas de vida enviadas pelo RH) foram registrados no ano.">
                <KpiIco $bg="rgba(4,173,224,.12)" $color="#04ade0"><FiFileText size={20} /></KpiIco>
                <div>
                  <KpiLbl>Documentos no ano</KpiLbl>
                  <KpiVal>{docs?.year_total ?? 0}</KpiVal>
                  <KpiHint>faturas de vida enviadas em {year}</KpiHint>
                </div>
              </Kpi>
              <Kpi title="Documentos que a FRB já finalizou (status Concluído) no ano.">
                <KpiIco $bg="rgba(52,211,153,.12)" $color="#34d399"><FiCheckCircle size={20} /></KpiIco>
                <div>
                  <KpiLbl>Concluídos no ano</KpiLbl>
                  <KpiVal>{docs?.completed_year ?? 0}</KpiVal>
                  <KpiHint>documentos finalizados ({completionPct}%)</KpiHint>
                </div>
              </Kpi>
              <Kpi title="Faturas processadas na Bate-conferência e salvas no histórico, no ano.">
                <KpiIco $bg="rgba(139,92,246,.12)" $color="#a78bfa"><FiUploadCloud size={20} /></KpiIco>
                <div>
                  <KpiLbl>Faturas conferidas</KpiLbl>
                  <KpiVal>{bill?.year_total ?? 0}</KpiVal>
                  <KpiHint>bate-conferências salvas em {year}</KpiHint>
                </div>
              </Kpi>
              <Kpi title="Soma do valor total de todas as faturas conferidas no ano.">
                <KpiIco $bg="rgba(249,115,22,.12)" $color="#f97316"><FiDollarSign size={20} /></KpiIco>
                <div>
                  <KpiLbl>Valor conferido no ano</KpiLbl>
                  <KpiVal style={{ fontSize: "1.15rem" }}>{fmtBRL(bill?.value_year)}</KpiVal>
                  <KpiHint>somatório das faturas conferidas</KpiHint>
                </div>
              </Kpi>
            </KpiRow>

            <Grid $cols="1.4fr 1fr">
              {/* Gráfico de documentos por mês */}
              <Card>
                <CardTitle><FiActivity size={15} /> Documentos por mês ({year})</CardTitle>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData} margin={{ left: -10, right: 10, top: 8, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
                    <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,.45)", fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fill: "rgba(255,255,255,.4)", fontSize: 10 }} />
                    <Tooltip content={<DarkTip />} cursor={{ fill: "rgba(255,255,255,.04)" }} />
                    <Legend wrapperStyle={{ fontSize: ".75rem", color: "rgba(255,255,255,.5)" }} />
                    <Bar dataKey="Recebidos" fill="#04ade0" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Concluídos" fill="#34d399" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Conferências" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                {/* Barra de conclusão */}
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".78rem", color: "rgba(255,255,255,.5)" }}>
                    <span>Taxa de conclusão do ano</span>
                    <strong style={{ color: "#34d399" }}>{completionPct}%</strong>
                  </div>
                  <Progress><ProgressFill $pct={completionPct} /></Progress>
                </div>
              </Card>

              {/* Faturas conferidas no ano */}
              <Card>
                <CardTitle><FiUploadCloud size={15} /> Faturas conferidas em {year}</CardTitle>
                {(bill?.snapshots?.length ?? 0) === 0 ? (
                  <Empty>Nenhuma fatura conferida neste ano ainda.</Empty>
                ) : (
                  bill.snapshots.map(s => (
                    <SnapRow key={s.id} $saude={s.product === "saude"}>
                      <span className="period">{MONTHS_FULL[s.month]}/{s.year}</span>
                      <span className="prod">{s.product === "saude" ? "Saúde" : "Dental"}</span>
                      <span className="lives">{s.total_vidas} vidas</span>
                      <span className="val">{fmtBRL(s.total_value)}</span>
                    </SnapRow>
                  ))
                )}
              </Card>
            </Grid>

            {/* Linha do tempo */}
            <Card>
              <CardTitle><FiClock size={15} /> Linha do tempo · atividades recentes</CardTitle>
              {(d.timeline?.length ?? 0) === 0 ? (
                <Empty>Nenhuma atividade registrada.</Empty>
              ) : (
                <Timeline>
                  {d.timeline.map((e, i) => (
                    <TimeItem key={i} $type={e.type} $status={e.status}>
                      <div className="lbl">{e.label}</div>
                      <div className="date">{fmtDate(e.date)}</div>
                    </TimeItem>
                  ))}
                </Timeline>
              )}
            </Card>
          </>
        )}
      </Content>
    </PageWrapper>
  );
};
