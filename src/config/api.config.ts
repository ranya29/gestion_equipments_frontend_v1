// src/config/api.config.ts
import axios from 'axios';

// ✅ AVEC "/api" à la fin
const API_BASE_URL = 'http://localhost:3000/api';
const apiClient = axios.create({
  baseURL: API_BASE_URL,  // ← Doit être http://localhost:3000/api
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});


// Intercepteur pour ajouter le token JWT aux requêtes
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      window.location.href = '/auth/signin';
    }
    return Promise.reject(error);
  }
);

export default apiClient;