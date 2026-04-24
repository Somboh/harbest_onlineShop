import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { featuredProducts } from "../data/mockProducts";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => featuredProducts.slice(0, 2));

  const isFavorite = useCallback(
    (productId) => favorites.some((product) => product.id === productId),
    [favorites],
  );

  const addFavorite = useCallback((product) => {
    setFavorites((currentFavorites) => {
      const exists = currentFavorites.some((item) => item.id === product.id);

      if (exists) {
        return currentFavorites;
      }

      return [...currentFavorites, product];
    });
  }, []);

  const removeFavorite = useCallback((productId) => {
    setFavorites((currentFavorites) =>
      currentFavorites.filter((product) => product.id !== productId),
    );
  }, []);

  const toggleFavorite = useCallback((product) => {
    setFavorites((currentFavorites) => {
      const exists = currentFavorites.some((item) => item.id === product.id);

      if (exists) {
        return currentFavorites.filter((item) => item.id !== product.id);
      }

      return [...currentFavorites, product];
    });
  }, []);

  const value = useMemo(
    () => ({
      favorites,
      favoriteCount: favorites.length,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorite,
    }),
    [addFavorite, favorites, isFavorite, removeFavorite, toggleFavorite],
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
