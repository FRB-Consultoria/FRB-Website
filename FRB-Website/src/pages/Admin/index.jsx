import React, { useContext, useEffect, useState } from "react";
import { Main } from "./style";
import { AiOutlineSearch } from "react-icons/ai";
import { CreateCompanyModal } from "../../components/Modals/createCompany";
import { RemoveCompanyModal } from "../../components/Modals/removeCompany";
import { EditCompanyModal } from "../../components/Modals/editCompany";
import backLogin from "../../assets/img/IconBackPage.webp";
import FRB from "../../assets/img/logoBranca.webp";
import buttonPlus from "../../assets/img/Button Plus.webp";
import { FiEdit } from "react-icons/fi";
import { TbTrash } from "react-icons/tb";
import { UserContext } from "../../contexts/userContext/userContext";
import { AdminContext } from "../../contexts/adminContext/adminContext";
import { isFirstDayOfMonth, startOfToday } from "date-fns";
import { Spinner } from "../../components/Spinner/Spinner";

export const Admin = () => {
  const columnNames = [
    "Clientes",
    "Usuários",
    "CNPJ",
    "Telefone",
   
  
    "Editar / Remover",
  ];

  const [isLoading, setIsLoading] = useState(false);

  const { CompanyModal, setCompanyModal, ClientModal, user, navigate } =
    useContext(UserContext);
  const { target, setUsers, filter, filterClientOn, filterClient, createEmail } =
    useContext(AdminContext);

  // Função para enviar lembrete de fatura
  const handleSendReminder = async () => {
    setIsLoading(true); // Mostra o spinner
    await createEmail("sendEmailButton");
    setIsLoading(false); // Esconde o spinner
  };

  useEffect(() => {
    if (user.user_level !== "admin") navigate("/");

    const checkAndSendReminder = () => {
      if (isFirstDayOfMonth(startOfToday())) {
        handleSendReminder();
      }
    };

    // Verifica diariamente
    const intervalId = setInterval(checkAndSendReminder, 24 * 60 * 60 * 1000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, [user, navigate, createEmail, handleSendReminder]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [filterClient]);

  return (
    <Main>
      <div className="container">
        <div className="borderBotton">
          <div className="positionHeader">
            <img
              className="iconBack"
              src={backLogin}
              onClick={() => navigate("/areadocliente")}
              alt="Menu para voltar a página"
            />
            <img className="imgLogo" src={FRB} alt="Logo da empresa" />
          </div>
        </div>
        <div className="positionNameClient">
          <p className="nameClient">Olá, Flávio de Bem</p>
          <button className="sendReminderButton" onClick={handleSendReminder}>
            {isLoading ? <Spinner small /> : "Enviar Lembrete de Fatura"}
          </button>
        </div>
        <div className="positionIntro">
          <div className="positionLayout">
            <p>Clientes</p>
            <div>
              <div className="iconPositionAdd">
                <p>Adicionar Cliente</p>
                <img
                  src={buttonPlus}
                  alt="Botão de Adicionar Empresa"
                  onClick={() => setCompanyModal(<CreateCompanyModal />)}
                />
              </div>
            </div>
          </div>
          <form className="positionInput">
            <input
              onChange={(event) => filterClientOn(event)}
              type="text"
              placeholder="Digite o nome do cliente"
            />
            <button type="button" className="iconLup">
              <AiOutlineSearch />
            </button>
          </form>
        </div>
        <section>
          <div className="positionOption">
            <div className="positionBussines">
              {columnNames.map((name, index) => (
                <p key={index}>{name}</p>
              ))}
            </div>
          </div>
          {isLoading ? (
            <Spinner />
          ) : (
            <ul className="positionOption">
              {target && filter
                ? filter.map((client) => (
                    <li key={client.id} className="positionBussines opacity-2">
                      <p>{client.client_name}</p>
                      <p>{client.users.length}</p>
                      <p>{client.cnpj}</p>
                      <p>{client.tel}</p>
                     
                      <span>
                        <FiEdit
                          onClick={() => {
                            setCompanyModal(<EditCompanyModal client={client} />);
                            setUsers(client.users);
                          }}
                        />
                      </span>
                      <span>
                        <TbTrash
                          onClick={() => {
                            setCompanyModal(
                              <RemoveCompanyModal
                                name={client.client_name}
                                client_id={client.id}
                              />
                            );
                          }}
                        />
                      </span>
                    </li>
                  ))
                : filterClient.map((client) => (
                    <li key={client.id} className="positionBussines opacity-2">
                      <p>{client.client_name}</p>
                      <p>{client.users.length}</p>
                      <p>{client.cnpj}</p>
                      <p>{client.tel}</p>
                      
                      <div>
                        <span>
                          <FiEdit
                            onClick={() => {
                              setCompanyModal(<EditCompanyModal client={client} />);
                              setUsers(client.users);
                            }}
                          />
                        </span>
                        <span>
                          <TbTrash
                            onClick={() => {
                              setCompanyModal(
                                <RemoveCompanyModal
                                  name={client.client_name}
                                  client_id={client.id}
                                />
                              );
                            }}
                          />
                        </span>
                      </div>
                    </li>
                  ))}
            </ul>
          )}
        </section>
        {CompanyModal && CompanyModal}
        {ClientModal && ClientModal}
      </div>
    </Main>
  );
};
