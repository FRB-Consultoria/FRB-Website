// src/components/Loader/index.jsx
// Loader ÚNICO da plataforma — um anel ciano da marca FRB.
// Use em qualquer lugar: inline, com legenda, ou como overlay de tela cheia.
//   <Loader />                      -> anel pequeno inline
//   <Loader size={48} label="..." /> -> anel + texto, centralizado
//   <Loader overlay label="..." />   -> overlay de tela inteira
import styled, { keyframes } from "styled-components";

const spin = keyframes`to { transform: rotate(360deg); }`;

const Ring = styled.div`
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  border-radius: 50%;
  border: ${p => Math.max(2, Math.round(p.$size / 12))}px solid rgba(4, 173, 224, 0.18);
  border-top-color: #04ade0;
  animation: ${spin} 0.8s linear infinite;
  flex-shrink: 0;
`;

const Inline = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.9rem;
  ${p => p.$pad && "padding: 70px 20px;"}
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(5, 22, 43, 0.55);
  backdrop-filter: blur(3px);
`;
const OverlayCard = styled.div`
  background: #0d1525;
  border: 1px solid rgba(4, 173, 224, 0.25);
  border-radius: 18px;
  padding: 30px 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55);
  color: #fff;
  text-align: center;
  h3 { margin: 0; font-size: 1rem; font-weight: 700; }
  p  { margin: 0; font-size: 0.84rem; color: rgba(255, 255, 255, 0.5); }
`;

export const Loader = ({ size = 44, label, overlay = false, pad = false, small = false }) => {
  const dim = small ? 20 : size;
  const ring = <Ring $size={dim} />;

  if (overlay) {
    return (
      <Overlay>
        <OverlayCard>
          {ring}
          <h3>{label || "Carregando..."}</h3>
          <p>Aguarde um instante.</p>
        </OverlayCard>
      </Overlay>
    );
  }
  if (label || pad) {
    return <Inline $pad={pad}>{ring}{label && <span>{label}</span>}</Inline>;
  }
  return ring;
};

export default Loader;
