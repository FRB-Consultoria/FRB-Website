// src/components/Modals/RhSelectModal.jsx
import { useContext } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FiBarChart2, FiExternalLink, FiFileText,
  FiPieChart, FiX, FiSettings,
  FiHeart, FiUploadCloud, FiBookOpen, FiShield,
} from "react-icons/fi";
import { UserContext } from "../../contexts/userContext/userContext";

const fadeIn = keyframes`from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}`;

const Overlay = styled.div`
  position: fixed; inset: 0; z-index: 1300;
  background: rgba(0,0,0,.8);
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
  backdrop-filter: blur(8px);
`;
const Card = styled.div`
  background: #0d1525;
  border: 1px solid rgba(4,173,224,.28);
  border-radius: 22px;
  padding: 40px 36px;
  width: 100%; max-width: 560px;
  max-height: 90vh;
  max-height: 90dvh;        /* iOS: respeita a barra do Safari */
  overflow-y: auto;          /* rola por dentro em vez de cortar */
  animation: ${fadeIn} .24s ease;
  box-shadow: 0 40px 100px rgba(0,0,0,.75);
  @media (max-width: 600px) {
    padding: 22px 18px;
    border-radius: 18px;
  }
`;
const Top = styled.div`
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 6px;
`;
const CloseBtn = styled.button`
  background: transparent; border: none; cursor: pointer;
  color: rgba(255,255,255,.3); padding: 4px; border-radius: 8px;
  transition: all .15s; flex-shrink: 0;
  &:hover { color: #fff; background: rgba(255,255,255,.08); }
`;
const Badge = styled.div`
  font-size: .7rem; color: #04ade0;
  font-weight: 700; letter-spacing: .1em;
  text-transform: uppercase; margin-bottom: 8px;
`;
const Title = styled.h2`
  font-size: 1.3rem; font-weight: 800; color: #fff; margin: 0 0 8px;
  @media (max-width: 600px) { font-size: 1.1rem; }
`;
const Sub = styled.p`
  font-size: .87rem; color: rgba(255,255,255,.4);
  margin: 0 0 28px; line-height: 1.55;
  @media (max-width: 600px) { font-size: .82rem; margin: 0 0 18px; }
`;
const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${p => p.$count}, 1fr);
  gap: 14px;
  @media (max-width: 600px) { grid-template-columns: 1fr; gap: 10px; }
`;
const OptionCard = styled.button`
  display: flex; flex-direction: column; align-items: center;
  gap: 12px; padding: 24px 14px;
  background: rgba(255,255,255,.04);
  border: 2px solid ${p => p.$accent ? "rgba(4,173,224,.35)" : "rgba(255,255,255,.1)"};
  border-radius: 16px; cursor: pointer;
  transition: all .18s;
  &:hover {
    background: ${p => p.$accent ? "rgba(4,173,224,.1)" : "rgba(255,255,255,.07)"};
    border-color: ${p => p.$accent ? "#04ade0" : "rgba(255,255,255,.28)"};
    transform: translateY(-3px);
  }
  /* Celular: vira uma linha compacta (ícone à esquerda, texto à direita). */
  @media (max-width: 600px) {
    flex-direction: row; align-items: center; text-align: left;
    gap: 14px; padding: 14px 16px;
    &:hover { transform: none; }
    & > div { flex: 1; min-width: 0; }
  }
`;
const OptionIcon = styled.div`
  width: 52px; height: 52px; border-radius: 14px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: ${p => p.$bg};
  color: ${p => p.$color};
  font-size: 1.4rem;
  @media (max-width: 600px) { width: 44px; height: 44px; font-size: 1.2rem; }
`;
const OptionLabel = styled.div`
  font-size: .9rem; font-weight: 700; color: #fff; text-align: center;
  @media (max-width: 600px) { text-align: left; }
`;
const OptionSub = styled.div`
  font-size: .72rem; color: rgba(255,255,255,.38);
  text-align: center; line-height: 1.4;
  @media (max-width: 600px) { text-align: left; }
