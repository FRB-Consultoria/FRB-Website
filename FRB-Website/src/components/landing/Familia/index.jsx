import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import familyVideo from "../../../assets/videos/family-dad-daughter.mp4";

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
    rgba(2, 12, 27, 0.96) 0%,
    rgba(4, 22, 46, 0.85) 38%,
    rgba(4, 22, 46, 0.28) 68%,
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
  max-width: 560px;

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
  font-size: clamp(32px, 4vw, 58px);
  font-weight: 800;
  line-height: 1.12;
  color: var(--white);
  margin-bottom: 24px;
  letter-spacing: -1px;
`;

const Body = styled(motion.p)`
  font-family: "Nunito", sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 1.85;
  color: rgba(238, 245, 255, 0.65);
  margin-bottom: 36px;
  max-width: 50ch;
`;

const ItemList = styled(motion.ul)`
  list-style: none;
  padding: 0;
  margin: 0 0 40px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Item = styled(motion.li)`
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: rgba(238, 245, 255, 0.85);
  padding: 11px 16px;
  border-radius: var(--radius-sm);
  background: rgba(4, 173, 224, 0.07);
  border: 1px solid rgba(4, 173, 224, 0.14);
  border-left: 3px solid var(--accent);
`;

const CTAButton = styled(motion.button)`
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: var(--black);
  background: var(--accent);
  border: none;
  padding: 15px 36px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  box-shadow: 0 0 32px rgba(4, 173, 224, 0.28);
`;

const ease = [0.16, 1, 0.3, 1];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const child = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
};

const items = [
  "Cobertura nacional com rede ampla",
  "Planos PME, empresarial e coletivo",
  "Saúde, vida e dental",
  "Gestão de benefícios sem burocracia",
];

export const Familia = () => {
  return (
    <Section id="planos">
      <VideoBg
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={familyVideo} type="video/mp4" />
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
            Planos Empresariais
          </Label>

          <H2
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
          >
            A solução certa para cada perfil de empresa
          </H2>

          <Body
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
          >
            Do MEI à grande corporação, estruturamos coberturas completas
            com acesso às melhores redes credenciadas do país.
          </Body>

          <ItemList
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {items.map((item, i) => (
              <Item key={i} variants={child}>
                {item}
              </Item>
            ))}
          </ItemList>

          <CTAButton
            onClick={() => {
              const el = document.getElementById("servicos");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.55, ease }}
            whileHover={{ scale: 1.06, y: -2, boxShadow: "0 0 48px rgba(4,173,224,0.42)" }}
            whileTap={{ scale: 0.97 }}
          >
            Ver todos os serviços
          </CTAButton>
        </Inner>
      </Content>
    </Section>
  );
};
