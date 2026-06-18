// src/components/InstallApp/index.jsx
// Convite para instalar o Portal FRB como app (PWA), sem loja.
// Detecta o sistema (iPhone/iPad/Android) e o navegador exato (Safari, Chrome,
// Firefox, Edge, Samsung, Opera) e mostra o passo a passo certo para cada um.
//  - Android/Chromium: botão real de instalar (evento beforeinstallprompt).
//  - iOS e demais: instruções precisas por navegador.
import { useEffect, useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import {
  FiX, FiShare, FiPlusSquare, FiSmartphone, FiDownload,
  FiMoreVertical, FiMenu,
} from "react-icons/fi";
import FRB from "../../assets/img/logoBranca.webp";

const DISMISS_KEY = "@frb_install_dismissed_at";
const PAUSE_DAYS = 5;

const fadeUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}`;

const Overlay = styled.div`
  position: fixed; inset: 0; z-index: 4000;
  display: flex; align-items: flex-end; justify-content: center;
  background: rgba(0,0,0,.55); backdrop-filter: blur(4px);
`;
const Card = styled.div`
  width: 100%; max-width: 470px;
  background: #0d1525;
  border: 1px solid rgba(4,173,224,.3);
  border-top-left-radius: 22px; border-top-right-radius: 22px;
  padding: 22px 22px calc(20px + env(safe-area-inset-bottom, 0px));
  box-shadow: 0 -20px 60px rgba(0,0,0,.6);
  animation: ${fadeUp} .28s ease;
  @media (min-width: 520px) { margin-bottom: 18px; border-radius: 22px; }
`;
const Top = styled.div`display: flex; align-items: center; gap: 14px; margin-bottom: 6px;`;
const Logo = styled.div`
  width: 56px; height: 56px; border-radius: 15px; flex-shrink: 0;
  background: #05162b; border: 1px solid rgba(4,173,224,.3);
  display: flex; align-items: center; justify-content: center;
  img { width: 40px; }
