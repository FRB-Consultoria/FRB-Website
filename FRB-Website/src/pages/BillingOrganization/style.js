// src/pages/BillingOrganization/style.js
import styled from "styled-components";

export const PageWrapper = styled.div`
  min-height: 100vh;
  background: #05162b;
  color: #fff;
  font-family: "Inter", "Segoe UI", sans-serif;
  display: flex;
  flex-direction: column;
`;

export const Topbar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 32px;
  background: rgba(255,255,255,0.04);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  flex-shrink: 0;
  gap: 12px;
  @media (max-width: 600px) { padding: 13px 16px; gap: 10px; }
`;

export const TopbarLogo = styled.img`
  height: 36px;
  @media (max-width: 600px) { height: 28px; }
`;

export const TopbarTitle = styled.h1`
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255,255,255,0.9);
  margin: 0;
  @media (max-width: 600px) { font-size: .85rem; }
`;

export const BackBtn = styled.button`
  background: none;
  border: 1px solid rgba(255,255,255,0.18);
  color: rgba(255,255,255,0.7);
  border-radius: 8px;
  padding: 7px 16px;
  font-size: 0.82rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  &:hover { background: rgba(255,255,255,0.08); color: #fff; }
`;

export const Content = styled.main`
  flex: 1;
  padding: 32px;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  @media (max-width: 768px) { padding: 22px 16px; }
  @media (max-width: 480px) { padding: 16px 12px; }
`;

export const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #04ade0;
  margin: 0 0 18px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

/* ── Upload ── */
export const UploadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 28px;
  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; }
`;

export const UploadCard = styled.div`
  background: ${({ $dragOver }) => $dragOver ? "rgba(0,212,180,0.07)" : "rgba(255,255,255,0.04)"};
  border: 2px ${({ $dragOver }) => $dragOver ? "solid" : "dashed"} ${({ $hasFile, $dragOver }) =>
    $dragOver ? "#00d4b4" : $hasFile ? "#04ade0" : "rgba(255,255,255,0.15)"};
  border-radius: 16px;
  padding: 22px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  position: relative;
  transition: border-color 0.18s, background 0.18s, transform 0.18s;
  transform: ${({ $dragOver }) => $dragOver ? "scale(1.025)" : "scale(1)"};
  &:hover { border-color: #04ade0; background: rgba(4,173,224,0.05); }
`;

/** Overlay que aparece quando um arquivo é arrastado sobre o card */
export const DropOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,212,180,0.10);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  pointer-events: none;
  z-index: 10;

  .drop-icon { color: #00d4b4; }
  .drop-label {
    font-size: 0.88rem;
    font-weight: 800;
    color: #00d4b4;
    text-align: center;
  }
  .drop-sub {
    font-size: 0.72rem;
    color: rgba(0,212,180,0.65);
    text-align: center;
    max-width: 160px;
  }
`;

export const UploadIcon = styled.div`
  font-size: 2rem;
  color: ${({ $hasFile }) => $hasFile ? "#04ade0" : "rgba(255,255,255,0.3)"};
`;

export const UploadLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  text-align: center;
`;

export const UploadSub = styled.span`
  font-size: 0.74rem;
  color: rgba(255,255,255,0.4);
  text-align: center;
  line-height: 1.5;
`;

export const UploadFileName = styled.span`
  font-size: 0.78rem;
  color: #04ade0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const HiddenInput = styled.input`display: none;`;

/* ── Ações ── */
export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
  flex-wrap: wrap;
`;

export const ProcessBtn = styled.button`
  background: linear-gradient(135deg, #04ade0, #0288d1);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 11px 28px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
  transition: opacity 0.2s;
  &:disabled { opacity: 0.45; cursor: not-allowed; }
  &:hover:not(:disabled) { opacity: 0.88; }
`;

export const ExportBtn = styled.button`
  background: rgba(255,255,255,0.06);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 10px;
  padding: 11px 22px;
  font-size: 0.86rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
  transition: background 0.2s;
  &:disabled { opacity: 0.45; cursor: not-allowed; }
  &:hover:not(:disabled) { background: rgba(255,255,255,0.12); }
`;

export const StatusText = styled.span`
  font-size: 0.8rem;
  color: rgba(255,255,255,0.5);
`;

/* ── Tabs ── */
export const Tabs = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: 14px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  flex-wrap: wrap;
`;

export const Tab = styled.button`
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active }) => $active ? "#04ade0" : "transparent"};
  color: ${({ $active }) => $active ? "#04ade0" : "rgba(255,255,255,0.5)"};
  padding: 8px 18px;
  font-size: 0.84rem;
  font-weight: ${({ $active }) => $active ? "700" : "400"};
  cursor: pointer;
  margin-bottom: -1px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
  white-space: nowrap;
  &:hover { color: #fff; }
`;

/* ── Tabela ── */
export const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.09);
  max-height: 70vh;
  overflow-y: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.77rem;
  white-space: nowrap;
`;

export const Thead = styled.thead`
  background: rgba(4,173,224,0.15);
  position: sticky;
  top: 0;
  z-index: 2;
`;

export const Th = styled.th`
  padding: 10px 10px;
  color: #04ade0;
  font-weight: 700;
  font-size: 0.73rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  text-align: left;
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  background: ${({ $even, $titular }) =>
    $titular
      ? "rgba(4,173,224,0.06)"
      : $even ? "rgba(255,255,255,0.025)" : "transparent"};
  font-weight: ${({ $titular }) => $titular ? 700 : 400};
  transition: background 0.12s;
  &:hover { background: rgba(4,173,224,0.10); }
`;

export const Td = styled.td`
  padding: 7px 10px;
  color: ${({ $titular }) => $titular ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.72)"};
  border-bottom: 1px solid rgba(255,255,255,0.04);

  &.money {
    /* crédito (valor negativo) = laranja; débito normal = verde */
    color: ${({ $credit }) => $credit ? "#f97316" : "#4cde9a"};
    font-weight: 600;
    text-align: right;
  }
  &.right {
    text-align: right;
    color: rgba(255,255,255,0.7);
  }
`;

/**
 * Badge colorido para o campo MOV (tipoLancamento)
 * Cores por grupo de movimento:
 *   CM/CR  → cancelamento → laranja
 *   TR/TM  → transferência → ciano
 *   RM/RR  → reativação → verde
 *   AM/AR  → alteração → amarelo
 *   IR/IM  → inclusão retroativa → roxo
 *   ""     → cobrança normal → cinza suave
 */
export const MovTag = styled.span`
  display: inline-block;
  padding: 1px 7px;
  border-radius: 5px;
  font-size: 0.69rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  background: ${({ $t }) => {
    if (!$t) return "transparent";
    if ($t === "CM" || $t === "CR") return "rgba(249,115,22,.14)";
    if ($t === "TR" || $t === "TM") return "rgba(4,173,224,.14)";
    if ($t === "RM" || $t === "RR") return "rgba(52,211,153,.14)";
    if ($t === "AM" || $t === "AR") return "rgba(250,204,21,.14)";
    if ($t === "IR" || $t === "IM") return "rgba(124,92,191,.14)";
    return "transparent";
  }};
  color: ${({ $t }) => {
    if (!$t) return "rgba(255,255,255,0.35)";
    if ($t === "CM" || $t === "CR") return "#f97316";
    if ($t === "TR" || $t === "TM") return "#04ade0";
    if ($t === "RM" || $t === "RR") return "#34d399";
    if ($t === "AM" || $t === "AR") return "#facc15";
    if ($t === "IR" || $t === "IM") return "#a78bfa";
    return "rgba(255,255,255,0.35)";
  }};
`;

/* Linha de cabeçalho de sub (ciano) */
export const SubHeaderRow = styled.tr`
  background: rgba(4,173,224,0.18);
  td {
    padding: 8px 10px;
    font-size: 0.78rem;
    font-weight: 700;
    color: #04ade0;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
`;

/* Linha de subtotal por sub */
export const SubtotalRow = styled.tr`
  background: rgba(10,58,106,0.7);
  td {
    padding: 7px 10px;
    font-size: 0.78rem;
    font-weight: 700;
    color: #04ade0;
    &.money {
      color: #4cde9a;
      font-weight: 700;
      text-align: right;
    }
  }
`;

/* Linha de total geral */
export const TotalRow = styled.tr`
  background: rgba(4,173,224,0.22);
  position: sticky;
  bottom: 0;
  td {
    padding: 10px 10px;
    font-size: 0.82rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    &.money {
      color: #4cde9a;
      text-align: right;
      font-size: 0.9rem;
    }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 64px 0;
  color: rgba(255,255,255,0.3);
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  line-height: 1.6;
  svg { font-size: 2.5rem; opacity: 0.3; }
`;

/* ── Painel de configuração de agrupamento de subfaturas ── */
export const GroupPanel = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 12px;
  margin-bottom: 22px;
  overflow: hidden;
`;

export const GroupPanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  cursor: pointer;
  user-select: none;
  font-size: 0.83rem;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
  gap: 10px;
  transition: background 0.15s;
  &:hover { background: rgba(255,255,255,0.04); }

  span { display: flex; align-items: center; gap: 7px; }
  svg  { flex-shrink: 0; }
`;

export const GroupBadge = styled.span`
  background: rgba(4,173,224,0.15);
  color: #04ade0;
  border-radius: 20px;
  padding: 2px 9px;
  font-size: 0.72rem;
  font-weight: 700;
`;

export const GroupPanelBody = styled.div`
  padding: 0 18px 18px;
  border-top: 1px solid rgba(255,255,255,0.07);
`;

export const GroupHint = styled.p`
  font-size: 0.75rem;
  color: rgba(255,255,255,0.35);
  margin: 12px 0 14px;
  line-height: 1.5;
`;

export const GroupGrid = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 130px;
  gap: 4px 8px;
  max-height: 260px;
  overflow-y: auto;
  padding-right: 4px;
  margin-bottom: 14px;

  /* cabeçalho */
  & > span {
    font-size: 0.68rem;
    font-weight: 700;
    color: #04ade0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0 6px 6px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
`;

export const GroupRow = styled.div`
  display: contents;

  & > * {
    padding: 5px 6px;
    display: flex;
    align-items: center;
    background: ${({ $excluded }) =>
      $excluded ? "rgba(255,60,60,0.05)" : "transparent"};
    border-radius: 4px;
    font-size: 0.78rem;
  }
`;

export const GroupRowSub = styled.div`
  font-weight: 700;
  color: rgba(255,255,255,0.85);
  font-family: monospace;
`;

export const GroupRowName = styled.div`
  color: rgba(255,255,255,0.45);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.75rem;
`;

export const GroupRowInput = styled.input`
  width: 100%;
  background: ${({ $excluded }) => $excluded
    ? "rgba(255,60,60,0.12)"
    : ({ $remapped }) => $remapped
      ? "rgba(4,173,224,0.1)"
      : "rgba(255,255,255,0.06)"};
  border: 1px solid ${({ $excluded }) => $excluded
    ? "rgba(255,80,80,0.3)"
    : ({ $remapped }) => $remapped
      ? "rgba(4,173,224,0.3)"
      : "rgba(255,255,255,0.1)"};
  border-radius: 6px;
  color: ${({ $excluded }) => $excluded ? "#ff6060" : "#fff"};
  font-size: 0.78rem;
  font-family: monospace;
  padding: 4px 8px;
  outline: none;
  transition: border-color 0.15s;
  &:focus { border-color: #04ade0; }
  &::placeholder { color: rgba(255,255,255,0.2); font-family: inherit; }
`;

export const GroupActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding-top: 4px;
`;

export const GroupSaveBtn = styled.button`
  background: rgba(4,173,224,0.15);
  border: 1px solid rgba(4,173,224,0.3);
  color: #04ade0;
  border-radius: 8px;
  padding: 7px 16px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
  &:hover { background: rgba(4,173,224,0.25); }
`;

export const GroupResetBtn = styled.button`
  background: none;
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.4);
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { color: rgba(255,255,255,0.7); border-color: rgba(255,255,255,0.2); }
`;

/* ── Seção de validação PDF vs Calculado ── */
export const ValidationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 24px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 14px 18px;
`;

export const ValidationTitle = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
`;

export const ValidationGrid = styled.div`
  display: grid;
  grid-template-columns: 70px 1fr 140px 140px 110px;
  gap: 4px 10px;
  font-size: 0.78rem;

  /* cabeçalho */
  & > span {
    font-size: 0.68rem;
    font-weight: 700;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding-bottom: 6px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
`;

export const ValidationRow = styled.div`
  display: contents;

  & > * {
    display: flex;
    align-items: center;
    padding: 5px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.75);
  }

  /* Status OK */
  & > *:last-child {
    color: ${({ $ok }) => $ok ? '#4cde9a' : '#ff6b6b'};
    font-weight: 700;
    font-size: 0.8rem;
  }

  /* Valores monetários */
  & > *:nth-child(3),
  & > *:nth-child(4) {
    font-family: monospace;
    font-size: 0.78rem;
    color: ${({ $ok }) => $ok ? 'rgba(255,255,255,0.7)' : '#ff9a9a'};
  }
`;

/* ── Banner de uso exclusivo / aviso de auditoria ── */
export const DisclaimerBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(13, 39, 68, 0.6);
  border: 1px solid rgba(4, 173, 224, 0.2);
  border-radius: 10px;
  padding: 13px 20px;
  margin-bottom: 28px;
`;

export const DisclaimerIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: rgba(4, 173, 224, 0.12);
  border: 1px solid rgba(4, 173, 224, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #04ade0;
  font-size: 1rem;
`;

export const DisclaimerText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  span:first-child {
    font-size: 0.78rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.85);
    letter-spacing: 0.01em;
  }

  span:last-child {
    font-size: 0.74rem;
    color: rgba(255, 255, 255, 0.4);
  }

  em {
    font-style: normal;
    color: rgba(255, 200, 60, 0.85);
    font-weight: 500;
  }
`;

/* ────────────────────────────────────────────────────────────
   BATE-CONFERÊNCIA — FILTRO POR CAMPO
   ──────────────────────────────────────────────────────────── */
export const ConflictFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
`;

export const ConflictChip = styled.button`
  background: ${({ $active }) => $active ? "rgba(4,173,224,.22)" : "rgba(255,255,255,.05)"};
  border: 1px solid ${({ $active }) => $active ? "rgba(4,173,224,.55)" : "rgba(255,255,255,.12)"};
  color: ${({ $active }) => $active ? "#04ade0" : "rgba(255,255,255,.55)"};
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 0.72rem;
  font-weight: ${({ $active }) => $active ? "700" : "400"};
  cursor: pointer;
  transition: all .15s;
  white-space: nowrap;
  &:hover { border-color: rgba(4,173,224,.4); color: #fff; }
`;

/* ────────────────────────────────────────────────────────────
   COBERTURA
   ──────────────────────────────────────────────────────────── */
export const CoverageWrapper = styled.div`
  margin-top: 28px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

export const CoverageBlock = styled.div`
  background: ${({ $variant }) =>
    $variant === "dental"
      ? "rgba(4,173,224,.04)"
      : "rgba(250,204,21,.04)"};
  border: 1px solid ${({ $variant }) =>
    $variant === "dental"
      ? "rgba(4,173,224,.2)"
      : "rgba(250,204,21,.2)"};
  border-radius: 10px;
  padding: 12px 14px;
  overflow: hidden;
`;

export const CoverageBlockTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ $variant }) => $variant === "dental" ? "#04ade0" : "#facc15"};
  text-transform: uppercase;
  letter-spacing: .05em;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;

  span.badge {
    background: ${({ $variant }) =>
      $variant === "dental"
        ? "rgba(4,173,224,.18)"
        : "rgba(250,204,21,.18)"};
    color: ${({ $variant }) => $variant === "dental" ? "#04ade0" : "#facc15"};
    border-radius: 20px;
    padding: 1px 8px;
    font-size: .7rem;
  }
`;

export const CoverageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 220px;
  overflow-y: auto;
  font-size: .74rem;
`;

export const CoverageItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: baseline;
  padding: 4px 6px;
  border-radius: 5px;
  background: ${({ $even }) => $even ? "rgba(255,255,255,.03)" : "transparent"};

  .cert {
    font-family: monospace;
    font-size: .71rem;
    color: rgba(255,255,255,.5);
    flex-shrink: 0;
  }
  .nome {
    color: rgba(255,255,255,.8);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }
  .sub {
    font-size: .68rem;
    color: rgba(255,255,255,.3);
    flex-shrink: 0;
  }
`;

/* ────────────────────────────────────────────────────────────
   GRAU INDEFINIDO
   ──────────────────────────────────────────────────────────── */
export const GrauSection = styled.div`
  margin-top: 20px;
  background: rgba(250,204,21,.04);
  border: 1px solid rgba(250,204,21,.2);
  border-radius: 10px;
  padding: 12px 14px;
`;

export const GrauTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #facc15;
  text-transform: uppercase;
  letter-spacing: .05em;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const GrauGrid = styled.div`
  display: grid;
  grid-template-columns: 95px 1fr 90px 90px;
  gap: 3px 8px;
  font-size: .74rem;
  max-height: 180px;
  overflow-y: auto;

  & > span {
    font-size: .67rem;
    font-weight: 700;
    color: rgba(255,255,255,.25);
    text-transform: uppercase;
    letter-spacing: .04em;
    padding-bottom: 5px;
    border-bottom: 1px solid rgba(255,255,255,.06);
  }
`;

export const GrauRow = styled.div`
  display: contents;
  & > * {
    display: flex;
    align-items: center;
    padding: 4px 3px;
    border-bottom: 1px solid rgba(255,255,255,.03);
    color: rgba(255,255,255,.65);
    font-size: .73rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

/* ────────────────────────────────────────────────────────────
   VALIDAÇÃO DE SEXO
   ──────────────────────────────────────────────────────────── */
export const SexoConflictSection = styled.div`
  margin-top: 28px;
  margin-bottom: 8px;
  background: rgba(249, 115, 22, 0.04);
  border: 1px solid rgba(249, 115, 22, 0.25);
  border-radius: 12px;
  padding: 14px 18px 18px;
  overflow: hidden;
`;

export const SexoConflictTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fb923c;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 4px;
`;

export const SexoConflictSubtitle = styled.div`
  font-size: 0.72rem;
  color: rgba(255,255,255,0.35);
  margin-bottom: 12px;
`;

export const SexoConflictGrid = styled.div`
  display: grid;
  /* Sub | Certif. | Nome | Parent. | Sexo Usado | Base CC | Fat. Técnica | Pos. Cadastral */
  grid-template-columns: 50px 95px 1fr 65px 85px 85px 95px 95px;
  gap: 3px 8px;
  font-size: 0.76rem;
  overflow-x: auto;
  min-width: 0;

  /* linha de cabeçalho */
  & > span {
    font-size: 0.67rem;
    font-weight: 700;
    color: rgba(255,255,255,0.28);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding-bottom: 6px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    white-space: nowrap;
  }
`;

export const SexoConflictRow = styled.div`
  display: contents;

  & > * {
    display: flex;
    align-items: center;
    padding: 5px 4px;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    color: rgba(255,255,255,0.7);
    font-size: 0.75rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

/** Badge ciano — exibe o sexo que será efetivamente usado */
export const SexoBadge = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 4px;
  border-bottom: 1px solid rgba(255,255,255,0.03);

  & > span {
    background: rgba(4, 173, 224, 0.18);
    border: 1px solid rgba(4, 173, 224, 0.4);
    color: #04ade0;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
    letter-spacing: 0.03em;
  }
`;

/**
 * Célula de fonte de sexo.
 * $conflict={true}  → valor diverge do usado  → laranja/vermelho
 * $absent={true}    → fonte não tem o dado ("—") → cinza
 * else              → fonte concorda            → verde suave
 */
export const SexoSourceCell = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 4px;
  border-bottom: 1px solid rgba(255,255,255,0.03);

  & > span {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
    letter-spacing: 0.03em;

    ${({ $absent, $conflict }) =>
      $absent
        ? `
          color: rgba(255,255,255,0.2);
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
        `
        : $conflict
        ? `
          background: rgba(249,115,22,0.18);
          border: 1px solid rgba(249,115,22,0.45);
          color: #fb923c;
        `
        : `
          background: rgba(74,222,128,0.12);
          border: 1px solid rgba(74,222,128,0.3);
          color: #4ade80;
        `
    }
  }
`;
