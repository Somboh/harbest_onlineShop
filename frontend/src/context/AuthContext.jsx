import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  //isLoading arranca en true para que el Splash y los guards puedan distinguir
  //"todavía no sé si hay sesión" de "no hay sesión".
  const [isLoading, setIsLoading] = useState(true);

  //Hidrata el estado desde AsyncStorage al montar la app. authService lee el
  //JWT guardado, comprueba expiración, y devuelve {id,email,role} o null.
  //AsyncStorage cae a localStorage en web, así que esto sobrevive a recargas.
  const refresh = useCallback(async () => {
    try {
      const current = await authService.getCurrentUser();
      setUser(current);
    } catch (err) {
      console.error("Error hidratando sesión:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  //Login envuelve authService.userLogin/farmerLogin y, si va bien, refresca el
  //estado del contexto con el JWT recién guardado para que el resto de la app
  //(useAuth) se entere sin recargar.
  const loginUser = useCallback(
    async (credentials) => {
      const res = await authService.userLogin(credentials);
      if (res?.status === "OK") await refresh();
      return res;
    },
    [refresh],
  );

  const loginFarmer = useCallback(
    async (credentials) => {
      const res = await authService.farmerLogin(credentials);
      if (res?.status === "OK") await refresh();
      return res;
    },
    [refresh],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: Boolean(user),
      isLoading,
      loginUser,
      loginFarmer,
      logout,
      refresh,
    }),
    [user, isLoading, loginUser, loginFarmer, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

export default AuthContext;
