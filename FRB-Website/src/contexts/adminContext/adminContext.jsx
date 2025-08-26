// eslint-disable-next-line react/prop-types
import { createContext, useState, useEffect, useContext } from "react";
import { notifySucess, notifyError } from "../../Toastfy";
import { UserContext } from "../userContext/userContext";
import { api } from "../../services/api";
import "react-toastify/dist/ReactToastify.css";

export const AdminContext = createContext({});

export const AdminProvider = ({ children }) => {
  const { setLoading, setClientModal, setCompanyModal, setSpinner } =
    useContext(UserContext);
  const [clients, setClients] = useState(null);
  const [users, setUsers] = useState(null);
  const [filterClient, setFilterClient] = useState([]);
  const [filter, setFilter] = useState([]);
  const [target, setTarget] = useState("");
  const [document, setDocument] = useState(null);
  const [spinnerPost, setSpinnerPost] = useState(false);
  const [filterDocument, setFilterDocument] = useState([]);
  const [subinvoices, setSubinvoices] = useState([]);
  const [filterSubinvoice, setFilterSubinvoice] = useState([]);
  const [sub, setSub] = useState(null);
  const [filterSub, setFilterSub] = useState([]);
  const [shipEmail, setShipEmail] = useState(null);
  const [filterShipEmail, setFilterShipEmail] = useState([]);
  useEffect(() => {
    async function getClients() {
      try {
        setSpinner(true);
        const response = await api.get(`clients/`);
        setFilterClient(response.data.results);
        setClients(response.data.results);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        setSpinner(false);
      }
    }
    getClients();
  }, []);
  useEffect(() => {
    async function getDocuments() {
      try {
        setSpinner(true);
        let allClients = [];
        const fetchPages = async (url) => {
          const response = await api.get(url);
          const newClients = response.data.results;
          allClients = [...allClients, ...newClients];

          if (response.data.next) {
            await fetchPages(response.data.next);
          }
        };
        await fetchPages("documents/");
        setDocument(allClients);
        setFilterDocument(allClients);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        setSpinner(false);
      }
    }
    getDocuments();
  }, []);
  const getSubinvoices2 = async () => {
    try {
      setSpinner(true);
      let allSubinvoices = [];
      const fetchPages = async (url) => {
        const response = await api.get(url);
        const newSubinvoices = response.data.results;
        allSubinvoices = [...allSubinvoices, ...newSubinvoices];

        if (response.data.next) {
          await fetchPages(response.data.next);
        }
      };
      await fetchPages("subinvoices/");
      setSubinvoices(allSubinvoices);
      setFilterSubinvoice(allSubinvoices);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setSpinner(false);
    }
  };
  useEffect(() => {
    async function getSubinvoices() {
      try {
        setSpinner(true);
        let allClients = [];
        const fetchPages = async (url) => {
          const response = await api.get(url);
          const newClients = response.data.results;
          allClients = [...allClients, ...newClients];

          if (response.data.next) {
            await fetchPages(response.data.next);
          }
        };
        await fetchPages("subinvoices/");
        setSubinvoices(allClients);
        setFilterSubinvoice(allClients);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        setSpinner(false);
      }
    }
    getSubinvoices();
  }, []);
  const filterSubinvoicesByMonthAndYear = (month, year) => {
    const filtered = subinvoices.filter(
      (sub) => sub.month === month && sub.year === year
    );
    setFilterSubinvoice(filtered);
  };

  const createUser = async (body, client_id, button_name) => {
    body["username"] = body.email;
    body["password"] = body.email;
    body["client_id"] = client_id;

    try {
      setSpinner(button_name);
      const response = await api.post(`users/`, body);
      setUsers(
        (await api.get(`users/`)).data.results.filter(
          (user) => user.client_id == client_id
        )
      );
      setClientModal(false);
      notifySucess("Usuário criado com sucesso!");
    } catch (err) {
      console.log(err);
      notifyError("Não foi possível criar o usuário");
    } finally {
      setLoading(false);
      setSpinner(false);
    }
  };

  const updateUser = async (body, user_id, client_id, button_name) => {
    try {
      setSpinner(button_name);
      const response = await api.patch(`users/${user_id}/`, body);
      setUsers(
        (await api.get(`users/`)).data.results.filter(
          (user) => user.client_id == client_id
        )
      );
      setClientModal(false);
      notifySucess("Usuário atualizado com sucesso!");
    } catch (err) {
      console.log(err);
      notifyError("Não foi possível atualizar o usuário");
    } finally {
      setLoading(false);
      setSpinner(false);
    }
  };

  const deleteUser = async (user_id, client_id, button_name) => {
    try {
      setSpinner(button_name);
      const response = await api.delete(`users/${user_id}/`);
      setUsers(
        (await api.get(`users/`)).data.results.filter(
          (user) => user.client_id == client_id
        )
      );
      setClientModal(false);
      notifySucess("Usuário deletado com sucesso!");
    } catch (err) {
      console.log(err);
      notifyError("Não foi possível deletar o usuário");
    } finally {
      setLoading(false);
      setSpinner(false);
    }
  };

  const deactivateUser = async (user_id, active, client_id, button_name) => {
    try {
      const response = await api.patch(`users/${user_id}/`, {
        active: !active,
      });
      setUsers(
        (await api.get(`users/`)).data.results.filter(
          (user) => user.client_id == client_id
        )
      );
      notifySucess("Usuário desativado com sucesso!");
    } catch (err) {
      console.log(err);
      notifyError("Não foi possível desativar o usuário");
    } finally {
      setLoading(false);
    }
  };
  const createDocument = async (body, button_name) => {
    try {
      setSpinner(button_name);
      setSpinnerPost(true);
      const response = await api.post(`documents/`, body);

      setDocument((prevFilterProvider) => [
        response.data,
        ...prevFilterProvider,
      ]);
      setClientModal(false);
      notifySucess("Envio de fatura concluida");
    } catch (err) {
      console.error(err);

      console.error("Erro do backend:", err.response?.data);

      notifyError("Não foi possível enviar a fatura");
    } finally {
      setLoading(false);
      setSpinner(false);
      setSpinnerPost(false);
    }
  };
  const createSub = async (body, button_name) => {
    try {
      setSpinner(button_name);
      const response = await api.post(`subinvoices/`, body);
  
      setSub((prevFilterProvider) => {
        if (Array.isArray(prevFilterProvider)) {
          return [response.data, ...prevFilterProvider];
        } else {
          return [response.data];
        }
      });
  
      setClientModal(false);
      notifySucess("Subfatura criada com sucesso!");
    } catch (err) {
      console.error(err);
      console.error("Erro do backend:", err.response?.data);
      notifyError("Não foi possível criar a subfatura");
    } finally {
      setLoading(false);
      setSpinner(false);
      setSpinnerPost(false);
    }
  };
  const createEmail = async ( button_name) => {
    try {
      setSpinner(button_name);
      const response = await api.post(`trigger-send-invoice-reminder/`);
    
        setShipEmail((prevFilterProvider) => {
        if (Array.isArray(prevFilterProvider)) {
          return [response.data, ...prevFilterProvider];
        } else {
          return [response.data];
        }
      });
  
   
      notifySucess("E-mail enviado com sucesso!");
    } catch (err) {
      console.error(err);
      console.error("Erro do backend:", err.response?.data);
      notifyError("Não foi possível enviar o e-mail");
    } finally {
      setLoading(false);
      setSpinner(false);
      setSpinnerPost(false);
    }
  };
  const createClient = async (body, button_name) => {
    try {
      setSpinner(button_name);
      const response = await api.post(`clients/`, body);
      setFilterClient((await api.get(`clients/`)).data.results);
      setCompanyModal(false);
      notifySucess("Cliente criado com sucesso!");
    } catch (err) {
      console.log(err);
      notifyError("Não foi possível criar o cliente");
    } finally {
      setLoading(false);
      setSpinner(false);
    }
  };

  const updateClient = async (body, client_id, button_name) => {
    try {
      setSpinner(button_name);
      const response = await api.patch(`clients/${client_id}/`, body);
      setFilterClient((await api.get(`clients/`)).data.results);
      setCompanyModal(false);
      notifySucess("Cliente atualizado com sucesso!");
    } catch (err) {
      console.log(err);
      notifyError("Não foi possível atualizar o cliente");
    } finally {
      setLoading(false);
      setSpinner(false);
    }
  };

  const deleteClient = async (client_id, button_name) => {
    try {
      setSpinner(button_name);
      const response = await api.delete(`clients/${client_id}/`);
      setFilterClient((await api.get(`clients/`)).data.results);
      setCompanyModal(false);
      notifySucess("Cliente deletado com sucesso!");
    } catch (err) {
      console.log(err);
      notifyError("Não foi possível deletar o cliente");
    } finally {
      setLoading(false);
      setSpinner(false);
    }
  };

  function filterClientOn(event) {
    setTarget(event.target.value);
    const filter = clients.filter((elem) =>
      elem.client_name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilter(filter);
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
        deleteClient,
        filterClient,
        setFilterClient,
        filterClientOn,
        filter,
        setFilter,
        target,
        setTarget,
        document,
        setDocument,
        createDocument,
        filterDocument,
        filterSubinvoice,
        setFilterSubinvoice,
        subinvoices,
        setSubinvoices,
        filterSubinvoicesByMonthAndYear,
        spinnerPost,
        setSpinnerPost,
        sub,
        setSub,
        filterSub,
        setFilterSub,
        createSub,
        getSubinvoices2,
        createEmail,
        shipEmail, setShipEmail,filterShipEmail, setFilterShipEmail
        
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
