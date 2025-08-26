import { Main, ModalContainer, ModalButton, customStyles } from "./style"; // Importe os novos estilos
import FRB from "../../assets/img/logoBranca.webp";
import backLogin from "../../assets/img/IconBackPage.webp";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useContext } from "react";
import { UserContext } from "../../contexts/userContext/userContext";
import { useForm } from "react-hook-form";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import { schemaLogin } from "../../schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import Modal from "react-modal";

export const CustomerArea = () => {
  const navigate = useNavigate();
  const { handleForm, showModal, setShowModal, userInfo } = useContext(UserContext);
  const [eye, setEye] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schemaLogin),
  });

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleFaturamentoClick = () => {
    navigate("/faturamento");
    handleModalClose();
  };

  const handleUserClick = () => {
    navigate("/user");
    handleModalClose();
  };

  return (
    <>
      <Main>
        <div className="positionIconBack">
          <img
            className="imgIconBack"
            src={backLogin}
            alt="Icone para Voltar"
            onClick={() => {
              navigate("/");
            }}
          />
        </div>

        <div className="positionLogo">
          <img className="imglogo" src={FRB} alt="Logo Da FRB" />
        </div>
        <div className="reverse">
          <div className="positionElipse slideLeft">
            <div className="positionElipse">
              <div className="positionElipse">
                <div className="elipse">
                  <div className="elipse2">
                    <div className="elipse3">
                      <form
                        onSubmit={handleSubmit(handleForm)}
                        className="boxLogin "
                      >
                        <p className="textLogin">Login</p>
                        <div className="inputPosition">
                          <Input
                            name="username"
                            type="text"
                            label="E-mail"
                            placeholder="Digite seu email"
                            register={register("username")}
                            error={errors.username && <p className="error">{errors.username.message}</p>}
                          />
                         
                          <div className="positionEye">
                            <Input
                              name="password"
                              type={eye ? "password" : "text"}
                              label="Senha"
                              placeholder="Digite sua senha"
                              register={register("password")}
                              error={errors.password && <p className="error">{errors.password.message}</p>}
                            />
                            {eye ? (
                              <AiFillEyeInvisible onClick={()=>{setEye(!eye)}} />
                              ) : (
                                <AiFillEye onClick={()=>{setEye(!eye)}} />
                                )}
                          </div>
                           
                        </div>

                        <Button type="submit" name="Entrar"></Button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="positionDeskText this">
            <p className="textFooter slideRight">
              Monitore a performance dos seus contratos
            </p>
          </div>
        </div>
      </Main>

      {userInfo.user_level === 'invoicinguser' && (
        <Modal
          isOpen={showModal}
          onRequestClose={handleModalClose}
          contentLabel="Invoicing and BI Options"
          ariaHideApp={false}
          style={customStyles}
        >
          <ModalContainer>
            <h2>Escolha uma opção</h2>
            <ModalButton onClick={handleFaturamentoClick}>Ir para o Faturamento</ModalButton>
{userInfo.power_bi_link.includes("app")?<ModalButton onClick={handleUserClick}>Ir para o Power BI</ModalButton>:""}
            
          </ModalContainer>
        </Modal>
      )}
    </>
  );
};
