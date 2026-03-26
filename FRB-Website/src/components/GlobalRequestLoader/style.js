import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(7, 18, 38, 0.32);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Card = styled.div`
  width: min(92vw, 360px);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18px 60px rgba(13, 34, 74, 0.22);
  border: 1px solid rgba(17, 59, 125, 0.08);
  padding: 28px 24px;
  display: grid;
  gap: 14px;
  justify-items: center;
  text-align: center;

  h3 {
    margin: 0;
    font-size: 1.08rem;
    color: #123b7d;
    font-weight: 800;
  }

  p {
    margin: 0;
    color: #4f5f7a;
    font-size: 0.95rem;
    line-height: 1.45;
  }
`;

export const Spinner = styled.div`
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: 4px solid rgba(18, 59, 125, 0.14);
  border-top-color: #123b7d;
  animation: ${spin} 0.8s linear infinite;
`;

export const Dots = styled.div`
  display: flex;
  gap: 7px;

  span {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #123b7d;
    opacity: 0.18;
    animation: pulse 1.2s infinite ease-in-out;
  }

  span:nth-child(2) {
    animation-delay: 0.18s;
  }

  span:nth-child(3) {
    animation-delay: 0.36s;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.18;
      transform: translateY(0);
    }
    50% {
      opacity: 1;
      transform: translateY(-3px);
    }
  }
`;