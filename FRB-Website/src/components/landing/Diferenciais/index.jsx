import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Section = styled.section`
  background: var(--black);
  padding: 140px 40px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 80px 24px;
  }
`;

const TopEdge = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(to bottom, var(--black) 0%, transparent 100%);
  pointer-events: none;
  z-index: 1;
`;

const Container = styled.div`
  max-width: 1320px;
  margin: 0 auto;
`;

const HeaderRow = styled.div`
  margin-bottom: 72px;

  @media (max-width: 600px) {
    margin-bottom: 48px;
  }
`;

const HeaderTop = styled(motion.div)`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 0;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionLabel = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  color: var(--accent);
`;

const H2 = styled.h2`
  font-family: "Nunito", sans-serif;
  font-size: clamp(30px, 3.8vw, 52px);
  font-weight: 800;
  color: var(--white);
  letter-spacing: -0.8px;
  line-height: 1.1;
`;

const PanelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const Panel = styled(motion.article)`
  padding: 40px 32px;
  border-radius: var(--radius-lg);
  background: rgba(4, 173, 224, 0.04);
  border: 1px solid rgba(4, 173, 224, 0.1);
  border-top: 3px solid var(--accent);
  position: relative;
  overflow: hidden;
  transition: background 0.4s ease;

  &:hover {
    background: rgba(4, 173, 224, 0.08);
  }
`;

const PanelNumber = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 90px;
  font-weight: 800;
  color: var(--accent);
  opacity: 0.08;
  line-height: 1;
  margin-bottom: -26px;
  user-select: none;
  letter-spacing: -4px;
`;

const PanelTitle = styled.h3`
  font-family: "Nunito", sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: var(--white);
  margin-bottom: 14px;
  position: relative;
  line-height: 1.25;
  letter-spacing: -0.3px;
`;

const PanelBody = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: var(--gray);
  line-height: 1.75;
`;

const ease = [0.16, 1, 0.3, 1];

const panels = [
  {
    num: "01",
    title: "Consultoria real, não venda",
    body: "Analisamos o perfil da sua empresa e recomendamos o plano mais adequado para o seu time.",
  },
  {
    num: "02",
    title: "Relacionamento de longo prazo",
    body: "Estamos presentes na contratação, na utilização e na renovação. Do início ao fim.",
  },
  {
    num: "03",
    title: "Expertise em saúde corporativa",
    body: "Gestão de benefícios para empresas de todos os tamanhos, com relatórios e suporte contínuo.",
  },
];

export const Diferenciais = () => {
  return (
    <Section id="diferenciais">
      <TopEdge />
      <Container>
        <HeaderRow>
          <HeaderTop
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <HeaderLeft>
              <SectionLabel>Por que a FRB?</SectionLabel>
              <H2>Diferenciais</H2>
            </HeaderLeft>
          </HeaderTop>
        </HeaderRow>

        <PanelsGrid>
          {panels.map((p, i) => (
            <Panel
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: i * 0.14, ease }}
              whileHover={{ y: -6 }}
            >
              <PanelNumber>{p.num}</PanelNumber>
              <PanelTitle>{p.title}</PanelTitle>
              <PanelBody>{p.body}</PanelBody>
            </Panel>
          ))}
        </PanelsGrid>
      </Container>
    </Section>
  );
};
