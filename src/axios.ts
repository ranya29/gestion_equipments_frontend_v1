import axios, { AxiosInstance } from "axios";
declare module "../../axios";

const API_URL: string = "http://localhost:3000/api";

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export default api;
