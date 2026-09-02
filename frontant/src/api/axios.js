import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://multi-tenant-ecommerce-project-2.onrender.com/api",
});

export const API = api;
export default api;
