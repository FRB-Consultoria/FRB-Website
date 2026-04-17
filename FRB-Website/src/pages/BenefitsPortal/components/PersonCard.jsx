// src/pages/BenefitsPortal/components/PersonCard.jsx
import React from "react";
import { FiCopy, FiCheck, FiUserCheck, FiMail, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { RegistrationChip, IntakeChip, EventBadge } from "./BenefitsChips";
import { CardInputBlock } from "./CardInputBlock";
import { mapPerson, isPersonComplete, getPersonPendingReasons } from "../utils/benefitsHelpers";
import { prettifyLabel } from "../constants/benefitsConstants";
import {
  formatValueByKey,
  formatDateTimeBR,
  safeText,
  safeTextRaw,
  isValidCardNumber,
} from "../utils/benefitsFormatters";

// Eventos que pertencem APENAS ao contexto de exclusão
const EXCLUSION_ONLY_EVENTS = [
  "intake_exclude", "reminder_sent", "terminated",
  "aviso_previo_updated", "manual_reminder", "bulk_reminder",
];

const BASE_FIELDS = [
  "TIPO", "SUB", "MATRICULA", "NOME", "NOME_DO_DEPENDENTE",
  "VINCULO_FAMILIAR", "CARGO_DO_TITULAR", "CODIGO_DO_PLANO",
  "CARTEIRINHA_SAUDE", "CARTEIRINHA_DENTAL", "NO_HEALTH_CARD", "NO_DENTAL_CARD",
  "NUMERO_DO_DOCUMENTO", "NATUREZA_DA_IDENTIFICACAO", "ORGAO_EXPEDIDOR",
  "PAIS_EXPEDIDOR", "DATA_DE_EXPEDICAO", "SEXO", "ESTADO_CIVIL", "CASAMENTO",
  "NASCIMENTO", "ADMISSAO", "INICIO_DA_VIGENCIA", "NOME_DA_MAE",
  "EMAIL_DO_COLABORADOR", "CELULAR", "CEP", "ENDERECO_COMPLETO", "BAIRRO",
  "CIDADE", "UF", "TIPO_DE_CONTA", "BANCO", "AGENCIA", "CONTA_COM_DIGITO",
  "STATUS", "PLAN_REGISTRATION_STATUS", "REGISTERED_IN_PLAN_AT",
  "CARD_SAVED_AT", "LAST_CARD_EMAIL_SENT_AT", "AVISO_PREVIO_ATE", "ACTIVE", "CREATED_AT", "UPDATED_AT",
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
          onClick={() => onCopy(formattedValue === "-" ? "" : formattedValue, copyId)}
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
                Tipo: {safeTextRaw(event.event_type)} · Recebido em {formatDateTimeBR(event.received_at)}
              </small>
            </div>
            <EventBadge processedOk={event.processed_ok} />
          </div>
          {(event.message || event.error) && (
            <p>{safeTextRaw(event.error || event.message)}</p>
          )}
          {event.payload && (
            <details>
              <summary className="mutedText" style={{ cursor: "pointer" }}>Ver payload</summary>
              <pre className="payloadBox">{JSON.stringify(event.payload, null, 2)}</pre>
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
  onSendCardEmail,
  familyColor,
}) => {
  const person = mapPerson(personRaw);
  const isTitular = String(person.TIPO || "").toUpperCase() !== "DEPENDENTE";

  const relationText = !isTitular
    ? `${safeText(person.VINCULO_FAMILIAR)}${person.NOME_DO_DEPENDENTE ? ` · ${safeText(person.NOME_DO_DEPENDENTE)}` : ""}`
    : "TITULAR DA FAMÍLIA";

  const ownCpf = !isTitular ? "CPF_DEP" : "CPF_TIT";
  const otherCpf = !isTitular ? "CPF_TIT" : "CPF_DEP";
  const fields = [ownCpf, ...BASE_FIELDS, ...(isRoot ? ["DEPENDENT_COUNT"] : []), otherCpf];
  const uniqueFields = [...new Set(fields)].filter(
    (f) => f !== "DEPENDENTES" && f !== "EVENTOS_RECENTES"
  );

  // ── Passos do fluxo ──────────────────────────────────────────────────────────
  const planStatus = String(person.PLAN_REGISTRATION_STATUS || "").toLowerCase();
  const isRegistered = planStatus !== "to_register"; // Passo 1 concluído
  const hasEmail = Boolean(person.EMAIL_DO_COLABORADOR);
  const healthCard = String(person.CARTEIRINHA_SAUDE || "").trim();
  const dentalCard = String(person.CARTEIRINHA_DENTAL || "").trim();
  const healthOk = isValidCardNumber(healthCard) || Boolean(person.NO_HEALTH_CARD);
  const dentalOk = isValidCardNumber(dentalCard) || Boolean(person.NO_DENTAL_CARD);
  const allCardsHandled = healthOk && dentalOk;        // Passo 2 concluído
  const canSendEmail = isTitular && hasEmail && allCardsHandled;

  // Motivo de bloqueio do botão de e-mail (para o title/tooltip)
  const emailBlockReason = !hasEmail
    ? "Titular sem e-mail cadastrado"
    : !healthOk && !dentalOk
    ? "Carteirinhas de saúde e dental não cadastradas nem marcadas como inexistentes"
    : !healthOk
    ? "Carteirinha de saúde não cadastrada nem marcada como inexistente"
    : !dentalOk
    ? "Carteirinha dental não cadastrada nem marcada como inexistente"
    : null;

  // Pendências específicas de carteirinha desta pessoa
  const cardPendingReasons = getPersonPendingReasons(person);
  const personComplete = isPersonComplete(person);

  // Titular: e-mail pendente quando carteirinhas OK mas e-mail não enviado
  const emailPending = isTitular && personComplete && !Boolean(person.LAST_CARD_EMAIL_SENT_AT);

  // Conclusão completa
  const isFullyComplete = personComplete && (isTitular ? Boolean(person.LAST_CARD_EMAIL_SENT_AT) : true);

  // Eventos reais disponíveis no card (para IntakeChip verificar intake_update)
  const eventosRecentes = person.EVENTOS_RECENTES || [];

  return (
    <div className="personCard" data-person-id={person.id}>
      {/* Cabeçalho — chips de status ficam SOMENTE aqui */}
      <div className="personHeader">
        <div>
          <h4>{safeText(person.NOME)}</h4>
          <p>{relationText}</p>
        </div>
        <div className="personHeaderRight">
          <RegistrationChip status={person.PLAN_REGISTRATION_STATUS} />
          {/* IntakeChip recebe os eventos reais e a data de aviso prévio */}
          <IntakeChip
            status={person.STATUS}
            avisoPrevioAte={person.AVISO_PREVIO_ATE}
            eventos={eventosRecentes}
          />
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
          {/* ── Passo 1: Marcar como cadastrado ── */}
          {!isRegistered && (
            <div className="registrationStep">
              <div className="stepBadge stepBadge1">Passo 1</div>
              <p className="stepDesc">Marque o colaborador como cadastrado na operadora para liberar o preenchimento das carteirinhas.</p>
              <div className="actionButtons">
                <button
                  className="smallGhostBtn actionInlineBtn"
                  onClick={() => onMarkRegistered(person)}
                  type="button"
                >
                  <FiUserCheck /> Marcar cadastrado
                </button>
              </div>
            </div>
          )}

          {/* ── Passo 2 + 3: Carteirinhas e envio de e-mail (só após cadastrado) ── */}
          {isRegistered && (
            <>
              {/* Badge de cadastrado */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span className="chip success" style={{ pointerEvents: "none" }}>
                  <FiUserCheck /> {isTitular ? "Titular cadastrado" : "Dependente cadastrado"}
                </span>
              </div>

              {/* Inputs de carteirinha */}
              <div className="registrationStep">
                <div className="stepBadge stepBadge2">Passo 2</div>
                <p className="stepDesc">Preencha as carteirinhas ou marque-as como inexistentes neste plano.</p>
                <div className="cardInputsGrid">
                  <div data-person-id={person.id} data-card-type="health">
                    <CardInputBlock
                      person={person}
                      cardType="health"
                      draftValue={getCardDraftValue(person.id, "health")}
                      onChange={onCardChange}
                      onSave={onSaveCard}
                      onMarkMissing={onMarkCardMissing}
                      onReactivate={onReactivateCard}
                    />
                  </div>
                  <div data-person-id={person.id} data-card-type="dental">
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
                </div>
              </div>

              {/* Pendências específicas de carteirinha */}
              {cardPendingReasons.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                  {cardPendingReasons.map((reason, i) => (
                    <span key={i} className="chip warning">
                      <FiAlertTriangle style={{ fontSize: "0.8rem" }} />
                      {reason}
                    </span>
                  ))}
                </div>
              )}

              {/* Passo 3: Enviar e-mail (só para titular, aparece após ambas as carteirinhas) */}
              {isTitular && (
                <div className="registrationStep" style={{ marginTop: 10, opacity: allCardsHandled ? 1 : 0.6 }}>
                  <div className={`stepBadge ${allCardsHandled ? "stepBadge3Active" : "stepBadge3"}`}>Passo 3</div>
                  <p className="stepDesc">
                    {allCardsHandled
                      ? "Carteirinhas prontas. Envie o e-mail para o colaborador."
                      : emailBlockReason}
                  </p>
                  <div className="actionButtons">
                    <button
                      className="smallBtn actionInlineBtn"
                      onClick={() => onSendCardEmail && onSendCardEmail(person)}
                      disabled={!canSendEmail}
                      type="button"
                      title={emailBlockReason || "Enviar e-mail com carteirinhas (titular + dependentes)"}
                    >
                      <FiMail /> Enviar carteirinhas
                    </button>
                  </div>
                </div>
              )}

              {/* E-mail pendente — somente no titular quando carteirinhas OK */}
              {emailPending && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                  <span className="chip warning">
                    <FiMail style={{ fontSize: "0.8rem" }} />
                    E-mail de carteirinhas não enviado
                  </span>
                </div>
              )}

              {/* Conclusão — aparece quando tudo está resolvido */}
              {isFullyComplete && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                  <span className="chip success">
                    <FiCheckCircle style={{ fontSize: "0.8rem" }} />
                    {isTitular ? "Cadastro e e-mail concluídos" : "Cadastro concluído"}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="historySection">
          <div className="historyTitle">
            <h5>Histórico recente</h5>
          </div>
          <EventHistory
            events={eventosRecentes.filter(
              (e) => !EXCLUSION_ONLY_EVENTS.includes(e.event_type)
            )}
          />
        </div>
      </div>
    </div>
  );
};