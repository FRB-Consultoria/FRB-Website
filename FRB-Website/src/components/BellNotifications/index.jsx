import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import { Wrapper, Dropdown, Item, EmptyState, HeaderRow, TopActions } from "./style";
import { api } from "../../services/api";
import { AdminContext } from "../../contexts/adminContext/adminContext";
import { UserContext } from "../../contexts/userContext/userContext";
import { notifyError } from "../../Toastfy";

export const BellNotifications = () => {
  const { benefitsSelectedCompany } = useContext(AdminContext);
  const { userInfo } = useContext(UserContext);

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [fetching, setFetching] = useState(false);
  const wrapperRef = useRef(null);

  const isBenefitsUser =
    userInfo?.user_level === "benefitsadmin" ||
    userInfo?.user_level === "benefitsoperator" ||
    userInfo?.user_level === "admin";

  const unreadCount = useMemo(
    () => (notifications || []).filter((item) => item.unread).length,
    [notifications]
  );

  const fetchNotifications = async (silent = false) => {
    if (!isBenefitsUser) return;

    try {
      if (!silent) setFetching(true);

      const params = {};
      if (benefitsSelectedCompany) {
        params.client_id = benefitsSelectedCompany;
      }

      const response = await api.get("benefits/notifications/", {
        params,
      });

      const results = response?.data?.results || response?.data || [];
      setNotifications(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error(error);
      notifyError("Não foi possível carregar as notificações.");
    } finally {
      if (!silent) setFetching(false);
    }
  };

  const markNotificationRead = async (notificationId) => {
    try {
      await api.post(`benefits/notifications/${notificationId}/read/`);

      setNotifications((prev) =>
        (prev || []).map((item) =>
          String(item.id) === String(notificationId)
            ? { ...item, unread: false, read_at: new Date().toISOString() }
            : item
        )
      );
    } catch (error) {
      console.error(error);
      notifyError("Não foi possível marcar a notificação como lida.");
    }
  };

  useEffect(() => {
    if (!open) return;
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, benefitsSelectedCompany]);

  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 20000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, benefitsSelectedCompany]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isBenefitsUser) return null;

  return (
    <Wrapper ref={wrapperRef}>
      <button
        className="bell"
        onClick={() => setOpen((value) => !value)}
        aria-label="Notificações"
        type="button"
      >
        <IoNotificationsOutline />
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {open && (
        <Dropdown>
          <HeaderRow>
            <div>
              <div className="title">Notificações</div>
              <div className="subtitle">
                {benefitsSelectedCompany
                  ? "Empresa selecionada"
                  : "Selecione uma empresa para filtrar"}
              </div>
            </div>

            <TopActions>
              <button
                type="button"
                className="refreshBtn"
                onClick={() => fetchNotifications()}
                title="Atualizar"
              >
                <FiRefreshCw />
              </button>
            </TopActions>
          </HeaderRow>

          {fetching ? (
            <EmptyState>Carregando notificações...</EmptyState>
          ) : (notifications || []).length === 0 ? (
            <EmptyState>Sem notificações no momento.</EmptyState>
          ) : (
            (notifications || []).slice(0, 12).map((item) => (
              <Item
                key={item.id}
                className={item.unread ? "unread" : ""}
                onClick={() => markNotificationRead(item.id)}
              >
                <div className="itemTop">
                  <strong>{item.title}</strong>
                  {item.unread ? (
                    <span className="readTag unreadTag">Nova</span>
                  ) : (
                    <span className="readTag">
                      <FiCheckCircle />
                      Lida
                    </span>
                  )}
                </div>

                <p>{item.message}</p>

                <small>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString("pt-BR")
                    : "-"}
                </small>
              </Item>
            ))
          )}
        </Dropdown>
      )}
    </Wrapper>
  );
};