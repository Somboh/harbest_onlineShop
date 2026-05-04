import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { favoritesService } from "../services/favoritesService";

const FavoritesContext = createContext(null);

const getEmailFromToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return null;
    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp < Date.now() / 1000) return null;
    return decoded.email ?? null;
  } catch {
    return null;
  }
};

//Hidrata un favorito recibido del back ({product_id, producto: {...}}) al
//formato que esperan las pantallas (campos `name`, `image`, `seller`, ...).
const hydrateFavorite = (raw) => {
  const prod = raw.producto ?? raw;
  //La imagen del backend viene como URL plana en `foto_url`. Image source en
  //RN necesita { uri } para URLs remotas.
  let image = prod.image ?? null;
  if (!image && prod.foto_url) image = { uri: prod.foto_url };

  return {
    id: prod.id ?? raw.product_id,
    name: prod.nombre ?? prod.name,
    seller: prod.email_agricultor ?? prod.seller,
    email_agricultor: prod.email_agricultor ?? null,
    category: prod.categoria ?? prod.category,
    price: prod.precio ?? prod.price,
    unit: prod.unit ?? "kg",
    image,
    rating: prod.valoracion ?? prod.rating,
    stock: prod.cantidad ?? prod.stock,
  };
};

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  //Nos suscribimos al estado de auth para refrescar favoritos cuando el usuario
  //hace login/logout (si no, después de loguearse seguiría viendo lista vacía
  //hasta que entrara a Favoritos a la fuerza).
  const { user, isLoading: authLoading } = useAuth();
  const userEmail = user?.email ?? null;

  const reloadFavorites = useCallback(async () => {
    const email = await getEmailFromToken();
    if (!email) {
      setFavorites([]);
      return;
    }
    try {
      const remote = await favoritesService.getFavoritesByUser(email);
      setFavorites((remote ?? []).map(hydrateFavorite).filter((p) => p && p.id));
    } catch (err) {
      console.error("Error cargando favoritos:", err);
    }
  }, []);

  useEffect(() => {
    //Esperamos a que AuthContext termine de hidratar para no llamar al backend
    //antes de que el token esté disponible.
    if (authLoading) return;
    reloadFavorites();
  }, [authLoading, userEmail, reloadFavorites]);

  const isFavorite = useCallback(
    (productId) => favorites.some((product) => product.id === productId),
    [favorites],
  );

  const addFavorite = useCallback(async (product) => {
    //optimistic update
    setFavorites((current) => {
      if (current.some((item) => item.id === product.id)) return current;
      return [...current, product];
    });
    const email = await getEmailFromToken();
    if (!email) return;
    try {
      await favoritesService.addFavorite(email, product.id);
    } catch (err) {
      console.error("Error añadiendo favorito:", err);
      //revierte si falla
      setFavorites((current) => current.filter((item) => item.id !== product.id));
    }
  }, []);

  const removeFavorite = useCallback(async (productId) => {
    let removed = null;
    setFavorites((current) => {
      removed = current.find((item) => item.id === productId) ?? null;
      return current.filter((product) => product.id !== productId);
    });
    const email = await getEmailFromToken();
    if (!email) return;
    try {
      await favoritesService.removeFavorite(email, productId);
    } catch (err) {
      console.error("Error eliminando favorito:", err);
      //revierte si falla
      if (removed) setFavorites((current) => [...current, removed]);
    }
  }, []);

  const toggleFavorite = useCallback(
    (product) => {
      if (favorites.some((item) => item.id === product.id)) {
        return removeFavorite(product.id);
      }
      return addFavorite(product);
    },
    [favorites, addFavorite, removeFavorite],
  );

  const value = useMemo(
    () => ({
      favorites,
      favoriteCount: favorites.length,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorite,
      reloadFavorites,
    }),
    [favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite, reloadFavorites],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }

  return context;
};

export default FavoritesContext;
