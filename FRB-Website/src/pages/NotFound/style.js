// src/pages/NotFound/style.js
import styled, { keyframes } from "styled-components";

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-14px); }
`;
const glow = keyframes`
  0%, 100% { opacity: .6; }
  50%       { opacity: 1; }
`;
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const StyledNotFound = styled.main`
  min-height: 100vh;
  background: #05162b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Inter", "Segoe UI", sans-serif;
  overflow: hidden;
  position: relative;

  /* Brilho de fundo */
  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(4,173,224,.08) 0%, transparent 70%);
    pointer-events: none;
  }
`;

export const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0;
  animation: ${fadeUp} .5s ease;
  padding: 32px 20px;
  z-index: 1;
`;

export const Logo = styled.img`
  height: 42px;
  margin-bottom: 48px;
  opacity: .85;
`;

export const Code = styled.div`
  font-size: clamp(6rem, 20vw, 9rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -4px;
  background: linear-gradient(135deg, #04ade0 30%, #0270a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${float} 4s ease-in-out infinite, ${glow} 4s ease-in-out infinite;
  margin-bottom: 8px;
  user-select: none;
`;

export const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px;
`;

export const Subtitle = styled.p`
  font-size: .95rem;
  color: rgba(255,255,255,.45);
  max-width: 360px;
  line-height: 1.6;
  margin: 0 0 36px;
`;

export const BtnGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const BtnPrimary = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 12px;
  background: linear-gradient(135deg, #04ade0, #0270a0);
  color: #fff;
  font-size: .9rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: filter .15s, transform .1s;
  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
`;

export const BtnSecondary = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.15);
  background: transparent;
  color: rgba(255,255,255,.7);
  font-size: .9rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background .15s, color .15s;
  &:hover { background: rgba(255,255,255,.07); color: #fff; }
`;
