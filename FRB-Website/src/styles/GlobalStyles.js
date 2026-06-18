import { createGlobalStyle } from "styled-components";

export const LandingGlobalStyle = createGlobalStyle`
  :root {
    --black: #020c1b;
    --navy: #04162e;
    --navy-mid: #071f42;
    --accent: #04ADE0;
    --accent-deep: #0070BA;
    --accent-glow: rgba(4, 173, 224, 0.18);
    --white: #eef5ff;
    --gray: #6a85a8;
    --border: rgba(4, 173, 224, 0.12);
    --border-solid: rgba(255, 255, 255, 0.06);
    --radius-sm: 12px;
    --radius-md: 20px;
    --radius-lg: 32px;
    --radius-pill: 9999px;
  }

  html {
    scroll-behavior: smooth;
    /* NÃO usar overflow-x:hidden no html — quebra o scroll container do viewport */
  }

  body {
    overflow-x: hidden;
    overflow-y: auto;
    margin: 0;
    padding: 0;
    background: #020c1b;
    touch-action: pan-y;
  }

  /* Framer-motion injeta touch-action:none em elementos com gestures,
     bloqueando scroll vertical no mobile. Este override restaura o comportamento correto. */
  @media (hover: none) {
    button, a, [role="button"],
    div[style*="touch-action"],
    section[style*="touch-action"] {
      touch-action: pan-y !important;
    }
  }

  /* cursor: none só é aplicado após o primeiro mousemove (classe cursor-ready adicionada via JS)
     Isso evita que o browser bloqueie scroll wheel antes de rastrear o ponteiro */
  @media (hover: hover) {
    html.cursor-ready *,
    html.cursor-ready a,
    html.cursor-ready button,
    html.cursor-ready [role="button"],
    html.cursor-ready input,
    html.cursor-ready textarea,
    html.cursor-ready select,
    html.cursor-ready label {
      cursor: none !important;
    }
  }

  ::-webkit-scrollbar {
    width: 3px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(4, 173, 224, 0.35);
    border-radius: 2px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(4, 173, 224, 0.7);
  }
`;
