import React from "react";
import { FiCopy, FiCheck, FiUserCheck } from "react-icons/fi";
import { RegistrationChip, IntakeChip, EventBadge } from "./BenefitsChips";
import { CardInputBlock } from "./CardInputBlock";
import { mapPerson } from "../utils/benefitsHelpers";
import { prettifyLabel } from "../constants/benefitsConstants";
import {
  formatValueByKey,
  formatDateTimeBR,
  safeText,
} from "../utils/benefitsFormatters";

// Field display order — CPF_TIT / CPF_DEP are reordered per person type at render time
const BASE_FIELDS = [
  "TIPO",
  "SUB",
  "MATRICULA",
  "NOME",
  "NOME_DO_DEPENDENTE",
  "VINCULO_FAMILIAR",
  "CARGO_DO_TITULAR",
  "CODIGO_DO_PLANO",
  "CARTEIRINHA_SAUDE",
  "CARTEIRINHA_DENTAL",
  "NO_HEALTH_CARD",
  "NO_DENTAL_CARD",
  "NUMERO_DO_DOCUMENTO",
  "NATUREZA_DA_IDENTIFICACAO",
  "ORGAO_EXPEDIDOR",
  "PAIS_EXPEDIDOR",
  "DATA_DE_EXPEDICAO",
  "SEXO",
  "ESTADO_CIVIL",
  "CASAMENTO",
  "NASCIMENTO",
  "ADMISSAO",
  "INICIO_DA_VIGENCIA",
  "NOME_DA_MAE",
  "EMAIL_DO_COLABORADOR",
  "CELULAR",
  "CEP",
  "ENDERECO_COMPLETO",
  "BAIRRO",
  "CIDADE",
  "UF",
  "TIPO_DE_CONTA",
  "BANCO",
  "AGENCIA",
  "CONTA_COM_DIGITO",
  "STATUS",
  "PLAN_REGISTRATION_STATUS",
  "REGISTERED_IN_PLAN_AT",
  "CARD_SAVED_AT",
  "AVISO_PREVIO_ATE",
  "ACTIVE",
  "CREATED_AT",
  "UPDATED_AT",
];

const InfoItem = ({ person, fieldKey, copiedKey, onCopy }) => {
  const rawValue = person?.[fieldKey];
  const formattedValue = formatValueByKey(fieldKey, rawValue);
  const copyId = `${person.id}-${fieldKey}`;

  return (
    <div className="infoBox">
      <div className="infoBoxTop">
        <span>{prettifyLabel(fieldKey)}</span>
        <button
          type="button"
          className={`copyMiniBtn ${copiedKey === copyId ? "copied" : ""}`}
          onClick={() =>
            onCopy(formattedValue === "-" ? "" : formattedValue, copyId)
          }
          title="Copiar informação"
        >
          {copiedKey === copyId ? <FiCheck /> : <FiCopy />}
        </button>
      </div>
      <strong className="valueText">{formattedValue}</strong>
    </div>
  );
};

const EventHistory = ({ events = [] }) => {
  if (!Array.isArray(events) || events.length === 0)
    return <div className="mutedText">Nenhum evento recente.</div>;

  return (
    <div className="historyList">
      {events.map((event) => (
        <div key={event.id} className="eventCard">
          <div className="eventCardTop">
            <div>
              <strong>{safeText(event.title)}</strong>
              <small>
                Tipo: <span className="mono">{safeText(event.event_type)}</span>{" "}
                · Recebido em{" "}
                <span className="mono">
                  {formatDateTimeBR(event.received_at)}
                </span>
              </small>
            </div>
            <EventBadge processedOk={event.processed_ok} />
          </div>

          {(event.message || event.error) && (
            <p>{safeText(event.error || event.message)}</p>
          )}

          {event.payload && (
            <details>
              <summary className="mutedText" style={{ cursor: "pointer" }}>
                Ver payload
              </summary>
              <pre className="payloadBox">
                {JSON.stringify(event.payload, null, 2)}
              </pre>
            </details>
          )}
        </div>
      ))}
    </div>
  );
};

export const PersonCard = ({
  personRaw,
  isRoot = false,
  copiedKey,
  onCopy,
  getCardDraftValue,
  onCardChange,
  onSaveCard,
  onMarkCardMissing,
  onReactivateCard,
  onMarkRegistered,
}) => {
  const person = mapPerson(personRaw);

  const relationText =
    person.TIPO === "DEPENDENTE"
      ? `${safeText(person.VINCULO_FAMILIAR)}${
          person.NOME_DO_DEPENDENTE ? ` · ${person.NOME_DO_DEPENDENTE}` : ""
        }`
      : "Titular da família";

  // Place own CPF first, the other CPF last
  const ownCpf = person.TIPO === "DEPENDENTE" ? "CPF_DEP" : "CPF_TIT";
  const otherCpf = person.TIPO === "DEPENDENTE" ? "CPF_TIT" : "CPF_DEP";
  const fields = [ownCpf, ...BASE_FIELDS, ...(isRoot ? ["DEPENDENT_COUNT"] : []), otherCpf];
  const uniqueFields = [...new Set(fields)].filter(
    (f) => f !== "DEPENDENTES" && f !== "EVENTOS_RECENTES"
  );

  return (
    <div className="personCard">
      <div className="personHeader">
        <div>
          <h4>{safeText(person.NOME)}</h4>
          <p>{relationText}</p>
        </div>
        <div className="personHeaderRight">
          <RegistrationChip status={person.PLAN_REGISTRATION_STATUS} />
          <IntakeChip status={person.STATUS} />
        </div>
      </div>

      <div className="personBody">
        <div className="personGrid">
          {uniqueFields.map((fieldKey) => (
            <InfoItem
              key={fieldKey}
              person={person}
              fieldKey={fieldKey}
              copiedKey={copiedKey}
              onCopy={onCopy}
            />
          ))}
        </div>

        <div className="actionsBlock">
          <div className="cardInputsGrid">
            <CardInputBlock
              person={person}
              cardType="health"
              draftValue={getCardDraftValue(person.id, "health")}
              onChange={onCardChange}
              onSave={onSaveCard}
              onMarkMissing={onMarkCardMissing}
              onReactivate={onReactivateCard}
            />
            <CardInputBlock
              person={person}
              cardType="dental"
              draftValue={getCardDraftValue(person.id, "dental")}
              onChange={onCardChange}
              onSave={onSaveCard}
              onMarkMissing={onMarkCardMissing}
              onReactivate={onReactivateCard}
            />
          </div>

          <div className="actionButtons">
            <button
              className="smallGhostBtn actionInlineBtn"
              onClick={() => onMarkRegistered(person)}
              type="button"
            >
              <FiUserCheck />
              Marcar cadastrado
            </button>
            <RegistrationChip status={person.PLAN_REGISTRATION_STATUS} />
            <IntakeChip status={person.STATUS} />
          </div>
        </div>

        <div className="historySection">
          <div className="historyTitle">
            <h5>Histórico recente</h5>
          </div>
          <EventHistory events={person.EVENTOS_RECENTES} />
        </div>
      </div>
    </div>
  );
};