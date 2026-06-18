import { ModalBackground } from "./ModalBackground";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { AdminContext } from "../../contexts/adminContext/adminContext";
import { createClientSchema } from "../../schemas";
import {
  ModalTitle, ModalForm, ModalGrid, FieldGroup, FieldLabel, FieldInput,
  FieldError, ModalPrimaryBtn,
} from "./modalShared";

export const CreateCompanyModal = () => {
  const { createClient } = useContext(AdminContext);

  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "onBlur",
    resolver: yupResolver(createClientSchema),
  });

  return (
    <ModalBackground size="createCompany">
      <ModalTitle>Adicionar Cliente</ModalTitle>
      <ModalForm onSubmit={handleSubmit((body) => createClient(body, "Adicionar"))}>

        <FieldGroup>
          <FieldLabel>Nome do cliente *</FieldLabel>
          <FieldInput placeholder="Nome do cliente" {...register("client_name")} />
          {errors.client_name && <FieldError>{errors.client_name.message}</FieldError>}
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>CNPJ *</FieldLabel>
          <FieldInput placeholder="00.000.000/0000-00" {...register("cnpj")} />
          {errors.cnpj && <FieldError>{errors.cnpj.message}</FieldError>}
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Razão Social *</FieldLabel>
          <FieldInput placeholder="Razão social" {...register("corporate_name")} />
          {errors.corporate_name && <FieldError>{errors.corporate_name.message}</FieldError>}
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Telefone</FieldLabel>
          <FieldInput type="tel" placeholder="(00) 00000-0000" {...register("tel")} />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>E-mail</FieldLabel>
          <FieldInput type="email" placeholder="email@empresa.com.br" {...register("client_email")} />
        </FieldGroup>

        <ModalGrid>
          <FieldGroup>
            <FieldLabel>Contrato Saúde</FieldLabel>
            <FieldInput
              type="number"
              placeholder="Nº contrato"
              {...register("contract_health")}
              style={{ MozAppearance: "textfield" }}
            />
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>Contrato Vida</FieldLabel>
            <FieldInput
              type="number"
              placeholder="Nº contrato"
              {...register("contract_life")}
              style={{ MozAppearance: "textfield" }}
            />
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>Contrato Dental</FieldLabel>
            <FieldInput
              type="number"
              placeholder="Nº contrato"
              {...register("contract_dental")}
              style={{ MozAppearance: "textfield" }}
            />
          </FieldGroup>
        </ModalGrid>

        <ModalPrimaryBtn type="submit">Adicionar Cliente</ModalPrimaryBtn>
      </ModalForm>
    </ModalBackground>
  );
};
