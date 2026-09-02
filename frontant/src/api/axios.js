import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const API = api;
export default api;
