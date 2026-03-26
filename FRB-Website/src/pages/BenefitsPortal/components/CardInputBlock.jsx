import React from "react";
import { FiCreditCard, FiSlash, FiRotateCcw } from "react-icons/fi";

export const CardInputBlock = ({
  person,
  cardType,
  draftValue,
  onChange,
  onSave,
  onMarkMissing,
  onReactivate,
}) => {
  const isHealth = cardType === "health";
  const missingFlag = isHealth ? person.NO_HEALTH_CARD : person.NO_DENTAL_CARD;
  const label = isHealth ? "saúde" : "dental";
  const placeholder = isHealth
    ? "Digite a carteirinha de saúde"
    : "Digite a carteirinha dental";

  if (missingFlag) {
    return (
      <div className="cardTypeBlock">
        <label>{`Carteirinha ${label}`}</label>
        <div className="missingCardBox">
          <div className="missingCardInfo">
            <span className="missingBadge">
              <FiSlash />
              Não existe carteirinha {label}
            </span>
          </div>
          <button
            className="smallGhostBtn actionInlineBtn"
            onClick={() => onReactivate(person, cardType)}
            type="button"
          >
            <FiRotateCcw />
            Reativar campo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cardTypeBlock">
      <label>{`Carteirinha ${label}`}</label>
      <div className="inputActionRow">
        <input
          value={draftValue}
          onChange={(e) => onChange(person.id, cardType, e.target.value)}
          inputMode="numeric"
          maxLength={30}
          placeholder={placeholder}
        />
        <button
          className="smallBtn"
          onClick={() => onSave(person, cardType)}
          type="button"
        >
          <FiCreditCard />
          {isHealth ? "Salvar saúde" : "Salvar dental"}
        </button>
      </div>
      <button
        className="smallGhostBtn secondaryLineBtn"
        onClick={() => onMarkMissing(person, cardType)}
        type="button"
      >
        <FiSlash />
        {isHealth ? "Não existe saúde" : "Não existe dental"}
      </button>
    </div>
  );
};