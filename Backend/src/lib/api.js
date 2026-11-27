
import axios from "axios";

export const TOKEN_KEY = "ekajy_token";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";

    const estAuth =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/me") ||
      url.includes("/auth/forgot-password") ||
      url.includes("/auth/reset-password");

    if (error.response?.status === 401 && !estAuth) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event("ekajy:unauthorized"));
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ekajy_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export { api };
export default api;
