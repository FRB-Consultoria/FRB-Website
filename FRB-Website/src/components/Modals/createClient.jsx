import styled, { css } from "styled-components";
import { ModalBackground } from "./ModalBackground";
import { CreateClient } from "./createClientStyle";
import { AdminContext } from "../../contexts/adminContext/adminContext";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createUserSchema } from "../../schemas";
import { PERM_KEYS, PERM_LABELS, PERM_DESCRIPTIONS } from "../../utils/permissions";
import {
  FiActivity,
  FiMonitor,
  FiFileText,
  FiSettings,
  FiHeart,
  FiShield,
  FiUploadCloud,
  FiBarChart2,
  FiBookOpen,
  FiTrendingUp,
  FiAlertTriangle,
  FiCalendar,
  FiBell,
} from "react-icons/fi";

const PERM_ICONS = {
  perm_bi:                 FiActivity,
  perm_powerbi:            FiMonitor,
  perm_faturamento:        FiFileText,
  perm_faturamento_admin:  FiSettings,
  perm_benefits:           FiHeart,
  perm_benefits_billing:   FiUploadCloud,
  perm_benefits_dashboard: FiBarChart2,
  perm_admin:              FiShield,
  perm_book:               FiBookOpen,
  perm_dash_evolucao:      FiTrendingUp,
  perm_dash_divergencias:  FiAlertTriangle,
};

// ── Input base ─────────────────────────────────────────────────────────────
const inputBase = css`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13.5px;
  color: #e2e8f0;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;

  &::placeholder { color: rgba(255, 255, 255, 0.2); }

  &:focus {
    border-color: #04ade0;
    box-shadow: 0 0 0 3px rgba(4, 173, 224, 0.1);
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  @media (max-width: 540px) { grid-template-columns: 1fr; }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  &.full { grid-column: 1 / -1; }
`;

const FieldLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #475569;
`;

const ErrorMsg = styled.p`
  margin: 2px 0 0;
  font-size: 11px;
  color: #f87171;
