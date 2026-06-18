// src/pages/Notifications/style.js
import styled, { keyframes } from "styled-components";

const spin   = keyframes`to { transform: rotate(360deg); }`;
const fadeUp = keyframes`from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}`;

export const Bar = styled.div`
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  background: linear-gradient(135deg, rgba(4,173,224,.06), rgba(124,92,191,.05));
  border: 1px solid rgba(4,173,224,.18);
  border-radius: 14px; padding: 14px 18px; margin-bottom: 18px;
`;
export const BarLabel = styled.div`
  display: flex; align-items: center; gap: 8px;
  font-size: .72rem; font-weight: 800; letter-spacing: .06em;
  text-transform: uppercase; color: rgba(255,255,255,.45);
  svg { color: #04ade0; }
`;
export const Select = styled.select`
  background: #0d1525; color: #fff;
  border: 1px solid rgba(4,173,224,.35); border-radius: 10px;
  padding: 10px 14px; font-size: .9rem; font-weight: 700; cursor: pointer;
  min-width: 200px; transition: border-color .15s;
  &:hover { border-color: #04ade0; }
  &:focus { outline: none; border-color: #04ade0; box-shadow: 0 0 0 3px rgba(4,173,224,.15); }
  option { background: #0d1525; color: #fff; }
`;

export const Tabs = styled.div`
  display: flex; gap: 6px; margin-bottom: 22px; flex-wrap: wrap;
  /* No celular vira uma faixa rolável horizontalmente, sem quebrar/truncar. */
  @media (max-width: 560px) {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 0 -4px 18px;
    padding: 0 4px 6px;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }
`;
export const Tab = styled.button`
  display: flex; align-items: center; gap: 7px; white-space: nowrap; flex-shrink: 0;
  padding: 9px 18px; border-radius: 10px; font-size: .85rem; font-weight: 700; cursor: pointer;
  border: 1px solid ${p => p.$active ? "transparent" : "rgba(255,255,255,.1)"};
  background: ${p => p.$active ? "linear-gradient(135deg,#04ade0,#0270a0)" : "rgba(255,255,255,.04)"};
  color: ${p => p.$active ? "#fff" : "rgba(255,255,255,.5)"};
  transition: all .15s;
  &:hover { color: #fff; background: ${p => p.$active ? "" : "rgba(255,255,255,.08)"}; }
  @media (max-width: 560px) { padding: 9px 14px; font-size: .8rem; }
`;

export const Split = styled.div`
  display: grid; grid-template-columns: 1fr 1.1fr; gap: 18px;
  @media (max-width: 1000px) { grid-template-columns: 1fr; }
`;
export const Panel = styled.div`
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
  border-radius: 16px; padding: 18px 20px; animation: ${fadeUp} .3s ease both;
`;
export const PanelTitle = styled.h3`
  font-size: .9rem; font-weight: 700; color: rgba(255,255,255,.85);
  display: flex; align-items: center; gap: 8px; margin: 0 0 14px;
  svg { color: #04ade0; }
`;

export const CampaignList = styled.div`display: flex; flex-direction: column; gap: 8px; max-height: 520px; overflow-y: auto;`;
export const CampaignItem = styled.button`
  display: flex; align-items: center; gap: 12px; text-align: left;
  padding: 11px 14px; border-radius: 12px; cursor: pointer; width: 100%;
  background: ${p => p.$active ? "rgba(4,173,224,.1)" : "rgba(255,255,255,.03)"};
  border: 1px solid ${p => p.$active ? "rgba(4,173,224,.4)" : "rgba(255,255,255,.08)"};
  transition: all .15s;
  &:hover { border-color: rgba(4,173,224,.35); background: rgba(4,173,224,.07); }
`;
export const Dot = styled.span`
  width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0;
  background: ${p => p.$c || "#04ade0"}; border: 1px solid rgba(255,255,255,.25);
`;
export const CampaignName = styled.div`
  font-size: .86rem; font-weight: 700; color: #fff;
  span { display: block; font-size: .72rem; font-weight: 400; color: rgba(255,255,255,.45); margin-top: 2px; }
`;

