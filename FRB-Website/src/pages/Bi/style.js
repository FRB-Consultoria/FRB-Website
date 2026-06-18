// src/pages/Bi/style.js
import styled, { keyframes, css } from "styled-components";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(4, 173, 224, 0.55); }
  70%  { box-shadow: 0 0 0 16px rgba(4, 173, 224, 0); }
  100% { box-shadow: 0 0 0 0 rgba(4, 173, 224, 0); }
`;

export const BiMain = styled.main`
  min-height: 100vh;
  width: 100%;
  background: #0d1525;
  color: #fff;
  font-family: "Inter", "Segoe UI", sans-serif;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

export const PageHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(255, 255, 255, 0.03);

  @media (max-width: 600px) { padding: 14px 16px; }
`;

export const HeaderLogo = styled.img`
  width: 160px;

  @media (max-width: 600px) { width: 118px; }
`;

export const BackIcon = styled.div`
  width: 36px;
  height: 36px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s;

  &:hover {
    color: #04ade0;
  }

  svg {
    width: 36px;
    height: 36px;
  }
`;

export const TitleBlock = styled.div`
  padding: 18px 28px 0;
  animation: ${fadeUp} 0.3s ease;

  @media (max-width: 600px) { padding: 16px 16px 0; }
`;

export const PageTitle = styled.h1`
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0;
  color: #fff;

  @media (max-width: 600px) { font-size: 1.1rem; }
`;

export const PageSub = styled.p`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.45);
  margin: 6px 0 0;
  line-height: 1.5;

  @media (max-width: 600px) { font-size: 0.8rem; }
`;

export const TabsRow = styled.div`
  display: flex;
  gap: 10px;
  padding: 16px 28px 0;
  flex-wrap: wrap;
  animation: ${fadeUp} 0.35s ease;

  /* Celular/tablet: faixa rolável horizontal (não quebra em várias linhas). */
  @media (max-width: 820px) {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding: 14px 16px 0;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

export const TabButton = styled.button`
  padding: 10px 18px;
  border-radius: 12px;
  border: 1px solid ${(p) => (p.$active ? "#04ade0" : "rgba(255, 255, 255, 0.12)")};
  background: ${(p) => (p.$active ? "rgba(4, 173, 224, 0.15)" : "rgba(255, 255, 255, 0.04)")};
  color: ${(p) => (p.$active ? "#04ade0" : "rgba(255, 255, 255, 0.7)")};
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    border-color: #04ade0;
    color: #fff;
  }

  @media (max-width: 600px) { padding: 9px 14px; font-size: 0.8rem; }
`;

export const FrameWrap = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  min-height: 0;
  padding: 16px 20px 24px;
  animation: ${fadeUp} 0.35s ease;

  iframe {
    width: 100%;
    height: 100%;
    min-height: 60vh;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    background: #fff;
  }

  @media (max-width: 600px) {
    padding: 10px 10px 16px;
    iframe { min-height: 72vh; border-radius: 12px; }
  }

  /* Tela cheia (estilo player): preenche a tela toda, sem bordas/padding. */
  &:fullscreen,
  &:-webkit-full-screen {
    padding: 0;
    background: #0d1525;
  }
  &:fullscreen iframe,
  &:-webkit-full-screen iframe {
    border: none;
    border-radius: 0;
    min-height: 100vh;
    height: 100vh;
  }
`;

export const FsButton = styled.button`
  position: absolute;
  bottom: 38px;
  right: 40px;
  z-index: 30;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(13, 21, 37, 0.8);
  backdrop-filter: blur(5px);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  transition: all 0.15s;

  &:hover {
    border-color: #04ade0;
    color: #04ade0;
    background: rgba(13, 21, 37, 0.95);
  }

  @media (max-width: 600px) {
    bottom: 20px;
    right: 18px;
    width: 42px;
    height: 42px;
  }

  ${(p) =>
    p.$pulse &&
    css`
      border-color: #04ade0;
      color: #04ade0;
      animation: ${pulse} 1.6s ease-out infinite;
    `}
`;

/* ── Modal de dica (tela cheia) ── */
export const HintOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(5, 22, 43, 0.6);
  backdrop-filter: blur(2px);
`;

export const HintCard = styled.div`
  background: #0d1525;
  border: 1px solid rgba(4, 173, 224, 0.3);
  border-radius: 18px;
  padding: 26px 28px 24px;
  max-width: 390px;
  width: 100%;
  text-align: center;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55);
  animation: ${fadeUp} 0.25s ease;
`;

export const HintIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  margin: 0 auto 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(4, 173, 224, 0.14);
  color: #04ade0;
`;

export const HintTitle = styled.h3`
  margin: 0 0 8px;
  color: #fff;
  font-size: 1.05rem;
  font-weight: 800;
`;

export const HintText = styled.p`
  margin: 0 0 18px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.88rem;
  line-height: 1.55;
  strong { color: #04ade0; }
`;

export const HintBtn = styled.button`
  padding: 11px 28px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #04ade0, #0270a0);
  color: #fff;
  font-weight: 700;
  font-size: 0.88rem;
  transition: filter 0.15s;

  &:hover { filter: brightness(1.1); }
`;

export const StateWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 16px;
  min-height: 50vh;
  padding: 40px 20px;
  animation: ${fadeUp} 0.35s ease;
`;

export const Spinner = styled.div`
  width: 38px;
  height: 38px;
  border: 3px solid rgba(4, 173, 224, 0.2);
  border-top-color: #04ade0;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const StateTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
`;

export const StateText = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.45);
  margin: 0;
  max-width: 360px;
  line-height: 1.6;
`;

export const RetryBtn = styled.button`
  padding: 12px 28px;
  border-radius: 12px;
  background: linear-gradient(135deg, #04ade0, #0270a0);
  border: none;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: filter 0.15s;

  &:hover {
    filter: brightness(1.1);
  }
`;