`;

const DarkInput = styled.input`${inputBase}`;

const DarkSelect = styled.select`
  ${inputBase}
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
  option { background: #0d1525; color: #e2e8f0; }
`;

const DarkTextarea = styled.textarea`
  ${inputBase}
  height: 84px;
  resize: none;
  line-height: 1.5;
`;

const ActionsRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  padding-top: 2px;
`;

const SaveBtn = styled.button`
  background: linear-gradient(135deg, #04ade0 0%, #0284c7 100%);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 10px 28px;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: opacity 0.15s, transform 0.1s;
  &:hover { opacity: 0.88; }
  &:active { transform: scale(0.97); }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 24px 0 16px;
  &::before, &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.07);
  }
  span {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #04ade0;
    white-space: nowrap;
  }
`;

const PermContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  align-items: start;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const PermItem = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.15s, background 0.15s;
  &:hover {
    border-color: rgba(4, 173, 224, 0.28);
    background: rgba(4, 173, 224, 0.04);
  }
`;

const PermRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  user-select: none;
`;

const PermIcon = styled.span`
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(4, 173, 224, 0.1);
  color: #04ade0;
  font-size: 16px;
`;

const PermInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const PermName = styled.p`
  margin: 0;
  font-size: 13.5px;
  font-weight: 600;
  color: #e2e8f0;
  line-height: 1.3;
`;

const PermDesc = styled.p`
  margin: 3px 0 0;
  font-size: 11.5px;
  color: #7c8ba1;
  line-height: 1.45;
  white-space: normal;
`;

const Toggle = styled.button`
  flex-shrink: 0;
  width: 46px;
  height: 26px;
  border-radius: 13px;
  border: none;
  cursor: pointer;
  background: ${(p) => (p.$on ? "#04ade0" : "rgba(255,255,255,0.12)")};
  position: relative;
  transition: background 0.2s;
  &::after {
    content: "";
    position: absolute;
    top: 3px;
    left: ${(p) => (p.$on ? "23px" : "3px")};
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    transition: left 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }
  &:focus-visible {
    outline: 2px solid #04ade0;
    outline-offset: 2px;
  }
`;

const ExpandWrap = styled.div`
  max-height: ${(p) => (p.$open ? "64px" : "0")};
  overflow: hidden;
  transition: max-height 0.25s ease, padding 0.25s ease;
  padding: ${(p) => (p.$open ? "0 16px 13px" : "0 16px 0")};
`;

const LinkInput = styled.input`
  ${inputBase}
  font-size: 12.5px;
`;

// ──────────────────────────────────────────────────────────────────────────

const INITIAL_PERMS = {
  perm_bi:                 false,
  perm_powerbi:            false,
  perm_faturamento:        false,
  perm_faturamento_admin:  false,
  perm_benefits:           false,
  perm_benefits_billing:   false,
  perm_benefits_dashboard: false,
  perm_admin:              false,
  perm_book:               false,
  perm_dash_evolucao:      false,
  perm_dash_divergencias:  false,
  notify_health:           false,
  notify_dashboard:        false,
};

// Preferências de notificação por e-mail
const NOTIFY_KEYS = ["notify_health", "notify_dashboard"];
const NOTIFY_ICONS = { notify_health: FiCalendar, notify_dashboard: FiBell };
const NOTIFY_LABELS = {
  notify_health:    "Campanhas do calendário de saúde",
  notify_dashboard: "Aviso de dashboard disponível",
};
const NOTIFY_DESCS = {
  notify_health:    "Recebe por e-mail as campanhas mensais de saúde (Outubro Rosa, etc.)",
  notify_dashboard: "Recebe e-mail quando um novo dashboard de faturamento é publicado",
};

export const CreateClientModal = ({ client_id }) => {
  const { createUser } = useContext(AdminContext);
  const [perms, setPerms] = useState(INITIAL_PERMS);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(createUserSchema),
    defaultValues: { power_bi_link: "" },
  });

  const toggle = (key) => {
    setPerms((prev) => {
      const next = !prev[key];
      const update = { [key]: next };
      if (next) {
        if (key === "perm_faturamento")        update.perm_faturamento_admin  = false;
        else if (key === "perm_faturamento_admin") update.perm_faturamento    = false;
        else if (key === "perm_benefits_billing")  update.perm_benefits_dashboard = false;
        else if (key === "perm_benefits_dashboard") update.perm_benefits_billing  = false;
      }
      return { ...prev, ...update };
    });
  };

  const onSubmit = (body) => {
    createUser({ ...body, ...perms }, client_id, "Criar");
  };

  return (
    <CreateClient>
      <ModalBackground size="createClient">
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGrid>
              <Field>
                <FieldLabel>Nome</FieldLabel>
                <DarkInput
                  type="text"
                  placeholder="Nome completo"
                  {...register("name")}
                />
                {errors.name && <ErrorMsg>{errors.name.message}</ErrorMsg>}
              </Field>

              <Field>
                <FieldLabel>E-mail</FieldLabel>
                <DarkInput
                  type="email"
                  placeholder="email@empresa.com"
                  {...register("email")}
                />
                {errors.email && <ErrorMsg>{errors.email.message}</ErrorMsg>}
              </Field>

              <Field className="full">
                <FieldLabel>Nível do usuário</FieldLabel>
                <DarkSelect {...register("user_level")}>
                  <option value="">Selecione um nível</option>
                  <option value="medic">Médico</option>
                  <option value="rh">RH</option>
                  <option value="corretor">Corretor</option>
                  <option value="invoicinguser">Faturamento e Power BI</option>
                  <option value="invoicingadmin">Admin Faturamento</option>
                  <option value="benefitsadmin">Admin Benefícios</option>
                  <option value="benefitsoperator">Operador Benefícios</option>
                  <option value="admin">Admin Sistema</option>
                </DarkSelect>
              </Field>

              <Field className="full">
                <FieldLabel>Descrição</FieldLabel>
                <DarkTextarea
                  placeholder="Observações sobre este usuário"
                  {...register("description")}
                />
              </Field>

              <ActionsRow>
                <SaveBtn type="submit">Criar usuário</SaveBtn>
              </ActionsRow>
            </FormGrid>

            <Divider>
              <span>Permissões de Acesso</span>
            </Divider>

            <PermContainer>
              {PERM_KEYS.map((key) => {
                const Icon = PERM_ICONS[key];
                const isOn = perms[key];
                return (
                  <PermItem key={key}>
                    <PermRow onClick={() => toggle(key)}>
                      <PermIcon><Icon /></PermIcon>
                      <PermInfo>
                        <PermName>{PERM_LABELS[key]}</PermName>
                        <PermDesc>{PERM_DESCRIPTIONS[key]}</PermDesc>
                      </PermInfo>
                      <Toggle
                        type="button"
                        $on={isOn}
                        onClick={(e) => { e.stopPropagation(); toggle(key); }}
                        aria-pressed={isOn}
                        aria-label={`${isOn ? "Desativar" : "Ativar"} ${PERM_LABELS[key]}`}
                      />
                    </PermRow>

                    {key === "perm_powerbi" && (
                      <ExpandWrap $open={isOn}>
                        <LinkInput
                          type="text"
                          placeholder="https://app.powerbi.com/..."
                          tabIndex={isOn ? 0 : -1}
                          {...register("power_bi_link")}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </ExpandWrap>
                    )}
                  </PermItem>
                );
              })}
            </PermContainer>

            <Divider>
              <span>Notificações por E-mail</span>
            </Divider>

            <PermContainer>
              {NOTIFY_KEYS.map((key) => {
                const Icon = NOTIFY_ICONS[key];
                const isOn = perms[key];
                return (
                  <PermItem key={key}>
                    <PermRow onClick={() => toggle(key)}>
                      <PermIcon><Icon /></PermIcon>
                      <PermInfo>
                        <PermName>{NOTIFY_LABELS[key]}</PermName>
                        <PermDesc>{NOTIFY_DESCS[key]}</PermDesc>
                      </PermInfo>
                      <Toggle
                        type="button"
                        $on={isOn}
                        onClick={(e) => { e.stopPropagation(); toggle(key); }}
                        aria-pressed={isOn}
                        aria-label={`${isOn ? "Desativar" : "Ativar"} ${NOTIFY_LABELS[key]}`}
                      />
                    </PermRow>
                  </PermItem>
                );
              })}
            </PermContainer>
          </form>
        </div>
      </ModalBackground>
    </CreateClient>
  );
};
