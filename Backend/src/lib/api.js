import axios from "axios";

export const TOKEN_KEY = "ekajy_token";
export default api;


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});



// export const api = axios.create({
//   baseURL: "http://localhost:5000/api",
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

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