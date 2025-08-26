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
      setSpinner("Entrar");
      const response = await api.post("users/login/", body);
      const decodedToken = jwt_decode(response.data.access);
      window.localStorage.clear();
      window.localStorage.setItem(
        "@token",
        JSON.stringify(response.data.access)
      );
      setUserInfo(decodedToken);

      if (decodedToken.user_level === "invoicinguser") {
        setShowModal(true);
      } else {
        let route;

        if (decodedToken.user_level === "admin") {
          route = "/admin";
        } else if (decodedToken.user_level === "invoicingadmin") {
          route = "/faturamento/admin";
        } else if (decodedToken.user_level === "rh" || decodedToken.user_level === "medic") {
          route = "/user";
        }

        navigate(route);
      }

      setLoading(true);
      notifySucess("Logado com sucesso!");
    } catch (err) {
      console.log(err);
      notifyError("Email ou senha invalida!");
    } finally {
      setSpinner(false);
    }
  };

  useEffect(() => {
    async function loadUser() {
      const token = JSON.parse(localStorage.getItem("@token"));

      if (!token) {
        setLoading(false);
        return;
      }

      const userId = jwt_decode(token).user_id;

      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await api.get(`users/${userId}/`);
        setUser(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [navigate]);

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
