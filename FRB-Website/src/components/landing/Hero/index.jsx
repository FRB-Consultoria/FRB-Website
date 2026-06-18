import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import heroVideo from "../../../assets/videos/hero-woman-mask.mp4";

const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  height: 100svh;
  touch-action: pan-y;
`;

const HeroVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  pointer-events: none;
  touch-action: none;
  clip-path: inset(0);

  @media (max-width: 768px) {
    object-position: 62% center;
  }
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    160deg,
    rgba(2, 12, 27, 0.85) 0%,
    rgba(4, 22, 46, 0.55) 55%,
    rgba(4, 173, 224, 0.06) 100%
  );
`;

const HeroBottomFade = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(2, 12, 27, 0.45) 40%,
    rgba(2, 12, 27, 0.85) 72%,
    var(--black) 100%
  );
  pointer-events: none;
  z-index: 1;
`;

const HeroContent = styled.div`
  position: absolute;
  top: 80px;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 80px 110px;
  z-index: 2;
  touch-action: pan-y;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;

  @media (max-width: 1024px) {
    padding: 0 48px 80px;
  }

  @media (max-width: 768px) {
    padding: 0 24px 64px;
  }
`;

const Label = styled(motion.p)`
  font-family: "Nunito", sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 20px;
`;

const H1 = styled(motion.h1)`
  font-family: "Nunito", sans-serif;
  font-size: clamp(38px, 5.5vw, 92px);
  font-weight: 800;
  letter-spacing: -1.5px;
  line-height: 1.05;
  color: var(--white);
  margin-bottom: 24px;
  max-width: 760px;

  @media (max-height: 800px) {
    font-size: clamp(36px, 4.5vh, 72px);
    margin-bottom: 16px;
  }
`;

const Subtitle = styled(motion.p)`
  font-family: "Nunito", sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 1.8;
  color: rgba(238, 245, 255, 0.6);
  margin-bottom: 48px;
  max-width: 500px;

  @media (max-height: 800px) {
    font-size: 15px;
    margin-bottom: 28px;
  }
`;

const CTARow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const PrimaryButton = styled(motion.button)`
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 700;
  background: var(--accent);
  color: var(--black);
  border: none;
  padding: 16px 40px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  box-shadow: 0 0 32px rgba(4, 173, 224, 0.3);
`;

const SecondaryButton = styled(motion.button)`
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--white);
  background: transparent;
  border: none;
  opacity: 0.65;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ease = [0.16, 1, 0.3, 1];

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

export const Hero = () => {
  return (
    <HeroSection>
      <HeroVideo autoPlay muted loop playsInline>
        <source src={heroVideo} type="video/mp4" />
      </HeroVideo>
      <HeroOverlay />
      <HeroBottomFade />

      <HeroContent>
        <Label
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease }}
        >
          Gestão de Benefícios Corporativos
        </Label>

        <H1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease }}
        >
          Protegemos quem
          <br />
          move sua empresa.
        </H1>

        <Subtitle
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.62, ease }}
        >
          Planos de saúde, vida e dental com consultoria especializada
          para empresas em todo o Brasil.
        </Subtitle>

        <CTARow
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.78, ease }}
        >
          <PrimaryButton
            onClick={() => scrollTo("planos")}
            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 0 48px rgba(4,173,224,0.45)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 18 }}
          >
            Conhecer planos
          </PrimaryButton>
          <SecondaryButton
            onClick={() => scrollTo("programa")}
            whileHover={{ opacity: 1, x: 4 }}
            transition={{ duration: 0.3 }}
          >
            Ver nosso programa exclusivo
          </SecondaryButton>
        </CTARow>
      </HeroContent>

      <ScrollIndicator
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.5 }}
      >
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </ScrollIndicator>
    </HeroSection>
  );
};
