// src/pages/BillingDashboard/style.js
import styled, { keyframes } from "styled-components";

const spin   = keyframes`to { transform: rotate(360deg); }`;
const fadeUp = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}`;

/* ── Barra de exportação ── */
export const ExportBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  background: linear-gradient(135deg, rgba(4,173,224,.06) 0%, rgba(0,212,180,.04) 100%);
  border: 1px solid rgba(4,173,224,.15);
  border-radius: 14px;
  padding: 14px 20px;
  margin-bottom: 22px;
  flex-wrap: wrap;
  animation: ${fadeUp} .3s ease both;
`;
export const ExportBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  flex: 1;
`;
export const ExportBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;
export const PeriodTag = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: .78rem;
  font-weight: 700;
  background: ${p => p.$company ? "rgba(124,92,191,.12)" : "rgba(4,173,224,.12)"};
  color: ${p => p.$company ? "#a78bfa" : "#04ade0"};
  border: 1px solid ${p => p.$company ? "rgba(124,92,191,.2)" : "rgba(4,173,224,.2)"};
`;

/* ── Tabs ── */
export const DashTabs = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 28px;
  flex-wrap: wrap;
`;
export const DashTab = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: 10px;
  font-size: .85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all .15s;
  border: 1px solid ${p => p.$active ? "transparent" : "rgba(255,255,255,.1)"};
  background: ${p => p.$active ? "linear-gradient(135deg,#04ade0,#0270a0)" : "rgba(255,255,255,.04)"};
  color: ${p => p.$active ? "#fff" : "rgba(255,255,255,.45)"};
  &:hover { background: ${p => p.$active ? "" : "rgba(255,255,255,.08)"}; color: #fff; }
  svg { opacity: .8; }
`;

/* ── Section labels ── */
export const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: .78rem;
  font-weight: 800;
  letter-spacing: .07em;
  text-transform: uppercase;
  margin-bottom: 16px;
  color: ${p => p.$alert ? "#ffaa00" : p.$accent ? "#a78bfa" : "rgba(255,255,255,.45)"};
  border-left: 3px solid ${p => p.$alert ? "#ffaa00" : p.$accent ? "#7c5cbf" : "#04ade0"};
  padding-left: 10px;
`;

/* ── KPIs ── */
export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; }
`;
export const KpiCard = styled.div`
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  animation: ${fadeUp} .3s ease both;
  transition: border-color .2s;
  &:hover { border-color: rgba(4,173,224,.2); }
`;
export const KpiIcon = styled.div`
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  background: ${p => p.$bg ?? "rgba(4,173,224,.12)"};
  color: ${p => p.$color ?? "#04ade0"};
`;
export const KpiLabel = styled.div`
  font-size: .7rem; color: rgba(255,255,255,.45);
  text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px;
`;
export const KpiValue = styled.div`
  font-size: 1.25rem; font-weight: 800; color: #fff; line-height: 1;
`;
export const KpiSub = styled.div`
  font-size: .72rem; color: rgba(255,255,255,.3); margin-top: 4px;
`;

/* ── Chart grid ── */
export const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${p => p.$cols ?? 2}, 1fr);
  gap: 18px;
  margin-bottom: 20px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;
export const ChartCard = styled.div`
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 16px;
  padding: 20px 20px 14px;
  animation: ${fadeUp} .35s ease both;
  grid-column: ${p => p.$span ? `span ${p.$span}` : "span 1"};
  ${p => p.$full && "grid-column: 1 / -1;"}
`;
export const ChartTitle = styled.h3`
  font-size: .88rem; font-weight: 700;
  color: rgba(255,255,255,.8);
  display: flex; align-items: center; gap: 7px;
  margin: 0 0 18px;
  svg { color: #04ade0; }
`;
export const ChartInsight = styled.div`
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: 9px;
  background: rgba(4,173,224,.05);
  border-left: 3px solid rgba(4,173,224,.3);
  font-size: .78rem;
  color: rgba(255,255,255,.45);
  line-height: 1.6;
  strong { color: rgba(255,255,255,.7); }
`;

/* ── Alert card (desligados) ── */
export const AlertCard = styled.div`
  background: rgba(255,60,60,.06);
  border: 1px solid rgba(255,60,60,.25);
  border-radius: 16px;
  padding: 22px 24px;
  margin-bottom: 24px;
  animation: ${fadeUp} .35s ease both;
`;
export const AlertValue = styled.div`
  font-size: 1.35rem; font-weight: 900; color: #ff4444;
  margin-top: 4px;
`;
export const AlertLabel = styled.div`
  font-size: .68rem; font-weight: 700;
  color: rgba(255,255,255,.35);
  text-transform: uppercase; letter-spacing: .06em;
`;

/* ── Simulador ── */
export const SimCard = styled.div`
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(124,92,191,.2);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 28px;
  animation: ${fadeUp} .35s ease both;
`;
export const SimRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
`;
export const SimSlider = styled.input`
  width: 100%;
  accent-color: #04ade0;
  margin-bottom: 6px;
  cursor: pointer;
