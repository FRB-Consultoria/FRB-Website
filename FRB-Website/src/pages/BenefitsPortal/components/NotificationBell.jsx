// src/pages/BenefitsPortal/components/NotificationBell.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiBell, FiCheck, FiCheckCircle, FiUserPlus, FiRefreshCw, FiUserX, FiCircle } from "react-icons/fi";
import { api } from "../../../services/api";
import { notifyError } from "../../../Toastfy";

const POLL_INTERVAL = 30000;

// Eventos que exigem ação do operador
const ACTIONABLE_EVENT_TYPES = ["intake_create", "intake_update", "intake_exclude"];

const eventIcon = (eventType) => {
  if (eventType === "intake_create") return <FiUserPlus size={14} />;
  if (eventType === "intake_update") return <FiRefreshCw size={14} />;
  if (eventType === "intake_exclude") return <FiUserX size={14} />;
  return null;
};

const eventColor = (eventType) => {
  if (eventType === "intake_exclude") return { bg: "rgba(244,67,54,0.1)", color: "#b42318" };
  if (eventType === "intake_update") return { bg: "rgba(245,158,11,0.1)", color: "#a15c00" };
  return { bg: "rgba(18,59,125,0.08)", color: "#123b7d" };
};

const isActionable = (n) => {
  const et = n.metadata?.event_type;
  if (!et) return true;
  return ACTIONABLE_EVENT_TYPES.includes(et);
};

