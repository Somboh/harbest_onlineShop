import React from 'react';
import StackNavigator from './src/navigation/StackNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { DisplaySettingsProvider } from './src/context/DisplaySettingsContext';

export default function App() {
  return (
    <AuthProvider>
      <DisplaySettingsProvider>
        <FavoritesProvider>
          <CartProvider>
            <StackNavigator />
          </CartProvider>
        </FavoritesProvider>
      </DisplaySettingsProvider>
    </AuthProvider>
  );
}
