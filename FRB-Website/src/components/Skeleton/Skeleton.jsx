// src/components/Skeleton/Skeleton.jsx
// Skeleton screens com shimmer — placeholders que preenchem onde o conteúdo
// será renderizado, evitando "tela branca" durante carregamentos.
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0%   { background-position: -460px 0; }
  100% { background-position:  460px 0; }
`;

/* Bloco base com brilho deslizante (tema escuro) */
export const Sk = styled.div`
  border-radius: ${p => p.$radius ?? "10px"};
  width: ${p => p.$w ?? "100%"};
  height: ${p => p.$h ?? "16px"};
  background: linear-gradient(
    90deg,
    rgba(255,255,255,.05) 25%,
    rgba(255,255,255,.12) 37%,
    rgba(255,255,255,.05) 63%
  );
  background-size: 920px 100%;
  animation: ${shimmer} 1.25s ease-in-out infinite;
  ${p => p.$mb && `margin-bottom:${p.$mb};`}
  ${p => p.$mt && `margin-top:${p.$mt};`}
  flex-shrink: 0;
`;

export const SkRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${p => p.$gap ?? "12px"};
  ${p => p.$mb && `margin-bottom:${p.$mb};`}
  width: 100%;
`;

export const SkCardBox = styled.div`
  background: rgba(255,255,255,.035);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 16px;
  padding: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${p => p.$cols ?? 4}, 1fr);
  gap: 16px;
  margin-bottom: ${p => p.$mb ?? "0"};
  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; }
`;

/* ── KPIs (4 cartões com ícone + textos) ── */
export const SkeletonKpis = ({ count = 4 }) => (
  <Grid $cols={count} $mb="28px">
    {Array.from({ length: count }).map((_, i) => (
      <SkCardBox key={i}>
        <SkRow $gap="14px">
          <Sk $w="46px" $h="46px" $radius="12px" />
          <div style={{ flex: 1 }}>
            <Sk $w="55%" $h="10px" $mb="10px" />
            <Sk $w="80%" $h="20px" />
          </div>
        </SkRow>
      </SkCardBox>
    ))}
  </Grid>
);

/* ── Cartão de gráfico ── */
export const SkeletonChart = ({ height = 240 }) => (
  <SkCardBox style={{ marginBottom: 18 }}>
    <Sk $w="40%" $h="14px" $mb="20px" />
    <Sk $w="100%" $h={`${height}px`} $radius="12px" />
  </SkCardBox>
);

/* ── Grade de cards (ex.: histórico de faturamento) ── */
export const SkeletonCards = ({ count = 6, cols = 3 }) => (
  <Grid $cols={cols}>
    {Array.from({ length: count }).map((_, i) => (
      <SkCardBox key={i}>
        <SkRow $gap="12px" $mb="18px">
          <Sk $w="58px" $h="58px" $radius="12px" />
          <div style={{ flex: 1 }}>
            <Sk $w="70%" $h="14px" $mb="8px" />
            <Sk $w="40%" $h="10px" />
          </div>
        </SkRow>
        <SkRow $gap="10px" $mb="16px">
          <Sk $w="50%" $h="44px" $radius="10px" />
          <Sk $w="50%" $h="44px" $radius="10px" />
        </SkRow>
        <Sk $w="100%" $h="34px" $radius="8px" />
      </SkCardBox>
    ))}
  </Grid>
);

/* ── Linhas de tabela ── */
export const SkeletonTable = ({ rows = 6 }) => (
  <SkCardBox>
    <Sk $w="35%" $h="14px" $mb="18px" />
    {Array.from({ length: rows }).map((_, i) => (
      <SkRow key={i} $gap="16px" $mb="14px">
        <Sk $w="32%" $h="14px" />
        <Sk $w="18%" $h="14px" />
        <Sk $w="40%" $h="14px" />
      </SkRow>
    ))}
  </SkCardBox>
);

/* ── Barra de filtros ── */
export const SkeletonFilterBar = () => (
  <SkCardBox style={{ marginBottom: 22, padding: "14px 18px" }}>
    <SkRow $gap="12px">
      <Sk $w="220px" $h="38px" $radius="10px" />
      <Sk $w="160px" $h="38px" $radius="10px" />
      <Sk $w="140px" $h="38px" $radius="10px" />
      <Sk $w="120px" $h="38px" $radius="10px" style={{ marginLeft: "auto" }} />
    </SkRow>
  </SkCardBox>
);