export const PreviewFrame = styled.iframe`
  width: 100%; height: 520px; border: 1px solid rgba(255,255,255,.1);
  border-radius: 12px; background: #fff;
`;
export const EmptyPreview = styled.div`
  height: 520px; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; color: rgba(255,255,255,.35); font-size: .85rem; text-align: center;
  border: 1px dashed rgba(255,255,255,.12); border-radius: 12px;
  svg { color: rgba(4,173,224,.4); }
`;

export const Field = styled.div`margin-bottom: 12px;`;
export const Label = styled.label`
  display: block; font-size: .72rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .05em; color: rgba(255,255,255,.45); margin-bottom: 6px;
`;
export const Textarea = styled.textarea`
  width: 100%; min-height: 90px; resize: vertical;
  background: #0d1525; color: #fff; border: 1px solid rgba(255,255,255,.12);
  border-radius: 10px; padding: 10px 12px; font-size: .85rem; font-family: inherit;
  &:focus { outline: none; border-color: #04ade0; }
`;
export const Input = styled.input`
  background: #0d1525; color: #fff; border: 1px solid rgba(255,255,255,.12);
  border-radius: 10px; padding: 9px 12px; font-size: .85rem; width: 100%;
  &:focus { outline: none; border-color: #04ade0; }
`;

export const Recipients = styled.div`
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
  border-radius: 10px; padding: 10px 14px; margin: 4px 0 14px;
  font-size: .82rem; color: rgba(255,255,255,.6);
  strong { color: #34d399; }
  .none { color: #fbbf24; }
`;
export const Chip = styled.span`
  font-size: .72rem; padding: 3px 9px; border-radius: 999px;
  background: rgba(4,173,224,.12); color: #7fd6f0; border: 1px solid rgba(4,173,224,.2);
`;

export const Row = styled.div`display: flex; gap: 10px; flex-wrap: wrap; align-items: end;`;

export const Btn = styled.button`
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 11px 20px; border-radius: 10px; font-size: .85rem; font-weight: 700; cursor: pointer;
  border: 1px solid ${p => p.$ghost ? "rgba(255,255,255,.18)" : "transparent"};
  background: ${p => p.$ghost ? "transparent"
    : p.$accent === "purple" ? "linear-gradient(135deg,#7c5cbf,#5b3fa0)"
    : "linear-gradient(135deg,#04ade0,#0270a0)"};
  color: #fff; transition: filter .15s, background .15s;
  &:hover:not(:disabled) { filter: brightness(1.12); }
  &:disabled { opacity: .5; cursor: default; }
  svg.spin { animation: ${spin} .8s linear infinite; }
`;

export const Loading = styled.div`
  display: flex; align-items: center; justify-content: center; gap: 10px;
  height: 520px; color: rgba(255,255,255,.4); font-size: .85rem;
  svg.spin { animation: ${spin} .8s linear infinite; color: #04ade0; }
`;

/* ── Descrição da aba (ajuda o usuário a entender) ── */
export const TabHelp = styled.div`
  display: flex; align-items: flex-start; gap: 10px;
  background: rgba(4,173,224,.06);
  border: 1px solid rgba(4,173,224,.16);
  border-radius: 12px;
  padding: 12px 16px; margin-bottom: 18px;
  font-size: .84rem; color: rgba(255,255,255,.7); line-height: 1.55;
  strong { color: #fff; }
  svg { color: #04ade0; flex-shrink: 0; margin-top: 2px; }
`;

