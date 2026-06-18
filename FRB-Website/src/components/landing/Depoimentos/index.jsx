import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Section = styled(motion.section)`
  background: var(--navy);
  padding: 140px 40px;

  @media (max-width: 768px) {
    padding: 80px 24px;
  }
`;

const Container = styled.div`
  max-width: 1320px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 72px;

  @media (max-width: 768px) {
    margin-bottom: 48px;
  }
`;

const Label = styled(motion.p)`
  font-family: "Nunito", sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 16px;
`;

const H2 = styled(motion.h2)`
  font-family: "Nunito", sans-serif;
  font-size: clamp(28px, 3.5vw, 48px);
  font-weight: 800;
  color: var(--white);
  letter-spacing: -0.8px;
  line-height: 1.15;
`;

const TestimonialsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const TestimonialBlock = styled(motion.div)`
  padding: 36px 32px;
  border-radius: var(--radius-lg);
  background: rgba(4, 173, 224, 0.04);
  border: 1px solid rgba(4, 173, 224, 0.1);
  display: flex;
  flex-direction: column;
  transition: background 0.35s ease;

  &:hover {
    background: rgba(4, 173, 224, 0.09);
  }
`;

const QuoteMark = styled(motion.p)`
  font-family: "Nunito", sans-serif;
  font-size: 72px;
  font-weight: 800;
  color: var(--accent);
  opacity: 0.25;
  line-height: 0.7;
  margin-bottom: 20px;
  user-select: none;
`;

const Quote = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 17px;
  font-weight: 400;
  color: rgba(238, 245, 255, 0.85);
  line-height: 1.75;
  margin-bottom: 28px;
  flex: 1;
`;

const Attribution = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--gray);
`;

const ease = [0.16, 1, 0.3, 1];

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14 },
  },
};

const card = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.75, ease } },
};

const testimonials = [
  {
    quote:
      "Tive um problema de saúde sério e a FRB foi minha âncora. Eles resolveram em horas o que levaria semanas sozinho.",
    name: "Rodrigo M., Rio de Janeiro",
  },
  {
    quote:
      "Estruturaram o benefício para toda a minha empresa com uma atenção que nunca vi em outra corretora.",
    name: "Ana Paula S., Empresária",
  },
  {
    quote:
      "Indicaram o especialista certo no momento certo. Não sei o que seria de mim sem o programa exclusivo deles.",
    name: "Cláudia T., Paciente",
  },
];

export const Depoimentos = () => {
  return (
    <Section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Container>
        <Header>
          <Label
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            O que dizem nossos clientes
          </Label>
          <H2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.1, ease }}
          >
            Confiança construída caso a caso.
          </H2>
        </Header>

        <TestimonialsGrid
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((t, i) => (
            <TestimonialBlock
              key={i}
              variants={card}
              whileHover={{ y: -6, borderColor: "rgba(4, 173, 224, 0.25)" }}
            >
              <QuoteMark
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 0.25, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1, type: "spring", stiffness: 200 }}
              >
                "
              </QuoteMark>
              <Quote>{t.quote}</Quote>
              <Attribution>— {t.name}</Attribution>
            </TestimonialBlock>
          ))}
        </TestimonialsGrid>
      </Container>
    </Section>
  );
};
