import { Header } from "../../components/header";
import { Footer } from "../../components/Footer";
import { Main } from "./style";
import intro from "../../assets/img/introBenefits.webp";
import life from "../../assets/img/IconLife.webp";
import health from "../../assets/img/IconHealth.webp";
import tooth from "../../assets/img/IconTooth.webp";
import iconLifeBlue from "../../assets/img/iconLifeBlue.webp";

export const Benefits = () => {
  return (
    <>
      <Header />
      <Main>
        <div className="positionTextInto">
          <img className="imgIntro" src={intro} alt="Introdução a página" />
          <p className="textIntro">Englobado os seguintes Benefícios</p>
        </div>
        <div className="positionCard">
          <div className="boxImg cardPosition positionTextBenfits widthbox">
            <img className="imgBenefits " src={tooth} alt="Icone de Dente" />
            <p className="textBenefits controlText widthbox">Dental</p>
          </div>
          <div className="widthbox">
            <div className="boxImgHealth cardPositionHealth positionTextBenfits positionHealth widthbox">
              <img
                className="imgBenefits marginHealth "
                src={health}
                alt="Icone de Saúde"
              />
              <p className="textBenefits controlText widthbox">Saúde</p>
            </div>
            <div className="whiteBanner widthbox"></div>
            <div className="blueBanner widthbox"> </div>
          </div>
          <div className="boxImg  positionTextBenfits cardPosition widthbox">
            <img className="imgBenefits" src={life} alt="Icone de Vida" />
            <p className="textBenefits controlText widthbox">Vida</p>
          </div>
        </div>
        <div>
          <div className="boxBlue marginTop">
            <div className="positionLayout">
              <img
                className="imgBenefits marginHealth"
                src={health}
                alt="Icone de Saúde"
              />{" "}
              <p className="textHealth">Saúde</p>
            </div>
            <div className="positionLayoutText">
              <p className="articleHealth">
                A saúde é um dos aspectos mais valiosos na vida de qualquer
                pessoa.{" "}
              </p>
              <p className="articleHealth articleHealthFinal">
                Ao oferecer um Plano de Saúde abrangente para sua equipe, você
                demonstrará o cuidado que a empresa tem com o bem-estar de cada
                colaborador.{" "}
              </p>
            </div>
          </div>
          <div className="boxWhite">
            <div className="positionLayout">
              <img
                className="imgBenefits marginHealth"
                src={iconLifeBlue}
                alt="Icone de Saúde"
              />{" "}
              <p className="textLife">Vida</p>
            </div>
            <div className="positionLayoutText">
              <p className="articleLife">
                Na jornada da vida, imprevistos podem acontecer, e é nosso dever
                garantir que seus colaboradores estejam preparados para
                enfrentá-los.{" "}
              </p>
              <p className="articleLife articleLifeFinal">
                Apresentamos a você nosso incrível Plano de Vida, uma solução
                completa que proporciona segurança financeira e tranquilidade
                para seus funcionários.{" "}
              </p>
            </div>
          </div>
          <div className="boxBlue">
            <div className="positionLayout">
              <img
                className="imgBenefits marginHealth"
                src={tooth}
                alt="Icone de Saúde"
              />{" "}
              <p className="textHealth">Dental</p>
            </div>
            <div className="positionLayoutText">
              <p className="articleHealth">
                Um sorriso saudável reflete a qualidade de vida de uma pessoa.
              </p>
              <p className="articleHealth">
                Nosso Plano Dental abrange uma série de procedimentos essenciais
                para a saúde bucal.
              </p>
              <p className="articleHealth articleHealthFinal">
                Ao oferecer esse benefício, você estará valorizando a saúde de
                seus colaboradores.
              </p>
            </div>
          </div>
        </div>
      </Main>
      <Footer />
    </>
  );
};
