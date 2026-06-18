import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1];

const Section = styled.section`
  background: var(--black);
  position: relative;
  overflow: hidden;
  padding: 0 40px 160px;

  @media (max-width: 768px) {
    padding: 0 24px 100px;
  }
`;

const TopLine = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(4, 173, 224, 0.12) 20%,
    rgba(4, 173, 224, 0.45) 50%,
    rgba(4, 173, 224, 0.12) 80%,
    transparent 100%
  );
  margin-bottom: 120px;

  @media (max-width: 768px) {
    margin-bottom: 80px;
  }
`;

const StageLight = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: min(900px, 100vw);
  height: 520px;
  background: radial-gradient(
    ellipse 55% 100% at 50% 0%,
    rgba(4, 173, 224, 0.065) 0%,
    transparent 70%
  );
  pointer-events: none;
`;

const Inner = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 100px;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 64px;
  }
`;

const Left = styled.div``;

const Label = styled(motion.p)`
  font-family: "Nunito", sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 28px;
`;

const H2 = styled(motion.h2)`
  font-family: "Nunito", sans-serif;
  font-size: clamp(44px, 5.8vw, 84px);
  font-weight: 800;
  color: var(--white);
  letter-spacing: -3px;
  line-height: 1.0;
  margin-bottom: 32px;
`;

const Sub = styled(motion.p)`
  font-family: "Nunito", sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: rgba(238, 245, 255, 0.38);
  line-height: 1.8;
  max-width: 40ch;
`;

const Right = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const StatsPanel = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  overflow: hidden;
`;

const StatCell = styled(motion.div)`
  padding: 26px 20px;
  background: rgba(4, 22, 46, 0.5);
  display: flex;
  flex-direction: column;
  gap: 7px;
  border-right: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-right: none;
  }
`;

const StatNum = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: var(--white);
  letter-spacing: -1.2px;
  line-height: 1;
`;

const StatAccent = styled.span`
  color: var(--accent);
`;

const StatDesc = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(238, 245, 255, 0.28);
  line-height: 1.4;
`;

const CTACol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PrimaryBtn = styled(motion.button)`
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  font-weight: 700;
  background: var(--accent);
  color: #020c1b;
  border: none;
  padding: 20px 32px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  width: 100%;
  letter-spacing: -0.2px;
`;

const SecondaryBtn = styled(motion.button)`
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: rgba(238, 245, 255, 0.5);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px 32px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  width: 100%;
  transition: border-color 0.3s ease, color 0.3s ease;

  &:hover {
    border-color: rgba(4, 173, 224, 0.3);
    color: rgba(238, 245, 255, 0.85);
  }
`;

const Footnote = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  color: rgba(238, 245, 255, 0.18);
  text-align: center;
  padding-top: 2px;
`;

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const statsVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const statFade = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export const CTAFinal = () => {
  return (
    <Section id="cta">
      <StageLight />
      <TopLine />

      <Inner>
        <Grid>
          <Left>
            <Label
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
            >
              Pronto para começar?
            </Label>

            <H2
              initial={{ opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.08, ease }}
            >
              Proteja quem
              <br />move tudo.
            </H2>

            <Sub
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.22, ease }}
            >
              Transforme o pacote de benefícios da sua empresa.
              Consultoria real, sem burocracia, em todo o Brasil.
            </Sub>
          </Left>

          <Right
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.14, ease }}
          >
            <StatsPanel
              variants={statsVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                { main: "50.000", suffix: "+", desc: "Vidas Assistidas" },
                { main: "10", suffix: " anos", desc: "Fundação" },
                { main: "100", suffix: "%", desc: "Nacional" },
              ].map((s) => (
                <StatCell key={s.desc} variants={statFade}>
                  <StatNum>
                    {s.main}
                    <StatAccent>{s.suffix}</StatAccent>
                  </StatNum>
                  <StatDesc>{s.desc}</StatDesc>
                </StatCell>
              ))}
            </StatsPanel>

            <CTACol>
              <PrimaryBtn
                onClick={() => scrollTo("contato")}
                whileHover={{ scale: 1.03, y: -2, boxShadow: "0 0 56px rgba(4,173,224,0.42)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                Falar com consultor
              </PrimaryBtn>
              <SecondaryBtn
                onClick={() => scrollTo("planos")}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                Conhecer os planos
              </SecondaryBtn>
              <Footnote>Sem compromisso. Atendemos todo o Brasil.</Footnote>
            </CTACol>
          </Right>
        </Grid>
      </Inner>
    </Section>
  );
};
