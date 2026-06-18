
import axios from "axios";
import { requestLoader } from "./requestLoader";
// export const api = axios.create({
//     baseURL: "https://frbseguros.com.br/api/",
//     timeout: 100000
// })
const rawBaseURL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BASE_URL ||
  "http://127.0.0.1:8000/api/"
  // "https://frbseguros.com.br/api/";
  // "https://hom.frbseguros.com.br/api/";

const normalizeBaseURL = (url) => {
  if (!url) return "http://127.0.0.1:8000/api/";
  // if (!url) return "https://frbseguros.com.br/api/";
    // if (!url) return "https://hom.frbseguros.com.br/api/";

  return url.endsWith("/") ? url : `${url}/`;
};

const getStoredToken = () => {
  const tokenRaw = window.localStorage.getItem("@token");
  if (!tokenRaw) return null;
  try {
    return JSON.parse(tokenRaw);
  } catch {
    return tokenRaw;
  }
};

let _redirectingToLogin = false;
const redirectToLogin = () => {
  if (_redirectingToLogin) return;
  _redirectingToLogin = true;
  window.localStorage.removeItem("@token");
  delete api.defaults.headers.common["Authorization"];
  window.location.href = "/areadocliente";
};

export const api = axios.create({
  baseURL: normalizeBaseURL(rawBaseURL),
  timeout: 100000,
});

api.interceptors.request.use(
  (config) => {
    if (!config.skipGlobalLoader) {
      requestLoader.start();
    }

    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    requestLoader.stop();
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (!response.config?.skipGlobalLoader) {
      requestLoader.stop();
    }
    return response;
  },
  (error) => {
    if (!error.config?.skipGlobalLoader) {
      requestLoader.stop();
    }

    const status = error?.response?.status;

    // Token expirado ou inválido → limpa sessão e redireciona para login
    // Exceto: endpoint de login (evita reload em credencial errada)
    // Exceto: chamadas com skipAuthRedirect:true (evita redirect no carregamento inicial)
    if (status === 401) {
      const url = error?.config?.url || '';
      const skipAuthRedirect = error?.config?.skipAuthRedirect;
      if (!skipAuthRedirect && !url.includes('users/login/')) {
        redirectToLogin();
      }
      return Promise.reject(error);
    }

    // 403 = sem permissão para este recurso (sessão ainda válida)
    // Apenas propaga o erro — cada componente trata com seu próprio catch

    return Promise.reject(error);
  }
);