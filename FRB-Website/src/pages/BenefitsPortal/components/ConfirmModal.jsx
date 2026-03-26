import React from "react";
import { FiX } from "react-icons/fi";

export const ConfirmModal = ({ open, config, loading, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="confirmModalOverlay" onClick={onClose}>
      <div
        className="confirmModalCard"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirmModalHeader">
          <h3>{config.title}</h3>
          <button
            className="confirmCloseBtn"
            onClick={onClose}
            disabled={loading}
            type="button"
          >
            <FiX />
          </button>
        </div>

        <div className="confirmModalBody">
          <p>{config.message}</p>

          <div className="confirmModalActions">
            <button
              className="outlineBtn"
              onClick={onClose}
              disabled={loading}
              type="button"
            >
              {config.cancelText}
            </button>

            <button
              className={
                config.variant === "ghost"
                  ? "smallGhostBtn confirmActionBtn"
                  : "smallBtn confirmActionBtn"
              }
              onClick={onConfirm}
              disabled={loading}
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