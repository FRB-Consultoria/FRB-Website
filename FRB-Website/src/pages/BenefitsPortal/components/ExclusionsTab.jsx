// src/pages/BenefitsPortal/components/ExclusionsTab.jsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  FiChevronLeft, FiChevronRight, FiShield, FiUser, FiUsers,
  FiEdit3, FiCheck, FiClock, FiCheckCircle, FiMail,
} from "react-icons/fi";
import { MdOutlineVerified } from "react-icons/md";
import { RiMailSendLine } from "react-icons/ri";
import { ExclusionStatusChip, EventBadge } from "./BenefitsChips";
import { api } from "../../../services/api";
import { notifySucess, notifyError } from "../../../Toastfy";
import {
  safeText, formatCPF, formatDateBR, formatDateTimeBR, safeTextRaw,
} from "../utils/benefitsFormatters";
import { daysUntil, daysUntilText, daysUntilColor } from "../utils/benefitsHelpers";

// ── Prazo editável ──
const EditableDueDate = ({ row, benefitsSelectedCompany }) => {
  const [editing, setEditing] = useState(false);
  const [dateValue, setDateValue] = useState(row.due_date || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!dateValue) { notifyError("Informe uma data válida."); return; }
    setSaving(true);
    try {
      await api.patch(`benefits/exclusions/${row.id}/due-date/`, {
        client_id: benefitsSelectedCompany,
        aviso_previo_ate: dateValue,
      });
      notifySucess("Prazo de aviso prévio atualizado!");
      setEditing(false);
    } catch (err) {
      notifyError(err?.response?.data?.detail || "Erro ao atualizar prazo.");
    } finally { setSaving(false); }
  };

  if (editing) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input type="date" value={dateValue} onChange={(e) => setDateValue(e.target.value)}
          style={{ minHeight: 34, borderRadius: 10, border: "1px solid rgba(18,59,125,0.14)", padding: "0 10px", fontSize: "0.85rem", outline: "none" }} />
        <button className="copyMiniBtn" onClick={handleSave} disabled={saving} type="button" title="Salvar">
          <FiCheck />
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <strong>{formatDateBR(row.due_date)}</strong>
      <button className="copyMiniBtn" onClick={() => setEditing(true)} type="button" title="Editar prazo">
        <FiEdit3 />
      </button>
    </div>
  );
};

