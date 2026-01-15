// src/axios.ts
import axios, { AxiosInstance } from "axios";

const API_URL: string = import.meta.env.VITE_API_URL; 
// VITE_API_URL="http://localhost:3000"

const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,  // 🔴 Ajout du /api
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;