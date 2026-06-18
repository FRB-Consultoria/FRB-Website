// src/pages/BookEntregas/style.js
import styled, { keyframes } from "styled-components";

const fadeUp = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}`;
const spin   = keyframes`to{transform:rotate(360deg)}`;

export const Intro = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 26px;
`;
export const IntroText = styled.div`
  h2 {
    font-size: 1.35rem; font-weight: 800; color: #fff; margin: 0 0 6px;
  }
  p { font-size: .85rem; color: rgba(255,255,255,.45); margin: 0; max-width: 560px; line-height: 1.55; }
  strong { color: #04ade0; }
`;

export const YearTabs = styled.div`
  display: flex; gap: 8px; flex-wrap: wrap;
`;
export const YearBtn = styled.button`
  padding: 8px 18px; border-radius: 10px;
  font-size: .85rem; font-weight: 700; cursor: pointer;
  transition: all .15s;
  background: ${p => p.$active ? "linear-gradient(135deg,#04ade0,#0270a0)" : "rgba(255,255,255,.05)"};
  border: 1px solid ${p => p.$active ? "transparent" : "rgba(255,255,255,.1)"};
  color: ${p => p.$active ? "#fff" : "rgba(255,255,255,.55)"};
  &:hover { color: #fff; background: ${p => p.$active ? "" : "rgba(255,255,255,.08)"}; }
`;

export const PrintBtn = styled.button`
  display: flex; align-items: center; gap: 7px;
  padding: 9px 16px; border-radius: 9px;
  background: linear-gradient(135deg,#7c5cbf,#5b3fa0);
  border: none; color: #fff; cursor: pointer;
  font-size: .82rem; font-weight: 700;
  transition: filter .15s;
  &:hover { filter: brightness(1.12); }
`;

export const KpiRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 26px;
  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; }
`;
export const Kpi = styled.div`
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 16px;
  padding: 20px;
  display: flex; align-items: center; gap: 16px;
  animation: ${fadeUp} .3s ease both;
`;
export const KpiIco = styled.div`
  width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: ${p => p.$bg ?? "rgba(4,173,224,.12)"};
  color: ${p => p.$color ?? "#04ade0"};
`;
export const KpiLbl = styled.div`
  font-size: .7rem; color: rgba(255,255,255,.45);
  text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px;
`;
export const KpiVal = styled.div`
  font-size: 1.4rem; font-weight: 800; color: #fff; line-height: 1;
`;
export const KpiHint = styled.div`
  font-size: .72rem; color: rgba(255,255,255,.3); margin-top: 4px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${p => p.$cols ?? "1.4fr 1fr"};
  gap: 18px;
  margin-bottom: 18px;
  @media (max-width: 960px) { grid-template-columns: 1fr; }
`;
export const Card = styled.div`
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 16px;
  padding: 20px 22px;
  animation: ${fadeUp} .35s ease both;
`;
export const CardTitle = styled.h3`
  font-size: .9rem; font-weight: 700; color: rgba(255,255,255,.85);
  display: flex; align-items: center; gap: 8px; margin: 0 0 18px;
  svg { color: #04ade0; }
`;

export const Progress = styled.div`
  height: 10px; border-radius: 999px;
  background: rgba(255,255,255,.08); overflow: hidden; margin: 10px 0 6px;
`;
export const ProgressFill = styled.div`
  height: 100%; border-radius: 999px;
  width: ${p => p.$pct ?? 0}%;
  background: linear-gradient(90deg,#04ade0,#34d399);
  transition: width .5s ease;
`;

export const SnapRow = styled.div`
  display: flex; align-items: center; gap: 12px;
  padding: 11px 0;
  border-top: 1px solid rgba(255,255,255,.06);
  &:first-of-type { border-top: none; }
  .period { font-weight: 700; color: rgba(255,255,255,.85); font-size: .85rem; min-width: 110px; }
  .prod {
    font-size: .68rem; font-weight: 800; padding: 2px 9px; border-radius: 999px;
    text-transform: uppercase; letter-spacing: .04em;
    color: ${p => p.$saude ? "#34d399" : "#04ade0"};
    background: ${p => p.$saude ? "rgba(52,211,153,.12)" : "rgba(4,173,224,.12)"};
  }
  .lives { margin-left: auto; font-size: .8rem; color: rgba(255,255,255,.5); }
  .val { font-weight: 700; color: rgba(255,255,255,.8); font-size: .82rem; min-width: 110px; text-align: right; }
`;

export const Timeline = styled.div`
  position: relative;
  padding-left: 22px;
  &::before {
    content: ""; position: absolute; left: 5px; top: 4px; bottom: 4px;
    width: 2px; background: rgba(255,255,255,.1);
  }
`;
export const TimeItem = styled.div`
  position: relative; padding: 0 0 16px;
  &::before {
    content: ""; position: absolute; left: -21px; top: 4px;
    width: 10px; height: 10px; border-radius: 50%;
    background: ${p =>
      p.$type === "billing" ? "#04ade0" :
      p.$status === "completed" ? "#34d399" :
      p.$status === "in_progress" ? "#facc15" : "rgba(255,255,255,.35)"};
    box-shadow: 0 0 0 3px rgba(5,22,43,1);
  }
  .lbl { font-size: .84rem; color: rgba(255,255,255,.85); font-weight: 600; }
  .date { font-size: .72rem; color: rgba(255,255,255,.35); margin-top: 2px; }
`;

export const Empty = styled.div`
  text-align: center; padding: 30px 10px;
  color: rgba(255,255,255,.35); font-size: .85rem;
`;

export const Loading = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 100px 20px; gap: 16px; color: rgba(255,255,255,.4); font-size: .88rem;
  svg.spin { animation: ${spin} .8s linear infinite; color: #04ade0; }
`;
