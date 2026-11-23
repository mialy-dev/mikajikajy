
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier la session au démarrage
  useEffect(() => {
    let actif = true;

    api
      .get("/auth/me", { timeout: 8000 })
      .then((response) => {
        if (actif) {
          setUser(response.data?.user ?? null);
        }
      })
      .catch((error) => {
        if (actif) {
          setUser(null);
          console.error(
            "Erreur de vérification de session :",
            error.response?.data || error.message
          );
        }
      })
      .finally(() => {
        if (actif) setLoading(false);
      });

    return () => {
      actif = false;
    };
  }, []);

  // Gestion des sessions expirées
  useEffect(() => {
    const onUnauthorized = () => setUser(null);

    window.addEventListener("ekajy:unauthorized", onUnauthorized);

    return () => {
      window.removeEventListener("ekajy:unauthorized", onUnauthorized);
    };
  }, []);

  // Connexion
  const login = useCallback(async (email, password, remember = false) => {
    const response = await api.post("/auth/login", {
      email,
      password,
      remember,
    });

    const utilisateur = response.data?.user;

    if (!utilisateur) {
      throw new Error("Le serveur n'a pas retourné les informations utilisateur.");
    }

    setUser(utilisateur);
    return utilisateur;
  }, []);

  // Inscription
  const register = useCallback(async (payload) => {
    const response = await api.post("/auth/register", payload);
    return response.data;
  }, []);

  // Déconnexion
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  }, []);

  // Vérification des rôles
  const peut = useCallback(
    (...roles) => {
      return Boolean(user) &&
        (roles.length === 0 || roles.includes(user.role));
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        peut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }

  return context;
}
