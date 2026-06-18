import {
  PageWrapper,
  BrandSide,
  BrandLogo,
  BrandContent,
  BrandTitle,
  BrandSub,
  BrandFeatures,
  BrandFeatureItem,
  BrandBack,
  Divider,
  FormSide,
  MobileLogo,
  FormCard,
  FormTitle,
  FormSub,
  FieldGroup,
  FieldWrapper,
  FieldLabel,
  FieldInput,
  EyeButton,
  ErrorText,
  SubmitButton,
  MobileBackLink,
  ModalContainer,
  ModalButton,
  customStyles,
} from "./style";
import FRB from "../../assets/img/logoBranca.webp";
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/userContext/userContext";
import { useForm } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { schemaLogin } from "../../schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import Modal from "react-modal";
import { RhSelectModal } from "../../components/Modals/RhSelectModal";

export const CustomerArea = () => {
  const navigate = useNavigate();
  const { handleForm, showModal, setShowModal, showBenefitsModal, setShowBenefitsModal, showRhModal, setShowRhModal, userInfo, spinner } = useContext(UserContext);
  const [eye, setEye] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schemaLogin),
  });

  const handleModalClose = () => setShowModal(false);
  const handleFaturamentoClick = () => { navigate("/faturamento"); handleModalClose(); };
  const handleUserClick = () => { navigate("/user"); handleModalClose(); };
  const handleBiClick = () => { navigate("/bi"); handleModalClose(); };

  const handleBenefitsModalClose = () => setShowBenefitsModal(false);
  const handleGoInclusao = () => { navigate("/beneficios/portal"); handleBenefitsModalClose(); };
  const handleGoFaturamento = () => { navigate("/beneficios/faturamento"); handleBenefitsModalClose(); };

  return (
    <>
      <PageWrapper>
        <BrandSide>
          <BrandLogo src={FRB} alt="FRB Consultoria" />

          <BrandContent>
            <BrandTitle>
              Portal de <span>Gestão</span> FRB Consultoria
            </BrandTitle>
            <BrandSub>
              Acesse contratos, documentos, faturamento e benefícios dos seus colaboradores em um só lugar.
            </BrandSub>
            <BrandFeatures>
              <BrandFeatureItem>Gestão de planos de saúde, vida e dental</BrandFeatureItem>
              <BrandFeatureItem>Acompanhamento de faturamento em tempo real</BrandFeatureItem>
              <BrandFeatureItem>Envio e controle de documentos</BrandFeatureItem>
              <BrandFeatureItem>Carteirinhas digitais para colaboradores</BrandFeatureItem>
              <BrandFeatureItem>Visualização de relatórios em Power BI</BrandFeatureItem>
            </BrandFeatures>
          </BrandContent>

          <BrandBack onClick={() => navigate("/")}>
            ← Voltar para o site
          </BrandBack>
        </BrandSide>

        <Divider />

        <FormSide>
          <MobileLogo src={FRB} alt="FRB Consultoria" />

          <FormCard>
            <FormTitle>Acessar conta</FormTitle>
            <FormSub>Entre com suas credenciais para continuar</FormSub>

            <form onSubmit={handleSubmit(handleForm)}>
              <FieldGroup>
                <FieldWrapper>
                  <FieldLabel htmlFor="username">E-mail</FieldLabel>
                  <FieldInput
                    id="username"
                    type="text"
                    placeholder="seu@email.com.br"
                    autoComplete="username"
                    {...register("username")}
                  />
                  {errors.username && <ErrorText>{errors.username.message}</ErrorText>}
                </FieldWrapper>

                <FieldWrapper>
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <FieldInput
                    id="password"
                    type={eye ? "password" : "text"}
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    {...register("password")}
                  />
                  <EyeButton type="button" onClick={() => setEye(!eye)} tabIndex={-1}>
                    {eye ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </EyeButton>
                  {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
                </FieldWrapper>
              </FieldGroup>

              <SubmitButton type="submit" disabled={!!spinner}>
                {spinner ? "Entrando..." : "Entrar"}
              </SubmitButton>
            </form>
          </FormCard>

          <MobileBackLink onClick={() => navigate("/")}>
            ← Voltar para o site
          </MobileBackLink>
        </FormSide>
      </PageWrapper>

      {userInfo?.user_level === "invoicinguser" && (
        <Modal
          isOpen={showModal}
          onRequestClose={handleModalClose}
          contentLabel="Escolha de área"
          ariaHideApp={false}
          style={customStyles}
        >
          <ModalContainer>
            <h2>Escolha uma opção</h2>
            <ModalButton onClick={handleFaturamentoClick}>Ir para o Faturamento</ModalButton>
            {userInfo?.power_bi_link?.includes("app") && (
              <ModalButton onClick={handleUserClick}>Ir para o Power BI</ModalButton>
            )}
            {userInfo?.perms?.bi && (
              <ModalButton onClick={handleBiClick}>Ir para o BI FRB</ModalButton>
            )}
          </ModalContainer>
        </Modal>
      )}

      {userInfo?.user_level === "benefitsadmin" && (
        <Modal
          isOpen={showBenefitsModal}
          onRequestClose={handleBenefitsModalClose}
          contentLabel="Área de Benefícios"
          ariaHideApp={false}
          style={customStyles}
        >
          <ModalContainer>
            <h2>O que deseja fazer?</h2>
            <ModalButton onClick={handleGoInclusao}>Central de Beneficiários </ModalButton>
            <ModalButton onClick={handleGoFaturamento} style={{ background: "rgba(4,173,224,0.15)", borderColor: "#04ADE0" }}>
              Organização do Faturamento
            </ModalButton>
          </ModalContainer>
        </Modal>
      )}

      {/* Modal RH agora renderizado na página /user (onde o usuário rh é redirecionado) */}
    </>
  );
};
