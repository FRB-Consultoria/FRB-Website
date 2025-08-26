import { ModalBackground } from "./ModalBackground";
import { Button } from "../Button";
import { Input } from "../Input";
import { EditClient } from "./editClientStyle";
import { AdminContext } from "../../contexts/adminContext/adminContext";
import { useContext } from "react";
import { useForm } from "react-hook-form";

export const EditClientModal = ({user, client_id}) => {
  const { updateUser } = useContext(AdminContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues:{
      name: user.name,
      power_bi_link: user.power_bi_link,
      email: user.email,
      user_level: user.user_level,
      description: user.description
    }
  });

  return (
    <EditClient>
      <ModalBackground size="editClient">
        <div>
          <form onSubmit={handleSubmit((body)=>{updateUser(body,user.id, client_id, "Atualizar")})}>
            <Input
              name="name"
              type="text"
              placeholder="Atualize o nome do usuário"
              label="Nome do usuário"
              register={register("name")}
            />
            <Input
              name="power_bi_link"
              type="text"
              placeholder="Atualize o link Power Bi"
              label="Link Power Bi somente o App"
              register={register("power_bi_link")}
            />
            <Input
              name="email"
              type="email"
              placeholder="Atualize o email do usuário"
              label="E-mail"
              register={register("email")}
            />
            <label> Nivel do usuário
              <select {...register("user_level")}>
                <option value="">--</option>
                <option value="medic">Médico</option>
                <option value="rh">RH</option>
                <option value="invoicinguser">Faturamento e Power BI</option>
                
              </select>
            </label>
            <label> Descrição do usuário
              <textarea name="description" 
              placeholder="Digite a descrição do usuário"
              
              {...register("description")}>
              </textarea>
            </label>
            <div>
              <Button type="submit" name="Atualizar"></Button>
            </div>
          </form>
        </div>
      </ModalBackground>
    </EditClient>
  );
};