`;
export const SimResult = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: rgba(255,255,255,.05);
  border-radius: 12px;
  padding: 16px 20px;
  border: 1px solid rgba(255,255,255,.1);
  flex-wrap: wrap;
`;
export const SimDelta = styled.div`
  text-align: right;
  color: ${p => p.$positive ? "#34d399" : "#f97316"};
  background: ${p => p.$positive ? "rgba(52,211,153,.08)" : "rgba(249,115,22,.08)"};
  border: 1px solid ${p => p.$positive ? "rgba(52,211,153,.2)" : "rgba(249,115,22,.2)"};
  border-radius: 10px;
  padding: 10px 16px;
  min-width: 120px;
`;

/* ── Barra de seleção de empresa ── */
export const CompanyBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  background: linear-gradient(135deg, rgba(4,173,224,.06), rgba(124,92,191,.05));
  border: 1px solid rgba(4,173,224,.18);
  border-radius: 14px;
  padding: 14px 18px;
  margin-bottom: 18px;
`;
export const CompanyBarLabel = styled.div`
  display: flex; align-items: center; gap: 8px;
  font-size: .72rem; font-weight: 800; letter-spacing: .06em;
  text-transform: uppercase; color: rgba(255,255,255,.45);
  svg { color: #04ade0; }
`;
export const CompanySelect = styled.select`
  background: #0d1525;
  color: #fff;
  border: 1px solid rgba(4,173,224,.35);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: .9rem;
  font-weight: 700;
  cursor: pointer;
  min-width: 220px;
  transition: border-color .15s;
  &:hover  { border-color: #04ade0; }
  &:focus  { outline: none; border-color: #04ade0; box-shadow: 0 0 0 3px rgba(4,173,224,.15); }
  option { background: #0d1525; color: #fff; }
`;
export const CompanyTag = styled.div`
  display: flex; align-items: center; gap: 8px;
  background: rgba(124,92,191,.14);
  border: 1px solid rgba(124,92,191,.3);
  color: #c4b5fd;
  border-radius: 10px;
  padding: 9px 16px;
  font-size: .92rem; font-weight: 800;
  svg { color: #a78bfa; }
`;
export const CompanyCount = styled.span`
  font-size: .72rem; font-weight: 700;
  color: rgba(255,255,255,.4);
`;

/* ── Seletor de mês ── */
export const MonthSelector = styled.div`
  display: flex; flex-wrap: wrap; gap: 8px;
`;
export const MonthBtn = styled.button`
  display: flex; flex-direction: column; align-items: center;
  padding: 7px 14px; border-radius: 10px;
  background: ${p => p.$active ? "linear-gradient(135deg,#04ade0,#0270a0)" : "rgba(255,255,255,.05)"};
  border: 1px solid ${p => p.$active ? "transparent" : "rgba(255,255,255,.1)"};
  color: ${p => p.$active ? "#fff" : "rgba(255,255,255,.55)"};
  cursor: pointer; font-size: .82rem; font-weight: 700;
  transition: all .15s;
  span { font-size: .65rem; font-weight: 400; opacity: .7; margin-top: 2px; }
  &:hover { background: ${p => p.$active ? "" : "rgba(255,255,255,.08)"}; color: #fff; }
`;

/* ── Botão exportar / refresh ── */
export const ExportDashBtn = styled.button`
  display: flex; align-items: center; gap: 7px;
  padding: 9px 16px; border-radius: 9px;
  background: ${p => p.$excel
    ? "linear-gradient(135deg, #1d6f42, #217346)"
    : "linear-gradient(135deg, #04ade0, #0270a0)"};
  border: none; color: #fff; cursor: pointer;
  font-size: .82rem; font-weight: 700;
  transition: filter .15s;
  box-shadow: ${p => p.$excel ? "0 4px 16px rgba(29,111,66,.35)" : "none"};
  &:hover:not(:disabled) { filter: brightness(1.12); }
  &:disabled { opacity: .5; cursor: default; }
  svg.spin { animation: ${spin} .8s linear infinite; }
`;

/* ── Evolução / comparativo histórico ── */
export const DeltaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; }
`;
export const DeltaCard = styled.div`
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 16px;
  padding: 18px 20px;
  animation: ${fadeUp} .3s ease both;
`;
export const DeltaLabel = styled.div`
  font-size: .7rem; color: rgba(255,255,255,.45);
  text-transform: uppercase; letter-spacing: .06em; margin-bottom: 8px;
`;
export const DeltaValue = styled.div`
  font-size: 1.45rem; font-weight: 800; color: #fff; line-height: 1;
`;
export const DeltaPill = styled.span`
  display: inline-flex; align-items: center; gap: 4px;
  margin-top: 10px;
  padding: 3px 10px; border-radius: 999px;
  font-size: .74rem; font-weight: 800;
  color: ${p => p.$up ? "#34d399" : p.$down ? "#fb7185" : "rgba(255,255,255,.5)"};
  background: ${p => p.$up ? "rgba(52,211,153,.1)" : p.$down ? "rgba(251,113,133,.1)" : "rgba(255,255,255,.06)"};
  border: 1px solid ${p => p.$up ? "rgba(52,211,153,.25)" : p.$down ? "rgba(251,113,133,.25)" : "rgba(255,255,255,.12)"};
`;

/* ── Tabela de histórico ── */
export const HistWrap = styled.div`
  overflow-x: auto;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.08);
`;
export const HistTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: .82rem;
  min-width: 640px;
  th, td {
    padding: 11px 16px;
    text-align: right;
    white-space: nowrap;
  }
  th:first-child, td:first-child { text-align: left; }
  thead th {
    background: rgba(4,173,224,.08);
    color: rgba(255,255,255,.65);
    font-weight: 700;
    text-transform: uppercase;
    font-size: .68rem;
    letter-spacing: .05em;
    position: sticky; top: 0;
  }
  tbody tr {
    border-top: 1px solid rgba(255,255,255,.05);
    transition: background .15s;
  }
  tbody tr:hover { background: rgba(255,255,255,.03); }
  tbody td { color: rgba(255,255,255,.8); }
  tbody tr.current { background: rgba(4,173,224,.06); }
  tbody tr.current td:first-child { color: #04ade0; font-weight: 700; }
`;

/* ── Divergências de fatura ── */
export const DivSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 26px;
  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; }
`;
export const DivStat = styled.div`
  background: ${p =>
    p.$tone === "crit"  ? "rgba(239,68,68,.07)" :
    p.$tone === "warn"  ? "rgba(250,204,21,.06)" :
    p.$tone === "good"  ? "rgba(52,211,153,.06)" :
    "rgba(255,255,255,.04)"};
  border: 1px solid ${p =>
    p.$tone === "crit"  ? "rgba(239,68,68,.3)" :
    p.$tone === "warn"  ? "rgba(250,204,21,.28)" :
    p.$tone === "good"  ? "rgba(52,211,153,.28)" :
    "rgba(255,255,255,.1)"};
  border-radius: 14px;
  padding: 16px 18px;
  animation: ${fadeUp} .3s ease both;
`;
export const DivStatValue = styled.div`
  font-size: 1.6rem; font-weight: 900; line-height: 1;
  color: ${p =>
    p.$tone === "crit"  ? "#ef4444" :
    p.$tone === "warn"  ? "#facc15" :
    p.$tone === "good"  ? "#34d399" :
    "#fff"};
`;
export const DivStatLabel = styled.div`
  font-size: .7rem; color: rgba(255,255,255,.45);
  text-transform: uppercase; letter-spacing: .06em; margin-top: 8px;
`;
export const DivGroup = styled.div`
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.08);
  border-left: 3px solid ${p =>
    p.$tone === "crit" ? "#ef4444" :
    p.$tone === "warn" ? "#facc15" :
    p.$tone === "good" ? "#34d399" : "#04ade0"};
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 14px;
  animation: ${fadeUp} .3s ease both;
`;
export const DivGroupHead = styled.div`
  display: flex; align-items: center; gap: 10px;
  margin-bottom: ${p => p.$open ? "14px" : "0"};
  cursor: pointer;
  h4 { margin: 0; font-size: .9rem; font-weight: 700; color: rgba(255,255,255,.9); flex: 1; }
  .count {
    font-size: .75rem; font-weight: 800;
    padding: 2px 10px; border-radius: 999px;
    background: rgba(255,255,255,.08); color: rgba(255,255,255,.7);
  }
  svg { color: rgba(255,255,255,.4); }
`;
export const DivItem = styled.div`
  display: flex; align-items: center; gap: 12px;
  padding: 9px 0;
  border-top: 1px solid rgba(255,255,255,.05);
  font-size: .82rem;
  &:first-of-type { border-top: none; }
  .name { color: rgba(255,255,255,.85); font-weight: 600; flex: 1; }
  .meta { color: rgba(255,255,255,.4); font-size: .74rem; }
  .val  { font-weight: 700; color: rgba(255,255,255,.75); white-space: nowrap; }
`;

/* ── Alias legado ── */
export const ChartSection = ChartGrid;

/* ── Estados ── */
export const LoadingState = styled.div`
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 100px 20px; gap: 16px;
  color: rgba(255,255,255,.4); font-size: .88rem;
  svg.spin { animation: ${spin} .8s linear infinite; color: #04ade0; }
`;
export const EmptyDash = styled.div`
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 100px 20px; text-align: center;
  h3 { color: #fff; font-size: 1.1rem; font-weight: 700; margin: 18px 0 8px; }
  p { color: rgba(255,255,255,.4); font-size: .88rem; max-width: 380px; line-height: 1.6; }
`;
