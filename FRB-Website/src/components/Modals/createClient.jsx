import { ModalBackground } from "./ModalBackground";
import { Button } from "../Button";
import { Input } from "../Input";
import { CreateClient } from "./createClientStyle";
import { AdminContext } from "../../contexts/adminContext/adminContext";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { createUserSchema } from "../../schemas"
import { yupResolver } from "@hookform/resolvers/yup";


export const CreateClientModal = ({client_id}) => {
  const { createUser } = useContext(AdminContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(createUserSchema),
  });

  return (
    <CreateClient>
      <ModalBackground size="createClient">
        <div>
          <form onSubmit={handleSubmit((body)=>{createUser(body,client_id, "Criar")})}>
            <Input
              name="name"
              type="text"
              placeholder="Digite o nome do usuário"
              label="Nome do usuário"
              register={register("name")}
              error={errors.name && <p className="error">{errors.name.message}</p>}
            />
            <Input
              name="power_bi_link"
              type="text"
              placeholder="Digite o link power Bi"
              label="Link Power Bi somente o App"
              register={register("power_bi_link")}
              error={errors.power_bi_link && <p className="error">{errors.power_bi_link.message}</p>}
            />
            <Input
              name="email"
              type="email"
              placeholder="Atualize o email do usuário"
              label="E-mail"
              register={register("email")}
              error={errors.email && <p className="error">{errors.email.message}</p>}
            />
            <label>
              Nivel do usuário
              <select {...register("user_level")}>
                <option value="">--</option>
                <option value="medic">Médico</option>
                <option value="rh">RH</option>
                <option value="invoicinguser">Faturamento e Power BI</option>
                
              </select>
              {errors.user_level && <p className="error">{errors.user_level.message}</p>}
            </label>
            <label>
              Descrição do usuário
              <textarea
                name="description"
                placeholder="Digite a descrição do usuário"
                {...register("description")}
                >
              </textarea>
                {errors.description && <p className="error">{errors.description.message}</p>}
            </label>
            <div>
              <Button type="submit" name="Criar" ></Button>
            </div>
          </form>
        </div>
      </ModalBackground>
    </CreateClient>
  );
};
