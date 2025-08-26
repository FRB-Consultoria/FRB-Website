import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { AdminContext } from "../../contexts/adminContext/adminContext";
import { ModalBackground } from "./ModalBackground";
import { Button } from "../Button";
import { Input } from "../Input";
import { CreateSub } from "./createSubStyle";

 const cpfcnpjMask = (value) => {
  if (!value) return "";

  let result;
  if (value.length < 14 || (value.length <= 14 && value.includes("."))) {
    result = value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  } else {
    result = value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  }

  return result;
};

export const CreateSubModal = ({ client_id }) => {
  const { createSub, subinvoices, getSubinvoices2 } = useContext(AdminContext);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    getSubinvoices2();
  }, []);

  const handleCNPJChange = (e) => {
    const value = cpfcnpjMask(e.target.value);
    setValue("sub_cnpj", value);
  };

  const handleNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setValue("sub_number", value);
  };

  // const isValidCNPJ = (cnpj) => {
  //   cnpj = cnpj.replace(/[^\d]+/g, '');

  //   if (cnpj.length !== 14) return false;

  //   // Elimina CNPJs inválidos conhecidos
  //   if (/^(\d)\1+$/.test(cnpj)) return false;

  //   // Valida DVs
  //   let length = cnpj.length - 2;
  //   let numbers = cnpj.substring(0, length);
  //   let digits = cnpj.substring(length);
  //   let sum = 0;
  //   let pos = length - 7;
    
  //   for (let i = length; i >= 1; i--) {
  //     sum += numbers.charAt(length - i) * pos--;
  //     if (pos < 2) pos = 9;
  //   }
  //   let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  //   if (result != digits.charAt(0)) return false;

  //   length = length + 1;
  //   numbers = cnpj.substring(0, length);
  //   sum = 0;
  //   pos = length - 7;
  //   for (let i = length; i >= 1; i--) {
  //     sum += numbers.charAt(length - i) * pos--;
  //     if (pos < 2) pos = 9;
  //   }
  //   result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  //   if (result != digits.charAt(1)) return false;

  //   return true;
  // };

  const filteredSubinvoices = subinvoices.filter(
    (subinvoice) => subinvoice.client_id === client_id
  );

  const onSubmit = async (data) => {
    // if (!isValidCNPJ(data.sub_cnpj)) {
    //   alert("CNPJ inválido");
    //   return;
    // }

    setSpinner(true);
    const body = { ...data, client_id };
    await createSub(body, "Criar");
    setSpinner(false);
    reset();
  };

  return (
    <CreateSub>
      <ModalBackground size="CreateSub">
        <div>
          <h2>Subfaturas Criadas</h2>
          {filteredSubinvoices.length === 0 ? (
            <p>Ainda não foram criadas Subfaturas</p>
          ) : (
            <ul>
              {filteredSubinvoices.map((subinvoice) => (
                <li key={subinvoice.id}>
                  {subinvoice.name} - {subinvoice.sub_number}
                </li>
              ))}
            </ul>
          )}
        </div>
        <h2>Criar Subfatura</h2>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>
              Nome da empresa na Subfatura
              <input
                name="name"
                type="text"
                placeholder="Digite o nome da empresa"
                {...register("name", { required: "Este campo é obrigatório" })}
              />
              {errors.name && <p className="error">{errors.name.message}</p>}
            </label>
            <label>
              Número da Subfatura
              <input
                name="sub_number"
                type="text"
                placeholder="Digite o número da Subfatura"
                onChange={handleNumberChange}
                {...register("sub_number", { required: "Este campo é obrigatório" })}
              />
              {errors.sub_number && <p className="error">{errors.sub_number.message}</p>}
            </label>
            <label>
              CNPJ da Subfatura
              <input
                name="sub_cnpj"
                type="text"
                placeholder="Digite o CNPJ da Subfatura"
                onChange={handleCNPJChange}
                maxLength="18"
                {...register("sub_cnpj", { required: "Este campo é obrigatório" })}
              />
              {errors.sub_cnpj && <p className="error">{errors.sub_cnpj.message}</p>}
            </label>
            <label>
              Unidade da Subfatura
              <input
                name="sub_unity"
                type="text"
                placeholder="Digite a unidade da Subfatura"
                {...register("sub_unity", { required: "Este campo é obrigatório" })}
              />
              {errors.sub_unity && <p className="error">{errors.sub_unity.message}</p>}
            </label> <label>
              Apólice da Subfatura
              <input
                name="apolice"
                type="text"
                placeholder="Digite a apólice Subfatura"
                {...register("apolice", { required: "Este campo é obrigatório" })}
              />
              {errors.apolice && <p className="error">{errors.apolice.message}</p>}
            </label>
            <div className="buttonContainer">
              <Button type="submit" name="Criar" disabled={spinner} />
            </div>
          </form>
        </div>
      </ModalBackground>
    </CreateSub>
  );
};
