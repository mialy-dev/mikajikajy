import axios from 'axios';

// Adresse du backend (sans /api). Modifiable dans frontend/.env :  VITE_API_URL=http://localhost:5000
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '').replace(/\/api$/, '');

export const api = axios.create({
  baseURL: `${API_URL}/api`,   // toutes les routes du backend commencent par /api
  withCredentials: true,       // cookie HttpOnly "token"
});

// Compatibilite : si un appel ecrit deja '/api/xxx', on evite le doublon /api/api/xxx
api.interceptors.request.use((cfg) => {
  if (typeof cfg.url === 'string' && cfg.url.startsWith('/api/')) cfg.url = cfg.url.slice(4);
  return cfg;
});

export default api; // import api from '../lib/api'  ET  import { api } from '../lib/api' fonctionnent