// src/pages/BillingDashboard/index.jsx
// Dashboard analítico: descritivo + preditivo
// Recebe dados via router state (processamento imediato) ou snapshot da API (histórico)

import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { UserContext } from "../../contexts/userContext/userContext";
import {
  ResponsiveContainer,
  BarChart, Bar, ComposedChart, Line, Area, AreaChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
  ReferenceLine,
} from "recharts";
import {
  FiArrowLeft, FiBarChart2, FiUsers, FiTrendingUp,
  FiLoader, FiDownload, FiCalendar, FiClock, FiRefreshCw,
  FiActivity, FiAlertTriangle, FiChevronDown, FiChevronRight,
  FiArrowUpRight, FiArrowDownRight, FiCheckCircle, FiDollarSign,
  FiBriefcase, FiFileText,
} from "react-icons/fi";
import {
  PageWrapper, Topbar, TopbarLogo, TopbarTitle, BackBtn, Content,
} from "../BillingOrganization/style";
import {
  DashTabs, DashTab, SectionLabel,
  KpiGrid, KpiCard, KpiIcon, KpiLabel, KpiValue, KpiSub,
  ChartGrid, ChartCard, ChartTitle, ChartInsight,
  LoadingState, EmptyDash, MonthSelector, MonthBtn, ExportDashBtn,
  ExportBar, ExportBarLeft, ExportBarRight, PeriodTag,
  DeltaGrid, DeltaCard, DeltaLabel, DeltaValue, DeltaPill,
  HistWrap, HistTable,
  DivSummary, DivStat, DivStatValue, DivStatLabel,
  DivGroup, DivGroupHead, DivItem,
  CompanyBar, CompanyBarLabel, CompanySelect, CompanyTag, CompanyCount,
} from "./style";
import FRB from "../../assets/img/logoBranca.webp";
import { api } from "../../services/api";
import { notifyError, notifySucess } from "../../Toastfy";
import { SkeletonKpis, SkeletonChart, SkeletonFilterBar } from "../../components/Skeleton/Skeleton";
import { exportToExcel as exportBillingExcel } from "../BillingOrganization/utils/exportExcel";

