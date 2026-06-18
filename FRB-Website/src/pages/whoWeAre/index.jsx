import React, { useEffect } from "react";
import styled from "styled-components";
import { LandingGlobalStyle } from "../../styles/GlobalStyles";
import { CustomCursor } from "../../components/landing/CustomCursor";
import { Navbar } from "../../components/landing/Navbar";
import { Hero } from "../../components/landing/Hero";
import { Manifesto } from "../../components/landing/Manifesto";
import { Familia } from "../../components/landing/Familia";
import { ProgramaExclusivo } from "../../components/landing/ProgramaExclusivo";
import { Servicos } from "../../components/landing/Servicos";
import { Diferenciais } from "../../components/landing/Diferenciais";
import { CTAFinal } from "../../components/landing/CTAFinal";
import { Contato } from "../../components/landing/Contato";
import { LandingFooter } from "../../components/landing/LandingFooter";

const LandingWrapper = styled.div`
  background: var(--black);
  position: relative;
`;

export const WhoWeAre = () => {
  useEffect(() => {
    // Força foco na janela para que scroll wheel funcione sem precisar clicar primeiro
    window.focus();
    document.body.setAttribute("tabindex", "-1");
    document.body.focus({ preventScroll: true });
    document.body.removeAttribute("tabindex");

    // Micro-scroll: inicializa o sistema de scroll do browser de forma programática
    requestAnimationFrame(() => {
      window.scrollBy(0, 1);
      requestAnimationFrame(() => window.scrollBy(0, -1));
    });
  }, []);

  return (
    <>
      <LandingGlobalStyle />
      <CustomCursor />
      <LandingWrapper>
        <Navbar />
        <Hero />
        <Manifesto />
        <Familia />
        <ProgramaExclusivo />
        <Servicos />
        <Diferenciais />
        <CTAFinal />
        <Contato />
        <LandingFooter />
      </LandingWrapper>
    </>
  );
};
