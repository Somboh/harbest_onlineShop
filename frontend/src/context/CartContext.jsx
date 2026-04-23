import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { calculateCartSubtotal } from "../utils/helpers";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const shipping = items.length > 0 ? 2.5 : 0;

  const addToCart = useCallback((product, quantity = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: +(item.quantity + quantity).toFixed(1) }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity: +quantity.toFixed(1) } : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = calculateCartSubtotal(items);
  const total = subtotal + shipping;

  const value = useMemo(
    () => ({
      items,
      shipping,
      subtotal,
      total,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemCount: items.length,
    }),
    [addToCart, clearCart, items, removeFromCart, shipping, subtotal, total, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};

export default CartContext;