`;
export const RhSelectModal = ({ onClose, onSelectPowerBi, powerBiLink, userName }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const firstName = userName ? userName.split(" ")[0] : "usuário";

  // O que aparece é decidido SOMENTE pela permissão (switch) do usuário —
  // igual para RH, médico e corretor. Sem condições extras de dados.
  const options = [
    // BI · FRB Consultoria · gateado por perm_bi
    user?.perm_bi && {
      key:    "bi",
      label:  "BI",
      sub:    "Painéis FRB Consultoria",
      icon:   <FiPieChart />,
      bg:     "rgba(4,173,224,.15)",
      color:  "#04ade0",
      accent: true,
      action: () => { onClose(); navigate("/bi"); },
    },

    // Power BI legado · gateado por perm_powerbi E link configurado
    user?.perm_powerbi && powerBiLink && {
      key:    "pbi",
      label:  "Power BI",
      sub:    "Relatório Microsoft Power BI",
      icon:   <FiExternalLink />,
      bg:     "rgba(240,180,0,.12)",
      color:  "#f0b400",
      accent: false,
      action: () => { onSelectPowerBi(); onClose(); },
    },

    // Portal Benefícios · gateado por perm_benefits
    user?.perm_benefits && {
      key:    "benefits",
      label:  "Admin Inclusão de Beneficiários",
      sub:    "Inclusão e exclusão de beneficiários",
      icon:   <FiHeart />,
      bg:     "rgba(0,212,140,.12)",
      color:  "#00d48c",
      accent: false,
      action: () => { onClose(); navigate("/beneficios/portal"); },
    },

    // Admin Bate-conferência · gateado por perm_benefits_billing
    user?.perm_benefits_billing && {
      key:    "benefits_billing",
      label:  "Bate-conferência",
      sub:    "Upload, organização e análise de faturas",
      icon:   <FiUploadCloud />,
      bg:     "rgba(139,92,246,.12)",
      color:  "#a78bfa",
      accent: false,
      action: () => { onClose(); navigate("/beneficios/faturamento"); },
    },

    // Dashboard Faturamento Benefícios · gateado por perm_benefits_dashboard OU perm_benefits_billing (processador tem acesso total)
    (user?.perm_benefits_dashboard || user?.perm_benefits_billing) && {
      key:    "benefits_dashboard",
      label:  "Dashboard Faturamento",
      sub:    "Análise analítica do faturamento",
      icon:   <FiBarChart2 />,
      bg:     "rgba(4,173,224,.15)",
      color:  "#04ade0",
      accent: true,
      action: () => { onClose(); navigate("/beneficios/faturamento/dashboard"); },
    },

    // Faturamento Vida · gateado por perm_faturamento E contrato de vida
    user?.perm_faturamento && {
      key:    "vida",
      label:  "Faturamento Vida",
      sub:    "Envio e acompanhamento da fatura de vida",
      icon:   <FiFileText />,
      bg:     "rgba(0,212,140,.12)",
      color:  "#00d48c",
      accent: false,
      action: () => { onClose(); navigate("/faturamento"); },
    },

    // Admin Faturamento · gateado por perm_faturamento_admin (exclusivo com perm_faturamento)
    user?.perm_faturamento_admin && {
      key:    "fat_admin",
      label:  "Admin Faturamento",
      sub:    "Gestão administrativa de faturas",
      icon:   <FiSettings />,
      bg:     "rgba(139,92,246,.12)",
      color:  "#8b5cf6",
      accent: false,
      action: () => { onClose(); navigate("/faturamento/admin"); },
    },

    // Book de Entregas · gateado pelo switch perm_book (ou admin)
    (user?.perm_book || user?.perm_admin) && {
      key:    "book",
      label:  "Book de Entregas",
      sub:    "Resumo das entregas e atividades do período",
      icon:   <FiBookOpen />,
      bg:     "rgba(52,211,153,.12)",
      color:  "#34d399",
      accent: false,
      action: () => { onClose(); navigate("/beneficios/book"); },
    },

    // Admin do Sistema · gateado por perm_admin (clientes, usuários, notificações)
    user?.perm_admin && {
      key:    "admin",
      label:  "Admin do Sistema",
      sub:    "Clientes, usuários e Central de Notificações",
      icon:   <FiShield />,
      bg:     "rgba(239,68,68,.12)",
      color:  "#f87171",
      accent: false,
      action: () => { onClose(); navigate("/admin"); },
    },
  ].filter(Boolean);

  return (
    <Overlay onClick={e => e.target === e.currentTarget && onClose()}>
      <Card>
        <Top>
          <div>
            <Badge>Portal FRB · Área do Cliente</Badge>
            <Title>Olá, {firstName}! O que deseja ver?</Title>
          </div>
          <CloseBtn onClick={onClose}><FiX size={18} /></CloseBtn>
        </Top>
        <Sub>Escolha o que deseja acessar. As opções disponíveis são baseadas no seu contrato.</Sub>

        {options.length === 0 ? (
          <Sub style={{ textAlign: "center", padding: "20px 0" }}>
            Nenhum recurso configurado para o seu perfil ainda.<br />
            Fale com a FRB para liberar o acesso.
          </Sub>
        ) : (
          <OptionsGrid $count={Math.min(options.length, 3)}>
            {options.map(opt => (
              <OptionCard key={opt.key} $accent={opt.accent} onClick={opt.action}>
                <OptionIcon $bg={opt.bg} $color={opt.color}>
                  {opt.icon}
                </OptionIcon>
                <div>
                  <OptionLabel>{opt.label}</OptionLabel>
                  <OptionSub>{opt.sub}</OptionSub>
                </div>
              </OptionCard>
            ))}
          </OptionsGrid>
        )}
      </Card>
    </Overlay>
  );
};
