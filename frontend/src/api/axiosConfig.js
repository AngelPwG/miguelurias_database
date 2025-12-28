import axios from 'axios';

// 1. Definimos la URL base del Backend
const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Antes de cada petición, revisa si hay un token guardado
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const userLevel = localStorage.getItem('userLevel');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (userLevel) {
            config.headers['X-User-Level'] = userLevel;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;