// src/pages/BenefitsPortal/components/IntegrationPanel.jsx
import React, { useState, useEffect, useCallback } from "react";
import { FiCopy, FiCheck, FiRefreshCw, FiShield, FiEye, FiEyeOff, FiMail, FiPlus, FiTrash2 } from "react-icons/fi";
import { api } from "../../../services/api";
import { notifySucess, notifyError } from "../../../Toastfy";

export const IntegrationPanel = ({ benefitsSelectedCompany }) => {
  const [integration, setIntegration] = useState(null);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rotating, setRotating] = useState(false);
  // CC email management
  const [ccEmail, setCcEmail] = useState("");
  const [savingCc, setSavingCc] = useState(false);

  const fetchIntegration = useCallback(async () => {
    if (!benefitsSelectedCompany) return;
    try {
      const res = await api.get("benefits/integration/", {
        params: { client_id: benefitsSelectedCompany },
      });
      setIntegration(res.data || null);
    } catch { /* silencioso */ }
  }, [benefitsSelectedCompany]);

  useEffect(() => {
    fetchIntegration();
  }, [fetchIntegration]);

  const copyWebhookUrl = async () => {
    if (!integration?.webhook_url) return;
    try {
      await navigator.clipboard.writeText(integration.webhook_url);
      setCopied(true);
      notifySucess("URL do webhook copiada!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      notifyError("Não foi possível copiar.");
    }
  };

  const rotateKey = async () => {
    if (!benefitsSelectedCompany) return;
    if (!window.confirm("Tem certeza que deseja rotacionar a chave do webhook? A URL antiga deixará de funcionar.")) return;
    setRotating(true);
    try {
      const res = await api.post("benefits/integration/rotate-key/", {
        client_id: benefitsSelectedCompany,
      });
      setIntegration(res.data || null);
      notifySucess("Chave do webhook rotacionada com sucesso!");
    } catch {
      notifyError("Erro ao rotacionar a chave.");
    } finally {
      setRotating(false);
    }
  };

  const addCcEmail = async () => {
    const trimmed = ccEmail.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) { notifyError("Informe um e-mail válido."); return; }
    const current = integration?.company_cc_emails || [];
    if (current.includes(trimmed)) { notifyError("Este e-mail já está na lista."); return; }

    setSavingCc(true);
    try {
      const res = await api.patch("benefits/integration/", {
        client_id: benefitsSelectedCompany,
        company_cc_emails: [...current, trimmed],
      });
      setIntegration(res.data || null);
      setCcEmail("");
      notifySucess("E-mail de cópia adicionado!");
    } catch {
      notifyError("Erro ao salvar e-mail.");
    } finally {
      setSavingCc(false); }
  };

  const removeCcEmail = async (email) => {
    const current = (integration?.company_cc_emails || []).filter((e) => e !== email);
    setSavingCc(true);
    try {
      const res = await api.patch("benefits/integration/", {
        client_id: benefitsSelectedCompany,
        company_cc_emails: current,
      });
      setIntegration(res.data || null);
      notifySucess("E-mail removido.");
    } catch {
      notifyError("Erro ao remover e-mail.");
    } finally {
      setSavingCc(false);
    }
  };

  if (!integration) return null;

  const maskedId = showKey
    ? integration.public_id
    : `${String(integration.public_id).slice(0, 8)}${"•".repeat(20)}`;

  const ccEmails = integration.company_cc_emails || [];

  return (
    <div className="sideSection">
      <div className="sectionTitle">
        <FiShield style={{ marginRight: 6, verticalAlign: "middle" }} />
        Integração (Webhook)
      </div>

      {/* Chave do webhook */}
      <div className="integrationKeyBox">
        <div className="integrationKeyRow">
          <span className="integrationKeyValue">{maskedId}</span>
          <button className="integrationMiniBtn" onClick={() => setShowKey((prev) => !prev)}
            type="button" title={showKey ? "Ocultar" : "Mostrar"}>
            {showKey ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <div className="integrationActions">
          <button className="ghostBtn" onClick={copyWebhookUrl} type="button" style={{ fontSize: "0.82rem" }}>
            {copied ? <FiCheck /> : <FiCopy />}
            {copied ? "Copiado!" : "Copiar URL"}
          </button>
          <button className="dangerBtn" onClick={rotateKey} disabled={rotating} type="button" style={{ fontSize: "0.82rem" }}>
            <FiRefreshCw className={rotating ? "spinning" : ""} />
            {rotating ? "Rotacionando..." : "Rotacionar chave"}
          </button>
        </div>
      </div>

      {integration.last_used_at && (
        <div className="integrationMeta">
          Último uso: {new Date(integration.last_used_at).toLocaleString("pt-BR")}
        </div>
      )}

      {/* E-mails de cópia da empresa */}
      <div style={{ marginTop: 16 }}>
        <div className="sectionTitle" style={{ marginBottom: 8 }}>
          <FiMail style={{ marginRight: 6, verticalAlign: "middle" }} />
          Cópia de e-mails para empresa
        </div>

        <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.65)", marginBottom: 10, lineHeight: 1.5 }}>
          Toda comunicação enviada ao colaborador (carteirinhas, exclusão) chegará também nestes endereços.
        </div>

        {/* E-mails já cadastrados */}
        {ccEmails.length > 0 && (
          <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
            {ccEmails.map((email) => (
              <div key={email} className="integrationKeyRow" style={{ padding: "8px 12px" }}>
                <span className="integrationKeyValue" style={{ fontSize: "0.8rem" }}>{email}</span>
                <button className="integrationMiniBtn" onClick={() => removeCcEmail(email)} type="button"
                  title="Remover" disabled={savingCc} style={{ color: "#ff8a80" }}>
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Adicionar novo */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
          <input
            type="email"
            value={ccEmail}
            onChange={(e) => setCcEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addCcEmail(); }}
            placeholder="email@empresa.com"
            style={{
              minHeight: 38, borderRadius: 12, border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(255,255,255,0.16)", color: "#fff", padding: "0 12px",
              fontSize: "0.82rem", outline: "none",
            }}
          />
          <button className="integrationMiniBtn" onClick={addCcEmail} disabled={savingCc}
            type="button" title="Adicionar e-mail" style={{ width: 38, height: 38, borderRadius: 12 }}>
            <FiPlus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};