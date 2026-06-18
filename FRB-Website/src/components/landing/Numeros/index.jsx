import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Section = styled(motion.section)`
  background: var(--black);
  padding: 100px 40px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 72px 24px;
  }
`;

const TopLine = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 5%;
  right: 5%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  opacity: 0.3;
`;

const BottomLine = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 5%;
  right: 5%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  opacity: 0.3;
`;

const Container = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: 36px 24px;
  border-radius: var(--radius-md);
  background: rgba(4, 173, 224, 0.05);
  border: 1px solid rgba(4, 173, 224, 0.1);
  transition: background 0.4s ease, border-color 0.4s ease;

  &:hover {
    background: rgba(4, 173, 224, 0.1);
    border-color: rgba(4, 173, 224, 0.25);
  }
`;

const Number = styled(motion.p)`
  font-family: "Nunito", sans-serif;
  font-size: clamp(34px, 4vw, 60px);
  font-weight: 800;
  color: var(--accent);
  line-height: 1;
  margin-bottom: 12px;
  letter-spacing: -1px;
`;

const StatLabel = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(238, 245, 255, 0.4);
  line-height: 1.5;
`;

const ease = [0.16, 1, 0.3, 1];

const stats = [
  { number: "+10 anos", label: "de fundação" },
  { number: "+50.000", label: "famílias protegidas" },
  { number: "300+", label: "redes credenciadas" },
  { number: "4 produtos", label: "saúde, vida, dental, previdência" },
];

export const Numeros = () => {
  return (
    <Section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <TopLine
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease }}
      />
      <BottomLine
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2, ease }}
      />

      <Container>
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.12, ease }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <Number
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease }}
            >
              {stat.number}
            </Number>
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </Container>
    </Section>
  );
};
