import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import bgPhoto from "../../../assets/img/BackgroundConfiança.webp";

/* ── constants ──────────────────────────────────────────────────── */
const W = 580;
const R = 222;
const BTN = 68;
const SPIN = "48s";
const ease = [0.16, 1, 0.3, 1];

function getPos(i, n) {
  const a = (i / n) * Math.PI * 2 - Math.PI / 2;
  return { x: Math.cos(a) * R, y: Math.sin(a) * R };
}

/* ── keyframes ──────────────────────────────────────────────────── */
const spin  = keyframes`to { transform: rotate(360deg); }`;
const spinR = keyframes`to { transform: rotate(-360deg); }`;

/* ── icons (white stroke on gradient bg) ───────────────────────── */
const Svg = ({ size = 26, children }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,0.95)"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const IconPME = ({ size }) => (
  <Svg size={size}>
    <rect x="3" y="9" width="18" height="13" rx="1" />
    <path d="M8 9V6a4 4 0 0 1 8 0v3" />
    <line x1="12" y1="13" x2="12" y2="17" />
    <line x1="10" y1="15" x2="14" y2="15" />
  </Svg>
);
const IconEmpresarial = ({ size }) => (
  <Svg size={size}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="16" />
    <line x1="10" y1="14" x2="14" y2="14" />
  </Svg>
);
const IconDental = ({ size }) => (
  <Svg size={size}>
    <path d="M12 2C8 2 5 5.5 5 8c0 2 .5 3.5 1 5 .8 2.5 1.5 5 2.5 7 .3.5.6.8 1 .8s.7-.3 1-.8L12 16l2.5 4c.3.5.6.8 1 .8s.7-.3 1-.8c1-2 1.7-4.5 2.5-7 .5-1.5 1-3 1-5 0-2.5-3-6-7-6z" />
  </Svg>
);
const IconVida = ({ size }) => (
  <Svg size={size}>
    <path d="M12 21S4 14 4 8.5a4.5 4.5 0 0 1 8-2.8 4.5 4.5 0 0 1 8 2.8C20 14 12 21 12 21z" />
    <polyline points="9,10 11,12 15,8" strokeWidth="1.6" />
  </Svg>
);
const IconAutomovel = ({ size }) => (
  <Svg size={size}>
    <path d="M5 17H3a2 2 0 0 1-2-2V9l2-5h14l2 5v6a2 2 0 0 1-2 2h-2" />
    <circle cx="7.5" cy="17.5" r="2.5" />
    <circle cx="16.5" cy="17.5" r="2.5" />
    <line x1="3" y1="9" x2="21" y2="9" />
  </Svg>
);
const IconInCompany = ({ size }) => (
  <Svg size={size}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);
const IconGestao = ({ size }) => (
  <Svg size={size}>
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
  </Svg>
);
const IconBI = ({ size }) => (
  <Svg size={size}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </Svg>
);
const IconResidencial = ({ size }) => (
  <Svg size={size}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </Svg>
);

