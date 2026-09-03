import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

export const API = api;
export default api;