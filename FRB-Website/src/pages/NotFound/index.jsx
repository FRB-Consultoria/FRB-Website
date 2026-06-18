// src/pages/NotFound/index.jsx
import { Link } from "react-router-dom";
import { FiHome, FiArrowLeft } from "react-icons/fi";
import { StyledNotFound, Inner, Logo, Code, Title, Subtitle, BtnGroup, BtnPrimary, BtnSecondary } from "./style";
import FRB from "../../assets/img/logoBranca.webp";

export const NotFound = () => {
  return (
    <StyledNotFound>
      <Inner>
        <Logo src={FRB} alt="FRB Consultoria" />

        <Code>404</Code>

        <Title>Página não encontrada</Title>
        <Subtitle>
          A página que você procura não existe ou foi removida.
          Verifique o endereço e tente novamente.
        </Subtitle>

        <BtnGroup>
          <BtnPrimary as={Link} to="/">
            <FiHome size={15} />
            Voltar para Home
          </BtnPrimary>
          <BtnSecondary as="button" onClick={() => window.history.back()} style={{ border: "1px solid rgba(255,255,255,.15)", background: "transparent", cursor: "pointer" }}>
            <FiArrowLeft size={15} />
            Página anterior
          </BtnSecondary>
        </BtnGroup>
      </Inner>
    </StyledNotFound>
  );
};
