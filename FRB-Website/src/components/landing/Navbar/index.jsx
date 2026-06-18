import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logoWhite from "../../../assets/img/logoBranca.webp";

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: background 0.5s ease, border-color 0.5s ease, backdrop-filter 0.5s ease;
  background: ${({ $scrolled }) =>
    $scrolled ? "rgba(2, 12, 27, 0.9)" : "transparent"};
  backdrop-filter: ${({ $scrolled }) => ($scrolled ? "blur(24px)" : "none")};
  border-bottom: 1px solid
    ${({ $scrolled }) => ($scrolled ? "rgba(4, 173, 224, 0.1)" : "transparent")};
`;

const Container = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 40px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`;

const LogoWrapper = styled(motion.a)`
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  flex-shrink: 0;
`;

const LogoImg = styled.img`
  height: 38px;
  object-fit: contain;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  flex: 1;
  justify-content: center;

  @media (max-width: 1024px) {
    gap: 22px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(motion.a)`
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--white);
  opacity: 0.6;
  text-decoration: none;
  position: relative;
  cursor: pointer;
  white-space: nowrap;

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    border-radius: var(--radius-pill);
    background: var(--accent);
    transition: width 0.35s ease;
  }

  &:hover {
    opacity: 1;
    &::after {
      width: 100%;
    }
  }
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ClientButton = styled(motion.a)`
  font-family: "Nunito", sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: var(--white);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 9px 22px;
  border-radius: var(--radius-pill);
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.3s ease, color 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.45);
    color: var(--white);
  }
`;

const ContactButton = styled(motion.button)`
  font-family: "Nunito", sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: var(--black);
  background: var(--accent);
  border: none;
  padding: 10px 24px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 0 20px var(--accent-glow);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 0 32px rgba(4, 173, 224, 0.38);
  }
`;

const HamburgerButton = styled.button`
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 4px;
  z-index: 110;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const HamLine = styled(motion.span)`
  display: block;
  width: 24px;
  height: 2px;
  border-radius: var(--radius-pill);
  background: var(--white);
  transform-origin: center;
`;

const MobileOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: var(--navy);
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
`;

const MobileNavLink = styled(motion.a)`
  font-family: "Nunito", sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: var(--white);
  text-decoration: none;
  cursor: pointer;
  opacity: 0.85;
  transition: color 0.3s ease;

  &:hover {
    color: var(--accent);
  }
`;

const MobileDivider = styled.div`
  width: 40px;
  height: 1px;
  background: rgba(4, 173, 224, 0.25);
  margin: 4px 0;
`;

const MobileClientBtn = styled(motion.a)`
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: var(--white);
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 12px 32px;
  border-radius: var(--radius-pill);
  text-decoration: none;
  cursor: pointer;
`;

const MobileContactBtn = styled(motion.a)`
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: var(--black);
  background: var(--accent);
  padding: 14px 36px;
  border-radius: var(--radius-pill);
  text-decoration: none;
  cursor: pointer;
`;

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const links = [
  { label: "Sobre", id: "manifesto" },
  { label: "Planos", id: "planos" },
  { label: "Serviços", id: "servicos" },
  { label: "Programa", id: "programa" },
  { label: "Diferenciais", id: "diferenciais" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLink = (id) => {
    setMenuOpen(false);
    scrollTo(id);
  };

  return (
    <>
      <Nav
        $scrolled={scrolled}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <Container>
          <LogoWrapper
            href="/"
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <LogoImg src={logoWhite} alt="FRB Consultoria" />
          </LogoWrapper>

          <NavLinks>
            {links.map((link, i) => (
              <NavLink
                key={link.label}
                onClick={() => scrollTo(link.id)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 0.6, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
                whileHover={{ opacity: 1, y: -1 }}
              >
                {link.label}
              </NavLink>
            ))}
          </NavLinks>

          <RightGroup>
            <ClientButton
              href="/areadocliente"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              Área do Cliente
            </ClientButton>

            <ContactButton
              onClick={() => scrollTo("contato")}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.52 }}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              Fale Conosco
            </ContactButton>
          </RightGroup>

          <HamburgerButton
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <HamLine
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <HamLine
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
            />
            <HamLine
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </HamburgerButton>
        </Container>
      </Nav>

      <AnimatePresence>
        {menuOpen && (
          <MobileOverlay
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {links.map((link, i) => (
              <MobileNavLink
                key={link.label}
                onClick={() => handleLink(link.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                {link.label}
              </MobileNavLink>
            ))}

            <MobileDivider />

            <MobileClientBtn
              href="/areadocliente"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: links.length * 0.06, duration: 0.4 }}
              onClick={() => setMenuOpen(false)}
            >
              Área do Cliente
            </MobileClientBtn>

            <MobileContactBtn
              onClick={() => handleLink("contato")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: links.length * 0.06 + 0.07, duration: 0.4 }}
            >
              Fale Conosco
            </MobileContactBtn>
          </MobileOverlay>
        )}
      </AnimatePresence>
    </>
  );
};