/* ── Planejador anual de campanhas ── */
export const PlanControls = styled.div`
  display: flex; align-items: flex-end; gap: 14px; flex-wrap: wrap;
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 12px; padding: 14px 16px; margin-bottom: 16px;
  @media (max-width: 560px) { justify-content: center; align-items: center; gap: 16px; }
`;
export const PlanRow = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr 1.4fr auto;
  align-items: center; gap: 12px;
  padding: 11px 14px; border-radius: 12px; margin-bottom: 8px;
  background: ${p => p.$on ? "rgba(4,173,224,.07)" : "rgba(255,255,255,.03)"};
  border: 1px solid ${p => p.$on ? "rgba(4,173,224,.22)" : "rgba(255,255,255,.07)"};
  opacity: ${p => p.$disabled ? .55 : 1};
  transition: all .15s;
  /* Celular: vira flex em 2 linhas — mês+ícones em cima, seletor cheio embaixo
     (evita o seletor espremido a 44px). */
  @media (max-width: 560px) {
    display: flex; flex-wrap: wrap; align-items: center; gap: 10px 12px;
    & > :nth-child(2) { flex: 1; }
    & > :nth-child(3) { flex: 1 1 100%; order: 5; }
    & > :nth-child(4) { order: 4; margin-left: auto; }
  }
`;
export const PlanMonth = styled.div`
  font-size: .88rem; font-weight: 800; color: #fff;
  small { display: block; font-size: .66rem; font-weight: 400; color: rgba(255,255,255,.4); margin-top: 2px; }
`;
export const MiniSelect = styled.select`
  width: 100%;
  background: #0d1525; color: #fff;
  border: 1px solid rgba(255,255,255,.12); border-radius: 9px;
  padding: 8px 10px; font-size: .82rem; cursor: pointer;
  &:focus { outline: none; border-color: #04ade0; }
  option { background: #0d1525; color: #fff; }
  &:disabled { opacity: .5; cursor: default; }
`;
export const IconBtn = styled.button`
  display: inline-flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: 9px; cursor: pointer;
  background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.12);
  color: rgba(255,255,255,.6); transition: all .15s;
  &:hover { color: #04ade0; border-color: rgba(4,173,224,.4); }
`;
export const AgendaItem = styled.div`
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px; border-radius: 10px; margin-bottom: 8px;
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
  border-left: 3px solid #a78bfa;
  .when { font-size: .8rem; font-weight: 800; color: #c4b5fd; min-width: 78px; }
  .what { flex: 1; font-size: .84rem; color: rgba(255,255,255,.85); }
  .what small { display:block; color: rgba(255,255,255,.4); font-size: .72rem; }
`;

/* ── Tabela de usuários (visão geral dos avisos) ── */
export const UTableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 12px;
`;
export const UTable = styled.table`
  width: 100%; border-collapse: collapse; font-size: .85rem; min-width: 640px;
  thead th {
    background: rgba(4,173,224,.08); color: rgba(255,255,255,.65);
    font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em;
    padding: 12px 16px; text-align: left;
  }
  thead th.center, tbody td.center { text-align: center; }
  tbody td { padding: 12px 16px; border-top: 1px solid rgba(255,255,255,.05); color: rgba(255,255,255,.85); }
  tbody tr:hover { background: rgba(255,255,255,.03); }
  .uname { font-weight: 600; color: #fff; }
  .umeta { font-size: .74rem; color: rgba(255,255,255,.4); margin-top: 2px; }
  .lvl {
    font-size: .68rem; padding: 2px 8px; border-radius: 999px;
    background: rgba(255,255,255,.08); color: rgba(255,255,255,.55);
  }
`;
export const Switch = styled.button`
  width: 44px; height: 25px; border-radius: 13px; border: none; cursor: pointer;
  position: relative; flex-shrink: 0;
  background: ${p => p.$on ? "#34d399" : "rgba(255,255,255,.15)"};
  transition: background .2s;
  &::after {
    content: ""; position: absolute; top: 3px; left: ${p => p.$on ? "22px" : "3px"};
    width: 19px; height: 19px; border-radius: 50%; background: #fff;
    transition: left .2s cubic-bezier(.34,1.56,.64,1); box-shadow: 0 1px 3px rgba(0,0,0,.3);
  }
  &:disabled { opacity: .5; cursor: default; }
`;
export const UCount = styled.div`
  display: inline-flex; align-items: center; gap: 6px;
  font-size: .75rem; font-weight: 700; padding: 4px 10px; border-radius: 999px;
  background: rgba(52,211,153,.12); color: #34d399; border: 1px solid rgba(52,211,153,.22);
`;
