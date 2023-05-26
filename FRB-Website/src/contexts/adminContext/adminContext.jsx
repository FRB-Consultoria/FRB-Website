// eslint-disable-next-line react/prop-types
import { createContext, useState, useEffect, useContext } from "react";
import { notifyErrorLogin, notifySucessLogin } from "../../Toastfy";
import { UserContext } from "../userContext/userContext";
import { api } from "../../services/api";
import "react-toastify/dist/ReactToastify.css";

export const AdminContext = createContext({});

export const AdminProvider = ({ children }) => {
  const { setLoading, setClientModal, setCompanyModal } = useContext(UserContext);
  const [clients, setClients] = useState(null);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    async function getClients() {
      try {
        const response = await api.get(`clients/`);
        setClients(response.data.results);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    getClients();
  }, []);

  const createUser = async (body, client_id) => {
    body["username"] = body.email;
    body["password"] = body.email;
    body["client_id"] = client_id;

    try {
      const response = await api.post(`users/`, body);
      setUsers((await api.get(`users/`)).data.results);
      setClientModal(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (body, user_id) => {
    try {
      const response = await api.patch(`users/${user_id}/`, body);
      setUsers((await api.get(`users/`)).data.results);
      setClientModal(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (user_id) => {
    try {
      const response = await api.delete(`users/${user_id}/`);
      setUsers((await api.get(`users/`)).data.results);
      setClientModal(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deactivateUser = async (user_id, active) => {
    
    try {
      const response = await api.patch(`users/${user_id}/`, {active: !active});
      setUsers((await api.get(`users/`)).data.results);
     
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (body)=>{
    try {
      const response = await api.post(`clients/`, body);
      setClients((await api.get(`clients/`)).data.results);
      setCompanyModal(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const updateClient = async (body, client_id)=>{
    try {
      const response = await api.patch(`clients/${client_id}/`, body);
      setClients((await api.get(`clients/`)).data.results);
      setCompanyModal(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const deleteClient = async (client_id)=>{
    try {
      const response = await api.delete(`clients/${client_id}/`);
      setClients((await api.get(`clients/`)).data.results);
      setCompanyModal(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminContext.Provider
      value={{
        clients,
        createUser,
        updateUser,
        setUsers,
        users,
        deleteUser,
        deactivateUser,
        createClient,
        updateClient,
        deleteClient
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};