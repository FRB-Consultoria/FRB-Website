import { ModalBackground } from "./ModalBackground";
import { Button } from "../Button";
import { Input } from "../Input";
import { EditCompany } from "./editCompanyStyle";
import { useContext } from "react";
import { UserContext } from "../../contexts/userContext/userContext";
import { CreateClientModal } from "../../components/Modals/createClient";
import { RemoveClientModal } from "../../components/Modals/removeClient";
import { EditClientModal } from "../../components/Modals/editClient";
import { AdminContext } from "../../contexts/adminContext/adminContext";
import { useForm } from "react-hook-form";
import powerBiLogo from '../../assets/img/powerbi-logo.png';
import {CreateSubModal} from "./createSub"

const OPERADORAS = [
  { value: "",           label: "— Nenhuma —" },
  { value: "bradesco",   label: "Bradesco Saúde" },
  { value: "sulamerica", label: "SulAmérica Saúde" },
  { value: "amil",       label: "Amil" },
];

export const EditCompanyModal = ({ client }) => {
  const { setClientModal } = useContext(UserContext);
  const { users, deactivateUser, updateClient } = useContext(AdminContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      client_name: client.client_name,
      cnpj: client.cnpj,
      password: client.password,
      tel: client.tel,
      client_email: client.client_email,
      corporate_name: client.corporate_name,
      contract_health: client.contract_health,
      contract_life: client.contract_life,
      contract_dental: client.contract_dental,
      operadora: client.operadora || "",
    },
  });

  const rhUser = users?.find(user => user.user_level === 'rh');

  return (
    <EditCompany>
      <ModalBackground size="editCompany">
        <div>
          <form onSubmit={handleSubmit((body) => { updateClient(body, client.id, "Atualizar") })}>
            <Input
              name="client_name"
              type="text"
              placeholder="Atualize o nome do cliente"
              label="Nome do Cliente"
              register={register("client_name")}
            />
            <Input
              name="cnpj"
              type="text"
              placeholder="Atualize o cnpj do cliente"
              label="CNPJ"
              register={register("cnpj")}
            />
            {/* <Input
              name="password"
              type="password"
              placeholder="Crie uma nova senha"
              label="Nova Senha"
              register={register("password")}
            /> */}
            <Input
              name="tel"
              type="tel"
              placeholder="Atualize o telefone do cliente"
              label="Telefone"
              register={register("tel")}
            />
            <Input
              name="client_email"
              type="email"
              placeholder="Digite o e-mail do cliente"
              label="E-mail"
              register={register("client_email")}
            />
            <Input
              name="corporate_name"
              type="text"
              placeholder="Digite a razão social"
              label="Razão social"
              register={register("corporate_name")}
            />
            <Input
              name="contract_health"
              type="text"
              placeholder="Digite o contrato de Saúde"
              label="Contrato de Saúde"
              register={register("contract_health")}
            />
            <Input
              name="contract_life"
              type="text"
              placeholder="Digite o contrato de Vida"
              label="Contrato de Vida"
              register={register("contract_life")}
            />
            <Input
              name="contract_dental"
              type="text"
              placeholder="Digite o contrato Dental"
              label="Contrato Dental"
              register={register("contract_dental")}
            />

            {/* Seleção de Operadora */}
            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "14px", fontWeight: "600", color: "var(--color-primary-2)" }}>
              Operadora de Saúde / Dental
              <select
                {...register("operadora")}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "1px solid #d0d5dd",
                  fontSize: "14px",
                  color: "#344054",
                  backgroundColor: "#fff",
                  marginTop: "4px",
                  cursor: "pointer",
                }}
              >
                {OPERADORAS.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
            </label>

            <Button type="submit" name="Atualizar"></Button>
          </form>
          <div className="positionClient">
            <h3>Gerenciamento de Usuário</h3>
            {rhUser && rhUser.power_bi_link && (
              <a className="powerbi-button" href={rhUser.power_bi_link} target="_blank" rel="noopener noreferrer">
                
                Power BI Link
              </a>
            )}
            
              <Button
              type="submit"
              name="Subfatura"
              onClick={() => {
                setClientModal(<CreateSubModal client_id={client.id} />);
              }}
            ></Button>
            <Button
              type="submit"
              name="Criar usuário"
              onClick={() => {
                setClientModal(<CreateClientModal client_id={client.id} />);
              }}
            ></Button>
          </div>
          <ul className="clientList">
            {users ? users.map((user) =>
              <li key={user.id} className="opacity-2">
                <span
                  className="close"
                  onClick={() => {
                    setClientModal(<RemoveClientModal name={user.name} user_id={user.id} client_id={client.id} />);
                  }}
                >
                  x
                </span>
                <h4>{user.name}</h4>
                <div>
                  <Button
                    type="button"
                    name="Editar"
                    onClick={() => {
                      setClientModal(<EditClientModal user={user} client_id={client.id} />);
                    }}
                  ></Button>
                  <Button
                    type="button"
                    name={user.active ? "Desativar" : "Ativar"}
                    onClick={() => { deactivateUser(user.id, user.active, client.id) }}
                    className={!user.active ? "active" : "deactive"}>
                  </Button>
                </div>
              </li>
            ) : null}
          </ul>
        </div>
      </ModalBackground>
    </EditCompany>
  );
};
