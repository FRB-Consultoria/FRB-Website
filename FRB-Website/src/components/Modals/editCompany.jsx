import { ModalBackground } from "./ModalBackground";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "../../contexts/userContext/userContext";
import { AdminContext } from "../../contexts/adminContext/adminContext";
import { api } from "../../services/api";
import { Spinner } from "../Spinner/Spinner";
import { CreateClientModal } from "./createClient";
import { RemoveClientModal } from "./removeClient";
import { EditClientModal } from "./editClient";
import { CreateSubModal } from "./createSub";
import {
  ModalTitle, ModalSubTitle, ModalForm, FieldGroup, FieldLabel, FieldInput,
  FieldSelect, ModalPrimaryBtn, UserList, UserItem, UserItemActions,
  UserSmallBtn, UserCloseBtn, PowerBiLink, BtnRow,
} from "./modalShared";

const OPERADORAS = [
  { value: "",           label: "— Nenhuma —" },
  { value: "bradesco",   label: "Bradesco Saúde" },
  { value: "sulamerica", label: "SulAmérica Saúde" },
  { value: "amil",       label: "Amil" },
];

export const EditCompanyModal = ({ client }) => {
  const { setClientModal } = useContext(UserContext);
  const { users, setUsers, deactivateUser, updateClient } = useContext(AdminContext);

  // Carrega os usuários frescos deste cliente ao abrir o modal, com loading —
  // evita listar usuários vazios/desatualizados enquanto os dados não chegaram.
  const [loadingUsers, setLoadingUsers] = useState(true);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingUsers(true);
      try {
        const res = await api.get(`clients/${client.id}/`, { skipGlobalLoader: true });
        if (!cancelled) setUsers(res.data?.users ?? []);
      } catch {
        if (!cancelled) setUsers(client.users ?? []);
      } finally {
        if (!cancelled) setLoadingUsers(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client.id]);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      client_name:      client.client_name,
      cnpj:             client.cnpj,
      tel:              client.tel,
      client_email:     client.client_email,
      corporate_name:   client.corporate_name,
      contract_health:  client.contract_health,
      contract_life:    client.contract_life,
      contract_dental:  client.contract_dental,
      operadora:        client.operadora || "",
    },
  });

  const rhUser = users?.find((u) => u.user_level === "rh");

  return (
    <ModalBackground size="editCompany">
      <ModalTitle>Editar Cliente</ModalTitle>

      <ModalForm onSubmit={handleSubmit((body) => updateClient(body, client.id, "Atualizar"))}>
        <FieldGroup>
          <FieldLabel>Nome do cliente</FieldLabel>
          <FieldInput placeholder="Nome do cliente" {...register("client_name")} />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>CNPJ</FieldLabel>
          <FieldInput placeholder="00.000.000/0000-00" {...register("cnpj")} />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Razão Social</FieldLabel>
          <FieldInput placeholder="Razão social" {...register("corporate_name")} />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Telefone</FieldLabel>
          <FieldInput type="tel" placeholder="(00) 00000-0000" {...register("tel")} />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>E-mail</FieldLabel>
          <FieldInput type="email" placeholder="email@empresa.com.br" {...register("client_email")} />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Contrato Saúde</FieldLabel>
          <FieldInput placeholder="Nº contrato" {...register("contract_health")} />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Contrato Vida</FieldLabel>
          <FieldInput placeholder="Nº contrato" {...register("contract_life")} />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Contrato Dental</FieldLabel>
          <FieldInput placeholder="Nº contrato" {...register("contract_dental")} />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Operadora de Saúde / Dental</FieldLabel>
          <FieldSelect {...register("operadora")}>
            {OPERADORAS.map((op) => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </FieldSelect>
        </FieldGroup>

        <ModalPrimaryBtn type="submit">Salvar Alterações</ModalPrimaryBtn>
      </ModalForm>

      <ModalSubTitle>Gerenciamento de Usuários</ModalSubTitle>

      {rhUser?.power_bi_link && (
        <PowerBiLink href={rhUser.power_bi_link} target="_blank" rel="noopener noreferrer">
          Power BI Link
        </PowerBiLink>
      )}

      <BtnRow style={{ marginTop: 16 }}>
        <UserSmallBtn
          className="sub"
          type="button"
          onClick={() => setClientModal(<CreateSubModal client_id={client.id} />)}
        >
          + Subfatura
        </UserSmallBtn>
        <UserSmallBtn
          className="edit"
          type="button"
          onClick={() => setClientModal(<CreateClientModal client_id={client.id} />)}
        >
          + Criar Usuário
        </UserSmallBtn>
      </BtnRow>

      {loadingUsers ? (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 12, padding: "26px 0", color: "rgba(255,255,255,.6)", fontSize: ".9rem",
        }}>
          <Spinner small /> Carregando usuários...
        </div>
      ) : !users || users.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "22px 0",
          color: "rgba(255,255,255,.5)", fontSize: ".88rem",
        }}>
          Nenhum usuário cadastrado para este cliente.
        </div>
      ) : (
        <UserList>
          {users.map((u) => (
            <UserItem key={u.id}>
              <UserCloseBtn
                type="button"
                onClick={() =>
                  setClientModal(
                    <RemoveClientModal name={u.name} user_id={u.id} client_id={client.id} />
                  )
                }
                title="Remover usuário"
              >
                ×
              </UserCloseBtn>
              <h4>{u.name}</h4>
              <UserItemActions>
                <UserSmallBtn
                  className="edit"
                  type="button"
                  onClick={() =>
                    setClientModal(<EditClientModal user={u} client_id={client.id} />)
                  }
                >
                  Editar
                </UserSmallBtn>
                <UserSmallBtn
                  className={u.active ? "deactive" : "active"}
                  type="button"
                  onClick={() => deactivateUser(u.id, u.active, client.id)}
                >
                  {u.active ? "Desativar" : "Ativar"}
                </UserSmallBtn>
              </UserItemActions>
            </UserItem>
          ))}
        </UserList>
      )}
    </ModalBackground>
  );
};
