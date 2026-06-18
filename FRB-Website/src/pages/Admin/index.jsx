import { useContext, useEffect, useState } from "react";
import {
  PageWrapper, Inner, Topbar, TopbarInner, TopbarLogo, TopbarRight, BackBtn,
  HeroSection, HeroGreeting, HeroTitle, HeroSub, ReminderButton,
  Toolbar, SectionTitle, ToolbarRight, SearchWrapper, SearchInput, AddButton,
  TableCard, TableHead, TableHeadCell, TableRow, TableCell,
  UsersBadge, ActionCell, ActionBtn, EmptyState,
} from "./style";
import { AiOutlineSearch } from "react-icons/ai";
import { FiEdit, FiPlus, FiMail, FiBell } from "react-icons/fi";
import { TbTrash } from "react-icons/tb";
import { CreateCompanyModal } from "../../components/Modals/createCompany";
import { RemoveCompanyModal } from "../../components/Modals/removeCompany";
import { EditCompanyModal } from "../../components/Modals/editCompany";
import FRB from "../../assets/img/logoBranca.webp";
import { UserContext } from "../../contexts/userContext/userContext";
import { AdminContext } from "../../contexts/adminContext/adminContext";
import { isFirstDayOfMonth, startOfToday } from "date-fns";
import { Spinner } from "../../components/Spinner/Spinner";

const COLUMNS = ["Cliente", "Usuários", "CNPJ", "Telefone", "Ações"];

export const Admin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { CompanyModal, setCompanyModal, ClientModal, user, navigate } =
    useContext(UserContext);
  const { target, setUsers, filter, filterClientOn, filterClient, createEmail } =
    useContext(AdminContext);

  useEffect(() => {
    if (user && user.user_level !== "admin" && !user.perm_admin && !user.is_superuser) navigate("/");

    const sendReminder = async () => {
      setIsLoading(true);
      await createEmail("sendEmailButton");
      setIsLoading(false);
    };

    if (isFirstDayOfMonth(startOfToday())) sendReminder();

    const intervalId = setInterval(() => {
      if (isFirstDayOfMonth(startOfToday())) sendReminder();
    }, 24 * 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [user, navigate, createEmail]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 5000);
    return () => clearTimeout(timer);
  }, [filterClient]);

  const handleSendReminder = async () => {
    setIsLoading(true);
    await createEmail("sendEmailButton");
    setIsLoading(false);
  };

  const clients = target && filter ? filter : filterClient;
  const displayName = user?.name || user?.username || "Admin";

  return (
    <PageWrapper>
      <Topbar>
        <TopbarInner>
          <TopbarLogo src={FRB} alt="FRB Consultoria" />
          <TopbarRight>
            <BackBtn onClick={() => navigate("/areadocliente")}>
              ← Sair
            </BackBtn>
          </TopbarRight>
        </TopbarInner>
      </Topbar>

      <Inner>
        <HeroSection>
          <HeroGreeting>
            <HeroTitle>
              Olá, <span>{displayName}</span>
            </HeroTitle>
            <HeroSub>Gerencie os clientes e usuários da plataforma</HeroSub>
          </HeroGreeting>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <ReminderButton
              onClick={() => navigate("/admin/notificacoes")}
              style={{ background: "linear-gradient(135deg,#04ade0,#0270a0)" }}
            >
              <FiBell />
              Central de Notificações
            </ReminderButton>
            <ReminderButton onClick={handleSendReminder} disabled={isLoading}>
              <FiMail />
              {isLoading ? "Enviando..." : "Enviar Lembrete de Fatura"}
            </ReminderButton>
          </div>
        </HeroSection>

        <Toolbar>
          <SectionTitle>Clientes</SectionTitle>
          <ToolbarRight>
            <SearchWrapper>
              <AiOutlineSearch />
              <SearchInput
                onChange={filterClientOn}
                type="text"
                placeholder="Buscar cliente..."
              />
            </SearchWrapper>
            <AddButton onClick={() => setCompanyModal(<CreateCompanyModal />)}>
              <FiPlus />
              Adicionar Cliente
            </AddButton>
          </ToolbarRight>
        </Toolbar>

        <TableCard>
          <TableHead>
            {COLUMNS.map((col) => (
              <TableHeadCell key={col}>{col}</TableHeadCell>
            ))}
          </TableHead>

          {isLoading ? (
            <EmptyState><Spinner /></EmptyState>
          ) : clients.length === 0 ? (
            <EmptyState><p>Nenhum cliente encontrado.</p></EmptyState>
          ) : (
            clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell data-label="Cliente">{client.client_name}</TableCell>
                <TableCell data-label="Usuários">
                  <UsersBadge>{client.users.length}</UsersBadge>
                </TableCell>
                <TableCell data-label="CNPJ">{client.cnpj}</TableCell>
                <TableCell data-label="Telefone">{client.tel}</TableCell>
                <ActionCell>
                  <ActionBtn
                    className="edit"
                    title="Editar cliente"
                    onClick={() => {
                      setCompanyModal(<EditCompanyModal client={client} />);
                      setUsers(client.users);
                    }}
                  >
                    <FiEdit />
                  </ActionBtn>
                  <ActionBtn
                    className="delete"
                    title="Remover cliente"
                    onClick={() =>
                      setCompanyModal(
                        <RemoveCompanyModal
                          name={client.client_name}
                          client_id={client.id}
                        />
                      )
                    }
                  >
                    <TbTrash />
                  </ActionBtn>
                </ActionCell>
              </TableRow>
            ))
          )}
        </TableCard>
      </Inner>

      {CompanyModal && CompanyModal}
      {ClientModal && ClientModal}
    </PageWrapper>
  );
};
