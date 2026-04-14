// src/pages/BenefitsPortal/components/BenefitsChips.jsx
import React from "react";
import {
  FiCheckCircle,
  FiClock,
  FiUserCheck,
  FiAlertTriangle,
  FiRefreshCw,
  FiUserX,
} from "react-icons/fi";
import { RiMailSendLine } from "react-icons/ri";
import { MdOutlineVerified } from "react-icons/md";
import { registrationLabelMap } from "../constants/benefitsConstants";
import { daysUntil } from "../utils/benefitsHelpers";
import { formatDateBR } from "../utils/benefitsFormatters";

export const RegistrationChip = ({ status: statusRaw }) => {
  const status = String(statusRaw || "").toLowerCase();

  if (status === "card_saved")
    return (
      <span className="chip success">
        <FiCheckCircle />
        {registrationLabelMap[status]}
      </span>
    );

  if (status === "registered_waiting_card")
    return (
      <span className="chip warning">
        <FiClock />
        {registrationLabelMap[status]}
      </span>
    );

  return (
    <span className="chip default">
      <FiUserCheck />
      {registrationLabelMap[status] || "A cadastrar"}
    </span>
  );
};

/**
 * IntakeChip — exibe avisos sobre o estado do beneficiário.
 *
 * Props:
 *   status         — campo STATUS do beneficiário
 *   avisoPrevioAte — data limite do aviso prévio (para exclusões)
 *   eventos        — array EVENTOS_RECENTES (para verificar intake_update real)
 *
 * Regras:
 *   "updated"            → só exibe se houver um evento intake_update no histórico
 *   "pending_exclusion" /
 *   "reminded"           → exibe "Aviso prévio até DD/MM/AAAA" se a data ainda não passou;
 *                          exibe "Exclusão solicitada pela empresa" se passou ou não há data
 *   "terminated"         → exibe "Demitido"
 *   "resolved"           → exibe "Exclusão resolvida"
 *   "pending"            → null (estado padrão de entrada, sem significado visual)
 */
export const IntakeChip = ({ status: statusRaw, avisoPrevioAte, eventos = [] }) => {
  const status = String(statusRaw || "").toLowerCase();

  // "updated": verificar se existe um evento real de intake_update no histórico
  if (status === "updated") {
    const hasRealUpdateEvent =
      Array.isArray(eventos) &&
      eventos.some((e) => e.event_type === "intake_update");

    if (!hasRealUpdateEvent) return null;

    return (
      <span
        className="chip default"
        title="A empresa enviou uma atualização cadastral via integração"
      >
        <FiRefreshCw style={{ fontSize: "0.85rem" }} />
        Dados atualizados pela empresa
      </span>
    );
  }

  // Exclusão com aviso prévio
  if (status === "pending_exclusion" || status === "reminded") {
    const days = daysUntil(avisoPrevioAte);

    // Tem data futura → mostrar "Aviso prévio até DD/MM/AAAA"
    if (days !== null && days >= 0) {
      const dateFormatted = formatDateBR(avisoPrevioAte);
      return (
        <span
          className="chip warning"
          title="Exclusão solicitada — prazo de aviso prévio vigente"
        >
          <FiClock style={{ fontSize: "0.85rem" }} />
          Aviso prévio até {dateFormatted}
        </span>
      );
    }

    // Data passada ou sem data → exclusão solicitada sem prazo
    return (
      <span
        className="chip danger"
        title="A empresa solicitou a exclusão deste beneficiário do plano"
      >
        <FiUserX style={{ fontSize: "0.85rem" }} />
        Exclusão solicitada pela empresa
      </span>
    );
  }

  if (status === "terminated")
    return (
      <span className="chip danger" title="Este beneficiário foi excluído do plano">
        <FiAlertTriangle style={{ fontSize: "0.85rem" }} />
        Demitido
      </span>
    );

  if (status === "resolved")
    return (
      <span className="chip success" title="A exclusão deste beneficiário foi resolvida">
        <FiCheckCircle style={{ fontSize: "0.85rem" }} />
        Exclusão resolvida
      </span>
    );

  // pending e qualquer outro estado inicial → não exibir
  return null;
};

export const ExclusionStatusChip = ({ status: statusRaw }) => {
  const status = String(statusRaw || "").toLowerCase();

  if (status === "resolved")
    return (
      <span className="chip success">
        <MdOutlineVerified />
        Resolvido
      </span>
    );

  if (status === "sent" || status === "reminded")
    return (
      <span className="chip warning">
        <RiMailSendLine />
        Lembrete enviado
      </span>
    );

  return (
    <span className="chip default">
      <FiClock />
      Pendente
    </span>
  );
};

export const EventBadge = ({ processedOk }) => {
  if (processedOk === true)
    return (
      <span className="chip success">
        <FiCheckCircle />
        OK
      </span>
    );

  if (processedOk === false)
    return (
      <span className="chip danger">
        <FiAlertTriangle />
        Erro
      </span>
    );

  return (
    <span className="chip warning">
      <FiClock />
      Pendente
    </span>
  );
};