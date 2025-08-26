import axios from "axios";

export const api = axios.create({
    baseURL: "https://frbseguros.com.br/api/",
    timeout: 100000
})
// export const api = axios.create({
//     baseURL: "http://127.0.0.1:8000/api/",
//     timeout: 100000
// })