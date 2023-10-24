import axios from "axios";

export const api = axios.create({
    baseURL: "https://frbseguros.com.br/api/",
    timeout: 100000
})