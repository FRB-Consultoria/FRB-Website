// src/pages/BenefitsPortal/components/NotificationBell.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiBell, FiCheck, FiCheckCircle, FiUserPlus, FiRefreshCw, FiUserX } from "react-icons/fi";
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
  if (!et) return true; // notificações antigas sem event_type: exibir por precaução
  return ACTIONABLE_EVENT_TYPES.includes(et);
};

export const NotificationBell = ({
  benefitsSelectedCompany,
  onNavigateToBeneficiary,  // (beneficiaryId, pendingPersonId, pendingField) → beneficiaries tab
  onNavigateToExclusion,    // (familyRootId) → exclusions tab
}) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [fetchingList, setFetchingList] = useState(false);
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

    // intake_exclude → aba de exclusões com destaque no card
    if (eventType === "intake_exclude") {
      if (familyRootId && onNavigateToExclusion) {
        onNavigateToExclusion(familyRootId);
      }
      return;
    }

    // intake_create / intake_update → aba de beneficiários com foco no campo
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

  return (
    <div className="notificationBellWrap" ref={dropdownRef}>
      <button className="bellBtn" onClick={() => setOpen((prev) => !prev)} type="button" title="Ações necessárias">
        <FiBell />
        {unreadCount > 0 && (
          <span className="bellBadge">{unreadCount > 99 ? "99+" : unreadCount}</span>
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

          <div className="notifDropdownBody">
            {fetchingList ? (
              <div className="notifEmpty">Carregando...</div>
            ) : notifications.length === 0 ? (
              <div className="notifEmpty">Nenhuma ação pendente.</div>
            ) : (
              notifications.slice(0, 30).map((n) => {
                const et = n.metadata?.event_type;
                const isUnread = n.unread !== false && !n.read_at;
                const colors = eventColor(et);

                return (
                  <div
                    key={n.id}
                    className={`notifItem ${isUnread ? "unread" : ""}`}
                    onClick={() => handleNotificationClick(n)}
                  >
                    {et && (
                      <div style={{
                        width: 32, height: 32, minWidth: 32, borderRadius: 10,
                        background: colors.bg, color: colors.color,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {eventIcon(et)}
                      </div>
                    )}
                    <div className="notifItemContent">
                      <strong className="notifItemTitle">{n.title}</strong>
                      <span className="notifItemMessage">{n.message}</span>
                      {et === "intake_exclude" && (
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
                    {isUnread && (
                      <button className="notifReadBtn"
                        onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                        type="button" title="Marcar como lida">
                        <FiCheck />
                      </button>
                    )}
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