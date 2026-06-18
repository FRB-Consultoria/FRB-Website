import React, { useState, useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Section = styled(motion.section)`
  background: var(--black);
  padding: 140px 40px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 80px 24px;
  }
`;

const GlowBg = styled.div`
  position: absolute;
  bottom: -200px;
  right: -200px;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(4, 173, 224, 0.07) 0%, transparent 65%);
  pointer-events: none;
`;

const Container = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 44fr 56fr;
  gap: 80px;
  align-items: start;
  position: relative;
  z-index: 1;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 56px;
  }
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionLabel = styled(motion.p)`
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
  font-size: clamp(28px, 3.5vw, 48px);
  font-weight: 800;
  color: var(--white);
  letter-spacing: -0.8px;
  line-height: 1.15;
  margin-bottom: 24px;
`;

const InfoText = styled(motion.p)`
  font-family: "Nunito", sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 1.85;
  color: rgba(238, 245, 255, 0.6);
  margin-bottom: 48px;
  max-width: 46ch;
`;

const ContactDetails = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const DetailItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const IconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: rgba(4, 173, 224, 0.1);
  border: 1px solid rgba(4, 173, 224, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  flex-shrink: 0;
`;

const DetailText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const DetailLabel = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--gray);
`;

const DetailValue = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: var(--white);
`;

const FormWrapper = styled(motion.div)`
  background: rgba(4, 173, 224, 0.04);
  border: 1px solid rgba(4, 173, 224, 0.12);
  border-radius: var(--radius-lg);
  padding: 48px 44px;

  @media (max-width: 600px) {
    padding: 32px 24px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const FieldGroup = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const FieldLabel = styled.label`
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(238, 245, 255, 0.5);
`;

const FieldInput = styled.input`
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: var(--white);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${({ $error }) => $error ? "rgba(251,113,133,0.55)" : "rgba(255,255,255,0.08)"};
  border-radius: var(--radius-sm);
  padding: 14px 18px;
  outline: none;
  transition: border-color 0.3s ease, background 0.3s ease;

  &::placeholder {
    color: rgba(238, 245, 255, 0.22);
  }

  &:focus {
    border-color: ${({ $error }) => $error ? "rgba(251,113,133,0.75)" : "rgba(4,173,224,0.5)"};
    background: ${({ $error }) => $error ? "rgba(251,113,133,0.04)" : "rgba(4,173,224,0.05)"};
  }
`;

const FieldSelect = styled.select`
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: var(--white);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${({ $error }) => $error ? "rgba(251,113,133,0.55)" : "rgba(255,255,255,0.08)"};
  border-radius: var(--radius-sm);
  padding: 14px 18px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${({ $error }) => $error ? "rgba(251,113,133,0.75)" : "rgba(4,173,224,0.5)"};
  }

  option {
    background: var(--navy);
    color: var(--white);
  }
`;

const FieldTextarea = styled.textarea`
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: var(--white);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${({ $error }) => $error ? "rgba(251,113,133,0.55)" : "rgba(255,255,255,0.08)"};
  border-radius: var(--radius-sm);
  padding: 14px 18px;
  outline: none;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.3s ease, background 0.3s ease;

  &::placeholder {
    color: rgba(238, 245, 255, 0.22);
  }

  &:focus {
    border-color: ${({ $error }) => $error ? "rgba(251,113,133,0.75)" : "rgba(4,173,224,0.5)"};
    background: ${({ $error }) => $error ? "rgba(251,113,133,0.04)" : "rgba(4,173,224,0.05)"};
  }
`;

const ErrorMsg = styled.span`
  font-family: "Nunito", sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #fb7185;
  padding-top: 1px;
`;

const SubmitButton = styled(motion.button)`
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: var(--black);
  background: var(--accent);
  border: none;
  padding: 16px 40px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  align-self: flex-start;
  box-shadow: 0 0 28px rgba(4, 173, 224, 0.25);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 0 44px rgba(4, 173, 224, 0.42);
  }
`;

const states = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC",
  "SP","SE","TO"
];

const ease = [0.16, 1, 0.3, 1];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

/* ── regex ──────────────────────────────────────────────────────── */
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_RE = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;

function maskPhone(raw) {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (!d.length) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function validate(data) {
  const errs = {};
  if (!data.name?.trim()) errs.name = "Nome é obrigatório";
  if (!data.email?.trim()) {
    errs.email = "E-mail é obrigatório";
  } else if (!EMAIL_RE.test(data.email.trim())) {
    errs.email = "E-mail inválido (ex: voce@empresa.com.br)";
  }
  if (data.tel && !PHONE_RE.test(data.tel)) {
    errs.tel = "Telefone inválido — use (XX) XXXXX-XXXX";
  }
  if (!data.estado) errs.estado = "Selecione um estado";
  if (!data.description?.trim()) errs.description = "Mensagem é obrigatória";
  return errs;
}

export const Contato = () => {
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const handlePhone = (e) => setPhone(maskPhone(e.target.value));

  const handleSubmit = (e) => {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(formRef.current));
    const errs = validate({ ...raw, tel: phone });
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      formRef.current.submit();
    }
  };

  const clearError = (field) =>
    setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });

  return (
    <Section
      id="contato"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <GlowBg />

      <Container>
        <InfoBlock>
          <SectionLabel
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            Fale Conosco
          </SectionLabel>

          <H2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.1, ease }}
          >
            Comece agora a transformação que a sua empresa precisa
          </H2>

          <InfoText
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
          >
            Preencha o formulário e nossa equipe entrará em contato para
            encontrar a melhor solução para sua empresa.
          </InfoText>

          <ContactDetails
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <DetailItem variants={item}>
              <IconWrap>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
              </IconWrap>
              <DetailText>
                <DetailLabel>Endereço</DetailLabel>
                <DetailValue>Av. Alm. Júlio de Sá Bierrenbach, 200 Bloco 1A · Sala 224 · Barra da Tijuca · Rio de Janeiro, RJ · 22775-028</DetailValue>
              </DetailText>
            </DetailItem>

            <DetailItem variants={item}>
              <IconWrap>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
              </IconWrap>
              <DetailText>
                <DetailLabel>E-mail</DetailLabel>
                <DetailValue>contatoseguro@frbconsultoria.com.br</DetailValue>
              </DetailText>
            </DetailItem>

            <DetailItem variants={item}>
              <IconWrap>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </IconWrap>
              <DetailText>
                <DetailLabel>Atendimento</DetailLabel>
                <DetailValue>Todo o Brasil</DetailValue>
              </DetailText>
            </DetailItem>
          </ContactDetails>
        </InfoBlock>

        <FormWrapper
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.15, ease }}
        >
          <Form
            ref={formRef}
            action="https://formsubmit.co/contatoseguro@frbconsultoria.com.br"
            method="POST"
            onSubmit={handleSubmit}
            noValidate
          >
            <Row>
              <FieldGroup
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2, ease }}
              >
                <FieldLabel htmlFor="name">Nome</FieldLabel>
                <FieldInput
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Seu nome"
                  $error={!!errors.name}
                  onChange={() => clearError("name")}
                />
                {errors.name && <ErrorMsg>{errors.name}</ErrorMsg>}
              </FieldGroup>

              <FieldGroup
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.28, ease }}
              >
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <FieldInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder="voce@empresa.com.br"
                  $error={!!errors.email}
                  onChange={() => clearError("email")}
                />
                {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}
              </FieldGroup>
            </Row>

            <Row>
              <FieldGroup
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.36, ease }}
              >
                <FieldLabel htmlFor="tel">Telefone</FieldLabel>
                <FieldInput
                  id="tel"
                  name="tel"
                  type="tel"
                  placeholder="(21) 99999-9999"
                  value={phone}
                  $error={!!errors.tel}
                  onChange={(e) => { handlePhone(e); clearError("tel"); }}
                  inputMode="numeric"
                />
                {errors.tel && <ErrorMsg>{errors.tel}</ErrorMsg>}
              </FieldGroup>

              <FieldGroup
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.44, ease }}
              >
                <FieldLabel htmlFor="estado">Estado</FieldLabel>
                <FieldSelect
                  id="estado"
                  name="estado"
                  defaultValue=""
                  $error={!!errors.estado}
                  onChange={() => clearError("estado")}
                >
                  <option value="" disabled>Selecione</option>
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </FieldSelect>
                {errors.estado && <ErrorMsg>{errors.estado}</ErrorMsg>}
              </FieldGroup>
            </Row>

            <FieldGroup
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.52, ease }}
            >
              <FieldLabel htmlFor="description">Mensagem</FieldLabel>
              <FieldTextarea
                id="description"
                name="description"
                placeholder="Sobre o que deseja falar?"
                $error={!!errors.description}
                onChange={() => clearError("description")}
              />
              {errors.description && <ErrorMsg>{errors.description}</ErrorMsg>}
            </FieldGroup>

            <input type="hidden" name="_subject" value="Novo contato pelo site FRB Consultoria" />
            <input type="hidden" name="_honey" />
            <input type="hidden" name="_next" value="https://frbconsultoria.com.br/contato/obrigadopelocontato" />
            <input type="hidden" name="_captcha" value="false" />

            <SubmitButton
              type="submit"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
            >
              Enviar mensagem
            </SubmitButton>
          </Form>
        </FormWrapper>
      </Container>
    </Section>
  );
};
