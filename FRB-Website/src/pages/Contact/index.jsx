import { Main } from "./style";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Select } from "../../components/Select";

export const Contact = () => {
  return (
    <>
      <Header className="static" />
      <Main>
        <div className="container">
          <div className="text">
            <h2>
                Comece agora a transformação que a sua empresa precisa
            </h2>
            <p>
              Preencha o formulário para que nossos consultores entrem em
              contato.
            </p>
          </div>
          <form action="https://formsubmit.co/contatofrb@frbconsultoria.com.br" method="POST">
            <div>
              <Input
                name="name"
                type="text"
                placeholder="Digite seu nome"
                label="Nome*"
                required={true}
              />


              <Input
                name="email"
                type="email"
                placeholder="Digite seu email"
                label="E-mail*"
                required={true}
                
              />
            </div>
            <div>
              <Input
                name="tel"
                type="tel"
                placeholder="Digite seu telefone"
                label="Telefone"
                
              />
              <label>Estado*
                <Select required={true} />
              </label>
            </div>
            <label>Fale Conosco*
            <textarea required name="description" placeholder="Sobre o que deseja falar?"  ></textarea></label>
            <div className="buttonBox">
              <Button type="submit" name="Enviar" />
            </div>
            <input type="hidden" name="_subject" value="E-mail recebido pelo preenchimento do formulário" />
            <input type="hidden" name="_honey"  />
            <input type="hidden" name="_next" value="https://frbconsultoria.com.br/contato/obrigadopelocontato"/>
            
            <input type="hidden" name="_captcha" value="false"/>
          </form>
        </div>
      </Main>
      <Footer />
    </>
  );
};
