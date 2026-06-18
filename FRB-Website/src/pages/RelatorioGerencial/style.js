// src/pages/RelatorioGerencial/style.js
// Documento gerencial em A4, claro e otimizado para impressão / salvar em PDF.
import styled, { createGlobalStyle, keyframes } from "styled-components";

const spin = keyframes`to { transform: rotate(360deg); }`;

/* Regras de impressão globais — esconde a barra e ajusta a página */
export const PrintStyle = createGlobalStyle`
  @media print {
    @page { size: A4; margin: 12mm; }
    .no-print { display: none !important; }
    body { background: #fff !important; }
    .doc { box-shadow: none !important; margin: 0 !important; width: 100% !important; }
    .avoid-break { break-inside: avoid; page-break-inside: avoid; }
  }
`;

export const Screen = styled.div`
  min-height: 100vh;
  background: #e9eef5;
  padding: 0 0 60px;
`;

/* Barra superior (não imprime) */
export const Toolbar = styled.div`
  position: sticky; top: 0; z-index: 10;
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px;
  background: #05162b;
  padding: 14px 24px;
  border-bottom: 1px solid rgba(255,255,255,.08);
`;
export const ToolbarTitle = styled.div`
  color: #fff; font-size: .95rem; font-weight: 700;
  display: flex; align-items: center; gap: 8px;
  svg { color: #04ade0; }
`;
export const ToolbarBtns = styled.div`display: flex; gap: 10px;`;
export const TBtn = styled.button`
  display: flex; align-items: center; gap: 7px;
  padding: 9px 16px; border-radius: 9px;
  font-size: .82rem; font-weight: 700; cursor: pointer;
  border: 1px solid ${p => p.$primary ? "transparent" : "rgba(255,255,255,.2)"};
  background: ${p => p.$primary ? "linear-gradient(135deg,#04ade0,#0270a0)" : "transparent"};
  color: #fff;
  transition: filter .15s, background .15s;
  &:hover { filter: brightness(1.1); background: ${p => p.$primary ? "" : "rgba(255,255,255,.1)"}; }
  svg.spin { animation: ${spin} .8s linear infinite; }
`;

/* Folha do documento */
export const Doc = styled.div.attrs({ className: "doc" })`
  background: #fff;
  color: #1a2433;
  width: 210mm;
  max-width: calc(100% - 32px);
  margin: 28px auto;
  padding: 26mm 20mm;
  box-shadow: 0 20px 60px rgba(0,0,0,.25);
  font-family: "Inter", "Segoe UI", sans-serif;
  font-size: 12px;
  line-height: 1.5;
  @media (max-width: 760px) { padding: 22px 18px; }
`;

export const DocHeader = styled.header`
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 18px;
  padding-bottom: 16px;
  border-bottom: 3px solid #04ade0;
  margin-bottom: 22px;
`;
export const Logo = styled.img`height: 46px;`;
export const HeadRight = styled.div`text-align: right;`;
export const DocKicker = styled.div`
  font-size: 10px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase;
  color: #04ade0;
`;
export const DocTitle = styled.h1`
  font-size: 19px; font-weight: 800; color: #0a1f38; margin: 2px 0 0;
`;
export const DocMeta = styled.div`
  font-size: 11px; color: #5a6b80; margin-top: 6px;
  div { margin-top: 2px; }
  strong { color: #0a1f38; }
`;

export const Section = styled.section.attrs({ className: "avoid-break" })`
  margin: 22px 0;
`;
export const SecTitle = styled.h2`
  font-size: 13px; font-weight: 800; color: #0a1f38;
  text-transform: uppercase; letter-spacing: .04em;
  display: flex; align-items: center; gap: 8px;
  margin: 0 0 12px;
  padding-left: 10px;
  border-left: 4px solid #04ade0;
`;

/* KPIs */
export const KpiRow = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
  @media (max-width: 600px) { grid-template-columns: repeat(2,1fr); }
`;
export const Kpi = styled.div`
  border: 1px solid #dce5ef; border-radius: 10px;
  padding: 12px 14px; background: #f7fafd;
`;
export const KpiLbl = styled.div`
  font-size: 9.5px; text-transform: uppercase; letter-spacing: .05em;
  color: #6b7c92; font-weight: 700;
`;
export const KpiVal = styled.div`
  font-size: 18px; font-weight: 800; color: #0a1f38; margin-top: 4px; line-height: 1.1;
`;
export const KpiSub = styled.div`font-size: 10px; color: #8a98ab; margin-top: 2px;`;

/* Tabela */
export const Table = styled.table`
  width: 100%; border-collapse: collapse; font-size: 11px;
  th, td { padding: 7px 10px; text-align: right; border-bottom: 1px solid #e6edf5; }
  th:first-child, td:first-child { text-align: left; }
  thead th {
    background: #0a1f38; color: #fff; font-weight: 700;
    font-size: 10px; text-transform: uppercase; letter-spacing: .03em;
  }
  tbody tr:nth-child(even) { background: #f7fafd; }
  tbody tr.current td { font-weight: 800; color: #0270a0; }
  tfoot td { font-weight: 800; border-top: 2px solid #0a1f38; }
`;

/* Cartões de composição / pílulas */
export const Pills = styled.div`display: flex; gap: 10px; flex-wrap: wrap;`;
export const Pill = styled.div`
  flex: 1 1 120px; min-width: 110px;
  border: 1px solid #dce5ef; border-radius: 10px; padding: 10px 14px; background: #f7fafd;
  .lbl { font-size: 9.5px; text-transform: uppercase; letter-spacing: .05em; color: #6b7c92; font-weight: 700; }
  .val { font-size: 17px; font-weight: 800; margin-top: 3px; color: ${p => p.$color ?? "#0a1f38"}; }
`;

/* Box de auditoria/divergência */
export const DivRow = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
  @media (max-width: 600px) { grid-template-columns: repeat(2,1fr); }
`;
export const DivBox = styled.div`
  border: 1px solid ${p =>
    p.$tone === "crit" ? "#f1b0b0" : p.$tone === "warn" ? "#f0dca0" : p.$tone === "good" ? "#aee0c4" : "#dce5ef"};
  background: ${p =>
    p.$tone === "crit" ? "#fdf2f2" : p.$tone === "warn" ? "#fdf9ec" : p.$tone === "good" ? "#f0faf4" : "#f7fafd"};
  border-radius: 10px; padding: 12px 14px; text-align: center;
  .v { font-size: 22px; font-weight: 900; color: ${p =>
    p.$tone === "crit" ? "#c0392b" : p.$tone === "warn" ? "#b7950b" : p.$tone === "good" ? "#1e8449" : "#0a1f38"}; }
  .l { font-size: 10px; color: #6b7c92; margin-top: 4px; font-weight: 600; }
`;

export const Insight = styled.p`
  margin: 12px 0 0; padding: 10px 14px;
  background: #eef7fc; border-left: 4px solid #04ade0; border-radius: 6px;
  font-size: 11px; color: #34495e; line-height: 1.55;
  strong { color: #0a1f38; }
`;

export const Foot = styled.footer`
  margin-top: 28px; padding-top: 14px; border-top: 1px solid #e6edf5;
  display: flex; justify-content: space-between; gap: 12px;
  font-size: 9.5px; color: #8a98ab;
`;

export const Loading = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 120px 20px; gap: 16px; color: #5a6b80; font-size: .9rem;
  svg.spin { animation: ${spin} .8s linear infinite; color: #04ade0; }
`;

export const Empty = styled.div`
  text-align: center; color: #8a98ab; font-size: 11px; padding: 14px 0;
`;