/* ── service data ───────────────────────────────────────────────── */
const services = [
  { num:"01", tag:"PME",        title:"PME",                       desc:"Planos para micro e pequenas empresas com custo acessível, ampla rede credenciada e gestão simplificada de benefícios.", from:"#1D4ED8", to:"#60A5FA", glow:"59,130,246",   Icon:IconPME },
  { num:"02", tag:"Empresarial",title:"Empresarial",               desc:"Coberturas robustas para médias e grandes corporações, com relatórios de sinistros, gestão de risco e atendimento dedicado.", from:"#4338CA", to:"#A78BFA", glow:"129,140,248", Icon:IconEmpresarial },
  { num:"03", tag:"Odontológico",title:"Odontológico",             desc:"Planos odontológicos coletivos com rede ampla e cobertura para procedimentos preventivos, restauradores e de urgência.", from:"#0D9488", to:"#2DD4BF", glow:"45,212,191",   Icon:IconDental },
  { num:"04", tag:"Vida",       title:"Vida e Proteção Financeira",desc:"Seguro de vida coletivo com coberturas personalizáveis para proteger o patrimônio e a tranquilidade dos colaboradores.", from:"#BE123C", to:"#FB7185", glow:"251,113,133", Icon:IconVida },
  { num:"05", tag:"Automóvel",  title:"Automóvel",                 desc:"Gestão de frotas e seguros de veículos corporativos com condições exclusivas e apólices centralizadas.", from:"#B45309", to:"#FCD34D", glow:"252,211,77",   Icon:IconAutomovel },
  { num:"06", tag:"In Company", title:"Atendimento in Company",    desc:"Serviços de saúde e bem-estar realizados diretamente na sua empresa, reduzindo absenteísmo e aumentando produtividade.", from:"#15803D", to:"#4ADE80", glow:"74,222,128",   Icon:IconInCompany },
  { num:"07", tag:"Gest. Risco",title:"Gestão de Risco em Saúde", desc:"Análise e mitigação de riscos assistenciais com indicadores de utilização, relatórios periódicos e recomendações estratégicas.", from:"#0369A1", to:"#38BDF8", glow:"56,189,248",   Icon:IconGestao },
  { num:"08", tag:"BI",         title:"Business Intelligence",     desc:"Dashboards e relatórios de utilização do plano para apoiar decisões de RH com dados concretos e atualizados em tempo real.", from:"#6D28D9", to:"#C084FC", glow:"192,132,252", Icon:IconBI },
  { num:"09", tag:"Residencial",title:"Residencial",               desc:"Seguros residenciais para os colaboradores, ampliando o pacote de benefícios e fortalecendo o vínculo com a empresa.", from:"#C2410C", to:"#FB923C", glow:"251,146,60",   Icon:IconResidencial },
];

/* ── styled: orbit layers (defined before WheelWrap for selector refs) ── */

/* the rotating ring — spins the entire icon group */
const Orbit = styled.div`
  position: absolute;
  inset: 0;
  animation: ${spin} ${SPIN} linear infinite;
`;

/* per-icon position wrapper: sits inside Orbit (so it orbits), but has NO
   animation itself — only translate(-50%,-50%) which is static */
const IconOuter = styled.div`
  position: absolute;
  width: 112px;
  height: ${BTN + 30}px;
`;

/* counter-rotation wrapper: cancels the parent Orbit rotation so icon stays upright */
const IconInner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 7px;
  animation: ${spinR} ${SPIN} linear infinite;
`;

const IconLabel = styled.span`
  font-family: "Nunito", sans-serif;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: rgba(238, 245, 255, 0.62);
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
  text-align: center;
`;

/* wheel container: hover pauses orbit + counter-spin simultaneously */
const WheelWrap = styled.div`
  position: relative;
  width: ${W}px;
  height: ${W}px;
  flex-shrink: 0;

  &:hover ${Orbit} {
    animation-play-state: paused;
  }
  &:hover ${IconInner} {
    animation-play-state: paused;
  }
`;

/* ── rest of styled ─────────────────────────────────────────────── */
const Section = styled.section`
  background: var(--black);
  padding: 140px 40px 160px;
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    padding: 80px 24px 100px;
  }
`;

const BgPhoto = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
  opacity: 0.11;
  filter: grayscale(85%) contrast(0.7);
  pointer-events: none;
  user-select: none;
  z-index: 0;
`;

const TopEdge = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 180px;
  background: linear-gradient(to bottom, var(--black) 0%, transparent 100%);
  pointer-events: none;
  z-index: 0;
`;

const BottomEdge = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 180px;
  background: linear-gradient(to top, var(--black) 0%, transparent 100%);
  pointer-events: none;
  z-index: 0;
`;

const Container = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 80px;

  @media (max-width: 768px) {
    margin-bottom: 56px;
  }
`;

const SLabel = styled(motion.p)`
  font-family: "Nunito", sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 16px;
`;

const SH2 = styled(motion.h2)`
  font-family: "Nunito", sans-serif;
  font-size: clamp(28px, 3.8vw, 52px);
  font-weight: 800;
  color: var(--white);
  letter-spacing: -0.8px;
  line-height: 1.1;
  margin-bottom: 16px;
