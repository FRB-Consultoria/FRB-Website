
import axios from "axios";
import { requestLoader } from "./requestLoader";
// export const api = axios.create({
//     baseURL: "https://frbseguros.com.br/api/",
//     timeout: 100000
// })
const rawBaseURL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BASE_URL ||
  "http://127.0.0.1:8000/api/";
// https://frbseguros.com.br/api/;

const normalizeBaseURL = (url) => {
  if (!url) return "http://127.0.0.1:8000/api/";
//   if (!url) return "https://frbseguros.com.br/api/";

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

    if (error?.response?.status === 403) {
      window.location.reload();
    }

    return Promise.reject(error);
  }
);