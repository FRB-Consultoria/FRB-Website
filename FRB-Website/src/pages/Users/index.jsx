// src/pages/Users/index.jsx
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../contexts/userContext/userContext";
import {
  UserMain, PageHeader, HeaderLogo, BackIcon,
  GreetText, GreetRow, BiNavLink, PbiWrap,
  WelcomeScreen, WelcomeIcon, WelcomeTitle, WelcomeSub, ReopenBtn,
} from "./style";
import FRB from "../../assets/img/logoBranca.webp";
import { BsArrowLeftCircle } from "react-icons/bs";
import { FiBarChart2 } from "react-icons/fi";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router";
import { RhSelectModal } from "../../components/Modals/RhSelectModal";

export const User = () => {
  const {
    userInfo, observer, setObserver, user,
    showRhModal, setShowRhModal,
  } = useContext(UserContext);

  const navigate = useNavigate();

  // Controla se o iframe do Power BI foi liberado pelo usuário via modal
  const [pbiActive, setPbiActive] = useState(false);

  // Redireciona se nível não autorizado
  useEffect(() => {
    if (
      user.user_level !== "rh" &&
      user.user_level !== "medic" &&
      user.user_level !== "corretor" &&
      user.user_level !== "invoicinguser"
    ) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const raw   = localStorage.getItem("@token");
    const token = JSON.parse(raw);
    setObserver(jwt_decode(token));
  }, []);

  // Sempre que voltar para esta tela, reabre o leque de serviços disponíveis.
  useEffect(() => {
    setShowRhModal(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pbiLink  = observer?.power_bi_link || user?.power_bi_link;
  const clientId = observer?.client_id     || user?.client_id;
  const userName = observer?.name          || user?.name;

  return (
    <>
      <UserMain>
        <PageHeader>
          <BackIcon onClick={() => navigate("/areadocliente")}>
            <BsArrowLeftCircle />
          </BackIcon>
          <HeaderLogo src={FRB} alt="FRB" />
        </PageHeader>

        <GreetRow>
          <GreetText>Seja bem-vindo, {observer.name}!</GreetText>
          {user.perm_bi && (
            <BiNavLink onClick={() => navigate("/bi")}>
              <FiBarChart2 /> Acessar BI
            </BiNavLink>
          )}
        </GreetRow>

        {/* ── Iframe Power BI · só aparece depois que o usuário escolheu no modal ── */}
        {pbiActive && pbiLink ? (
          <PbiWrap>
            <iframe
              src={pbiLink}
              allowFullScreen
              frameBorder="0"
              title="Power BI"
            />
          </PbiWrap>
        ) : !showRhModal ? (
          /* Tela de boas-vindas · modal foi fechado sem escolher Power BI */
          <WelcomeScreen>
            <WelcomeIcon><FiBarChart2 size={52} /></WelcomeIcon>
            <WelcomeTitle>Olá, {userName?.split(" ")[0]}!</WelcomeTitle>
            <WelcomeSub>
              Escolha onde deseja navegar para ver as informações do seu contrato.
            </WelcomeSub>
            <ReopenBtn onClick={() => setShowRhModal(true)}>
              Ver opções disponíveis
            </ReopenBtn>
          </WelcomeScreen>
        ) : null}
      </UserMain>

      {/* Modal de seleção de áreas · RH, médico e corretor caem aqui após login.
          O próprio modal já filtra cada card pela permissão (perm_*) do usuário. */}
      {showRhModal && ["rh", "medic", "corretor"].includes(user?.user_level) && (
        <RhSelectModal
          onClose={() => setShowRhModal(false)}
          onSelectPowerBi={() => setPbiActive(true)}
          powerBiLink={pbiLink}
          clientId={clientId}
          userName={userName}
        />
      )}
    </>
  );
};
