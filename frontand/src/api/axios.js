import axios from 'axios';

const api = axios.create({
    baseURL: baseURL: 'https://multi-tenant-ecommerce-project-2.onrender.com/api',
});

export default api;