// src/pages/BillingHistory/style.js
import styled, { keyframes } from "styled-components";

const spin = keyframes`to { transform: rotate(360deg); }`;

/* ── Filtros ── */
export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 28px;
  padding: 16px 20px;
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 14px;
`;
export const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,.4);
  font-size: .85rem;
`;
export const FilterSelect = styled.select`
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 8px;
  color: #fff;
  padding: 8px 12px;
  font-size: .85rem;
  cursor: pointer;
  option { background: #0d1525; }
  &:focus { outline: none; border-color: #04ade0; }
`;
export const FilterInput = styled.input`
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 8px;
  color: #fff;
  padding: 8px 12px;
  font-size: .85rem;
  min-width: 200px;
  &::placeholder { color: rgba(255,255,255,.25); }
  &:focus { outline: none; border-color: #04ade0; }
`;

/* ── Grid de cards ── */
export const SnapshotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
`;

export const SnapshotCard = styled.div`
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.09);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: border-color .2s, transform .15s;
  &:hover {
    border-color: rgba(4,173,224,.3);
    transform: translateY(-2px);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const CardMonth = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #04ade0, #0270a0);
  border-radius: 10px;
  padding: 8px 14px;
  min-width: 56px;
  flex-shrink: 0;
  .month {
    font-size: .95rem;
    font-weight: 800;
    color: #fff;
    line-height: 1;
  }
  .year {
    font-size: .7rem;
    color: rgba(255,255,255,.8);
    margin-top: 2px;
  }
`;

export const CardCompany = styled.div`
  font-size: .95rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
`;

export const CardStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,.04);
  border-radius: 10px;
  padding: 10px 12px;
  svg { color: #04ade0; flex-shrink: 0; }
`;

export const StatLabel = styled.div`
  font-size: .65rem;
  color: rgba(255,255,255,.4);
  text-transform: uppercase;
  letter-spacing: .05em;
  margin-bottom: 2px;
`;

export const StatValue = styled.div`
  font-size: .88rem;
  font-weight: 700;
  color: #fff;
`;

export const SubsChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const SubChip = styled.span`
  background: rgba(4,173,224,.1);
  border: 1px solid rgba(4,173,224,.2);
  border-radius: 20px;
  padding: 3px 10px;
  font-size: .7rem;
  color: #04ade0;
  font-weight: 600;
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,.07);
`;

export const ViewBtn = styled.button`
  display: flex; align-items: center; gap: 5px;
  padding: 6px 12px; border-radius: 7px;
  background: rgba(4,173,224,.12);
  border: 1px solid rgba(4,173,224,.25);
  color: #04ade0; font-size: .78rem; font-weight: 600;
  cursor: pointer;
  transition: background .15s;
  &:hover { background: rgba(4,173,224,.22); }
`;

export const DeleteBtn = styled.button`
  display: flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; border-radius: 7px;
  background: rgba(255,60,60,.08);
  border: 1px solid rgba(255,60,60,.2);
  color: #ff4444; cursor: pointer;
  transition: background .15s;
  &:hover:not(:disabled) { background: rgba(255,60,60,.2); }
  &:disabled { opacity: .4; cursor: default; }
  .spin { animation: ${spin} .7s linear infinite; }
`;

/* ── Estados ── */
export const EmptyHistory = styled.div`
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 80px 20px; text-align: center;
  h3 { color: #fff; font-size: 1.1rem; font-weight: 700; margin: 16px 0 8px; }
  p { color: rgba(255,255,255,.4); font-size: .88rem; max-width: 360px; line-height: 1.6; }
  strong { color: #04ade0; }
`;

export const EmptyIcon = styled.div`
  color: rgba(4,173,224,.3);
`;

export const LoadingState = styled.div`
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 80px 20px; gap: 16px;
  color: rgba(255,255,255,.4); font-size: .88rem;
  svg.spin { animation: ${spin} .8s linear infinite; color: #04ade0; }
`;

/**
 * Badge de produto no card do snapshot.
 * $product="dental" → ciano; $product="saude" → verde.
 */
export const ProductBadge = styled.span`
  display: inline-flex; align-items: center;
  padding: 2px 9px; border-radius: 20px;
  font-size: .68rem; font-weight: 700; letter-spacing: .03em;
  background: ${({ $product }) =>
    $product === "dental" ? "rgba(4,173,224,.15)" :
    $product === "saude"  ? "rgba(52,211,153,.15)" :
    "rgba(255,255,255,.07)"};
  border: 1px solid ${({ $product }) =>
    $product === "dental" ? "rgba(4,173,224,.35)" :
    $product === "saude"  ? "rgba(52,211,153,.35)" :
    "rgba(255,255,255,.12)"};
  color: ${({ $product }) =>
    $product === "dental" ? "#04ade0" :
    $product === "saude"  ? "#34d399" :
    "rgba(255,255,255,.4)"};
`;

/** Chip de filtro de produto */
export const ProductFilterChip = styled.button`
  padding: 5px 14px; border-radius: 20px; cursor: pointer;
  font-size: .75rem; font-weight: 600; transition: all .15s;
  background: ${({ $active, $product }) =>
    !$active ? "rgba(255,255,255,.05)" :
    $product === "dental" ? "rgba(4,173,224,.18)" :
    $product === "saude"  ? "rgba(52,211,153,.18)" :
    "rgba(255,255,255,.12)"};
  border: 1px solid ${({ $active, $product }) =>
    !$active ? "rgba(255,255,255,.1)" :
    $product === "dental" ? "rgba(4,173,224,.45)" :
    $product === "saude"  ? "rgba(52,211,153,.45)" :
    "rgba(255,255,255,.3)"};
  color: ${({ $active, $product }) =>
    !$active ? "rgba(255,255,255,.5)" :
    $product === "dental" ? "#04ade0" :
    $product === "saude"  ? "#34d399" :
    "#fff"};
  &:hover { opacity: .85; }
`;
