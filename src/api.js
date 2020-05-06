import axios from "axios";

const api = axios.create({
  baseURL: "https://api.monzo.com",
});

export default api;
