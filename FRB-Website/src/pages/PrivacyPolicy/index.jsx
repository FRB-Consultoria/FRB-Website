import {Main} from "./style"
import { Header } from "../../components/header";
import pdfReader from "./Policy.pdf"
import {AiFillFilePdf} from "react-icons/ai"
import {BiLink} from "react-icons/bi"

// import {politic} from "../../assets/pdf/politic.pdf"
import { Link } from "react-router-dom";
export const PrivacyPolicy = () =>{
    return(<Main>
<Header className="static" />
<section>
    <p>Termos de uso e Política de Privacidade</p></section>
    <article>
        
            <a href={pdfReader} target="_blank" rel="noopener noreferrer"> <AiFillFilePdf/> Política de Privacidade </a>
    </article><section>
    <p>Portal da Privacidade</p></section>
    <article>
        
            <a href="https://frbconsultoria.dpo.direct/index.aspx" target="_blank" rel="noopener noreferrer"> <BiLink/> Portal da Privacidade </a>
    </article>
    
</Main>
        )

}