export const NotificationBell = ({
  benefitsSelectedCompany,
  onNavigateToBeneficiary,
  onNavigateToExclusion,
}) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [fetchingList, setFetchingList] = useState(false);
  const [activeTab, setActiveTab] = useState("pending"); // "pending" | "done"
  const dropdownRef = useRef(null);
  const intervalRef = useRef(null);

  const fetchCount = useCallback(async () => {
    if (!benefitsSelectedCompany) return;
    try {
      const res = await api.get("benefits/notifications/count/", {
        params: { client_id: benefitsSelectedCompany },
        skipGlobalLoader: true,
      });
      setUnreadCount(res.data?.unread_count || 0);
    } catch { /* silencioso */ }
  }, [benefitsSelectedCompany]);

  const fetchNotifications = useCallback(async () => {
    if (!benefitsSelectedCompany) return;
    setFetchingList(true);
    try {
      const res = await api.get("benefits/notifications/", {
        params: { client_id: benefitsSelectedCompany },
      });
      const all = res.data?.results || res.data || [];
      setNotifications(all.filter(isActionable));
    } catch {
      notifyError("Erro ao carregar notificações.");
    } finally {
      setFetchingList(false);
    }
  }, [benefitsSelectedCompany]);

  useEffect(() => {
    fetchCount();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetchCount, POLL_INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fetchCount]);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.post(`benefits/notifications/${id}/read/`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString(), unread: false } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      notifyError("Erro ao marcar como lida.");
    }
  };

  const toggleDone = async (e, id, currentDone) => {
    e.stopPropagation();
    try {
      const res = await api.post(`benefits/notifications/${id}/done/`);
      const isDone = res.data?.done;
      setNotifications((prev) =>
        prev.map((n) => (n.id === id
          ? { ...n, done: isDone, done_at: isDone ? new Date().toISOString() : null }
          : n))
      );
      // If marking as done, also mark as read
      if (isDone) {
        const notif = notifications.find((n) => n.id === id);
        if (notif && notif.unread !== false && !notif.read_at) {
          await api.post(`benefits/notifications/${id}/read/`, {}, { skipGlobalLoader: true }).catch(() => {});
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString(), unread: false } : n))
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch {
      notifyError("Erro ao atualizar status da tarefa.");
    }
  };

  const markAllRead = async () => {
    try {
      await api.post("benefits/notifications/read-all/", { client_id: benefitsSelectedCompany });
      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString(), unread: false })));
      setUnreadCount(0);
    } catch {
      notifyError("Erro ao marcar todas como lidas.");
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setOpen(false);

    const meta = notification.metadata || {};
    const eventType = meta.event_type;
    const familyRootId = meta.family_root_id || meta.beneficiary_id;

    if (eventType === "intake_exclude") {
      if (familyRootId && onNavigateToExclusion) {
        onNavigateToExclusion(familyRootId);
      }
      return;
    }

    if (familyRootId && onNavigateToBeneficiary) {
      onNavigateToBeneficiary(familyRootId, meta.pending_person_id, meta.pending_field);
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "agora";
    if (mins < 60) return `${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const pendingNotifs = notifications.filter((n) => !n.done);
  const doneNotifs = notifications.filter((n) => n.done);
  const displayList = activeTab === "pending" ? pendingNotifs : doneNotifs;
  const pendingCount = pendingNotifs.filter((n) => n.unread !== false && !n.read_at).length;

  return (
    <div className="notificationBellWrap" ref={dropdownRef}>
      <button className="bellBtn" onClick={() => setOpen((prev) => !prev)} type="button" title="Ações necessárias">
        <FiBell />
        {pendingCount > 0 && (
          <span className="bellBadge">{pendingCount > 99 ? "99+" : pendingCount}</span>
        )}
      </button>

      {open && (
        <div className="notifDropdown">
          <div className="notifDropdownHeader">
            <span className="notifDropdownTitle">Ações necessárias</span>
            {unreadCount > 0 && (
              <button className="notifMarkAllBtn" onClick={markAllRead} type="button">
                <FiCheckCircle /> Marcar todas lidas
              </button>
            )}
          </div>

          {/* Abas Pendente / Concluído */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(18,59,125,0.08)", padding: "0 12px" }}>
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              style={{
                flex: 1, padding: "8px 0", fontSize: "0.82rem", fontWeight: 700,
                background: "none", border: "none", cursor: "pointer",
                color: activeTab === "pending" ? "#123b7d" : "#7c8796",
                borderBottom: activeTab === "pending" ? "2px solid #123b7d" : "2px solid transparent",
              }}
            >
              <FiCircle style={{ marginRight: 4, fontSize: "0.75rem" }} />
              Pendente ({pendingNotifs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("done")}
              style={{
                flex: 1, padding: "8px 0", fontSize: "0.82rem", fontWeight: 700,
                background: "none", border: "none", cursor: "pointer",
                color: activeTab === "done" ? "#157347" : "#7c8796",
                borderBottom: activeTab === "done" ? "2px solid #157347" : "2px solid transparent",
              }}
            >
              <FiCheckCircle style={{ marginRight: 4, fontSize: "0.75rem" }} />
              Concluído ({doneNotifs.length})
            </button>
          </div>

          <div className="notifDropdownBody">
            {fetchingList ? (
              <div className="notifEmpty">Carregando...</div>
            ) : displayList.length === 0 ? (
              <div className="notifEmpty">
                {activeTab === "pending" ? "Nenhuma ação pendente." : "Nenhuma tarefa concluída."}
              </div>
            ) : (
              displayList.slice(0, 30).map((n) => {
                const et = n.metadata?.event_type;
                const isUnread = n.unread !== false && !n.read_at;
                const isDone = Boolean(n.done);
                const colors = isDone
                  ? { bg: "rgba(34,197,94,0.08)", color: "#157347" }
                  : eventColor(et);

                return (
                  <div
                    key={n.id}
                    className={`notifItem ${isUnread && !isDone ? "unread" : ""}`}
                    onClick={() => !isDone && handleNotificationClick(n)}
                    style={{ opacity: isDone ? 0.8 : 1, cursor: isDone ? "default" : "pointer" }}
                  >
                    {et && (
                      <div style={{
                        width: 32, height: 32, minWidth: 32, borderRadius: 10,
                        background: colors.bg, color: colors.color,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {isDone ? <FiCheckCircle size={14} /> : eventIcon(et)}
                      </div>
                    )}
                    <div className="notifItemContent">
                      <strong className="notifItemTitle" style={{ textDecoration: isDone ? "line-through" : "none", color: isDone ? "#7c8796" : undefined }}>
                        {n.title}
                      </strong>
                      <span className="notifItemMessage">{n.message}</span>
                      {et === "intake_exclude" && !isDone && (
                        <span style={{
                          display: "inline-block", marginTop: 4,
                          fontSize: "0.72rem", fontWeight: 800,
                          color: "#b42318", background: "rgba(244,67,54,0.08)",
                          padding: "2px 8px", borderRadius: 6,
                        }}>
                          Clique para ir às exclusões →
                        </span>
                      )}
                      <span className="notifItemTime">{formatTimeAgo(n.created_at)}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                      {/* Botão marcar como feito / desfazer */}
                      <button
                        className="notifReadBtn"
                        onClick={(e) => toggleDone(e, n.id, isDone)}
                        type="button"
                        title={isDone ? "Marcar como pendente" : "Marcar como concluído"}
                        style={{
                          background: isDone ? "rgba(34,197,94,0.15)" : undefined,
                          color: isDone ? "#157347" : undefined,
                          borderRadius: 8,
                        }}
                      >
                        {isDone ? <FiCheckCircle size={14} /> : <FiCheck size={14} />}
                      </button>
                      {/* Botão marcar como lida (só para não lidas e não concluídas) */}
                      {isUnread && !isDone && (
                        <button
                          className="notifReadBtn"
                          onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                          type="button"
                          title="Marcar como lida"
                          style={{ opacity: 0.6 }}
                        >
                          <FiCircle size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
