import React from "react";
import {
  FiCheckCircle,
  FiClock,
  FiUserCheck,
  FiAlertTriangle,
  FiInbox,
} from "react-icons/fi";
import { RiMailSendLine } from "react-icons/ri";
import { MdOutlineVerified } from "react-icons/md";
import {
  registrationLabelMap,
  intakeStatusLabelMap,
} from "../constants/benefitsConstants";

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

export const IntakeChip = ({ status: statusRaw }) => {
  const status = String(statusRaw || "").toLowerCase();

  if (status === "terminated")
    return (
      <span className="chip danger">
        <FiAlertTriangle />
        {intakeStatusLabelMap[status]}
      </span>
    );

  if (status === "pending_exclusion")
    return (
      <span className="chip warning">
        <FiClock />
        {intakeStatusLabelMap[status]}
      </span>
    );

  if (status === "resolved" || status === "updated")
    return (
      <span className="chip success">
        <FiCheckCircle />
        {intakeStatusLabelMap[status]}
      </span>
    );

  return (
    <span className="chip default">
      <FiInbox />
      {intakeStatusLabelMap[status] || "Pendente"}
    </span>
  );
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