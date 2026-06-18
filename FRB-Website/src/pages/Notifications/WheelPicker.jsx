// src/pages/Notifications/WheelPicker.jsx
// Seletor de horário estilo "roda do relógio do iPhone" (drum picker).
// Rolagem vertical com snap; o item na faixa central é o selecionado.
import { useRef, useEffect, useCallback } from "react";
import styled from "styled-components";

const ITEM_H = 40;     // altura de cada item
const VISIBLE = 5;     // itens visíveis (ímpar) — 5 => 2 acima, 2 abaixo
const PAD = ((VISIBLE - 1) / 2) * ITEM_H;
const VIEW_H = VISIBLE * ITEM_H;

const Board = styled.div`
  display: flex;
  align-items: stretch;
  gap: 6px;
  background: #0d1525;
  border: 1px solid rgba(4, 173, 224, 0.25);
  border-radius: 16px;
  padding: 10px 8px 12px;
  width: max-content;
  user-select: none;
`;
const Col = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 78px;
  @media (max-width: 380px) { width: 60px; }
`;
const ColLabel = styled.div`
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 6px;
`;
const ColWrap = styled.div`
  position: relative;
  height: ${VIEW_H}px;
  width: 100%;
`;
const Scroller = styled.div`
  height: 100%;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  /* máscara: some o topo/baixo pra dar profundidade de "tambor" */
  -webkit-mask-image: linear-gradient(180deg, transparent, #000 22%, #000 78%, transparent);
  mask-image: linear-gradient(180deg, transparent, #000 22%, #000 78%, transparent);
`;
const Spacer = styled.div`height: ${PAD}px;`;
const Item = styled.div`
  height: ${ITEM_H}px;
  line-height: ${ITEM_H}px;
  text-align: center;
  scroll-snap-align: center;
  cursor: pointer;
  font-size: 1.25rem;
  font-variant-numeric: tabular-nums;
  color: ${(p) => (p.$active ? "#fff" : "rgba(255,255,255,.38)")};
  font-weight: ${(p) => (p.$active ? 800 : 500)};
  transition: color 0.12s, font-weight 0.12s;
`;
const Band = styled.div`
  position: absolute;
  left: 2px;
  right: 2px;
  top: ${PAD}px;
  height: ${ITEM_H}px;
  border-top: 1px solid rgba(4, 173, 224, 0.45);
  border-bottom: 1px solid rgba(4, 173, 224, 0.45);
  background: rgba(4, 173, 224, 0.1);
  border-radius: 8px;
  pointer-events: none;
`;

const pad2 = (n) => String(n).padStart(2, "0");

function WheelColumn({ label, values, value, onChange, format }) {
  const ref = useRef(null);
  const lock = useRef(false);
  const tmr = useRef(null);
  const idx = Math.max(0, values.indexOf(value));

  // Posiciona a rolagem quando o valor muda por fora (carregar agenda salva etc.)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = idx * ITEM_H;
    if (Math.abs(el.scrollTop - target) > 2) {
      lock.current = true;
      el.scrollTop = target;
      window.clearTimeout(tmr.current);
      tmr.current = window.setTimeout(() => { lock.current = false; }, 220);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el || lock.current) return;
    window.clearTimeout(tmr.current);
    tmr.current = window.setTimeout(() => {
      let i = Math.round(el.scrollTop / ITEM_H);
      i = Math.max(0, Math.min(values.length - 1, i));
      if (values[i] !== value) onChange(values[i]);
    }, 90);
  }, [values, value, onChange]);

  const pick = (v, i) => {
    const el = ref.current;
    if (el) el.scrollTo({ top: i * ITEM_H, behavior: "smooth" });
    if (v !== value) onChange(v);
  };

  return (
    <Col>
      <ColLabel>{label}</ColLabel>
      <ColWrap>
        <Scroller ref={ref} onScroll={onScroll}>
          <Spacer />
          {values.map((v, i) => (
            <Item key={v} $active={i === idx} onClick={() => pick(v, i)}>
              {format ? format(v) : v}
            </Item>
          ))}
          <Spacer />
        </Scroller>
        <Band />
      </ColWrap>
    </Col>
  );
}

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

export function TimeWheel({ day, hour, minute, onChange, minDay = 1, maxDay = 28 }) {
  const days = range(minDay, maxDay);
  const hours = range(0, 23);
  const minutes = range(0, 59);
  return (
    <Board>
      <WheelColumn label="Dia" values={days} value={day}
        onChange={(v) => onChange({ day: v, hour, minute })} format={pad2} />
      <WheelColumn label="Hora" values={hours} value={hour}
        onChange={(v) => onChange({ day, hour: v, minute })} format={pad2} />
      <WheelColumn label="Min" values={minutes} value={minute}
        onChange={(v) => onChange({ day, hour, minute: v })} format={pad2} />
    </Board>
  );
}

export default TimeWheel;