// ── Histórico COMPLETO de eventos do beneficiário ──
// Exibe TODOS os eventos, sem filtro por tipo — o usuário precisa ver tudo
const ExclusionEventHistory = ({ beneficiaryId, benefitsSelectedCompany }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchEvents = useCallback(async () => {
    if (!beneficiaryId || !benefitsSelectedCompany) return;
    setLoading(true);
    try {
      const res = await api.get(`benefits/beneficiaries/${beneficiaryId}/events/`, {
        params: { client_id: benefitsSelectedCompany },
        skipGlobalLoader: true,
      });
      // Sem filtro — exibe TODOS os eventos do beneficiário
      const all = res.data?.results || res.data || [];
      setEvents(all);
    } catch { /* silencioso */ }
    finally { setLoading(false); }
  }, [beneficiaryId, benefitsSelectedCompany]);

  useEffect(() => {
    if (open && events.length === 0) fetchEvents();
  }, [open, fetchEvents, events.length]);

  return (
    <div style={{ marginTop: 12 }}>
      <button
        className="smallGhostBtn"
        type="button"
        onClick={() => setOpen((p) => !p)}
        style={{ fontSize: "0.8rem", padding: "4px 10px" }}
      >
        <FiClock />
        {open ? "Ocultar histórico" : "Ver histórico completo"}
        {events.length > 0 && ` (${events.length})`}
      </button>

      {open && (
        <div style={{ marginTop: 10 }}>
          {loading ? (
            <div className="mutedText" style={{ fontSize: "0.82rem" }}>Carregando...</div>
          ) : events.length === 0 ? (
            <div className="mutedText" style={{ fontSize: "0.82rem" }}>Nenhum evento registrado.</div>
          ) : (
            <div className="historyList" style={{ maxHeight: 340, overflowY: "auto" }}>
              {events.map((event) => (
                <div key={event.id} className="eventCard" style={{ padding: "10px 12px", marginBottom: 8 }}>
                  <div className="eventCardTop">
                    <div>
                      <strong style={{ fontSize: "0.84rem" }}>{safeText(event.title)}</strong>
                      <small style={{ display: "block", marginTop: 2 }}>
                        {safeTextRaw(event.event_type)} · {formatDateTimeBR(event.received_at)}
                      </small>
                    </div>
                    <EventBadge processedOk={event.processed_ok} />
                  </div>
                  {(event.message || event.error) && (
                    <p style={{ fontSize: "0.82rem", margin: "6px 0 0", color: event.error ? "#B42318" : "#3f4b5b" }}>
                      {safeTextRaw(event.error || event.message)}
                    </p>
                  )}
                  {event.payload && (
                    <details style={{ marginTop: 4 }}>
                      <summary className="mutedText" style={{ cursor: "pointer", fontSize: "0.78rem" }}>
                        Ver payload
                      </summary>
                      <pre className="payloadBox mono" style={{ marginTop: 6 }}>
                        {JSON.stringify(event.payload, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Modal de confirmação de reenvio de e-mail ──
const ResendConfirmModal = ({ open, row, onConfirm, onCancel }) => {
  if (!open) return null;
  const sentDate = formatDateTimeBR(row.last_exclusion_reminder_sent_at);
  return (
    <div className="confirmModalOverlay" onClick={onCancel}>
      <div className="confirmModalCard" onClick={(e) => e.stopPropagation()}>
        <div className="confirmModalHeader">
          <h3>E-mail já enviado</h3>
          <button className="confirmCloseBtn" onClick={onCancel} type="button">✕</button>
        </div>
        <div className="confirmModalBody">
          <p>
            Já foi enviado um e-mail de exclusão para{" "}
            <strong>{safeText(row.employee_name)}</strong> em{" "}
            <strong>{sentDate}</strong>.
          </p>
          <p style={{ marginTop: 12, color: "#5c6b80", fontSize: "0.92rem" }}>
            Deseja enviar novamente?
          </p>
          <div className="confirmModalActions" style={{ marginTop: 22 }}>
            <button className="outlineBtn" onClick={onCancel} type="button" style={{ width: "auto", minWidth: 120 }}>
              Cancelar
            </button>
            <button className="smallBtn confirmActionBtn" onClick={onConfirm} type="button" style={{ minWidth: 180 }}>
              <FiMail /> Sim, reenviar e-mail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Card de pessoa na exclusão ──
const ExclusionPersonCard = ({ row, isTitular, onSendReminder, onResolve, benefitsSelectedCompany }) => {
  const [resendModalOpen, setResendModalOpen] = useState(false);

  const isResolved = ["terminated", "resolved"].includes(String(row.status || "").toLowerCase());
  const daysText = !isResolved && row.due_date ? daysUntilText(row.due_date) : null;
  const daysColor = !isResolved && row.due_date ? daysUntilColor(row.due_date) : null;

  const reminderSentAt = row.last_exclusion_reminder_sent_at;
  const reminderWasSent = Boolean(reminderSentAt);

  const handleReminderClick = () => {
    if (reminderWasSent) {
      setResendModalOpen(true);
    } else {
      onSendReminder(row.id, "Enviar lembrete", benefitsSelectedCompany);
    }
  };

  const handleResendConfirm = () => {
    setResendModalOpen(false);
    onSendReminder(row.id, "Reenviar lembrete", benefitsSelectedCompany);
  };

  return (
    <>
      <ResendConfirmModal
        open={resendModalOpen}
        row={row}
        onConfirm={handleResendConfirm}
        onCancel={() => setResendModalOpen(false)}
      />

      {/*
        IMPORTANTE: não usar a classe CSS "exclusionResolved" aqui pois ela aplica
        pointer-events: none e bloqueia o botão de histórico.
        Aplicamos o visual de resolvido manualmente via style inline.
      */}
      <div
        className="exclusionPersonCard"
        data-exclusion-id={row.id}
        style={isResolved ? { opacity: 0.75, background: "rgba(34,197,94,0.03)", borderColor: "rgba(34,197,94,0.15)" } : {}}
      >
        <div className="exclusionPersonHeader">
          <div className="exclusionPersonLeft">
            <div className={`exclusionIconWrap ${isResolved ? "exclusionIconResolved" : ""}`}>
              {isTitular ? <FiShield /> : <FiUser />}
            </div>
            <div>
              <h4 className="exclusionPersonName">{safeText(row.employee_name)}</h4>
              <p className="exclusionPersonRelation">
                {isTitular
                  ? "TITULAR"
                  : `${safeText(row.relation)} · TITULAR: ${safeText(row.titular_name)}`}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <ExclusionStatusChip status={row.status} />
            {isResolved && (
              <span className="chip success">
                <FiCheckCircle style={{ fontSize: "0.85rem" }} />
                {isTitular ? "Família resolvida" : "Dependente resolvido"}
              </span>
            )}
          </div>
        </div>

        <div className="exclusionPersonGrid">
          <div className="miniInfo">
            <span>CPF</span>
            <strong>{formatCPF(row.cpf)}</strong>
          </div>
          <div className="miniInfo">
            <span>Plano</span>
            <strong>{safeText(row.plan_name)}</strong>
          </div>
          <div className="miniInfo">
            <span>Prazo</span>
            {isResolved
              ? <strong style={{ color: "#157347" }}>Resolvido</strong>
              : <EditableDueDate row={row} benefitsSelectedCompany={benefitsSelectedCompany} />
            }
          </div>

          {/* Contagem: só quando NÃO resolvido */}
          {!isResolved && daysText && (
            <div className="miniInfo">
              <span>Contagem</span>
              <strong style={{ color: daysColor }}>{daysText}</strong>
            </div>
          )}

          <div className="miniInfo">
            <span>Saúde</span>
            <strong>{safeText(row.card_number_health)}</strong>
          </div>
          <div className="miniInfo">
            <span>Dental</span>
            <strong>{safeText(row.card_number_dental)}</strong>
          </div>
          <div className="miniInfo">
            <span>E-mail</span>
            <strong style={{ textTransform: "lowercase" }}>{row.email || "-"}</strong>
          </div>
          <div className="miniInfo">
            <span>Empresa</span>
            <strong>{safeText(row.client_name)}</strong>
          </div>
          {isTitular && (
            <div className="miniInfo">
              <span>Dependentes</span>
              <strong>{row.dependent_count || 0}</strong>
            </div>
          )}
        </div>

        {/* Ações: ocultadas se resolvido, mostradas se não */}
        {!isResolved ? (
          <div className="exclusionPersonActions">
            <button
              type="button"
              onClick={handleReminderClick}
              style={{
                minHeight: 38, padding: "0 14px", fontSize: "0.85rem", borderRadius: 14,
                border: reminderWasSent ? "1px solid rgba(21,115,71,0.2)" : "1px solid var(--portal-border)",
                background: reminderWasSent ? "rgba(34,197,94,0.12)" : "#fff",
                color: reminderWasSent ? "#157347" : "var(--portal-primary)",
                fontWeight: 800, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 6,
                transition: "0.18s ease",
              }}
              title={reminderWasSent
                ? `E-mail enviado em ${formatDateTimeBR(reminderSentAt)}. Clique para reenviar.`
                : "Enviar e-mail de lembrete de exclusão"}
            >
              {reminderWasSent ? <FiCheckCircle /> : <RiMailSendLine />}
              {reminderWasSent ? "E-mail enviado" : "Enviar lembrete"}
            </button>

            <button className="smallBtn actionInlineBtn" type="button"
              onClick={() => onResolve(row.id,
                isTitular ? "Resolver exclusão da família" : "Resolver exclusão",
                benefitsSelectedCompany)}>
              <MdOutlineVerified />
              {isTitular ? "Resolver família" : "Resolver"}
            </button>
          </div>
        ) : (
          <div style={{ padding: "12px 0 4px", borderTop: "1px solid rgba(18,59,125,0.06)" }}>
            <span className="chip success" style={{ pointerEvents: "none" }}>
              <FiCheckCircle />
              {isTitular ? "Exclusão da família concluída" : "Exclusão do dependente concluída"}
            </span>
          </div>
        )}

        {/* Histórico SEMPRE visível e clicável — inclusive para resolvidos */}
        <ExclusionEventHistory
          beneficiaryId={row.id}
          benefitsSelectedCompany={benefitsSelectedCompany}
        />
      </div>
    </>
  );
};

// ── Árvore familiar de exclusão ──
const ExclusionFamilyTree = ({ titular, dependents, onSendReminder, onResolve, benefitsSelectedCompany }) => (
  <div className="exclusionFamilyCard" data-exclusion-family-id={titular?.id}>
    <div className="exclusionTreeRoot">
      <ExclusionPersonCard row={titular} isTitular
        onSendReminder={onSendReminder} onResolve={onResolve}
        benefitsSelectedCompany={benefitsSelectedCompany} />
    </div>

    {dependents.length > 0 && (
      <>
        <div className="exclusionTreeDivider">
          <FiUsers style={{ marginRight: 6 }} />
          Dependentes desta família ({dependents.length})
        </div>
        <div className="exclusionTreeDependents">
          {dependents.map((dep) => (
            <div className="exclusionTreeDepLine" key={dep.id}>
              <ExclusionPersonCard row={dep} isTitular={false}
                onSendReminder={onSendReminder} onResolve={onResolve}
                benefitsSelectedCompany={benefitsSelectedCompany} />
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);

// ── Tab principal ──
export const ExclusionsTab = ({
  exclusionRows,
  benefitsFetching,
  benefitsMeta,
  goBenefitsNextPage,
  goBenefitsPrevPage,
  sendExclusionReminder,
  markExclusionResolved,
  benefitsSelectedCompany,
  highlightExclusionId,
}) => {
  const familyTrees = useMemo(() => {
    const titulares = [];
    const dependentes = [];
    const used = new Set();

    (exclusionRows || []).forEach((row) => {
      if (String(row.beneficiary_type || "").toUpperCase() === "TITULAR") {
        titulares.push(row);
      } else {
        dependentes.push(row);
      }
    });

    const trees = [];

    titulares.forEach((tit) => {
      const deps = (tit.affected_dependents || []).map((ad) => {
        const match = dependentes.find((d) => String(d.id) === String(ad.id));
        if (match) used.add(String(match.id));
        return match || {
          id: ad.id, employee_name: ad.name, relation: ad.relation,
          cpf: ad.cpf, status: ad.status || tit.status,
          plan_name: tit.plan_name, due_date: tit.due_date,
          client_name: tit.client_name, email: "",
          card_number_health: "", card_number_dental: "",
          beneficiary_type: "DEPENDENTE", titular_name: tit.employee_name,
          last_exclusion_reminder_sent_at: null,
        };
      });
      trees.push({ titular: tit, dependents: deps });
    });

    dependentes.forEach((dep) => {
      if (!used.has(String(dep.id))) {
        trees.push({ titular: null, dependents: [dep] });
      }
    });

    return trees;
  }, [exclusionRows]);

  // Scroll e highlight quando navegado a partir de notificação
  useEffect(() => {
    if (!highlightExclusionId) return;
    setTimeout(() => {
      const el = document.querySelector(
        `[data-exclusion-id="${highlightExclusionId}"], [data-exclusion-family-id="${highlightExclusionId}"]`
      );
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("highlight-blink");
        setTimeout(() => {
          const resolveBtn = el.querySelector("button.smallBtn");
          if (resolveBtn) resolveBtn.focus();
          el.classList.remove("highlight-blink");
        }, 3000);
      }
    }, 600);
  }, [highlightExclusionId]);

  return (
    <div className="workspace">
      <div className="contentTopbar">
        <div className="pageTitle">
          <h1>Exclusões pendentes</h1>
          <p>
            Titular na raiz, dependentes abaixo. Clique em "Ver histórico completo" para ver
            todos os eventos de cada pessoa. O botão de lembrete fica verde quando o e-mail já foi enviado.
          </p>
        </div>
        <div className="statsRow">
          <div className="metaChip"><span>Total da página</span><strong>{exclusionRows.length}</strong></div>
          <div className="metaChip"><span>Total no geral</span><strong>{benefitsMeta?.count || 0}</strong></div>
          <div className="metaChip"><span>Pendentes</span>
            <strong>{exclusionRows.filter((r) => !["terminated", "resolved"].includes(String(r.status))).length}</strong>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panelHeader">
          <div>
            <h3>Fluxo de exclusões (árvore familiar)</h3>
            <p>Clique em "Ver histórico completo" em cada card para ver todos os eventos daquele beneficiário.</p>
          </div>
        </div>

        <div className="panelBody">
          {benefitsFetching ? (
            <div className="emptyState">
              <div className="loaderDots"><span /><span /><span /></div>
              Carregando exclusões...
            </div>
          ) : familyTrees.length === 0 ? (
            <div className="emptyState">Nenhuma exclusão encontrada.</div>
          ) : (
            <div className="exclusionCardGrid">
              {familyTrees.map((tree) =>
                tree.titular ? (
                  <ExclusionFamilyTree key={tree.titular.id}
                    titular={tree.titular} dependents={tree.dependents}
                    onSendReminder={sendExclusionReminder} onResolve={markExclusionResolved}
                    benefitsSelectedCompany={benefitsSelectedCompany} />
                ) : (
                  tree.dependents.map((dep) => (
                    <div className="exclusionFamilyCard" key={dep.id} data-exclusion-family-id={dep.id}>
                      <div className="exclusionTreeRoot">
                        <ExclusionPersonCard row={dep} isTitular={false}
                          onSendReminder={sendExclusionReminder} onResolve={markExclusionResolved}
                          benefitsSelectedCompany={benefitsSelectedCompany} />
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          )}

          <div className="paginationBar">
            <button className="pageBtn" disabled={!benefitsMeta?.previous} onClick={goBenefitsPrevPage} type="button">
              <FiChevronLeft /> Anterior
            </button>
            <div className="pageInfo">Página {benefitsMeta?.page || 1}</div>
            <button className="pageBtn" disabled={!benefitsMeta?.next} onClick={goBenefitsNextPage} type="button">
              Próxima <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};