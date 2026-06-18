// src/pages/Users/style.js
import styled, { keyframes } from "styled-components";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1; }
`;

export const UserMain = styled.main`
  min-height: 100vh;
  background: #05162b;
  color: #fff;
  font-family: "Inter", "Segoe UI", sans-serif;
`;

export const PageHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(255, 255, 255, 0.03);
`;

export const HeaderLogo = styled.img`
  width: 160px;
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

export const GreetText = styled.p`
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
`;

export const GreetRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 28px 0;
`;

export const BiNavLink = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 12px;
  border: 1px solid rgba(4, 173, 224, 0.35);
  background: rgba(4, 173, 224, 0.08);
  color: #04ade0;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;

  &:hover {
    background: rgba(4, 173, 224, 0.18);
    border-color: #04ade0;
  }
`;

export const PbiWrap = styled.div`
  width: 100%;
  padding: 16px 20px;
  animation: ${fadeUp} 0.3s ease;

  iframe {
    width: 100%;
    height: calc(100vh - 140px);
    min-height: 500px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
`;

export const WelcomeScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 160px);
  padding: 40px 20px;
  text-align: center;
  animation: ${fadeUp} 0.35s ease;
`;

export const WelcomeIcon = styled.div`
  color: rgba(4, 173, 224, 0.4);
  margin-bottom: 20px;
  animation: ${pulse} 3s ease-in-out infinite;
`;

export const WelcomeTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 10px;
`;

export const WelcomeSub = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 24px;
  max-width: 340px;
  line-height: 1.6;
`;

export const ReopenBtn = styled.button`
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

/* Retrocompatibilidade — outros arquivos que importem `Main` continuam funcionando */
export const Main = UserMain;
