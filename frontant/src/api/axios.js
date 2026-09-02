import axios from 'axios';

const api = axios.create({
  baseURL: 'https://multi-tenant-ecommerce-project-2.onrender.com/api',
});

export const API = api;
export default api;