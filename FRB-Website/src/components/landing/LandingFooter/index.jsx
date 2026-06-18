import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import logoWhite from "../../../assets/img/logoBranca.webp";

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const FooterWrapper = styled(motion.footer)`
  background: var(--navy);
  border-top: 1px solid rgba(4, 173, 224, 0.1);
`;

const Main = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 80px 40px 60px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.4fr;
  gap: 60px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 48px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    padding: 60px 24px 48px;
    gap: 40px;
  }
`;

const Col = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FooterLogo = styled.img`
  height: 36px;
  object-fit: contain;
  align-self: flex-start;
`;

const FooterDesc = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--gray);
  line-height: 1.7;
  max-width: 220px;
`;

const ColTitle = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--white);
  opacity: 0.4;
  margin-bottom: 4px;
`;

const FooterScrollLink = styled(motion.button)`
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--gray);
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  padding: 0;
  transition: color 0.3s ease;

  &:hover {
    color: var(--accent);
  }
`;

const FooterStaticLink = styled(motion.a)`
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--gray);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: var(--accent);
  }
`;

const ContactItem = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--gray);
  line-height: 1.6;
`;

const Bottom = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 24px 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px;
    gap: 10px;
  }
`;

const BottomText = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--gray);
  opacity: 0.5;
  line-height: 1.6;
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 24px;
`;

const BottomLink = styled.a`
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--gray);
  opacity: 0.5;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const ease = [0.16, 1, 0.3, 1];

const colVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const colItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const navLinks = [
  { label: "Sobre nós", id: "manifesto" },
  { label: "Planos", id: "planos" },
  { label: "Serviços", id: "servicos" },
  { label: "Programa Exclusivo", id: "programa" },
  { label: "Diferenciais", id: "diferenciais" },
  { label: "Contato", id: "contato" },
];

const products = [
  "Plano de Saúde",
  "Seguro de Vida",
  "Plano Dental",
];

export const LandingFooter = () => {
  return (
    <FooterWrapper
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease }}
    >
      <Main>
        <Col
          variants={colVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={colItem}>
            <FooterLogo src={logoWhite} alt="FRB Consultoria" />
          </motion.div>
          <motion.div variants={colItem}>
            <FooterDesc>
              Corretora especializada em saúde, vida e dental. Consultoria e
              gestão de benefícios para empresas em todo o Brasil.
            </FooterDesc>
          </motion.div>
        </Col>

        <Col
          variants={colVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={colItem}>
            <ColTitle>Navegação</ColTitle>
          </motion.div>
          
          {navLinks.map((link) => (
            <motion.div key={link.label} variants={colItem}>
              <FooterScrollLink
                onClick={() => scrollTo(link.id)}
                whileHover={{ x: 4 }}
              >
                {link.label}
              
              </FooterScrollLink>
              
            </motion.div>
            
          ))}
          
        </Col>

        <Col
          variants={colVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={colItem}>
            <ColTitle>Produtos</ColTitle>
          </motion.div>
          {products.map((p) => (
            <motion.div key={p} variants={colItem}>
              <FooterScrollLink
                onClick={() => scrollTo("servicos")}
                whileHover={{ x: 4 }}
              >
                {p}
              </FooterScrollLink>
            </motion.div>
          ))}
        </Col>

        <Col
          variants={colVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={colItem}>
            <ColTitle>Contato</ColTitle>
          </motion.div>
          <motion.div variants={colItem}>
            <ContactItem>contatoseguro@frbconsultoria.com.br</ContactItem>
          </motion.div>

          <motion.div variants={colItem}>
            <ContactItem>Av. Alm. Júlio de Sá Bierrenbach, 200 Bloco 1A · Sala 224 · Barra da Tijuca · Rio de Janeiro, RJ · 22775-028</ContactItem>
          </motion.div>

          <motion.div variants={colItem}>
            <ContactItem>Atendimento em todo o Brasil</ContactItem>
          </motion.div>
        
        </Col>
      </Main>

      <Bottom>
        <BottomText>
          © 2025 FRB Consultoria. CNPJ 22.999.233/0001-82.
        </BottomText>
        <BottomLinks>
          <BottomLink href="/politicadeprivacidade">Termos de Uso e Política de Privacidade</BottomLink>
        </BottomLinks>
      </Bottom>
    </FooterWrapper>
  );
};
