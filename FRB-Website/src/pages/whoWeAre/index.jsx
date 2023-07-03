import { Main } from "./style";
import { Header } from "../../components/header";
import { Footer } from "../../components/Footer";
import father from "../../assets/img/apontando2.webp";
import stethoscope from "../../assets/img/stethoscope.webp";
import management from "../../assets/img/management.webp";
import selfManagement from "../../assets/img/selfManagement.webp";
import apart from "../../assets/img/apart.webp";
import BI from "../../assets/img/BI.webp";
import medic from "../../assets/img/medic.webp";
import { SlideShow } from "../../components/Slider";
import { useRef } from "react";
import { ObservedItem } from "../../components/Observer";
import { BsChevronDoubleDown } from "react-icons/bs";
import agility from "../../assets/img/agiliserv.webp";
import flexibility from "../../assets/img/flexibility.webp";
import simplicity from "../../assets/img/simplicity.webp";
import acessiblitypic from "../../assets/img/acessiblitypic.webp";
import technology from "../../assets/img/relacion.webp";
import zeal from "../../assets/img/excelencia.webp";
import proactive from "../../assets/img/proactive.webp";

export const WhoWeAre = () => {
  const whyFRB = useRef(false);
  const fatherImg = useRef(false);
  const text = useRef(false);
  const text1 = useRef(false);
  const text2 = useRef(false);
  const text3 = useRef(false);
  const text4 = useRef(false);
  const text5 = useRef(false);
  const text6 = useRef(false);

  const img1 = useRef(false);
  const img2 = useRef(false);
  const img3 = useRef(false);
  const img4 = useRef(false);
  const img5 = useRef(false);
  const img6 = useRef(false);
  return (
    <>
      <Header />
      <Main>
        <SlideShow />
        <section className="firstSection">
            <div ref={whyFRB} className="none">
              <h3>Por que a FRB?</h3>
              <div>
                <p>
                  Nossa reputação sólida e expertise no setor são fundamentais
                  para construção de relacionamentos.
                </p>
                <p>
                  Ao longo dos anos, estabelecemos um nome de confiança como
                  provedores de serviços em gestão.
                </p>
                <p>
                  Quando você escolhe nossa empresa, você escolhe a
                  tranquilidade de saber que será atendido por uma equipe
                  experiente e dedicada.
                </p>
              </div>
              
            </div>
        </section>
          <ObservedItem
            onVisible={() => {
              whyFRB.current.className = "whyFRB slideRight";
            }}
          >
          </ObservedItem>
        <div className="fatherImg">
          <ObservedItem
            onVisible={() => {
              fatherImg.current.className = "slideRight";
              text.current.className = "slideLeft";
            }}
          >
            <img
              className="none"
              ref={fatherImg}
              src={father}
              alt="imagem pai e filha"
            />
            <p className="none" ref={text}>
              Protegendo com confiança, credibilidade e segurança.
            </p>
          </ObservedItem>
        </div>
        <div className="positionH4P scale">
          <div className="separete width">
        <h4>Missão</h4>
        <p >
          Nossa missão é ser a consultoria de confiança, estabelecendo
          relacionamento sólido e transparente, interligando e facilitando a
          relação entre empresas, seguradoras e operadoras de saúde. Oferecemos
          serviços de gestão de risco em saúde, com excelência, proatividade e
          comprometimento.
        </p></div>
        
          <div className="width">
        <h4>Visão</h4>
        <p className="pH4"> 
          Ser reconhecidos como a referência no segmento de seguros,
          destacando-nos pela confiabilidade, relacionamentos duradouros,
          primando pela proximidade e agilidade no atendimento.
        </p></div></div>
        <h4 className="values">Valores</h4>
        <div className="positionCard ">
          <ObservedItem
            onVisible={() => {
              text1.current.className = "positionText slideRight";
            }}
          >
            <div ref={text1} className="none">
              <p className="purple">Agilidade</p>
              <p className="article ">
                Nós entendemos que a burocracia e a demora nas respostas podem
                ser fontes de frustração. É por isso que treinamos nossa equipe
                para acolher, entender o problema e buscar as soluções mais
                viáveis e rápidas, com atendimento personalizado.
              </p>
            </div>
          </ObservedItem>

          <ObservedItem
            onVisible={() => {
              img1.current.className = "imgCard slideLeft";
            }}
          >
            <img
              ref={img1}
              className="none"
              src={agility}
              alt="Imagem sobre agilidade"
            />
          </ObservedItem>
        </div>
        <div className="positionCard invert">
          <ObservedItem
            onVisible={() => {
              text2.current.className = "positionText slideLeft";
            }}
          >
            <div ref={text2} className="none">
              <p className="purple">Acessibilidade</p>
              <p className="article">
                Somos acessíveis, estabelecendo canais de contato fáceis e
                flexíveis!
              </p>
            </div>
          </ObservedItem>
          <ObservedItem
            onVisible={() => {
              img2.current.className = "imgCard slideRight";
            }}
          >
            <img
              ref={img2}
              className="none"
              src={acessiblitypic}
              alt="Imagem sobre agilidade"
            />
          </ObservedItem>
        </div>
        <div className="positionCard">
          <ObservedItem
            onVisible={() => {
              text3.current.className = "positionText slideRight";
            }}
          >
            <div ref={text3} className="none ">
              <p className="purple">Confiança</p>
              <p className="article">
                Valorizamos a confiança como base para todos os nossos
                relacionamentos, cultivando a transparência e a integridade.
              </p>
            </div>
          </ObservedItem>
          <ObservedItem
            onVisible={() => {
              img3.current.className = "imgCard slideLeft";
            }}
          >
            <img
              ref={img3}
              className="none"
              src={simplicity}
              alt="Imagem sobre agilidade"
            />
          </ObservedItem>
        </div>
        <div className="positionCard invert">
          <ObservedItem
            onVisible={() => {
              text4.current.className = "positionText slideLeft";
            }}
          >
            <div ref={text4} className="none">
              <p className="purple">Relacionamento</p>
              <p className="article">
                Priorizamos relacionamentos duradouros, baseados no respeito, na
                empatia e no comprometimento com as necessidades e objetivos dos
                clientes.
              </p>
            </div>
          </ObservedItem>
          <ObservedItem
            onVisible={() => {
              img4.current.className = "imgCard slideRight";
            }}
          >
            <img
              ref={img4}
              className="none"
              src={technology}
              alt="Imagem sobre agilidade"
            />
          </ObservedItem>
        </div>
        <div className="positionCard">
          <ObservedItem
            onVisible={() => {
              text5.current.className = "positionText slideRight";
            }}
          >
            <div ref={text5} className="none">
              <p className="purple">Excelência</p>
              <p className="article">
                {" "}
                Buscamos a excelência em nossos serviços, entregando soluções
                personalizadas e de qualidade para garantir a proteção e a
                tranquilidade dos clientes.
              </p>
            </div>
          </ObservedItem>
          <ObservedItem
            onVisible={() => {
              img5.current.className = "imgCard imgzeal slideLeft";
            }}
          >
            <img
              ref={img5}
              className="none"
              src={zeal}
              alt="Imagem sobre agilidade"
            />
          </ObservedItem>
        </div>
        <div className="positionCard invert">
          <ObservedItem
            onVisible={() => {
              text6.current.className = "positionText slideLeft";
            }}
          >
            <div ref={text6} className="none">
              <p className="purple">Proatividade</p>
              <p className="article">
                Somos proativos em antecipar desafios e oferecer soluções
                inovadoras, adaptando-nos às necessidades em constante evolução
                dos nossos clientes.
              </p>
            </div>
          </ObservedItem>
          <ObservedItem
            onVisible={() => {
              img6.current.className = "imgCard slideRight";
            }}
          >
            <img
              ref={img6}
              className="none"
              src={proactive}
              alt="Imagem sobre agilidade"
            />
          </ObservedItem>
        </div>
        <section>
          <ul className="cardList">
            <li>
              <img src={stethoscope} alt="Gestão Integrada de Saúdescópio" />
              <h3>Gestão Integrada de Saúde</h3>
              <p>
                Gestão eficaz realizada com indicadores preditivos para
                melhorias na utilização das coberturas dos benefícios de saúde.
              </p>
            </li>
            <li>
              <img src={management} alt="Plataforma de Gestão de Benefícios" />
              <h3>Plataforma de Gestão de Benefícios</h3>
              <p>
                Automatização de processos administrativos. Seu time ganha mais
                tempo e recursos para focar em estratégias.
              </p>
            </li>
            <li>
              <img src={selfManagement} alt="Autogestão para Empresas" />
              <h3>Autogestão para Empresas</h3>
              <p>
                Promoção de saúde e bem-estar dos colaboradores. Mais qualidade
                de vida, motivação e produtividade.
              </p>
            </li>
            {/* <li>
              <img src={apart} alt="Gestão de Afastados" />
              <h3>Gestão de Afastados</h3>
              <p>
                Organização de dados e controle de indicadores. Transparência e
                assertividade para eliminar possíveis inconsistências e conter
                custos.
              </p>
            </li> */}
            <li>
              <img src={BI} alt="Graficos" />
              <h3>BI</h3>
              <p>
                Gestão eficaz realizada com indicadores preditivos para
                melhorias na utilização das coberturas dos benefícios de saúde.
              </p>
            </li>
            <li>
              <img src={medic} alt="Concierge Médico" />
              <h3>Concierge Médico</h3>
              <p>
                Acolhimento e atendimento humanizado para seus colaboradores.
                Acompanhamento de casos clínicos complexos.
              </p>
            </li>
          </ul>
        </section>
      </Main>
      <Footer />
    </>
  );
};
