import * as yup from "yup";
const passwordType = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
const passwordReset = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required("Esse campo é obrigatório!")
    .matches(passwordReset, {
      message: "Deve conter minimo de 8 caractéres, ter letra, número e ao menos um símbolo",
    }),
  confirmPassword: yup
    .string()
    .required("Esse campo é obrigatório!")
    .oneOf([yup.ref("password"), null], "As senhas devem ser iguais"),
});

export const schemaLogin = yup.object().shape({
  username: yup.string().required("E-mail obrigatório"),
  password: yup.string().required("Senha obrigatória"),
});

export const createUserSchema = yup.object().shape({
  name: yup.string().required("Nome do usuário obrigatório"),
  email: yup.string().required("E-mail obrigatório").email("Email invalido"),
  user_level: yup.string().required("Nivel de usuário obrigatório"),
  power_bi_link: yup.string().required("Link do power bi obrigatório"),
  description: yup.string(),
});

export const createClientSchema = yup.object().shape({
  client_name: yup.string().required("Nome do cliente obrigatório"),
  cnpj: yup.string().required("cnpj do cliente obrigatório"),
  corporate_name: yup.string().required("Razão social do cliente obrigatório"),
});