`;

const SSub = styled(motion.p)`
  font-family: "Nunito", sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: rgba(238, 245, 255, 0.48);
  line-height: 1.75;
  max-width: 52ch;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const WidgetRow = styled.div`
  display: grid;
  align-items: center;

  /* grid columns set via inline style (dynamic per scale) */
  @media (max-width: 1160px) {
    grid-template-columns: 1fr !important;
    gap: 48px !important;
    justify-items: center;
  }
`;

const CenterOrb = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 1px dashed rgba(4, 173, 224, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  pointer-events: none;
`;

const OrbHint = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(238, 245, 255, 0.18);
  text-align: center;
  line-height: 1.6;
  max-width: 90px;
`;

const DetailPanel = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 320px;
  justify-content: center;

  @media (max-width: 1160px) {
    max-width: 560px;
    width: 100%;
    text-align: center;
    align-items: center;
    min-height: 0;
  }
`;

const DNum = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 80px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -4px;
  color: rgba(255, 255, 255, 0.04);
  margin-bottom: -18px;
  user-select: none;
`;

const DTag = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 14px;
`;

const DTitle = styled.h3`
  font-family: "Nunito", sans-serif;
  font-size: clamp(22px, 3vw, 40px);
  font-weight: 800;
  color: var(--white);
  letter-spacing: -0.6px;
  line-height: 1.15;
  margin-bottom: 18px;
`;

const DDesc = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 1.85;
  color: rgba(238, 245, 255, 0.58);
  max-width: 44ch;
  margin-bottom: 32px;
`;

const DClose = styled(motion.button)`
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(238, 245, 255, 0.3);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 9px 22px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  align-self: flex-start;
  transition: color 0.3s ease, border-color 0.3s ease;

  &:hover {
    color: rgba(238, 245, 255, 0.75);
    border-color: rgba(255, 255, 255, 0.22);
  }

  @media (max-width: 1160px) {
    align-self: center;
  }
`;

const IdleTitle = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: clamp(22px, 3vw, 38px);
  font-weight: 800;
  color: rgba(238, 245, 255, 0.15);
  letter-spacing: -0.5px;
  line-height: 1.2;
  margin-bottom: 14px;
`;

const IdleSub = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: rgba(238, 245, 255, 0.12);
  line-height: 1.7;
  max-width: 34ch;
`;

/* ── responsive scale hook ──────────────────────────────────────── */
function useWheelScale() {
  const compute = () => {
    if (typeof window === "undefined") return 1;
    const pad = window.innerWidth <= 768 ? 48 : 80;
    return Math.min(1, (window.innerWidth - pad) / W);
  };
  const [scale, setScale] = useState(compute);
  useEffect(() => {
    const handler = () => setScale(compute());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return scale;
}

/* ── component ──────────────────────────────────────────────────── */
export const Servicos = () => {
  const [active, setActive] = useState(null);
  const svc = active !== null ? services[active] : null;
  const wheelScale = useWheelScale();
  const visualW = Math.round(W * wheelScale);

  /* directional entry: icon "flies in" from its orbit angle */
  const entryDir = active !== null ? getPos(active, services.length) : { x: 0, y: 0 };
  const entryX = (entryDir.x / R) * 55;
  const entryY = (entryDir.y / R) * 55;

  return (
    <Section id="servicos">
      <BgPhoto src={bgPhoto} alt="" aria-hidden="true" />
      <TopEdge />
      <BottomEdge />

      <Container>
        <SectionHeader>
          <SLabel
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            O que oferecemos
          </SLabel>
          <SH2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.1, ease }}
          >
            Nossos Serviços
          </SH2>
          <SSub
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
          >
            Saúde, vida, dental, automóvel, residencial e muito mais clique em cada ícone para descobrir a solução certa para sua empresa.
          </SSub>
        </SectionHeader>

        <WidgetRow style={{ gridTemplateColumns: `${visualW}px 1fr`, gap: "80px" }}>
          {/* ── spinning wheel ─────────────────────────────────── */}
          {/* Outer div tells the grid the visual size; inner WheelWrap
              scales from its natural W×W to fit any viewport width */}
          <div style={{ position: "relative", width: visualW, height: visualW, flexShrink: 0 }}>
          <WheelWrap
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              marginLeft: -(W / 2),
              transform: `scale(${wheelScale})`,
              transformOrigin: "top center",
            }}
          >
            {/* ring track */}
            <svg
              width={W}
              height={W}
              style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}
            >
              <circle
                cx={W / 2} cy={W / 2} r={R}
                fill="none"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="1"
                strokeDasharray="4 5"
              />
              <circle
                cx={W / 2} cy={W / 2} r={90}
                fill="none"
                stroke="rgba(4,173,224,0.09)"
                strokeWidth="1"
              />
            </svg>

            {/* orbit */}
            <Orbit>
              {services.map((s, i) => {
                const { x, y } = getPos(i, services.length);
                const BtnIcon = s.Icon;
                const isActive = active === i;
                const isOtherActive = active !== null && !isActive;
                return (
                  <IconOuter
                    key={i}
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: "translate(-50%, -50%)",
                      zIndex: 2,
                    }}
                  >
                    <IconInner>
                      <motion.button
                        style={{
                          width: BTN,
                          height: BTN,
                          borderRadius: "50%",
                          border: "none",
                          background: `linear-gradient(135deg, ${s.from}, ${s.to})`,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          outline: "none",
                        }}
                        animate={{
                          opacity: isActive ? 0.28 : isOtherActive ? 0.65 : 1,
                          scale: isActive ? 0.72 : 1,
                          boxShadow: isActive
                            ? `0 2px 8px rgba(${s.glow}, 0.2)`
                            : `0 4px 22px rgba(${s.glow}, 0.58)`,
                        }}
                        whileHover={!isActive ? {
                          scale: 1.22,
                          boxShadow: `0 0 40px rgba(${s.glow}, 0.8)`,
                        } : {}}
                        whileTap={{ scale: 0.88 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        onClick={() => setActive(isActive ? null : i)}
                        aria-label={s.tag}
                      >
                        <BtnIcon size={27} />
                      </motion.button>
                      <IconLabel style={{
                        color: isActive
                          ? `rgba(${s.glow}, 0.5)`
                          : isOtherActive
                          ? "rgba(238,245,255,0.35)"
                          : "rgba(238,245,255,0.7)",
                        transition: "color 0.3s ease",
                      }}>
                        {s.tag}
                      </IconLabel>
                    </IconInner>
                  </IconOuter>
                );
              })}
            </Orbit>

            {/* center orb */}
            <CenterOrb style={{ pointerEvents: active !== null ? "all" : "none" }}>
              <AnimatePresence mode="wait">
                {active === null ? (
                  <motion.div
                    key="hint"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease }}
                  >
                    <OrbHint>Toque para explorar</OrbHint>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`center-${active}`}
                    initial={{ opacity: 0, scale: 0.35, x: entryX, y: entryY }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, scale: 0.35 }}
                    transition={{ type: "spring", stiffness: 230, damping: 20 }}
                    style={{
                      width: 122,
                      height: 122,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${svc.from}, ${svc.to})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: `0 0 64px rgba(${svc.glow}, 0.65), 0 0 120px rgba(${svc.glow}, 0.22)`,
                    }}
                    onClick={() => setActive(null)}
                    title="Clique para fechar"
                  >
                    {React.createElement(svc.Icon, { size: 54 })}
                  </motion.div>
                )}
              </AnimatePresence>
            </CenterOrb>
          </WheelWrap>
          </div>

          {/* ── detail panel ───────────────────────────────────── */}
          <DetailPanel>
            <AnimatePresence mode="wait">
              {active === null ? (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.38, ease }}
                >
                  <IdleTitle>
                    Soluções completas<br />em benefícios.
                  </IdleTitle>
                  <IdleSub>
                    Selecione um serviço na roda para conhecer os detalhes.
                  </IdleSub>
                </motion.div>
              ) : (
                <motion.div
                  key={`detail-${active}`}
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <DTag style={{ color: `rgba(${svc.glow}, 1)` }}>
                    {svc.tag}
                  </DTag>
                  <DTitle>{svc.title}</DTitle>
                  <DDesc>{svc.desc}</DDesc>
                  <DClose
                    onClick={() => setActive(null)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Fechar
                  </DClose>
                </motion.div>
              )}
            </AnimatePresence>
          </DetailPanel>
        </WidgetRow>
      </Container>
    </Section>
  );
};
