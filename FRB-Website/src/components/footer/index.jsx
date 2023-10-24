import { FooterStyle } from "./styled";
import logo from "../../assets/img/FRB.webp";
import { GrInstagram } from "react-icons/gr";
import { GrLinkedinOption } from "react-icons/gr";
import { Link } from "react-router-dom";

export const Footer = () => {
  function scrollToSmoothly(pos, time) {
    const currentPos = window.pageYOffset || document.documentElement.scrollTop;
    const distance = pos - currentPos;
    const framesPerSecond = 60;
    const totalTime =
      Math.max(0.1, Math.min(Math.abs(distance) / 1000, 0.8)) * time;
    const increment = distance / (totalTime / (1000 / framesPerSecond));

    let currentPosition = currentPos;
    let currentTime = 0;

    function animateScroll() {
      currentTime += 1000 / framesPerSecond;
      currentPosition += increment;
      window.scrollTo(0, currentPosition);
      if (currentTime < totalTime) {
        requestAnimationFrame(animateScroll);
      }
    }
    animateScroll();
  }
  const redirectToInstagram = () => {
    window.location.href = "https://www.instagram.com/frbconsultoria_/";
  };
  return (
    <FooterStyle>
      <div className="footerBox">
        <div className="gapPolitic">
          <div>
          <h3>Email para contato</h3>
          <p>contatofrb@frbconsultoria.com.br</p></div>
          <div>
          <Link className="linkpolitic"
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            to={"/politicadeprivacidade"}
          >
            <h3>Termos de uso e Política de Privacidade</h3> 
          </Link></div>
          {/* <h3>Telefone para contato</h3>
          <p>(xx)xxxxx-xxxx</p> */}
        </div>
        <div className="about">
          <h3>Sobre</h3>
          <Link
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            to={"/"}
          >
            Quem somos
          </Link>
          <Link
            onClick={() => {
              scrollToSmoothly(650, 3000);
            }}
            to={"/serviços"}
          >
            Serviços
          </Link>
          {/* <Link
            className="positionBenefits"
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            to={"/beneficios"}
          >
            Benefícios
          </Link> */}
          <Link
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            to={"/contato"}
          >
            Contato
          </Link>
          <Link
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            to={"/areadocliente"}
          >
            Área do cliente
          </Link>
        </div>
        {/* <div>
          <h3>Siga-nos</h3>
          <div className="icons">
            <GrInstagram onClick={redirectToInstagram} />
            <GrLinkedinOption />
          </div>
        </div> */}
      </div>

      <img
        src={logo}
        alt="logo FRB"
        className="imgLogo"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </FooterStyle>
  );
};
