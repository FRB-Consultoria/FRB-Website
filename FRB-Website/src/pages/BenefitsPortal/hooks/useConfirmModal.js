// src/pages/BenefitsPortal/hooks/useConfirmModal.js
import { useState } from "react";

const DEFAULT_CONFIG = {
  title: "",
  message: "",
  confirmText: "Confirmar",
  cancelText: "Cancelar",
  onConfirm: null,
  variant: "primary",
  memberSelection: null,
  emailTo: null,
  onMemberToggle: null,
};

export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  const open = (cfg) => {
    setConfig({ ...DEFAULT_CONFIG, ...cfg });
    setIsOpen(true);
  };

  const close = () => {
    if (loading) return;
    setIsOpen(false);
    setConfig(DEFAULT_CONFIG);
  };

  const handleConfirm = async () => {
    if (typeof config.onConfirm !== "function") return;
    try {
      setLoading(true);
      await config.onConfirm();
      close();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { isOpen, loading, config, open, close, handleConfirm };
};