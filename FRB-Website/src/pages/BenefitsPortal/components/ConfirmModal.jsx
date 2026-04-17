// src/pages/BenefitsPortal/components/ConfirmModal.jsx
import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export const ConfirmModal = ({ open, config, loading, onClose, onConfirm }) => {
  // State local para checkboxes de seleção de membros
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (config?.memberSelection) {
      setMembers(config.memberSelection.map((m) => ({ ...m })));
    } else {
      setMembers([]);
    }
  }, [config?.memberSelection]);

  const toggleMember = (id) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, checked: !m.checked } : m))
    );
  };

  const handleConfirm = () => {
    // Se tem memberSelection, atualizar o config antes de confirmar
    if (config?.memberSelection && config?.onMemberToggle) {
      // Sync state back to config's mutable array
      members.forEach((m) => {
        const original = config.memberSelection.find((o) => o.id === m.id);
        if (original) original.checked = m.checked;
      });
    }
    onConfirm();
  };

  if (!open) return null;

  const hasMemberSelection = members.length > 0;
  const selectedCount = members.filter((m) => m.checked).length;

  return (
    <div className="confirmModalOverlay" onClick={onClose}>
      <div className="confirmModalCard" onClick={(e) => e.stopPropagation()}>
        <div className="confirmModalHeader">
          <h3>{config.title}</h3>
          <button className="confirmCloseBtn" onClick={onClose} disabled={loading} type="button">
            <FiX />
          </button>
        </div>

        <div className="confirmModalBody">
          {hasMemberSelection ? (
            <>
              <p style={{ marginBottom: 14 }}>
                Enviar e-mail com carteirinhas para <strong>{config.emailTo || ""}</strong>?
              </p>
              <p style={{ fontSize: "0.85rem", color: "#5c6b80", marginBottom: 10 }}>
                Membros incluídos ({selectedCount} de {members.length}). Desmarque quem não deve receber neste envio.
              </p>
              <div style={{ display: "grid", gap: 8, maxHeight: 260, overflowY: "auto", marginBottom: 16 }}>
                {members.map((m) => (
                  <label
                    key={m.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: m.disabled
                        ? "1px solid rgba(200,50,50,0.2)"
                        : "1px solid rgba(18,59,125,0.1)",
                      background: m.disabled
                        ? "rgba(200,50,50,0.04)"
                        : m.checked
                        ? "rgba(34,197,94,0.06)"
                        : "#fff",
                      cursor: m.disabled ? "not-allowed" : "pointer",
                      opacity: m.disabled ? 0.75 : 1,
                      transition: "0.14s ease",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={m.checked && !m.disabled}
                      onChange={() => !m.disabled && toggleMember(m.id)}
                      disabled={m.disabled}
                      style={{ width: 18, height: 18, accentColor: "#123b7d", cursor: m.disabled ? "not-allowed" : "pointer" }}
                    />
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: "0.9rem", color: m.disabled ? "#a04040" : "#1a2a3d" }}>
                        {m.name || "-"}
                      </strong>
                      <span style={{ display: "block", fontSize: "0.78rem", color: "#7c8796" }}>
                        {m.tipo === "TITULAR" ? "Titular" : "Dependente"}
                      </span>
                      {m.noCard && (
                        <span style={{ display: "block", fontSize: "0.74rem", color: "#b84040", marginTop: 2 }}>
                          Sem carteirinha cadastrada — não pode ser incluído neste envio
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </>
          ) : (
            <p>{config.message}</p>
          )}

          <div className="confirmModalActions">
            <button className="outlineBtn" onClick={onClose} disabled={loading} type="button">
              {config.cancelText}
            </button>
            <button
              className={
                config.variant === "ghost"
                  ? "smallGhostBtn confirmActionBtn"
                  : "smallBtn confirmActionBtn"
              }
              onClick={handleConfirm}
              disabled={loading || (hasMemberSelection && selectedCount === 0)}
              type="button"
            >
              {loading ? "Confirmando..." : config.confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};