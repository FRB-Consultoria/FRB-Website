import React from "react";
import { FiUser, FiShield } from "react-icons/fi";
import { MdOutlineVerified } from "react-icons/md";
import { RiMailSendLine } from "react-icons/ri";
import { ExclusionStatusChip } from "./BenefitsChips";
import {
  safeText,
  formatCPF,
  formatDateBR,
} from "../utils/benefitsFormatters";

const AffectedDependents = ({ row }) => {
  if (
    !Array.isArray(row.affected_dependents) ||
    row.affected_dependents.length === 0
  ) {
    return (
      <div className="mutedText">
        {row.beneficiary_type === "TITULAR"
          ? "Nenhum dependente vinculado."
          : "Ação individual neste dependente."}
      </div>
    );
  }

  return (
    <div className="dependentsPills">
      {row.affected_dependents.map((dep) => (
        <div key={dep.id} className="dependentPill">
          <div className="dependentPillTitle">{safeText(dep.name)}</div>
          <div className="dependentPillMeta">
            <span>{safeText(dep.relation)}</span>
            <span>{formatCPF(dep.cpf)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ExclusionCard = ({
  row,
  onSendReminder,
  onResolve,
  benefitsSelectedCompany,
}) => {
  const isTitular =
    String(row.beneficiary_type || "").toUpperCase() === "TITULAR";

  return (
    <div className="exclusionCard">
      <div className="exclusionHeader">
        <div className="exclusionHeaderLeft">
          <div className="exclusionIconWrap">
            {isTitular ? <FiShield /> : <FiUser />}
          </div>
          <div>
            <h4>{safeText(row.employee_name)}</h4>
            <p>
              {isTitular
                ? "Titular com exclusão pendente"
                : `${safeText(row.relation)} · Titular: ${safeText(
                    row.titular_name
                  )}`}
            </p>
          </div>
        </div>
        <div className="exclusionHeaderRight">
          <ExclusionStatusChip status={row.status} />
        </div>
      </div>

      <div className="exclusionBody">
        <div className="exclusionInfoGrid">
          <div className="miniInfo">
            <span>Tipo</span>
            <strong>{isTitular ? "Titular" : "Dependente"}</strong>
          </div>
          <div className="miniInfo">
            <span>CPF</span>
            <strong className="mono">{formatCPF(row.cpf)}</strong>
          </div>
          <div className="miniInfo">
            <span>Plano</span>
            <strong>{safeText(row.plan_name)}</strong>
          </div>
          <div className="miniInfo">
            <span>Prazo</span>
            <strong>{formatDateBR(row.due_date)}</strong>
          </div>
          <div className="miniInfo">
            <span>Carteirinha saúde</span>
            <strong className="mono">{safeText(row.card_number_health)}</strong>
          </div>
          <div className="miniInfo">
            <span>Carteirinha dental</span>
            <strong className="mono">{safeText(row.card_number_dental)}</strong>
          </div>
          <div className="miniInfo">
            <span>Dependentes impactados</span>
            <strong>{isTitular ? safeText(row.dependent_count) : "0"}</strong>
          </div>
          <div className="miniInfo">
            <span>Empresa</span>
            <strong>{safeText(row.client_name)}</strong>
          </div>
        </div>

        <div className="impactedSection">
          <div className="impactedSectionTop">
            <h5>
              {isTitular
                ? "Dependentes desta família"
                : "Escopo da exclusão"}
            </h5>
          </div>
          <AffectedDependents row={row} />
        </div>

        <div className="exclusionActions">
          <button
            className="smallGhostBtn actionInlineBtn"
            type="button"
            onClick={() =>
              onSendReminder(row.id, "Enviar lembrete", benefitsSelectedCompany)
            }
          >
            <RiMailSendLine />
            Enviar lembrete
          </button>

          <button
            className="smallBtn actionInlineBtn"
            type="button"
            onClick={() =>
              onResolve(
                row.id,
                isTitular
                  ? "Resolver exclusão da família"
                  : "Resolver exclusão do dependente",
                benefitsSelectedCompany
              )
            }
          >
            <MdOutlineVerified />
            {isTitular ? "Resolver família" : "Resolver dependente"}
          </button>
        </div>
      </div>
    </div>
  );
};