// src/contexts/userContext/userContext.jsx
// eslint-disable-next-line react/prop-types
import { createContext, useState, useEffect } from "react";
import { notifyError, notifySucess } from "../../Toastfy";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "react-toastify/dist/ReactToastify.css";
import jwt_decode from "jwt-decode";

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [CompanyModal, setCompanyModal] = useState(false);
  const [ClientModal, setClientModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [spinner, setSpinner] = useState(false);
  const [userInfo, setUserInfo] = useState("");
  const [observer, setObserver] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleForm = async (body) => {
    try {
      setLoading(true);
      setSpinner("Entrar");

      const response = await api.post("users/login/", body);

      const accessToken = response.data.access;
      const decodedToken = jwt_decode(accessToken);

      window.localStorage.clear();
      window.localStorage.setItem("@token", JSON.stringify(accessToken));

      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      setUserInfo(decodedToken);

      try {
        const userId = decodedToken.user_id;
        const userResponse = await api.get(`users/${userId}/`);
        setUser(userResponse.data);
      } catch (e) {
        setUser(decodedToken);
      }

      let route = "/";

      if (decodedToken.user_level === "invoicinguser") {
        setShowModal(true);
      } else {
        if (decodedToken.user_level === "admin") {
          route = "/admin";
        } else if (decodedToken.user_level === "invoicingadmin") {
          route = "/faturamento/admin";
        } else if (
          decodedToken.user_level === "benefitsadmin" ||
          decodedToken.user_level === "benefitsoperator"
        ) {
          route = "/beneficios/portal";
        } else if (
          decodedToken.user_level === "rh" ||
          decodedToken.user_level === "medic"
        ) {
          route = "/user";
        }

        navigate(route);
      }

      notifySucess("Logado com sucesso!");
    } catch (err) {
      console.log(err);
      notifyError("Email ou senha invalida!");
    } finally {
      setSpinner(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadUser() {
      const tokenRaw = localStorage.getItem("@token");

      if (!tokenRaw) {
        setLoading(false);
        return;
      }

      let token = null;
      try {
        token = JSON.parse(tokenRaw);
      } catch {
        token = tokenRaw;
      }

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const decoded = jwt_decode(token);
        setUserInfo(decoded);

        const userId = decoded.user_id;
        const response = await api.get(`users/${userId}/`);
        setUser(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        handleForm,
        loading,
        setLoading,
        user,
        setUser,
        CompanyModal,
        setCompanyModal,
        ClientModal,
        setClientModal,
        navigate,
        userInfo,
        observer,
        setObserver,
        spinner,
        setSpinner,
        showModal,
        setShowModal,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};