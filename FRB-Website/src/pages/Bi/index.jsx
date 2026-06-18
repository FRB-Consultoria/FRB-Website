// src/pages/Bi/index.jsx
import { useContext, useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../../contexts/userContext/userContext";
import { api } from "../../services/api";
import {
  BiMain, PageHeader, HeaderLogo, BackIcon,
  TitleBlock, PageTitle, PageSub,
  TabsRow, TabButton,
  FrameWrap, FsButton, StateWrap, Spinner, StateTitle, StateText, RetryBtn,
  HintOverlay, HintCard, HintIcon, HintTitle, HintText, HintBtn,
} from "./style";
import FRB from "../../assets/img/logoBranca.webp";
import { BsArrowLeftCircle } from "react-icons/bs";
import { FiAlertTriangle, FiMaximize, FiMinimize } from "react-icons/fi";

// Usados enquanto GET /api/bi/pages/ não responde (mesmos defaults do backend)
const FALLBACK_PAGES = ["executivo", "utilizacao-detalhada"];
const FALLBACK_DEFAULT_PAGE = "executivo";

const PAGE_LABELS = {
  executivo: "Executivo",
  "utilizacao-detalhada": "Utilização Detalhada",
};

const labelFor = (slug) =>
  PAGE_LABELS[slug] ||
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const ERROR_MESSAGES = {
  invalid_page: "Este dashboard não está disponível no momento.",
  bi_not_allowed:
    "Você não tem permissão para acessar o BI. Solicite ao administrador.",
  bi_empresa_not_configured:
    "Sua empresa ainda não está habilitada para o BI. Fale com o suporte da FRB para liberar o acesso.",
  embed_keys_not_configured:
    "A integração com o BI está sendo configurada. Tente novamente em breve.",
};

const DEFAULT_ERROR_MESSAGE =
  "Não foi possível carregar o dashboard agora. Tente novamente.";

// Origem esperada para mensagens postMessage do IntellimedBI.
// Definida via VITE_BI_EMBED_ORIGIN quando o CNAME estiver confirmado;
// caso contrário derivamos do embedUrl em runtime.
const ENV_BI_ORIGIN = import.meta.env.VITE_BI_EMBED_ORIGIN || "";

export const Bi = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [pages, setPages] = useState(FALLBACK_PAGES);
  const [activePage, setActivePage] = useState(FALLBACK_DEFAULT_PAGE);
  const [embedUrl, setEmbedUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFs, setIsFs] = useState(false);
  // Dica de tela cheia — aparece sempre que a pessoa entra no BI
  const [showHint, setShowHint] = useState(true);

  // Mantém a origem do embed atual para validação de postMessage
  const embedOriginRef = useRef(ENV_BI_ORIGIN);
  // Container do iframe, usado para a tela cheia (estilo player de vídeo)
  const frameRef = useRef(null);

  // ── Tela cheia (Fullscreen API, compatível com Chrome/Safari/Edge) ──
  const toggleFullscreen = useCallback(() => {
    setShowHint(false);
    const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
    if (fsEl) {
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
    } else {
      const el = frameRef.current;
      if (el) (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () =>
      setIsFs(!!(document.fullscreenElement || document.webkitFullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
    };
  }, []);

  // Bloqueia acesso se perm_bi não está ativa
  useEffect(() => {
    if (user && !user.perm_bi) {
      navigate("/user");
    }
  }, [user, navigate]);

  // Carrega os dashboards habilitados (BI_PAGES / BI_DEFAULT_PAGE)
  useEffect(() => {
    let cancelled = false;

    api
      .get("bi/pages/", { skipGlobalLoader: true })
      .then((res) => {
        if (cancelled) return;
        const list = res.data?.pages?.length ? res.data.pages : FALLBACK_PAGES;
        setPages(list);
        setActivePage(res.data?.default_page || list[0]);
      })
      .catch(() => {
        if (!cancelled) setActivePage(FALLBACK_DEFAULT_PAGE);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const fetchEmbedUrl = useCallback((page) => {
    if (!page) return;

    setLoading(true);
    setError(null);

    api
      .get("bi/embed-url/", { params: { page }, skipGlobalLoader: true })
      .then((res) => {
        setEmbedUrl(res.data.url);
      })
      .catch((err) => {
        const code = err?.response?.data?.error;
        setError(ERROR_MESSAGES[code] || DEFAULT_ERROR_MESSAGE);
        setEmbedUrl("");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchEmbedUrl(activePage);
  }, [activePage, fetchEmbedUrl]);

  // Atualiza a origem esperada sempre que o embedUrl muda
  useEffect(() => {
    if (!embedUrl || ENV_BI_ORIGIN) return;
    try {
      embedOriginRef.current = new URL(embedUrl).origin;
    } catch {
      // url malformada — mantém origem anterior
    }
  }, [embedUrl]);

  // Renovação automática do token de embed: IntellimedBI avisa via postMessage.
  // Só aceita mensagens da origem conhecida do parceiro.
  useEffect(() => {
    const handleMessage = (event) => {
      const expected = embedOriginRef.current;
      if (!expected || event.origin !== expected) return;
      if (event?.data?.type === "intellimedbi:expired") {
        fetchEmbedUrl(activePage);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [activePage, fetchEmbedUrl]);

  return (
    <BiMain>
      <PageHeader>
        <BackIcon onClick={() => navigate("/user")}>
          <BsArrowLeftCircle />
        </BackIcon>
        <HeaderLogo src={FRB} alt="FRB" />
      </PageHeader>

      <TitleBlock>
        <PageTitle>BI · FRB Consultoria</PageTitle>
        <PageSub>
          Painéis de Business Intelligence com os indicadores do seu contrato.
        </PageSub>
      </TitleBlock>

      {pages.length > 1 && (
        <TabsRow>
          {pages.map((slug) => (
            <TabButton
              key={slug}
              type="button"
              $active={slug === activePage}
              onClick={() => setActivePage(slug)}
            >
              {labelFor(slug)}
            </TabButton>
          ))}
        </TabsRow>
      )}

      {error ? (
        <StateWrap>
          <FiAlertTriangle size={40} color="#f0b400" />
          <StateTitle>Não foi possível abrir o BI</StateTitle>
          <StateText>{error}</StateText>
          <RetryBtn type="button" onClick={() => fetchEmbedUrl(activePage)}>
            Tentar novamente
          </RetryBtn>
        </StateWrap>
      ) : loading ? (
        <StateWrap>
          <Spinner />
          <StateText>Carregando dashboard...</StateText>
        </StateWrap>
      ) : (
        <FrameWrap ref={frameRef}>
          <iframe
            key={embedUrl}
            src={embedUrl}
            title="BI · FRB Consultoria"
            allow="clipboard-read; clipboard-write; storage-access"
            allowFullScreen
            frameBorder="0"
          />
          <FsButton
            type="button"
            $pulse={showHint && !isFs}
            onClick={toggleFullscreen}
            title={isFs ? "Sair da tela cheia (Esc)" : "Tela cheia"}
            aria-label={isFs ? "Sair da tela cheia" : "Tela cheia"}
          >
            {isFs ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
          </FsButton>

          {showHint && !isFs && (
            <HintOverlay onClick={() => setShowHint(false)}>
              <HintCard onClick={(e) => e.stopPropagation()}>
                <HintIcon><FiMaximize size={26} /></HintIcon>
                <HintTitle>Veja o dashboard em tela cheia</HintTitle>
                <HintText>
                  Para visualizar o painel de forma <strong>completa</strong>, clique no
                  ícone de <strong>tela cheia</strong> no canto inferior direito (ele está
                  piscando). Para sair, é só apertar <strong>Esc</strong>.
                </HintText>
                <HintBtn type="button" onClick={() => setShowHint(false)}>Entendi</HintBtn>
              </HintCard>
            </HintOverlay>
          )}
        </FrameWrap>
      )}
    </BiMain>
  );
};