`;
const Titles = styled.div`
  flex: 1; min-width: 0;
  h3 { margin: 0; color: #fff; font-size: 1.05rem; font-weight: 800; }
  p  { margin: 2px 0 0; color: rgba(255,255,255,.5); font-size: .8rem; }
`;
const Close = styled.button`
  background: transparent; border: none; color: rgba(255,255,255,.35);
  cursor: pointer; padding: 6px; border-radius: 8px; flex-shrink: 0;
  &:hover { color: #fff; background: rgba(255,255,255,.08); }
`;
const Chip = styled.span`
  display: inline-flex; align-items: center; gap: 6px;
  margin: 6px 0 12px; padding: 4px 10px; border-radius: 999px;
  background: rgba(4,173,224,.12); border: 1px solid rgba(4,173,224,.25);
  color: #7fd6f0; font-size: .72rem; font-weight: 700;
`;
const Lead = styled.p`
  color: rgba(255,255,255,.62); font-size: .88rem; line-height: 1.5; margin: 0 0 16px;
`;
const InstallBtn = styled.button`
  width: 100%; border: none; cursor: pointer;
  background: linear-gradient(135deg,#04ade0,#0270a0); color: #fff;
  font-size: .95rem; font-weight: 800; padding: 14px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; gap: 9px;
  transition: filter .15s;
  &:hover { filter: brightness(1.1); }
`;
const Steps = styled.ol`
  margin: 0; padding: 0; list-style: none;
  display: flex; flex-direction: column; gap: 10px;
`;
const Step = styled.li`
  display: flex; align-items: center; gap: 11px;
  color: rgba(255,255,255,.82); font-size: .86rem; line-height: 1.4;
  .num {
    width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
    background: rgba(4,173,224,.14); color: #04ade0;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: .82rem;
  }
  svg { color: #04ade0; flex-shrink: 0; }
  strong { color: #fff; }
`;
const Note = styled.p`
  margin: 12px 0 0; padding: 10px 12px; border-radius: 10px;
  background: rgba(250,204,21,.08); border: 1px solid rgba(250,204,21,.22);
  color: #facc15; font-size: .76rem; line-height: 1.45;
`;
const Later = styled.button`
  width: 100%; background: transparent; border: none; cursor: pointer;
  color: rgba(255,255,255,.4); font-size: .82rem; padding: 14px 0 2px;
  &:hover { color: rgba(255,255,255,.7); }
`;

const isStandalone = () =>
  (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
  window.navigator.standalone === true;

function detect() {
  const ua = navigator.userAgent || "";
  const ios = /iphone|ipad|ipod/i.test(ua) && !window.MSStream;
  const android = /android/i.test(ua);
  const os = ios ? "ios" : android ? "android" : "other";

  let browser = "other", label = "navegador";
  if (ios) {
    if (/CriOS/i.test(ua))      { browser = "chrome";  label = "Chrome"; }
    else if (/FxiOS/i.test(ua)) { browser = "firefox"; label = "Firefox"; }
    else if (/EdgiOS/i.test(ua)){ browser = "edge";    label = "Edge"; }
    else if (/Safari/i.test(ua)){ browser = "safari";  label = "Safari"; }
  } else if (android) {
    if (/SamsungBrowser/i.test(ua)) { browser = "samsung"; label = "Samsung Internet"; }
    else if (/EdgA/i.test(ua))      { browser = "edge";    label = "Edge"; }
    else if (/OPR|Opera/i.test(ua)) { browser = "opera";   label = "Opera"; }
    else if (/Firefox/i.test(ua))   { browser = "firefox"; label = "Firefox"; }
    else if (/Chrome/i.test(ua))    { browser = "chrome";  label = "Chrome"; }
  }
  const device = /ipad/i.test(ua) ? "iPad" : ios ? "iPhone" : android ? "Android" : "celular";
  const mobile = ios || android || /Mobile/i.test(ua);
  return { os, browser, label, device, mobile };
}

export const InstallApp = () => {
  const [info, setInfo] = useState(null);
  const [deferred, setDeferred] = useState(null);
  const [visible, setVisible] = useState(false);

  const dismissed = useCallback(() => {
    const at = Number(localStorage.getItem(DISMISS_KEY) || 0);
    return at && (Date.now() - at) < PAUSE_DAYS * 864e5;
  }, []);

  useEffect(() => {
    if (isStandalone()) return;
    const det = detect();
    if (!det.mobile) return;
    setInfo(det);

    const onBIP = (e) => { e.preventDefault(); setDeferred(e); };
    const onInstalled = () => { setVisible(false); localStorage.setItem(DISMISS_KEY, String(Date.now())); };
    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);

    let t;
    if (!dismissed()) t = setTimeout(() => setVisible(true), 1600);
    return () => {
      if (t) clearTimeout(t);
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [dismissed]);

  const close = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  };

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    try {
      const { outcome } = await deferred.userChoice;
      if (outcome === "accepted") setVisible(false);
    } catch { /* ignore */ }
    setDeferred(null);
  };

  if (!visible || !info) return null;

  const { os, browser, label, device } = info;

  // ── Monta o passo a passo certo para o sistema + navegador detectados ──
  let body;

  if (deferred) {
    // Android Chromium com instalação nativa disponível: 1 clique.
    body = (
      <InstallBtn onClick={install}>
        <FiDownload size={18} /> Adicionar à tela inicial
      </InstallBtn>
    );
  } else if (os === "ios" && (browser === "safari")) {
    body = (
      <Steps>
        <Step><span className="num">1</span><FiShare size={18} /><span>Toque em <strong>Compartilhar</strong> (o quadrado com a seta para cima), na barra do Safari.</span></Step>
        <Step><span className="num">2</span><FiPlusSquare size={18} /><span>Role e escolha <strong>Adicionar à Tela de Início</strong>.</span></Step>
        <Step><span className="num">3</span><FiSmartphone size={18} /><span>Toque em <strong>Adicionar</strong>, no canto superior direito.</span></Step>
      </Steps>
    );
  } else if (os === "ios" && browser === "chrome") {
    body = (
      <Steps>
        <Step><span className="num">1</span><FiShare size={18} /><span>Toque em <strong>Compartilhar</strong> (o quadrado com a seta), na barra do Chrome.</span></Step>
        <Step><span className="num">2</span><FiPlusSquare size={18} /><span>Escolha <strong>Adicionar à Tela de Início</strong>.</span></Step>
        <Step><span className="num">3</span><FiSmartphone size={18} /><span>Toque em <strong>Adicionar</strong>.</span></Step>
      </Steps>
    );
  } else if (os === "ios") {
    // Firefox/Edge/outros no iPhone: a instalação confiável é pelo Safari.
    body = (
      <>
        <Steps>
          <Step><span className="num">1</span><FiShare size={18} /><span>Abra este endereço no <strong>Safari</strong>.</span></Step>
          <Step><span className="num">2</span><FiShare size={18} /><span>No Safari, toque em <strong>Compartilhar</strong> (quadrado com a seta).</span></Step>
          <Step><span className="num">3</span><FiPlusSquare size={18} /><span>Escolha <strong>Adicionar à Tela de Início</strong> e toque em <strong>Adicionar</strong>.</span></Step>
        </Steps>
        <Note>No iPhone, o {label} não instala o app. Use o Safari para instalar.</Note>
      </>
    );
  } else if (os === "android" && browser === "samsung") {
    body = (
      <Steps>
        <Step><span className="num">1</span><FiMenu size={18} /><span>Toque no <strong>menu</strong> do Samsung Internet (as três linhas, no rodapé).</span></Step>
        <Step><span className="num">2</span><FiPlusSquare size={18} /><span>Escolha <strong>Adicionar página a</strong> e depois <strong>Tela inicial</strong>.</span></Step>
        <Step><span className="num">3</span><FiSmartphone size={18} /><span>Confirme em <strong>Adicionar</strong>.</span></Step>
      </Steps>
    );
  } else if (os === "android" && browser === "firefox") {
    body = (
      <Steps>
        <Step><span className="num">1</span><FiMoreVertical size={18} /><span>Toque no <strong>menu</strong> do Firefox (os três pontinhos).</span></Step>
        <Step><span className="num">2</span><FiPlusSquare size={18} /><span>Escolha <strong>Instalar</strong> ou <strong>Adicionar à tela inicial</strong>.</span></Step>
        <Step><span className="num">3</span><FiSmartphone size={18} /><span>Confirme em <strong>Adicionar</strong>.</span></Step>
      </Steps>
    );
  } else if (os === "android") {
    // Chrome, Edge, Opera, Brave e similares.
    body = (
      <Steps>
        <Step><span className="num">1</span><FiMoreVertical size={18} /><span>Toque no <strong>menu</strong> do {label} (os três pontinhos, no topo).</span></Step>
        <Step><span className="num">2</span><FiPlusSquare size={18} /><span>Escolha <strong>Instalar aplicativo</strong> ou <strong>Adicionar à tela inicial</strong>.</span></Step>
        <Step><span className="num">3</span><FiSmartphone size={18} /><span>Confirme em <strong>Instalar</strong>.</span></Step>
      </Steps>
    );
  } else {
    body = (
      <Steps>
        <Step><span className="num">1</span><FiMoreVertical size={18} /><span>Abra o <strong>menu</strong> do navegador.</span></Step>
        <Step><span className="num">2</span><FiPlusSquare size={18} /><span>Escolha <strong>Adicionar à tela inicial</strong>.</span></Step>
      </Steps>
    );
  }

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && close()}>
      <Card>
        <Top>
          <Logo><img src={FRB} alt="FRB" /></Logo>
          <Titles>
            <h3>Instalar o app da FRB</h3>
            <p>Portal FRB Consultoria</p>
          </Titles>
          <Close onClick={close} aria-label="Fechar"><FiX size={20} /></Close>
        </Top>

        <Chip><FiSmartphone size={12} /> {device}, {label}</Chip>

        <Lead>
          Adicione o portal à tela inicial do seu celular e acesse como um aplicativo,
          em tela cheia, sem precisar baixar nada na loja.
        </Lead>

        {body}

        <Later onClick={close}>Agora não</Later>
      </Card>
    </Overlay>
  );
};

export default InstallApp;