// ─── Paleta ──────────────────────────────────────────────────────
const C = ["#04ade0","#00d4b4","#7c5cbf","#f97316","#22d3ee","#a3e635","#fb7185","#facc15","#34d399","#60a5fa"];
const fmtBRL   = v => (+(v ?? 0)).toLocaleString("pt-BR", { style:"currency", currency:"BRL" });
const fmtShort = v => {
  const n = +(v ?? 0);
  if (n >= 1_000_000) return `R$${(n/1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `R$${(n/1_000).toFixed(1)}K`;
  return fmtBRL(n);
};

const DarkTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#0d1525", border:"1px solid rgba(4,173,224,.2)", borderRadius:10, padding:"10px 14px", fontSize:".78rem" }}>
      {label && <div style={{ color:"rgba(255,255,255,.5)", marginBottom:6 }}>{label}</div>}
      {payload.map((p,i) => (
        <div key={i} style={{ color:p.color||"#fff", fontWeight:700, marginBottom:2 }}>
          {p.name}: {typeof p.value === "number" ? (Math.abs(p.value) >= 1 && p.name?.toLowerCase().includes("r$") ? fmtBRL(Math.abs(p.value)) : Math.abs(p.value).toLocaleString("pt-BR")) : p.value}
        </div>
      ))}
    </div>
  );
};

const MONTHS_ABBR = ["","Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const MONTHS_FULL = ["","Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

// ─── Gerador dinâmico de insights baseado nos dados reais ──────────
function computeInsights(analytics) {
  if (!analytics) return {};

  // ── Pirâmide Etária ──────────────────────────────────────────────
  const pyramid = analytics.agePyramid ?? [];
  const peakRange = [...pyramid].sort((a, b) => b.total - a.total)[0];
  const over45Count = pyramid
    .filter(r => r.range === "45-54" || r.range === "55+")
    .reduce((s, r) => s + r.total, 0);
  const pct45plus = analytics.totalTitulares > 0
    ? ((over45Count / analytics.totalTitulares) * 100).toFixed(1) : "0";
  // Faixa imediatamente abaixo do risco (que migrará para 45-54 nos próximos ~10 anos)
  const ORDER = ["<25", "25-34", "35-44", "45-54", "55+"];
  const peakIdx = ORDER.indexOf(peakRange?.range);
  const nextRiskRange = peakIdx >= 0 && peakIdx < ORDER.length - 2
    ? ORDER[peakIdx + 1] : null;
  const totalMale   = pyramid.reduce((s, r) => s + Math.abs(r.male ?? 0), 0);
  const totalFemale = pyramid.reduce((s, r) => s + (r.female ?? 0), 0);
  const mfRatio     = totalFemale > 0 ? (totalMale / totalFemale).toFixed(2) : null;

  // ── Custo por CC ─────────────────────────────────────────────────
  const ccList  = analytics.costByCC ?? [];
  const topCC   = ccList[0];
  const mostExpensive = [...ccList].sort((a, b) => b.avgPerLife - a.avgPerLife)[0];
  const totalCCCost   = ccList.reduce((s, c) => s + c.total, 0);
  const totalCCVidas  = ccList.reduce((s, c) => s + c.vidas, 0);
  const topCCPct      = topCC && totalCCCost > 0
    ? ((topCC.total / totalCCCost) * 100).toFixed(1) : null;
  const avgCostPerLife = totalCCVidas > 0 ? (totalCCCost / totalCCVidas) : 0;

  // ── Curva de Crescimento ─────────────────────────────────────────
  const growth        = analytics.growthByYear ?? [];
  const peakGrow      = [...growth].sort((a, b) => b.count - a.count)[0];
  const recentYears   = growth.slice(-3);
  const recentAvg     = recentYears.length > 0
    ? (recentYears.reduce((s, r) => s + r.count, 0) / recentYears.length) : 0;
  const overallAvg    = growth.length > 0
    ? (growth.reduce((s, r) => s + r.count, 0) / growth.length) : 0;
  const growthTrend   = recentAvg > overallAvg * 1.1 ? "acelerado"
    : recentAvg < overallAvg * 0.85 ? "desacelerando" : "estável";
  const oldestYear    = growth[0]?.year;
  const newestYear    = growth[growth.length - 1]?.year;
  const totalYears    = growth.length;

  // ── Risco de Envelhecimento ──────────────────────────────────────
  const risk          = analytics.agingRisk ?? {};
  const totalAtRisk   = (risk.current45to54 ?? 0) + (risk.current55plus ?? 0);
  const pctAtRisk     = analytics.totalTitulares > 0
    ? ((totalAtRisk / analytics.totalTitulares) * 100).toFixed(1) : "0";
  const riskLevel     = +pctAtRisk > 35 ? "muito alto"
    : +pctAtRisk > 20 ? "alto" : +pctAtRisk > 10 ? "moderado" : "baixo";
  const avgAge        = risk.avgAge ?? 0;
  const ageCategory   = avgAge >= 44 ? "envelhecida"
    : avgAge >= 40 ? "madura" : avgAge >= 35 ? "jovem-adulta" : "jovem";
  const futureRisk    = risk.willBe45to54in10y ?? 0;
  const projPct       = risk.projectionPct ?? 0;

  // ── Razão de dependentes por CC ─────────────────────────────────
  const depRatioData  = analytics.depRatioByCC ?? [];
  const topDepCC      = depRatioData[0];
  const avgDep        = analytics.avgDependents ?? 0;
  const ccAcimaMedia  = depRatioData.filter(d => d.ratio > avgDep * 1.3).length;
  const totalDepExtra = depRatioData.reduce((s, d) => {
    const excesso = d.ratio > avgDep ? (d.ratio - avgDep) * d.titulares : 0;
    return s + excesso;
  }, 0);

  // ── Movimentação por CC ──────────────────────────────────────────
  const movData      = analytics.movByCC ?? [];
  const topMovCC     = movData[0];
  const totalInc     = movData.reduce((s, m) => s + m.inclusoes,     0);
  const totalCan     = movData.reduce((s, m) => s + m.cancelamentos, 0);
  const netSaldo     = totalInc - totalCan;
  const highRotCC    = [...movData].sort((a, b) => b.cancelamentos - a.cancelamentos)[0];

  return {
    // pirâmide
    peakRange, over45Count, pct45plus, nextRiskRange, mfRatio, totalMale, totalFemale,
    // cc custo
    topCC, mostExpensive, topCCPct, avgCostPerLife,
    // crescimento
    peakGrow, growthTrend, recentAvg: Math.round(recentAvg), overallAvg: Math.round(overallAvg),
    totalYears, oldestYear, newestYear,
    // risco
    totalAtRisk, pctAtRisk, riskLevel, ageCategory, avgAge, futureRisk, projPct,
    // dependentes por CC
    topDepCC, avgDep, ccAcimaMedia, totalDepExtra: Math.round(totalDepExtra),
    // movimentação por CC
    topMovCC, totalInc, totalCan, netSaldo, highRotCC,
  };
}

// ─── Série de evolução (comparativo histórico) ─────────────────────
// Filtra os snapshots para a MESMA empresa + produto do snapshot selecionado,
// ordena por data e calcula variações mês a mês (vidas, valor, ticket médio).
function buildEvolution(snapshots, selected) {
  if (!selected || !Array.isArray(snapshots)) return { series: [], deltas: null };

  const series = snapshots
    .filter(s =>
      (s.company_name ?? "") === (selected.company_name ?? "") &&
      s.product === selected.product
    )
    .sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month))
    .map(s => {
      const vidas  = +(s.total_vidas ?? 0);
      const valor  = +(s.total_value ?? 0);
      return {
        id:     s.id,
        month:  s.month,
        year:   s.year,
        label:  `${MONTHS_ABBR[s.month]}/${String(s.year).slice(-2)}`,
        full:   `${MONTHS_FULL[s.month]}/${s.year}`,
        vidas,
        valor,
        ticket: vidas > 0 ? valor / vidas : 0,
        isCurrent: s.id === selected.id,
      };
    });

  const idx  = series.findIndex(s => s.id === selected.id);
  const curr = series[idx];
  const prev = idx > 0 ? series[idx - 1] : null;

  const pct = (a, b) => (b > 0 ? ((a - b) / b) * 100 : null);
  const deltas = curr ? {
    prevLabel: prev?.full ?? null,
    vidas:  { value: curr.vidas,  abs: prev ? curr.vidas  - prev.vidas  : null, pct: prev ? pct(curr.vidas,  prev.vidas)  : null },
    valor:  { value: curr.valor,  abs: prev ? curr.valor  - prev.valor  : null, pct: prev ? pct(curr.valor,  prev.valor)  : null },
    ticket: { value: curr.ticket, abs: prev ? curr.ticket - prev.ticket : null, pct: prev ? pct(curr.ticket, prev.ticket) : null },
    months: series.length,
  } : null;

  return { series, deltas };
}

// ─── Exportador Excel ─────────────────────────────────────────────
const exportAnalyticsExcel = async ({ analytics, snap }) => {
  if (!analytics) return;
  try {
    const ExcelJS = (await import("exceljs")).default;
    const { saveAs } = await import("file-saver");

    const wb = new ExcelJS.Workbook();
    wb.creator   = "FRB Consultoria";
    wb.lastModifiedBy = "FRB Consultoria";
    wb.created   = new Date();
    wb.modified  = new Date();

    // ── Estilos reutilizáveis ──────────────────────────────────
    const HEADER_FILL = { type:"pattern", pattern:"solid", fgColor:{ argb:"FF04ADE0" } };
    const TITLE_FILL  = { type:"pattern", pattern:"solid", fgColor:{ argb:"FF0A1628" } };
    const ALT_FILL    = { type:"pattern", pattern:"solid", fgColor:{ argb:"FFF0F9FF" } };
    const BORDER      = {
      top:    { style:"thin", color:{ argb:"FFD0E8F5" } },
      left:   { style:"thin", color:{ argb:"FFD0E8F5" } },
      bottom: { style:"thin", color:{ argb:"FFD0E8F5" } },
      right:  { style:"thin", color:{ argb:"FFD0E8F5" } },
    };
    const HEADER_FONT = { bold:true, color:{ argb:"FFFFFFFF" }, size:11, name:"Calibri" };
    const TITLE_FONT  = { bold:true, color:{ argb:"FF04ADE0" }, size:14, name:"Calibri" };
    const SUB_FONT    = { italic:true, color:{ argb:"FF888888" }, size:10, name:"Calibri" };
    const DATA_FONT   = { size:10, name:"Calibri" };

    const applyHeaderRow = (row) => {
      row.eachCell(cell => {
        cell.fill      = HEADER_FILL;
        cell.font      = HEADER_FONT;
        cell.border    = BORDER;
        cell.alignment = { horizontal:"center", vertical:"middle" };
      });
      row.height = 24;
    };

    const applyDataRow = (row, alt) => {
      row.eachCell(cell => {
        if (alt) cell.fill = ALT_FILL;
        cell.border    = BORDER;
        cell.font      = DATA_FONT;
        cell.alignment = { vertical:"middle", wrapText:false };
      });
      row.height = 20;
    };

    const addSheetTitle = (ws, title, subtitle, cols) => {
      ws.mergeCells(`A1:${String.fromCharCode(64 + cols)}1`);
      const c1 = ws.getCell("A1");
      c1.value     = title;
      c1.font      = TITLE_FONT;
      c1.fill      = TITLE_FILL;
      c1.alignment = { horizontal:"center", vertical:"middle" };
      ws.getRow(1).height = 34;

      ws.mergeCells(`A2:${String.fromCharCode(64 + cols)}2`);
      const c2 = ws.getCell("A2");
      c2.value     = subtitle;
      c2.font      = SUB_FONT;
      c2.fill      = TITLE_FILL;
      c2.alignment = { horizontal:"center" };
      ws.getRow(2).height = 18;

      ws.addRow([]);
      ws.getRow(3).height = 6;
    };

    const periodLabel = snap
      ? `${MONTHS_FULL[snap.month] ?? snap.month}/${snap.year} · ${snap.company_name ?? ""}`
      : `Gerado em ${new Date().toLocaleDateString("pt-BR")}`;

    // ════════════════════════════════════════════════════════════
    // ABA 1 · RESUMO
    // ════════════════════════════════════════════════════════════
    const wsRes = wb.addWorksheet("📋 Resumo Executivo", { tabColor:{ argb:"FF04ADE0" } });
    wsRes.columns = [
      { key:"ind",   width:38 },
      { key:"val",   width:28 },
    ];
    addSheetTitle(wsRes, "FRB Consultoria · Relatório Analítico de Beneficiários", `Período: ${periodLabel}`, 2);

    const hRes = wsRes.addRow(["Indicador", "Valor"]);
    applyHeaderRow(hRes);

    const kpiData = [
      ["Total de Titulares",      (analytics.totalTitulares ?? 0).toLocaleString("pt-BR")],
      ["Total de Beneficiários",  (analytics.totalBeneficiarios ?? 0).toLocaleString("pt-BR")],
      ["Idade Média (titulares)", `${analytics.avgAge ?? "·"} anos`],
      ["Média de Dependentes",    analytics.avgDependents ?? "·"],
      ["% Titulares",             `${analytics.compositionTotal?.pctTitular ?? "·"}%`],
      ["% Cônjuges",              `${analytics.compositionTotal?.pctConjuge ?? "·"}%`],
      ["% Filhos / Dependentes",  `${analytics.compositionTotal?.pctFilho ?? "·"}%`],
    ];
    kpiData.forEach((row, i) => applyDataRow(wsRes.addRow(row), i % 2 === 0));

    // ════════════════════════════════════════════════════════════
    // ABA 2 · PIRÂMIDE ETÁRIA
    // ════════════════════════════════════════════════════════════
    const wsPyr = wb.addWorksheet("📊 Pirâmide Etária", { tabColor:{ argb:"FF00D4B4" } });
    wsPyr.columns = [
      { key:"range",  width:18 },
      { key:"male",   width:16 },
      { key:"female", width:16 },
      { key:"total",  width:12 },
    ];
    addSheetTitle(wsPyr, "Pirâmide Etária / Titulares por Faixa e Sexo", `Período: ${periodLabel}`, 4);
    applyHeaderRow(wsPyr.addRow(["Faixa Etária", "Masculino", "Feminino", "Total"]));
    (analytics.agePyramid ?? []).forEach((d, i) => {
      const r = wsPyr.addRow([d.range, Math.abs(d.male), d.female, d.total]);
      applyDataRow(r, i % 2 === 0);
      r.getCell(2).alignment = { horizontal:"center" };
      r.getCell(3).alignment = { horizontal:"center" };
      r.getCell(4).alignment = { horizontal:"center" };
    });

    // ════════════════════════════════════════════════════════════
    // ABA 3 · CUSTO POR CC
    // ════════════════════════════════════════════════════════════
    const wsCC = wb.addWorksheet("💰 Custo por CC", { tabColor:{ argb:"FF7C5CBF" } });
    wsCC.columns = [
      { key:"name",        width:36 },
      { key:"total",       width:20 },
      { key:"count",       width:12 },
      { key:"avgPerLife",  width:20 },
    ];
    addSheetTitle(wsCC, "Custo por Centro de Custo", `Período: ${periodLabel}`, 4);
    applyHeaderRow(wsCC.addRow(["Centro de Custo", "Total (R$)", "Vidas", "Custo Médio / Vida (R$)"]));
    (analytics.costByCC ?? []).forEach((d, i) => {
      const r = wsCC.addRow([d.name, +d.total, d.count, +d.avgPerLife]);
      r.getCell(2).numFmt = 'R$ #,##0.00';
      r.getCell(4).numFmt = 'R$ #,##0.00';
      r.getCell(3).alignment = { horizontal:"center" };
      applyDataRow(r, i % 2 === 0);
    });

    // ════════════════════════════════════════════════════════════
    // ABA 4 · COMPOSIÇÃO FAMILIAR
    // ════════════════════════════════════════════════════════════
    const wsFam = wb.addWorksheet("👨‍👩‍👧 Composição Familiar", { tabColor:{ argb:"FFF97316" } });
    wsFam.columns = [
      { key:"cc",         width:36 },
      { key:"pctTitular", width:16 },
      { key:"pctConjuge", width:16 },
      { key:"pctFilho",   width:16 },
    ];
    addSheetTitle(wsFam, "Composição Familiar por Centro de Custo · 100% Empilhado", `Período: ${periodLabel}`, 4);
    applyHeaderRow(wsFam.addRow(["Centro de Custo", "% Titular", "% Cônjuge", "% Filho/Dep"]));
    (analytics.familyComp ?? []).forEach((d, i) => {
      const r = wsFam.addRow([d.cc, `${d.pctTitular}%`, `${d.pctConjuge}%`, `${d.pctFilho}%`]);
      [2,3,4].forEach(c => { r.getCell(c).alignment = { horizontal:"center" }; });
      applyDataRow(r, i % 2 === 0);
    });

    // ════════════════════════════════════════════════════════════
    // ABA 5 · RISCO DE ENVELHECIMENTO
    // ════════════════════════════════════════════════════════════
    const wsRisk = wb.addWorksheet("⚠️ Risco Envelhecimento", { tabColor:{ argb:"FFEF4444" } });
    wsRisk.columns = [
      { key:"label", width:46 },
      { key:"value", width:20 },
    ];
    addSheetTitle(wsRisk, "Risco de Custo Futuro · Análise de Envelhecimento", `Período: ${periodLabel}`, 2);
    applyHeaderRow(wsRisk.addRow(["Indicador de Risco", "Titulares"]));
    const riskRows = [
      ["45–54 anos hoje (alto risco)",           analytics.agingRisk?.current45to54     ?? 0],
      ["35–44 anos hoje → passarão para 45–54 em +10 anos", analytics.agingRisk?.willBe45to54in10y ?? 0],
      ["55+ anos hoje (muito alto risco)",       analytics.agingRisk?.current55plus     ?? 0],
      ["Idade média dos titulares",              `${analytics.agingRisk?.avgAge ?? "·"} anos`],
    ];
    riskRows.forEach((row, i) => {
      const r = wsRisk.addRow(row);
      r.getCell(2).alignment = { horizontal:"center" };
      applyDataRow(r, i % 2 === 0);
    });

    // ════════════════════════════════════════════════════════════
    // ABA 6 · CRESCIMENTO DE VIDAS
    // ════════════════════════════════════════════════════════════
    const wsGrow = wb.addWorksheet("📈 Crescimento", { tabColor:{ argb:"FF34D399" } });
    wsGrow.columns = [
      { key:"year",       width:16 },
      { key:"count",      width:20 },
      { key:"cumulative", width:20 },
    ];
    addSheetTitle(wsGrow, "Curva de Crescimento · Novos Titulares por Ano de Adesão", `Período: ${periodLabel}`, 3);
    applyHeaderRow(wsGrow.addRow(["Ano de Adesão", "Novos Titulares", "Total Acumulado"]));
    (analytics.growthByYear ?? []).forEach((d, i) => {
      const r = wsGrow.addRow([d.year, d.count, d.cumulative]);
      [1,2,3].forEach(c => { r.getCell(c).alignment = { horizontal:"center" }; });
      applyDataRow(r, i % 2 === 0);
    });

    // ─── Salva ────────────────────────────────────────────────
    const buf = await wb.xlsx.writeBuffer();
    const company = snap?.company_name?.replace(/\s+/g, "_") ?? "relatorio";
    const period  = snap ? `${MONTHS_ABBR[snap.month]}${snap.year}` : new Date().toISOString().slice(0,10);
    saveAs(
      new Blob([buf], { type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      `FRB_Analytics_${company}_${period}.xlsx`
    );
    notifySucess("Relatório Excel exportado com sucesso!");
  } catch (err) {
    console.error("[exportToExcel]", err);
    notifyError("Erro ao gerar o relatório Excel.");
  }
};

// ─────────────────────────────────────────────────────────────────
export const BillingDashboard = () => {
  const navigate       = useNavigate();
  const location       = useLocation();
  const [searchParams] = useSearchParams();
  const { user }       = useContext(UserContext);

  useEffect(() => {
    if (user && !user.perm_benefits_dashboard && !user.perm_benefits_billing && !user.perm_admin) navigate("/");
  }, [user, navigate]);

  const preloadId = searchParams.get("snapshot");

  const [analytics,       setAnalytics]       = useState(null);
  const [snapshots,       setSnapshots]       = useState([]);
  const [selected,        setSelected]        = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [tab,             setTab]             = useState("descritivo");
  const [exporting,       setExporting]       = useState(false);

  // ── Divergências (auditoria automática vs. mês anterior) ──
  const [divergences,   setDivergences]   = useState(null);
  const [divLoading,    setDivLoading]    = useState(false);
  const [openDivGroups, setOpenDivGroups] = useState({});

  // ── Estudos estatísticos extras ──
  const [stats,        setStats]        = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // ── Busca analytics_data do endpoint de detalhe (o list não inclui) ──
  const fetchAnalytics = useCallback(async (snapId) => {
    try {
      const res = await api.get(`billing-snapshots/${snapId}/`, { skipGlobalLoader: true });
      const data = res.data?.analytics_data;
      setAnalytics(data && Object.keys(data).length ? data : null);
    } catch {
      setAnalytics(null);
    }
  }, []);

  // ── Busca divergências do snapshot (compara com o mês anterior) ──
  // Em erro grava { error:true } (não null) para não disparar o efeito em loop.
  const fetchDivergences = useCallback(async (snapId) => {
    setDivLoading(true);
    try {
      const res = await api.get(`billing-snapshots/${snapId}/divergences/`, { skipGlobalLoader: true });
      setDivergences(res.data ?? { error: true });
    } catch {
      setDivergences({ error: true });
    } finally {
      setDivLoading(false);
    }
  }, []);

  // ── Busca estudos estatísticos extras ──
  const fetchStats = useCallback(async (snapId) => {
    setStatsLoading(true);
    try {
      const res = await api.get(`billing-snapshots/${snapId}/stats/`, { skipGlobalLoader: true });
      setStats(res.data ?? { error: true });
    } catch {
      setStats({ error: true });
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ── Carrega lista de snapshots ─────────────────────────────────
  const loadFromApi = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await api.get("billing-snapshots/", { skipGlobalLoader: true });
      const data = res.data?.results ?? res.data ?? [];
      const arr  = Array.isArray(data)
        ? [...data].sort((a,b) => a.year !== b.year ? a.year - b.year : a.month - b.month)
        : [];
      setSnapshots(arr);
      const target = preloadId ? arr.find(s => s.id === preloadId) : arr[arr.length - 1];
      if (target) {
        setSelected(target);
        setSelectedCompany(target.company_name ?? "");
        // O list serializer não inclui analytics_data · busca pelo endpoint de detalhe
        await fetchAnalytics(target.id);
      }
    } catch { notifyError("Erro ao carregar dashboard."); }
    finally   { setLoading(false); }
  }, [preloadId, fetchAnalytics]);

  useEffect(() => {
    const state = location.state;
    if (state?.analytics) {
      setAnalytics(state.analytics);
      setLoading(false);
    } else {
      loadFromApi();
    }
  }, [location.state, loadFromApi]);

  const handleSelectSnap = async (snap) => {
    setSelected(snap);
    setAnalytics(null);
    setDivergences(null);      // reseta · recarrega sob demanda na aba Divergências
    setStats(null);            // reseta · recarrega sob demanda na aba Estudos
    await fetchAnalytics(snap.id);
  };

  // Troca de empresa: seleciona o período mais recente daquela empresa
  const handleSelectCompany = async (name) => {
    setSelectedCompany(name);
    const list = snapshots
      .filter(s => (s.company_name ?? "") === name)
      .sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month));
    const latest = list[list.length - 1];
    if (latest) await handleSelectSnap(latest);
  };

  // ── Carrega divergências sob demanda ao abrir a aba (lazy + sem loop) ──
  useEffect(() => {
    if (tab === "divergencias" && selected && divergences === null && !divLoading
        && (user?.perm_dash_divergencias || user?.perm_admin)) {
      fetchDivergences(selected.id);
    }
  }, [tab, selected, divergences, divLoading, fetchDivergences, user]);

  // ── Carrega estudos estatísticos sob demanda ──
  useEffect(() => {
    if (tab === "estudos" && selected && stats === null && !statsLoading) {
      fetchStats(selected.id);
    }
  }, [tab, selected, stats, statsLoading, fetchStats]);

  // Excel ANALÍTICO (Resumo, Pirâmide, Custo por CC, Composição, Risco, Crescimento)
  const handleExportAnalytics = async () => {
    setExporting("analytics");
    await exportAnalyticsExcel({ analytics, snap: selected });
    setExporting(false);
  };

  // Excel ORIGINAL do faturamento (Vidas, Total por Sub, Certificado, Centro de Custo)
  const handleExportBilling = async () => {
    if (!selected) return;
    setExporting("billing");
    try {
      // Detalhe traz summary_blocks / total_cert / total_cc
      const det = await api.get(`billing-snapshots/${selected.id}/`, { skipGlobalLoader: true });
      const s = det.data ?? {};

      // Busca todas as vidas de uma vez (page_size alto)
      const livesRes = await api.get(`billing-snapshots/${selected.id}/lives/`, {
        params: { page_size: 10000 }, skipGlobalLoader: true,
      });
      const lives = livesRes.data?.results ?? livesRes.data ?? [];

      // snake_case (API) → camelCase (gerador original)
      const vidasRows = lives.map(l => ({
        sub: l.sub, certifFull: l.certif_full, certGrupo: l.cert_grupo,
        nome: l.nome, cpf: l.cpf, centroCusto: l.centro_custo, codigoCC: l.codigo_cc,
        dataNascimento: l.data_nascimento, sexo: l.sexo, estCivil: l.est_civil,
        parentesco: l.parentesco, plano: l.plano, dataInicio: l.data_inicio,
        tipoLancamento: l.tipo_lancamento, lancamento: l.lancamento,
        valor: typeof l.valor === "number" ? l.valor : parseFloat(l.valor || 0),
      }));

      await exportBillingExcel({
        vidasRows,
        summaryBlocks: s.summary_blocks ?? [],
        totalCert:     s.total_cert ?? [],
        totalCC:       s.total_cc ?? [],
      }, { includeQualityTabs: false });
      notifySucess("Relatório Excel exportado com sucesso!");
    } catch (err) {
      console.error("[handleExportBilling]", err);
      notifyError("Erro ao gerar o relatório Excel.");
    } finally {
      setExporting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  if (loading) return (
    <PageWrapper>
      <Topbar>
        <TopbarLogo src={FRB} alt="FRB" />
        <TopbarTitle>Dashboard Analítico</TopbarTitle>
        <BackBtn onClick={() => navigate("/user")}><FiArrowLeft size={13}/> Voltar</BackBtn>
      </Topbar>
      <Content>
        <SkeletonFilterBar />
        <SkeletonKpis count={4} />
        <SkeletonChart height={260} />
        <SkeletonChart height={220} />
      </Content>
    </PageWrapper>
  );

  const hasSnaps     = snapshots.length > 0;
  const hasAnalytics = !!analytics;
  const snap         = selected;

  // Insights dinâmicos: recalculados a cada mudança de analytics
  const ins = computeInsights(analytics);

  // Série de evolução (comparativo histórico) · independe de analytics
  const evo = buildEvolution(snapshots, selected);

  // Permissões das abas novas (switch por usuário no painel de admin)
  const canEvo = !!(user?.perm_dash_evolucao || user?.perm_admin);
  const canDiv = !!(user?.perm_dash_divergencias || user?.perm_admin);

  // Empresas disponíveis (o backend já isola por cliente; aqui só agrupamos
  // por company_name). O seletor só aparece quando há mais de uma empresa.
  const companies = [...new Set(snapshots.map(s => s.company_name || ""))]
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
  const companyName  = selectedCompany ?? "";
  const companySnaps = snapshots.filter(s => (s.company_name || "") === companyName);

  return (
    <PageWrapper>
      <Topbar>
        <TopbarLogo src={FRB} alt="FRB" />
        <TopbarTitle>Dashboard Analítico</TopbarTitle>
        <div style={{ display:"flex", gap:10 }}>
          {hasSnaps && (
            <BackBtn
              onClick={() => navigate("/beneficios/faturamento/historico")}
              style={{ borderColor:"rgba(4,173,224,.3)", color:"#04ade0" }}
            >
              <FiClock size={13}/> Histórico
            </BackBtn>
          )}
          <BackBtn onClick={() => navigate("/user")}><FiArrowLeft size={13}/> Voltar</BackBtn>
        </div>
      </Topbar>

      <Content>
        {/* ── Seletor de empresa (admin escolhe; usuário comum só vê a sua) ── */}
        {hasSnaps && (
          <CompanyBar>
            <CompanyBarLabel><FiBriefcase size={14}/> Empresa</CompanyBarLabel>
            {companies.length > 1 ? (
              <CompanySelect
                value={companyName}
                onChange={(e) => handleSelectCompany(e.target.value)}
              >
                {companies.map(c => (
                  <option key={c || "·"} value={c}>{c || "(sem nome)"}</option>
                ))}
              </CompanySelect>
            ) : (
              <CompanyTag><FiBriefcase size={13}/> {companyName || "(sem nome)"}</CompanyTag>
            )}
            <CompanyCount>
              {companySnaps.length} {companySnaps.length === 1 ? "período" : "períodos"}
            </CompanyCount>
            <ExportDashBtn
              onClick={loadFromApi}
              style={{ marginLeft:"auto", background:"transparent", border:"1px solid rgba(255,255,255,.12)" }}
            >
              <FiRefreshCw size={13}/>
            </ExportDashBtn>
          </CompanyBar>
        )}

        {/* ── Seletor de período (somente da empresa escolhida) ── */}
        {hasSnaps && companySnaps.length > 0 && (
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24, flexWrap:"wrap" }}>
            <FiCalendar size={14} style={{ color:"#04ade0" }} />
            <MonthSelector>
              {companySnaps.map(s => {
                const prodLabel = s.product === "dental" ? "Dental"
                  : s.product === "saude" ? "Saúde" : null;
                const prodColor = s.product === "dental" ? "#04ade0"
                  : s.product === "saude"  ? "#34d399" : "rgba(255,255,255,.4)";
                return (
                  <MonthBtn key={s.id} $active={selected?.id === s.id} onClick={() => handleSelectSnap(s)}>
                    {MONTHS_ABBR[s.month]}/{s.year}
                    {prodLabel && (
                      <span style={{ color: prodColor, fontWeight: 700, fontSize: ".65rem" }}>
                        · {prodLabel}
                      </span>
                    )}
                  </MonthBtn>
                );
              })}
            </MonthSelector>
          </div>
        )}

        {!hasAnalytics ? (
          <EmptyDash>
            <FiBarChart2 size={52} style={{ color:"rgba(4,173,224,.3)" }}/>
            <h3>Analytics não disponíveis</h3>
            <p>
              Para ver os gráficos, clique em <strong>"Ver Analytics"</strong> após processar os arquivos,
              ou re-salve um faturamento existente para gerar os dados.
            </p>
            <BackBtn onClick={() => navigate("/beneficios/faturamento")} style={{ marginTop:16 }}>
              <FiArrowLeft size={13}/> Ir para Faturamento
            </BackBtn>
          </EmptyDash>
        ) : (
          <>
            {/* ── Barra de exportação ── */}
            <ExportBar>
              <ExportBarLeft>
                {snap && (
                  <>
                    <PeriodTag>
                      <FiCalendar size={12}/>
                      {MONTHS_FULL[snap.month]}/{snap.year}
                    </PeriodTag>
                    {snap.company_name && (
                      <PeriodTag $company>
                        {snap.company_name}
                      </PeriodTag>
                    )}
                  </>
                )}
                <span style={{ fontSize:".78rem", color:"rgba(255,255,255,.3)" }}>
                  {(analytics.totalBeneficiarios ?? 0).toLocaleString("pt-BR")} beneficiários
                  &nbsp;·&nbsp;
                  {(analytics.totalTitulares ?? 0).toLocaleString("pt-BR")} titulares
                </span>
              </ExportBarLeft>
              <ExportBarRight>
                {snap && (
                  <ExportDashBtn
                    onClick={() => navigate(`/beneficios/faturamento/relatorio?snapshot=${snap.id}`)}
                    style={{ background:"linear-gradient(135deg,#7c5cbf,#5b3fa0)" }}
                    title="Relatório gerencial em PDF (kit de reajuste)"
                  >
                    <FiFileText size={14}/> Relatório Gerencial (PDF)
                  </ExportDashBtn>
                )}
                <ExportDashBtn
                  onClick={handleExportBilling}
                  disabled={!!exporting}
                  $excel
                  title="Planilha do faturamento (Vidas, Total por Sub, Certificado e Centro de Custo)"
                >
                  {exporting === "billing"
                    ? <FiLoader size={14} className="spin"/>
                    : <FiDownload size={14}/>
                  }
                  {exporting === "billing" ? "Gerando..." : "Exportar Relatório Excel"}
                </ExportDashBtn>
                <ExportDashBtn
                  onClick={handleExportAnalytics}
                  disabled={!!exporting}
                  style={{ background:"linear-gradient(135deg,#0a8a6a,#0f6b54)" }}
                  title="Planilha analítica (Resumo, Pirâmide etária, Custo por CC, Composição, Risco e Crescimento)"
                >
                  {exporting === "analytics"
                    ? <FiLoader size={14} className="spin"/>
                    : <FiDownload size={14}/>
                  }
                  {exporting === "analytics" ? "Gerando..." : "Exportar Analítico (Excel)"}
                </ExportDashBtn>
              </ExportBarRight>
            </ExportBar>

            {/* ── Tabs ── */}
            <DashTabs>
              <DashTab $active={tab === "descritivo"} onClick={() => setTab("descritivo")}>
                <FiBarChart2 size={13}/> 📊 Descritivo / Situação Atual
              </DashTab>
              {canEvo && (
                <DashTab $active={tab === "evolucao"} onClick={() => setTab("evolucao")}>
                  <FiActivity size={13}/> 📈 Evolução / Comparativo Histórico
                </DashTab>
              )}
              {canDiv && (
                <DashTab $active={tab === "divergencias"} onClick={() => setTab("divergencias")}>
                  <FiAlertTriangle size={13}/> 🔎 Divergências / Auditoria
                </DashTab>
              )}
              <DashTab $active={tab === "estudos"} onClick={() => setTab("estudos")}>
                <FiFileText size={13}/> 📑 Estudos Estatísticos
              </DashTab>
              <DashTab $active={tab === "preditivo"} onClick={() => setTab("preditivo")}>
                <FiTrendingUp size={13}/> 🔮 Preditivo / Projeções e Riscos
              </DashTab>
            </DashTabs>

            {/* ════════════════════════════════════════════════════
                ABA DESCRITIVA
            ════════════════════════════════════════════════════ */}
            {tab === "descritivo" && (
              <>
                {/* KPIs */}
                <KpiGrid>
                  <KpiCard>
                    <KpiIcon $bg="rgba(4,173,224,.12)" $color="#04ade0"><FiUsers size={20}/></KpiIcon>
                    <div>
                      <KpiLabel>Total de Titulares</KpiLabel>
                      <KpiValue>{(analytics.totalTitulares ?? 0).toLocaleString("pt-BR")}</KpiValue>
                      <KpiSub>{(analytics.totalBeneficiarios ?? 0).toLocaleString("pt-BR")} beneficiários</KpiSub>
                    </div>
                  </KpiCard>
                  <KpiCard>
                    <KpiIcon $bg="rgba(124,92,191,.12)" $color="#7c5cbf"><FiBarChart2 size={20}/></KpiIcon>
                    <div>
                      <KpiLabel>Idade Média</KpiLabel>
                      <KpiValue>{analytics.avgAge ?? "·"} anos</KpiValue>
                      <KpiSub>titulares ativos</KpiSub>
                    </div>
                  </KpiCard>
                  <KpiCard>
                    <KpiIcon $bg="rgba(0,212,180,.12)" $color="#00d4b4"><FiUsers size={20}/></KpiIcon>
                    <div>
                      <KpiLabel>Média de Dependentes</KpiLabel>
                      <KpiValue>{analytics.avgDependents ?? "·"}</KpiValue>
                      <KpiSub>por titular</KpiSub>
                    </div>
                  </KpiCard>
                  <KpiCard>
                    <KpiIcon $bg="rgba(249,115,22,.12)" $color="#f97316"><FiTrendingUp size={20}/></KpiIcon>
                    <div>
                      <KpiLabel>Faixa Maior Custo</KpiLabel>
                      <KpiValue style={{ fontSize:"1rem" }}>
                        {analytics.agingRisk?.current45to54 > 0
                          ? `${(analytics.agingRisk.current45to54 ?? 0)} · 45–54`
                          : "·"}
                      </KpiValue>
                      <KpiSub>titulares em risco alto</KpiSub>
                    </div>
                  </KpiCard>
                </KpiGrid>

                {/* Composição global */}
                {analytics.compositionTotal && (
                  <div style={{ display:"flex", gap:10, marginBottom:24, flexWrap:"wrap" }}>
                    {[
                      { label:"Titular", pct:analytics.compositionTotal.pctTitular, color:"#04ade0" },
                      { label:"Cônjuge", pct:analytics.compositionTotal.pctConjuge, color:"#00d4b4" },
                      { label:"Filhos",  pct:analytics.compositionTotal.pctFilho,   color:"#7c5cbf" },
                    ].map(item => (
                      <div key={item.label} style={{
                        background:"rgba(255,255,255,.04)", borderRadius:10,
                        padding:"10px 18px", flex:"1 1 140px", minWidth:140,
                      }}>
                        <div style={{ fontSize:".68rem", color:"rgba(255,255,255,.4)", textTransform:"uppercase", letterSpacing:".06em", marginBottom:4 }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize:"1.2rem", fontWeight:800, color:item.color }}>{item.pct}%</div>
                      </div>
                    ))}
                  </div>
                )}

                <ChartGrid $cols={2}>
                  {/* ── 1. Pirâmide Etária ── */}
                  <ChartCard $span={2}>
                    <ChartTitle>1. Pirâmide Etária / Titulares por Sexo e Faixa</ChartTitle>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart layout="vertical" data={analytics.agePyramid} margin={{ left:10, right:20, top:8, bottom:8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" horizontal={false}/>
                        <XAxis
                          type="number"
                          tickFormatter={v => Math.abs(v).toLocaleString("pt-BR")}
                          tick={{ fill:"rgba(255,255,255,.4)", fontSize:10 }}
                          domain={[d => d, d => d]}
                        />
                        <YAxis type="category" dataKey="range" tick={{ fill:"rgba(255,255,255,.6)", fontSize:11, fontWeight:700 }} width={52}/>
                        <Tooltip content={<DarkTip />} formatter={v => Math.abs(v)}/>
                        <Legend wrapperStyle={{ fontSize:".75rem", color:"rgba(255,255,255,.5)" }}/>
                        <ReferenceLine x={0} stroke="rgba(255,255,255,.15)"/>
                        <Bar dataKey="male"   name="Masculino" fill="#04ade0" radius={[0,4,4,0]}/>
                        <Bar dataKey="female" name="Feminino"  fill="#f97316" radius={[0,4,4,0]}/>
                      </BarChart>
                    </ResponsiveContainer>
                    <ChartInsight>
                      💡 Concentração máxima em{" "}
                      <strong>{ins.peakRange?.range ?? "·"}</strong>{" "}
                      ({ins.peakRange?.total ?? "·"} titulares).
                      {ins.nextRiskRange &&
                        ` Em ~10 anos essa faixa migra para ${ins.nextRiskRange}, elevando o custo médio per capita.`}
                      {" "}Titulares acima de 45 anos:{" "}
                      <strong>{ins.over45Count} ({ins.pct45plus}%)</strong>
                      {+ins.pct45plus > 30
                        ? " · ⚠️ portfólio com risco alto de sinistralidade."
                        : "."}
                      {ins.mfRatio &&
                        ` Razão masc./fem.: ${ins.mfRatio} (${ins.totalMale}H / ${ins.totalFemale}M).`}
                    </ChartInsight>
                  </ChartCard>

                  {/* ── 2. Custo por CC ── */}
                  <ChartCard $span={2}>
                    <ChartTitle>2. Custo por Centro de Custo / Top 15</ChartTitle>
                    <ResponsiveContainer width="100%" height={Math.min(Math.max((analytics.costByCC?.length ?? 0) * 32 + 40, 200), 520)}>
                      <BarChart layout="vertical" data={(analytics.costByCC ?? []).slice(0,15)} margin={{ left:10, right:60, top:4, bottom:4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" horizontal={false}/>
                        <XAxis type="number" tickFormatter={fmtShort} tick={{ fill:"rgba(255,255,255,.4)", fontSize:10 }}/>
                        <YAxis type="category" dataKey="name" width={160} tick={{ fill:"rgba(255,255,255,.55)", fontSize:10 }} tickLine={false}/>
                        <Tooltip content={<DarkTip />} formatter={v => fmtBRL(v)} labelFormatter={l => l}/>
                        <Bar dataKey="total" name="Total (R$)" radius={[0,6,6,0]}>
                          {(analytics.costByCC ?? []).slice(0,15).map((_,i) => <Cell key={i} fill={C[i % C.length]}/>)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <ChartInsight>
                      {ins.topCC ? (
                        <>
                          💡 <strong>{ins.topCC.name}</strong> lidera com{" "}
                          {fmtBRL(ins.topCC.total)}
                          {ins.topCCPct && ` (${ins.topCCPct}% do total apurado por CC)`}.
                          {" "}CC com maior custo médio/vida:{" "}
                          <strong>{ins.mostExpensive?.name}</strong> ={" "}
                          {fmtBRL(ins.mostExpensive?.avgPerLife)}.
                          {" "}Custo médio global:{" "}
                          <strong>{fmtBRL(ins.avgCostPerLife)}/vida</strong>.
                        </>
                      ) : (
                        "💡 Nenhum Centro de Custo com dados disponíveis."
                      )}
                    </ChartInsight>
                  </ChartCard>

                  {/* chart 3 removido: Composição por CC mostrava 100% Titular
                      em todos os CCs (correto · só titulares têm CC associado).
                      A informação de composição global já está nos cards de % acima. */}

                  {/* ── 3. Razão de Dependentes por CC ── */}
                  {(analytics.depRatioByCC ?? []).length > 0 && (
                    <ChartCard $span={2}>
                      <ChartTitle>3. Razão de Dependentes por Centro de Custo / Top 15</ChartTitle>
                      <div style={{ fontSize:".72rem", color:"rgba(255,255,255,.35)", marginBottom:8 }}>
                        Dependentes (cônjuges + filhos) por titular. Linha pontilhada = média da empresa ({analytics.avgDependents ?? "·"}).
                      </div>
                      <ResponsiveContainer width="100%" height={Math.min(Math.max((analytics.depRatioByCC?.length ?? 0) * 36 + 40, 200), 560)}>
                        <BarChart
                          layout="vertical"
                          data={analytics.depRatioByCC ?? []}
                          margin={{ left: 10, right: 70, top: 4, bottom: 4 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" horizontal={false}/>
                          <XAxis
                            type="number"
                            tickFormatter={v => v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                            tick={{ fill:"rgba(255,255,255,.4)", fontSize:10 }}
                            domain={[0, "dataMax + 0.3"]}
                          />
                          <YAxis
                            type="category"
                            dataKey="cc"
                            width={165}
                            tick={{ fill:"rgba(255,255,255,.55)", fontSize:10 }}
                            tickLine={false}
                            tickFormatter={v => v.length > 22 ? v.slice(0, 22) + "…" : v}
                          />
                          <Tooltip content={<DarkTip />}/>
                          <ReferenceLine
                            x={analytics.avgDependents ?? 0}
                            stroke="#facc15"
                            strokeDasharray="5 3"
                            strokeWidth={1.5}
                            label={{ value:`Média ${analytics.avgDependents ?? ""}`, position:"insideTopRight", fill:"#facc15", fontSize:10, fontWeight:700 }}
                          />
                          <Bar dataKey="ratio" name="Dep./Titular" radius={[0, 6, 6, 0]}>
                            {(analytics.depRatioByCC ?? []).map((entry, i) => (
                              <Cell
                                key={i}
                                fill={entry.ratio > (analytics.avgDependents ?? 0) * 1.3 ? "#f97316" : entry.ratio > (analytics.avgDependents ?? 0) ? "#facc15" : "#00d4b4"}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <ChartInsight>
                        {ins.topDepCC ? (
                          <>
                            💡 <strong>{ins.topDepCC.cc}</strong> tem a maior carga familiar:{" "}
                            <strong>{ins.topDepCC.ratio}</strong> dependentes por titular
                            ({ins.topDepCC.dependentes} dep. / {ins.topDepCC.titulares} tit.).
                            {" "}Média da empresa: <strong>{ins.avgDep}</strong>.
                            {ins.ccAcimaMedia > 0 && (
                              <> {ins.ccAcimaMedia} CC{ins.ccAcimaMedia > 1 ? "s" : ""} com razão{" "}
                              ≥ 30% acima da média · potencial de <strong>{ins.totalDepExtra} dependentes extras</strong> vs. a estrutura média.
                              {" "}Ação recomendada: auditoria de elegibilidade (filhos acima de 21 anos, ex-cônjuges, duplicidades).</>
                            )}
                          </>
                        ) : "💡 Nenhum dado de dependente por CC disponível."}
                      </ChartInsight>
                    </ChartCard>
                  )}

                  {/* ── 4. Movimentação por CC ── */}
                  {(analytics.movByCC ?? []).length > 0 && (
                    <ChartCard $span={2}>
                      <ChartTitle>4. Movimentação por Centro de Custo / Inclusões vs Cancelamentos</ChartTitle>
                      <div style={{ fontSize:".72rem", color:"rgba(255,255,255,.35)", marginBottom:8 }}>
                        Apenas movimentos IM/IR (inclusão) e CM/CR (cancelamento) do período. Barras lado a lado por CC.
                      </div>
                      <ResponsiveContainer width="100%" height={Math.min(Math.max((analytics.movByCC?.length ?? 0) * 40 + 40, 200), 580)}>
                        <BarChart
                          layout="vertical"
                          data={analytics.movByCC ?? []}
                          margin={{ left: 10, right: 50, top: 4, bottom: 4 }}
                          barCategoryGap="28%"
                          barGap={3}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" horizontal={false}/>
                          <XAxis
                            type="number"
                            allowDecimals={false}
                            tick={{ fill:"rgba(255,255,255,.4)", fontSize:10 }}
                          />
                          <YAxis
                            type="category"
                            dataKey="cc"
                            width={165}
                            tick={{ fill:"rgba(255,255,255,.55)", fontSize:10 }}
                            tickLine={false}
                            tickFormatter={v => v.length > 22 ? v.slice(0, 22) + "…" : v}
                          />
                          <Tooltip content={<DarkTip />}/>
                          <Legend wrapperStyle={{ fontSize:".75rem", color:"rgba(255,255,255,.5)" }}/>
                          <Bar dataKey="inclusoes"     name="Inclusões (IM/IR)"      fill="#00d4b4" radius={[0, 5, 5, 0]}/>
                          <Bar dataKey="cancelamentos" name="Cancelamentos (CM/CR)"  fill="#f97316" radius={[0, 5, 5, 0]}/>
                        </BarChart>
                      </ResponsiveContainer>
                      <ChartInsight>
                        {ins.topMovCC ? (
                          <>
                            💡 No período, {ins.totalInc} inclusão{ins.totalInc !== 1 ? "ões" : ""} e{" "}
                            {ins.totalCan} cancelamento{ins.totalCan !== 1 ? "s" : ""} distribuídos por CC.
                            {" "}Saldo líquido:{" "}
                            <strong style={{ color: ins.netSaldo >= 0 ? "#00d4b4" : "#f97316" }}>
                              {ins.netSaldo >= 0 ? "+" : ""}{ins.netSaldo} vida{Math.abs(ins.netSaldo) !== 1 ? "s" : ""}
                            </strong>.
                            {" "}<strong>{ins.topMovCC.cc}</strong> concentra mais movimentação total ({ins.topMovCC.total} mov.).
                            {ins.highRotCC && ins.highRotCC.cancelamentos > 0 && (
                              <> <strong>{ins.highRotCC.cc}</strong> lidera em cancelamentos ({ins.highRotCC.cancelamentos}) · alta rotatividade nessa área impacta custos retroativos (acerto de cancelamento).</>
                            )}
                          </>
                        ) : "💡 Nenhuma movimentação (IM/IR/CM/CR) detectada no período."}
                      </ChartInsight>
                    </ChartCard>
                  )}

                </ChartGrid>
              </>
            )}

            {/* ════════════════════════════════════════════════════
                ABA EVOLUÇÃO / COMPARATIVO HISTÓRICO
            ════════════════════════════════════════════════════ */}
            {tab === "evolucao" && canEvo && (
              <>
                <SectionLabel>📈 Evolução do {snap?.product === "saude" ? "Plano de Saúde" : "Plano Dental"} · {snap?.company_name || "empresa"}</SectionLabel>

                {evo.series.length < 2 ? (
                  <EmptyDash>
                    <FiActivity size={52} style={{ color:"rgba(4,173,224,.3)" }}/>
                    <h3>Apenas 1 período salvo</h3>
                    <p>
                      A evolução compara este faturamento com os meses anteriores da
                      <strong> mesma empresa e produto</strong>. Salve ao menos mais um mês
                      no Bate-conferência para liberar os gráficos comparativos.
                    </p>
                  </EmptyDash>
                ) : (
                  <>
                    {/* KPIs de variação vs. mês anterior */}
                    <DeltaGrid>
                      <DeltaCard>
                        <DeltaLabel>Vidas no período</DeltaLabel>
                        <DeltaValue>{evo.deltas.vidas.value.toLocaleString("pt-BR")}</DeltaValue>
                        {evo.deltas.vidas.abs !== null && (
                          <DeltaPill $up={evo.deltas.vidas.abs > 0} $down={evo.deltas.vidas.abs < 0}>
                            {evo.deltas.vidas.abs > 0 ? <FiArrowUpRight/> : evo.deltas.vidas.abs < 0 ? <FiArrowDownRight/> : null}
                            {evo.deltas.vidas.abs > 0 ? "+" : ""}{evo.deltas.vidas.abs.toLocaleString("pt-BR")}
                            {evo.deltas.vidas.pct !== null && ` (${evo.deltas.vidas.pct > 0 ? "+" : ""}${evo.deltas.vidas.pct.toFixed(1)}%)`}
                          </DeltaPill>
                        )}
                      </DeltaCard>

                      <DeltaCard>
                        <DeltaLabel>Faturamento</DeltaLabel>
                        <DeltaValue style={{ fontSize:"1.2rem" }}>{fmtBRL(evo.deltas.valor.value)}</DeltaValue>
                        {evo.deltas.valor.abs !== null && (
                          <DeltaPill $up={evo.deltas.valor.abs < 0} $down={evo.deltas.valor.abs > 0}>
                            {evo.deltas.valor.abs > 0 ? <FiArrowUpRight/> : evo.deltas.valor.abs < 0 ? <FiArrowDownRight/> : null}
                            {evo.deltas.valor.abs > 0 ? "+" : ""}{fmtShort(Math.abs(evo.deltas.valor.abs)).replace("R$","R$ ")}
                            {evo.deltas.valor.pct !== null && ` (${evo.deltas.valor.pct > 0 ? "+" : ""}${evo.deltas.valor.pct.toFixed(1)}%)`}
                          </DeltaPill>
                        )}
                      </DeltaCard>

                      <DeltaCard>
                        <DeltaLabel>Ticket médio / vida</DeltaLabel>
                        <DeltaValue style={{ fontSize:"1.2rem" }}>{fmtBRL(evo.deltas.ticket.value)}</DeltaValue>
                        {evo.deltas.ticket.abs !== null && (
                          <DeltaPill $up={evo.deltas.ticket.abs < 0} $down={evo.deltas.ticket.abs > 0}>
                            {evo.deltas.ticket.abs > 0 ? <FiArrowUpRight/> : evo.deltas.ticket.abs < 0 ? <FiArrowDownRight/> : null}
                            {evo.deltas.ticket.abs > 0 ? "+" : ""}{fmtBRL(Math.abs(evo.deltas.ticket.abs))}
                            {evo.deltas.ticket.pct !== null && ` (${evo.deltas.ticket.pct > 0 ? "+" : ""}${evo.deltas.ticket.pct.toFixed(1)}%)`}
                          </DeltaPill>
                        )}
                      </DeltaCard>

                      <DeltaCard>
                        <DeltaLabel>Períodos analisados</DeltaLabel>
                        <DeltaValue>{evo.deltas.months}</DeltaValue>
                        <DeltaPill>
                          <FiCalendar size={11}/>
                          {evo.series[0].label} → {evo.series[evo.series.length-1].label}
                        </DeltaPill>
                      </DeltaCard>
                    </DeltaGrid>

                    <ChartGrid $cols={2}>
                      {/* Faturamento ao longo do tempo */}
                      <ChartCard $span={2}>
                        <ChartTitle><FiDollarSign size={14}/> Faturamento por Mês</ChartTitle>
                        <ResponsiveContainer width="100%" height={250}>
                          <AreaChart data={evo.series} margin={{ left:10, right:20, top:8, bottom:8 }}>
                            <defs>
                              <linearGradient id="evoValorGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%"   stopColor="#04ade0" stopOpacity={0.45}/>
                                <stop offset="100%" stopColor="#04ade0" stopOpacity={0.02}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)"/>
                            <XAxis dataKey="label" tick={{ fill:"rgba(255,255,255,.45)", fontSize:11 }}/>
                            <YAxis tickFormatter={fmtShort} tick={{ fill:"rgba(255,255,255,.4)", fontSize:10 }} width={70}/>
                            <Tooltip content={<DarkTip />} formatter={v => fmtBRL(v)}/>
                            <Area type="monotone" dataKey="valor" name="Faturamento R$" stroke="#04ade0" strokeWidth={2.5} fill="url(#evoValorGrad)" dot={{ r:3, fill:"#04ade0" }} activeDot={{ r:5 }}/>
                          </AreaChart>
                        </ResponsiveContainer>
                        <ChartInsight>
                          💡 De <strong>{evo.series[0].full}</strong> a <strong>{evo.series[evo.series.length-1].full}</strong>,
                          o faturamento {evo.series[evo.series.length-1].valor >= evo.series[0].valor ? "subiu" : "caiu"} de{" "}
                          <strong>{fmtBRL(evo.series[0].valor)}</strong> para <strong>{fmtBRL(evo.series[evo.series.length-1].valor)}</strong>
                          {(() => {
                            const a = evo.series[0].valor, b = evo.series[evo.series.length-1].valor;
                            const p = a > 0 ? ((b-a)/a)*100 : 0;
                            return ` (${p > 0 ? "+" : ""}${p.toFixed(1)}% no acumulado do histórico).`;
                          })()}
                        </ChartInsight>
                      </ChartCard>

                      {/* Vidas + Ticket médio */}
                      <ChartCard $span={2}>
                        <ChartTitle><FiUsers size={14}/> Vidas e Ticket Médio por Vida</ChartTitle>
                        <ResponsiveContainer width="100%" height={250}>
                          <ComposedChart data={evo.series} margin={{ left:10, right:20, top:8, bottom:8 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)"/>
                            <XAxis dataKey="label" tick={{ fill:"rgba(255,255,255,.45)", fontSize:11 }}/>
                            <YAxis yAxisId="left"  tick={{ fill:"rgba(255,255,255,.4)", fontSize:10 }} width={45}/>
                            <YAxis yAxisId="right" orientation="right" tickFormatter={fmtShort} tick={{ fill:"rgba(255,255,255,.35)", fontSize:10 }} width={60}/>
                            <Tooltip content={<DarkTip />}/>
                            <Legend wrapperStyle={{ fontSize:".75rem", color:"rgba(255,255,255,.5)" }}/>
                            <Bar  yAxisId="left"  dataKey="vidas"  name="Vidas"            fill="#7c5cbf" radius={[4,4,0,0]} opacity={.85} barSize={32}/>
                            <Line yAxisId="right" dataKey="ticket" name="Ticket médio R$" stroke="#34d399" strokeWidth={2.5} dot={{ r:3, fill:"#34d399" }} type="monotone"/>
                          </ComposedChart>
                        </ResponsiveContainer>
                        <ChartInsight>
                          💡 O ticket médio por vida {evo.deltas.ticket.abs === null ? "é" : evo.deltas.ticket.abs > 0 ? "subiu para" : evo.deltas.ticket.abs < 0 ? "caiu para" : "manteve-se em"}{" "}
                          <strong>{fmtBRL(evo.deltas.ticket.value)}</strong>.
                          {" "}Aumento de ticket sem aumento proporcional de vidas costuma indicar reajuste, mudança de faixa etária ou de plano.
                        </ChartInsight>
                      </ChartCard>
                    </ChartGrid>

                    {/* Tabela detalhada mês a mês */}
                    <ChartCard $span={2} style={{ marginTop:4 }}>
                      <ChartTitle><FiClock size={14}/> Histórico Mês a Mês</ChartTitle>
                      <HistWrap>
                        <HistTable>
                          <thead>
                            <tr>
                              <th>Período</th>
                              <th>Vidas</th>
                              <th>Δ Vidas</th>
                              <th>Faturamento</th>
                              <th>Δ Faturamento</th>
                              <th>Ticket médio</th>
                            </tr>
                          </thead>
                          <tbody>
                            {evo.series.map((row, i) => {
                              const prev = i > 0 ? evo.series[i-1] : null;
                              const dV   = prev ? row.vidas - prev.vidas : null;
                              const dVal = prev ? row.valor - prev.valor : null;
                              const dPct = prev && prev.valor > 0 ? ((row.valor - prev.valor)/prev.valor)*100 : null;
                              return (
                                <tr key={row.id} className={row.isCurrent ? "current" : ""}>
                                  <td>{row.full}</td>
                                  <td>{row.vidas.toLocaleString("pt-BR")}</td>
                                  <td style={{ color: dV === null ? "rgba(255,255,255,.3)" : dV > 0 ? "#34d399" : dV < 0 ? "#fb7185" : "rgba(255,255,255,.5)" }}>
                                    {dV === null ? "·" : `${dV > 0 ? "+" : ""}${dV.toLocaleString("pt-BR")}`}
                                  </td>
                                  <td>{fmtBRL(row.valor)}</td>
                                  <td style={{ color: dVal === null ? "rgba(255,255,255,.3)" : dVal > 0 ? "#fb7185" : dVal < 0 ? "#34d399" : "rgba(255,255,255,.5)" }}>
                                    {dVal === null ? "·" : `${dVal > 0 ? "+" : ""}${fmtBRL(dVal)}${dPct !== null ? ` (${dPct > 0 ? "+" : ""}${dPct.toFixed(1)}%)` : ""}`}
                                  </td>
                                  <td>{fmtBRL(row.ticket)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </HistTable>
                      </HistWrap>
                    </ChartCard>
                  </>
                )}
              </>
            )}

            {/* ════════════════════════════════════════════════════
                ABA DIVERGÊNCIAS / AUDITORIA AUTOMÁTICA
            ════════════════════════════════════════════════════ */}
            {tab === "divergencias" && canDiv && (
              <>
                <SectionLabel $alert>🔎 Auditoria automática da fatura · {snap ? `${MONTHS_FULL[snap.month]}/${snap.year}` : ""}</SectionLabel>

                {divLoading ? (
                  <LoadingState><FiLoader size={32} className="spin"/><span>Cruzando vidas com o mês anterior...</span></LoadingState>
                ) : !divergences || divergences.error ? (
                  <EmptyDash>
                    <FiAlertTriangle size={52} style={{ color:"rgba(250,204,21,.4)" }}/>
                    <h3>Auditoria indisponível</h3>
                    <p>
                      Não foi possível calcular as divergências deste faturamento agora.
                      Verifique se o backend está atualizado e tente recarregar.
                    </p>
                    <BackBtn onClick={() => fetchDivergences(selected.id)} style={{ marginTop:16 }}>
                      <FiRefreshCw size={13}/> Tentar novamente
                    </BackBtn>
                  </EmptyDash>
                ) : (
                  <>
                    <DivSummary>
                      <DivStat $tone="good">
                        <DivStatValue $tone="good">{divergences.summary?.added ?? 0}</DivStatValue>
                        <DivStatLabel>Inclusões (vidas novas)</DivStatLabel>
                      </DivStat>
                      <DivStat>
                        <DivStatValue>{divergences.summary?.removed ?? 0}</DivStatValue>
                        <DivStatLabel>Exclusões (vidas que saíram)</DivStatLabel>
                      </DivStat>
                      <DivStat $tone="warn">
                        <DivStatValue $tone="warn">{divergences.summary?.value_changed ?? 0}</DivStatValue>
                        <DivStatLabel>Mudança de valor</DivStatLabel>
                      </DivStat>
                      <DivStat $tone={(divergences.summary?.duplicates ?? 0) > 0 ? "crit" : "good"}>
                        <DivStatValue $tone={(divergences.summary?.duplicates ?? 0) > 0 ? "crit" : "good"}>
                          {divergences.summary?.duplicates ?? 0}
                        </DivStatValue>
                        <DivStatLabel>Duplicidades na fatura</DivStatLabel>
                      </DivStat>
                    </DivSummary>

                    {!divergences.has_previous && (
                      <ChartInsight style={{ marginBottom:18 }}>
                        ℹ️ Este é o <strong>primeiro período salvo</strong> para esta empresa/produto ·
                        não há mês anterior para comparar inclusões, exclusões e variações de valor.
                        Apenas a checagem de <strong>duplicidades dentro do próprio mês</strong> foi aplicada.
                      </ChartInsight>
                    )}

                    {divergences.has_previous && (
                      <ChartInsight style={{ marginBottom:18 }}>
                        💡 Comparando <strong>{divergences.current_label}</strong> com{" "}
                        <strong>{divergences.previous_label}</strong>:{" "}
                        variação total de faturamento de{" "}
                        <strong style={{ color: (divergences.summary?.value_delta ?? 0) > 0 ? "#fb7185" : "#34d399" }}>
                          {(divergences.summary?.value_delta ?? 0) > 0 ? "+" : ""}{fmtBRL(divergences.summary?.value_delta ?? 0)}
                        </strong>.
                        {" "}Revise especialmente <strong>duplicidades</strong> e <strong>vidas excluídas que continuam cobradas</strong>.
                      </ChartInsight>
                    )}

                    {(() => {
                      const GROUPS = [
                        { key:"duplicates",    tone:"crit", title:"Cobranças duplicadas na fatura",     icon:<FiAlertTriangle/>, note:"Linha idêntica repetida (mesmo certificado + mesmo lançamento + mesmo valor). Indica cobrança em duplicidade · confira na fatura." },
                        { key:"removed",       tone:"warn", title:"Exclusões (saíram vs. mês anterior)", icon:<FiArrowDownRight/>, note:"Vidas presentes no mês anterior e ausentes agora." },
                        { key:"added",         tone:"good", title:"Inclusões (novas vs. mês anterior)",  icon:<FiArrowUpRight/>, note:"Vidas que não existiam no mês anterior." },
                        { key:"value_changed", tone:"warn", title:"Mudança de valor (mesma vida)",       icon:<FiDollarSign/>, note:"Mesmo certificado com valor diferente do mês anterior." },
                      ];
                      const total = divergences.summary?.total_issues ?? 0;
                      if (total === 0) {
                        return (
                          <EmptyDash>
                            <FiCheckCircle size={52} style={{ color:"#34d399" }}/>
                            <h3>Nenhuma divergência encontrada</h3>
                            <p>A fatura está consistente com o mês anterior e sem duplicidades. ✅</p>
                          </EmptyDash>
                        );
                      }
                      return GROUPS.map(g => {
                        const items = divergences.groups?.[g.key] ?? [];
                        if (items.length === 0) return null;
                        const open = openDivGroups[g.key] ?? (g.key === "duplicates");
                        return (
                          <DivGroup key={g.key} $tone={g.tone}>
                            <DivGroupHead
                              $open={open}
                              onClick={() => setOpenDivGroups(s => ({ ...s, [g.key]: !open }))}
                            >
                              {g.icon}
                              <h4>{g.title}</h4>
                              <span className="count">{items.length}</span>
                              {open ? <FiChevronDown size={16}/> : <FiChevronRight size={16}/>}
                            </DivGroupHead>
                            {open && (
                              <div>
                                <div style={{ fontSize:".74rem", color:"rgba(255,255,255,.35)", marginBottom:8 }}>{g.note}</div>
                                {items.slice(0, 200).map((it, i) => (
                                  <DivItem key={i}>
                                    <span className="name">
                                      {it.nome || it.certif_full || "·"}
                                      {g.key === "duplicates" && it.descricao && (
                                        <small style={{ display:"block", color:"rgba(255,255,255,.45)", fontWeight:400, marginTop:3 }}>
                                          {it.descricao}
                                        </small>
                                      )}
                                    </span>
                                    {g.key !== "duplicates" && (
                                      <span className="meta">
                                        {it.certif_full ? `cert. ${it.certif_full}` : ""}
                                        {it.cpf ? ` · CPF ${it.cpf}` : ""}
                                      </span>
                                    )}
                                    <span className="val">
                                      {g.key === "value_changed"
                                        ? `${fmtBRL(it.valor_anterior)} → ${fmtBRL(it.valor_atual)} (${(it.delta ?? 0) > 0 ? "+" : ""}${fmtBRL(it.delta ?? 0)})`
                                        : g.key === "duplicates"
                                          ? `+${fmtBRL(it.valor_duplicado ?? 0)}`
                                          : fmtBRL(it.valor ?? 0)}
                                    </span>
                                  </DivItem>
                                ))}
                                {items.length > 200 && (
                                  <div style={{ fontSize:".74rem", color:"rgba(255,255,255,.35)", marginTop:8 }}>
                                    … e mais {items.length - 200} itens (exporte o detalhamento completo no Bate-conferência).
                                  </div>
                                )}
                              </div>
                            )}
                          </DivGroup>
                        );
                      });
                    })()}
                  </>
                )}
              </>
            )}

            {/* ════════════════════════════════════════════════════
                ABA ESTUDOS ESTATÍSTICOS EXTRAS
            ════════════════════════════════════════════════════ */}
            {tab === "estudos" && (
              <>
                <SectionLabel $accent>📑 Estudos estatísticos · {snap ? `${MONTHS_FULL[snap.month]}/${snap.year}` : ""}</SectionLabel>

                {statsLoading ? (
                  <LoadingState><FiLoader size={32} className="spin"/><span>Calculando estudos...</span></LoadingState>
                ) : !stats || stats.error ? (
                  <EmptyDash>
                    <FiFileText size={52} style={{ color:"rgba(124,92,191,.4)" }}/>
                    <h3>Estudos indisponíveis</h3>
                    <p>Não foi possível calcular os estudos deste faturamento agora.</p>
                  </EmptyDash>
                ) : (
                  <>
                    <KpiGrid>
                      <KpiCard>
                        <KpiIcon $bg="rgba(4,173,224,.12)" $color="#04ade0"><FiUsers size={20}/></KpiIcon>
                        <div>
                          <KpiLabel>Linhas processadas</KpiLabel>
                          <KpiValue>{(stats.total_lives ?? 0).toLocaleString("pt-BR")}</KpiValue>
                          <KpiSub>vidas/movimentos no mês</KpiSub>
                        </div>
                      </KpiCard>
                      <KpiCard>
                        <KpiIcon $bg="rgba(52,211,153,.12)" $color="#34d399"><FiDollarSign size={20}/></KpiIcon>
                        <div>
                          <KpiLabel>Valor total</KpiLabel>
                          <KpiValue style={{ fontSize:"1.1rem" }}>{fmtBRL(stats.total_value)}</KpiValue>
                          <KpiSub>somatório do faturamento</KpiSub>
                        </div>
                      </KpiCard>
                      <KpiCard>
                        <KpiIcon $bg="rgba(249,115,22,.12)" $color="#f97316"><FiTrendingUp size={20}/></KpiIcon>
                        <div>
                          <KpiLabel>Concentração (top 10)</KpiLabel>
                          <KpiValue>{stats.concentration_top10}%</KpiValue>
                          <KpiSub>do custo nos 10 maiores</KpiSub>
                        </div>
                      </KpiCard>
                      <KpiCard>
                        <KpiIcon $bg="rgba(124,92,191,.12)" $color="#a78bfa"><FiFileText size={20}/></KpiIcon>
                        <div>
                          <KpiLabel>Maior usuário</KpiLabel>
                          <KpiValue style={{ fontSize:"1rem" }}>{stats.top_lives?.[0] ? fmtBRL(stats.top_lives[0].valor) : "·"}</KpiValue>
                          <KpiSub>{stats.top_lives?.[0]?.nome ? stats.top_lives[0].nome.split(" ")[0] : "·"}</KpiSub>
                        </div>
                      </KpiCard>
                    </KpiGrid>

                    <ChartCard $span={2} style={{ marginBottom:18 }}>
                      <ChartTitle><FiUsers size={14}/> Maiores Usuários por Custo · Top {stats.top_lives?.length ?? 0}</ChartTitle>
                      <HistWrap>
                        <HistTable>
                          <thead>
                            <tr><th>Beneficiário</th><th>Sub</th><th>Plano</th><th>Centro de Custo</th><th>Valor</th><th>% Total</th></tr>
                          </thead>
                          <tbody>
                            {(stats.top_lives ?? []).map((l, i) => (
                              <tr key={i}>
                                <td>{l.nome || l.certif_full}</td>
                                <td>{l.sub || "·"}</td>
                                <td>{l.plano || "·"}</td>
                                <td>{l.centro_custo || "·"}</td>
                                <td>{fmtBRL(l.valor)}</td>
                                <td>{l.pct}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </HistTable>
                      </HistWrap>
                      <ChartInsight>
                        💡 Os 10 maiores usuários concentram <strong>{stats.concentration_top10}%</strong> do custo do mês.
                        Concentração alta indica poucos eventos de grande impacto · bons candidatos a auditoria individual.
                      </ChartInsight>
                    </ChartCard>

                    <ChartGrid $cols={2}>
                      <ChartCard>
                        <ChartTitle><FiBarChart2 size={14}/> Distribuição por Tipo de Movimento</ChartTitle>
                        <ResponsiveContainer width="100%" height={Math.min(Math.max((stats.by_lancamento?.length ?? 0) * 34 + 30, 160), 360)}>
                          <BarChart layout="vertical" data={(stats.by_lancamento ?? []).slice(0,10)} margin={{ left:10, right:30, top:4, bottom:4 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" horizontal={false}/>
                            <XAxis type="number" allowDecimals={false} tick={{ fill:"rgba(255,255,255,.4)", fontSize:10 }}/>
                            <YAxis type="category" dataKey="key" width={60} tick={{ fill:"rgba(255,255,255,.55)", fontSize:11 }}/>
                            <Tooltip content={<DarkTip />}/>
                            <Bar dataKey="count" name="Qtde" radius={[0,5,5,0]}>
                              {(stats.by_lancamento ?? []).slice(0,10).map((_,i) => <Cell key={i} fill={C[i % C.length]}/>)}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartCard>

                      <ChartCard>
                        <ChartTitle><FiUsers size={14}/> Composição por Parentesco</ChartTitle>
                        <HistWrap>
                          <HistTable>
                            <thead><tr><th>Parentesco</th><th>Qtde</th><th>Valor</th></tr></thead>
                            <tbody>
                              {(stats.by_parentesco ?? []).map((g, i) => (
                                <tr key={i}>
                                  <td>{g.key}</td>
                                  <td>{g.count.toLocaleString("pt-BR")}</td>
                                  <td>{fmtBRL(g.valor)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </HistTable>
                        </HistWrap>
                      </ChartCard>
                    </ChartGrid>
                  </>
                )}
              </>
            )}

            {/* ════════════════════════════════════════════════════
                ABA PREDITIVA
            ════════════════════════════════════════════════════ */}
            {tab === "preditivo" && (
              <>
                <SectionLabel>🔮 Projeções e Riscos Futuros</SectionLabel>

                <ChartGrid $cols={2}>
                  {/* ── 4. Curva de crescimento ── */}
                  <ChartCard $span={2}>
                    <ChartTitle>3. Curva de Crescimento de Vidas / Histórico de Adesão</ChartTitle>
                    {(analytics.growthByYear ?? []).length < 2 ? (
                      <p style={{ color:"rgba(255,255,255,.3)", fontSize:".82rem", padding:"24px 0" }}>
                        Dados insuficientes para o gráfico de crescimento.
                      </p>
                    ) : (
                      <ResponsiveContainer width="100%" height={230}>
                        <ComposedChart data={analytics.growthByYear} margin={{ left:10, right:20, top:8, bottom:8 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)"/>
                          <XAxis dataKey="year" tick={{ fill:"rgba(255,255,255,.4)", fontSize:11 }}/>
                          <YAxis yAxisId="left"  tick={{ fill:"rgba(255,255,255,.4)",  fontSize:11 }}/>
                          <YAxis yAxisId="right" orientation="right" tick={{ fill:"rgba(255,255,255,.35)", fontSize:10 }}/>
                          <Tooltip content={<DarkTip />}/>
                          <Legend wrapperStyle={{ fontSize:".75rem", color:"rgba(255,255,255,.5)" }}/>
                          <Bar  yAxisId="left"  dataKey="count"     name="Novos titulares" fill="#04ade0" radius={[4,4,0,0]} opacity={.8}/>
                          <Line yAxisId="right" dataKey="cumulative" name="Acumulado"       stroke="#00d4b4" strokeWidth={2.5} dot={{ r:3, fill:"#00d4b4" }} type="monotone"/>
                        </ComposedChart>
                      </ResponsiveContainer>
                    )}
                    <ChartInsight>
                      {ins.peakGrow ? (
                        <>
                          💡 Pico de adesões em{" "}
                          <strong>{ins.peakGrow.year}</strong>{" "}
                          ({ins.peakGrow.count} novos titulares).
                          {" "}Ritmo recente (últimos 3 anos):{" "}
                          <strong>~{ins.recentAvg} titulares/ano</strong>{" "}
                          · crescimento{" "}
                          <strong>{ins.growthTrend}</strong>
                          {ins.growthTrend === "acelerado"
                            ? " (acima da média histórica de " + ins.overallAvg + "/ano)"
                            : ins.growthTrend === "desacelerando"
                              ? " (abaixo da média histórica de " + ins.overallAvg + "/ano)"
                              : " (em linha com a média histórica de " + ins.overallAvg + "/ano)"}.
                          {" "}Base construída em{" "}
                          <strong>{ins.totalYears} anos</strong>{" "}
                          ({ins.oldestYear}–{ins.newestYear}).
                        </>
                      ) : (
                        "💡 Dados insuficientes para análise de tendência."
                      )}
                    </ChartInsight>
                  </ChartCard>

                  {/* ── 5. Risco de envelhecimento ── */}
                  <ChartCard $span={2}>
                    <ChartTitle>4. Risco de Custo Futuro / Envelhecimento da Carteira</ChartTitle>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px,1fr))", gap:12, marginBottom:18 }}>
                      {[
                        { label:"45–54 anos hoje (alto risco)",           value:analytics.agingRisk?.current45to54     ?? 0, color:"#f97316" },
                        { label:"35–44 hoje → 45–54 em +10 anos",         value:analytics.agingRisk?.willBe45to54in10y ?? 0, color:"#fb923c" },
                        { label:"55+ anos hoje (muito alto risco)",        value:analytics.agingRisk?.current55plus     ?? 0, color:"#ef4444" },
                        { label:"Idade média dos titulares",               value:`${analytics.agingRisk?.avgAge ?? "·"} anos`, color:"#04ade0", noFmt:true },
                      ].map((item, i) => (
                        <div key={i} style={{
                          display:"flex", justifyContent:"space-between", alignItems:"center",
                          padding:"14px 18px", background:"rgba(255,255,255,.04)",
                          borderRadius:12, border:`1px solid ${item.color}33`,
                        }}>
                          <span style={{ fontSize:".8rem", color:"rgba(255,255,255,.5)", maxWidth:200 }}>{item.label}</span>
                          <span style={{ fontWeight:800, color:item.color, fontSize:"1.15rem", marginLeft:16, flexShrink:0 }}>
                            {item.noFmt ? item.value : item.value.toLocaleString("pt-BR")}
                          </span>
                        </div>
                      ))}
                    </div>
                    <ChartInsight>
                      💡 Portfólio classificado como carteira{" "}
                      <strong>{ins.ageCategory}</strong>{" "}
                      (idade média: {ins.avgAge} anos)  risco{" "}
                      <strong style={{ color: ins.riskLevel === "muito alto" ? "#ef4444" : ins.riskLevel === "alto" ? "#f97316" : ins.riskLevel === "moderado" ? "#facc15" : "#34d399" }}>
                        {ins.riskLevel}
                      </strong>.
                      {" "}{ins.pctAtRisk}% dos titulares já estão na faixa 45+ hoje.
                      {" "}<strong>{ins.futureRisk}</strong> titulares (35–44 hoje) migrarão para 45–54 nos próximos 10 anos
                      {ins.projPct !== 0
                        ? ` variação projetada de ${ins.projPct > 0 ? "+" : ""}${ins.projPct}% no contingente de alto risco.`
                        : "."}
                      {" "}Estudos da ANS apontam aumento médio de{" "}
                      <strong>2–3× no custo per capita</strong>{" "}
                      na transição para a faixa 45–54.
                    </ChartInsight>
                  </ChartCard>
                </ChartGrid>
              </>
            )}
          </>
        )}
      </Content>
    </PageWrapper>
  );
};
