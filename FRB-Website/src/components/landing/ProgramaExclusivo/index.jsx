import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import nurseVideo from "../../../assets/videos/nurse-phone.mp4";

const Section = styled.section`
  position: relative;
  min-height: 92vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  background: var(--black);
  touch-action: pan-y;
`;

const VideoBg = styled.video`
  position: absolute;
  inset: -15% 0;
  width: 100%;
  height: 130%;
  object-fit: cover;
  object-position: 70% center;
  display: block;
  pointer-events: none;
  touch-action: none;
`;

const EdgeFade = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 40%;
  pointer-events: none;
  z-index: 1;

  &.top {
    top: 0;
    background: linear-gradient(to bottom, var(--black) 0%, rgba(2,12,27,0.6) 60%, transparent 100%);
  }
  &.bottom {
    bottom: 0;
    background: linear-gradient(to top, var(--black) 0%, rgba(2,12,27,0.6) 60%, transparent 100%);
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    rgba(2, 12, 27, 0.97) 0%,
    rgba(7, 31, 66, 0.86) 40%,
    rgba(7, 31, 66, 0.28) 68%,
    transparent 100%
  );

  @media (max-width: 768px) {
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(2, 12, 27, 0.82) 32%,
      rgba(2, 12, 27, 0.92) 68%,
      transparent 100%
    );
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1320px;
  margin: 0 auto;
  padding: 140px 80px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 100px 24px;
  }
`;

const Inner = styled.div`
  max-width: 580px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Label = styled(motion.p)`
  font-family: "Nunito", sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 20px;
`;

const H2 = styled(motion.h2)`
  font-family: "Nunito", sans-serif;
  font-size: clamp(30px, 3.8vw, 52px);
  font-weight: 800;
  line-height: 1.15;
  color: var(--white);
  margin-bottom: 20px;
  letter-spacing: -0.8px;
`;

const Subtitle = styled(motion.p)`
  font-family: "Nunito", sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 1.85;
  color: rgba(238, 245, 255, 0.6);
  margin-bottom: 44px;
  max-width: 50ch;
`;

const FeaturesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div)`
  padding: 22px 20px;
  border-radius: var(--radius-md);
  background: rgba(4, 173, 224, 0.05);
  border: 1px solid rgba(4, 173, 224, 0.12);
  border-left: 3px solid var(--accent);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: background 0.35s ease, border-color 0.35s ease;

  &:hover {
    background: rgba(4, 173, 224, 0.1);
    border-color: rgba(4, 173, 224, 0.28);
  }
`;

const IconWrap = styled.div`
  width: 34px;
  height: 34px;
  color: var(--accent);
  margin-bottom: 4px;
`;

const FeatureTitle = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 800;
  color: var(--white);
  line-height: 1.3;
`;

const FeatureDesc = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--gray);
  line-height: 1.65;
`;

const ease = [0.16, 1, 0.3, 1];

const featureVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
};

const featureChild = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease } },
};

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5z" />
    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z" />
  </svg>
);

const CalendarCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <polyline points="9 16 11 18 15 14" />
  </svg>
);

const ShieldPlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="9" x2="12" y2="15" />
    <line x1="9" y1="12" x2="15" y2="12" />
  </svg>
);

const SearchMedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

const ProgramasSaudeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
    <path d="M12 21s-7-4.5-7-10a5 5 0 0 1 7-4.58A5 5 0 0 1 19 11c0 5.5-7 10-7 10z" />
    <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" stroke="none" />
    <path d="M12 8v6M9 11h6" />
  </svg>
);

const features = [
  {
    icon: <PhoneIcon />,
    title: "Concierge exclusivo 24h por dia e 7 dias por semana",
    desc: "Atendimento exclusivo com equipe de saúde multidisciplinar, indicação de especialistas e apoio em momentos de fragilidade.",
  },
  {
    icon: <CalendarCheckIcon />,
    title: "Agendamento e Apoio",
    desc: "Auxílio no agendamento de exames de alta complexidade, cirurgias e internações.",
  },
  {
    icon: <ShieldPlusIcon />,
    title: "Acolhimento Integral",
    desc: "Suporte contínuo durante a internação e no período de pós-alta, garantindo tranquilidade disponível 24 horas uma gestão completa 360°.",
  },
  {
    icon: <SearchMedIcon />,
    title: "Busca Ativa de Especialistas",
    desc: "Encontre os melhores profissionais na rede credenciada com agilidade e precisão.",
  },
  {
    icon: <ProgramasSaudeIcon />,
    title: "Programas de Saúde: Crônicos e Gestantes",
    desc: "Acompanhamento especializado para colaboradores com condições crônicas e gestantes, promovendo saúde preventiva e qualidade de vida.",
  },
];

export const ProgramaExclusivo = () => {
  return (
    <Section id="programa">
      <VideoBg autoPlay muted loop playsInline>
        <source src={nurseVideo} type="video/mp4" />
      </VideoBg>
      <Overlay />
      <EdgeFade className="top" />
      <EdgeFade className="bottom" />

      <Content>
        <Inner>
          <Label
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            Serviços e Diferenciais Exclusivos
          </Label>

          <H2
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
          >
            A FRB vai além do básico
          </H2>

          <Subtitle
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
          >
            Suporte integral para a saúde e bem-estar dos seus colaboradores,
            com atendimento especializado disponível 24 horas uma gestão completa 360°.
          </Subtitle>

          <FeaturesGrid
            variants={featureVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((f, i) => (
              <FeatureCard
                key={i}
                variants={featureChild}
              >
                <IconWrap>{f.icon}</IconWrap>
                <FeatureTitle>{f.title}</FeatureTitle>
                <FeatureDesc>{f.desc}</FeatureDesc>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </Inner>
      </Content>
    </Section>
  );
};
