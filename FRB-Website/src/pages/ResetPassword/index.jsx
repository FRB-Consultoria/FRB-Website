import { Main } from "./style";
import FRB from "../../assets/img/FRB.png";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "../../schemas";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import jwt_decode from 'jwt-decode';

export const ResetPassword = () => {
  const params = useParams();
  const [token, setToken] = useState(false);
  const [eye, setEye] = useState(true);
  const navigate = useNavigate()
  const email = params.email;

  useEffect(() => {
    const login = async () => {
      const response = await api.post("users/login/", {
        username: email,
        password: email,
      });
      setToken(response.data.access);
    };
    login();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(resetPasswordSchema),
  });

  const resetPassword = async (body) => {
    const user_id = jwt_decode(token).user_id;
    try {
      const response = await api.patch(`users/${user_id}/`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      navigate("/areadocliente")
    } catch (err) {
      console.log(err);
    } 
  };

  return (
    <Main>
      <div className="positionHeader">
        <BsArrowLeftCircle
          className="iconBack"
          onClick={() => {
            window.history.back();
          }}
        />
        <img onClick={()=>{navigate("/")}} className="imgLogo" src={FRB} alt="Logo da empresa" />
      </div>
      <div className="positionText">
        <h2>Redefinir senha</h2>
        <p>
          Insira uma nova senha abaixo para ter acesso aos dados do seu
          assegurado
        </p>
      </div>
      <form onSubmit={handleSubmit(resetPassword)}>
        <div className="positionEye">
          <Input
            name="password"
            type={eye ? "password" : "text"}
            label="Nova senha"
            placeholder="Digite uma nova senha"
            register={register("password")}
            error={
              errors.password && (
                <p className="error">{errors.password.message}</p>
              )
            }
          />
        </div>
        <div className="positionEye">
          <Input
            name="confirmPassword"
            type={eye ? "password" : "text"}
            label="Confirme sua senha"
            placeholder="Digite senha novamente"
            register={register("confirmPassword")}
            error={
              errors.confirmPassword && (
                <p className="error">{errors.confirmPassword.message}</p>
              )
            }
          />
          {eye ? (
            <AiFillEyeInvisible
              onClick={() => {
                setEye(!eye);
              }}
            />
          ) : (
            <AiFillEye
              onClick={() => {
                setEye(!eye);
              }}
            />
          )}
        </div>
        <Button type="submit" name="Enviar" />
      </form>
      <p>Para maiores informações entre em <a href="/contato">contato</a></p>
      <a href="/areadocliente">Voltar para a área do cliente</a>
    </Main>
  );
};
