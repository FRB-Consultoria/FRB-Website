import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1];

const Section = styled.section`
  background: var(--black);
  padding: 180px 40px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 120px 24px;
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(4, 173, 224, 0.022) 1px, transparent 1px),
      linear-gradient(90deg, rgba(4, 173, 224, 0.022) 1px, transparent 1px);
    background-size: 80px 80px;
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 140px;
    background: linear-gradient(to top, var(--black) 0%, transparent 100%);
    pointer-events: none;
    z-index: 1;
  }
`;

const Inner = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 80px;
  align-items: start;
  position: relative;
  z-index: 1;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const LeftDecor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 8px;

  @media (max-width: 900px) {
    display: none;
  }
`;

const DecorNum = styled(motion.p)`
  font-family: "Nunito", sans-serif;
  font-size: 100px;
  font-weight: 800;
  color: var(--white);
  letter-spacing: -6px;
  line-height: 1;
  user-select: none;
  margin: 0;
`;

const DecorLine = styled(motion.div)`
  width: 1px;
  min-height: 200px;
  flex: 1;
  background: linear-gradient(to bottom, rgba(4, 173, 224, 0.3), transparent);
  margin-top: 28px;
`;

const Content = styled.div``;

const Label = styled(motion.p)`
  font-family: "Nunito", sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 44px;
`;

const HeadlineLine = styled(motion.div)`
  overflow: hidden;
  margin-bottom: 4px;
  padding-bottom: 6px;
`;

const HeadlineWord = styled(motion.span)`
  display: inline-block;
  font-family: "Nunito", sans-serif;
  font-size: clamp(38px, 5vw, 70px);
  font-weight: 800;
  color: var(--white);
  letter-spacing: -1.8px;
  line-height: 1.1;
  margin-right: 0.22em;
`;

const DimWord = styled(HeadlineWord)`
  color: rgba(238, 245, 255, 0.2);
`;

const Divider = styled(motion.div)`
  width: 56px;
  height: 2px;
  background: var(--accent);
  margin: 40px 0 36px;
  transform-origin: left;
`;

const Body = styled(motion.p)`
  font-family: "Nunito", sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 1.95;
  color: rgba(238, 245, 255, 0.42);
  max-width: 54ch;
`;

const wordReveal = {
  hidden: { opacity: 0, y: "115%" },
  visible: {
    opacity: 1,
    y: "0%",
    transition: { duration: 0.72, ease },
  },
};

const line1V = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const line2V = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.22 } },
};
const line3V = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.5 } },
};
const line4V = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.72 } },
};

export const Manifesto = () => {
  return (
    <Section id="manifesto">
      <Inner>
        <LeftDecor>
          <DecorLine
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            style={{ transformOrigin: "top" }}
            transition={{ duration: 1.4, delay: 0.2, ease }}
          />
        </LeftDecor>

        <Content>
          <Label
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            Nossa Crença
          </Label>

          <HeadlineLine
            variants={line1V}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {"Saúde não é".split(" ").map((word, i) => (
              <HeadlineWord key={i} variants={wordReveal}>
                {word}
              </HeadlineWord>
            ))}
          </HeadlineLine>

          <HeadlineLine
            variants={line2V}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {"um custo.".split(" ").map((word, i) => (
              <HeadlineWord key={i} variants={wordReveal}>
                {word}
              </HeadlineWord>
            ))}
          </HeadlineLine>

          <HeadlineLine
            variants={line3V}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {"É o principal benefício".split(" ").map((word, i) => (
              <DimWord key={i} variants={wordReveal}>
                {word}
              </DimWord>
            ))}
          </HeadlineLine>

          <HeadlineLine
            variants={line4V}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {"da sua empresa.".split(" ").map((word, i) => (
              <DimWord key={i} variants={wordReveal}>
                {word}
              </DimWord>
            ))}
          </HeadlineLine>

          <Divider
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 1.05, ease }}
          />

          <Body
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.15, ease }}
          >
            Na FRB, não gerenciamos contratos. Construímos programas de
            benefícios que protegem seus colaboradores e fortalecem sua empresa.
            Com expertise, presença e cuidado real.
          </Body>
        </Content>
      </Inner>
    </Section>
  );
};
