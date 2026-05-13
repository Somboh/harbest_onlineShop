import { useNavigationState } from '@react-navigation/native';
import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDisplaySettings } from '../../context/DisplaySettingsContext';
import { useResponsive } from '../../hooks/useResponsive';
import colors from '../../styles/colors';
import { getDisplayMode } from '../../styles/displayModes';
import { ROLE_THEMES } from '../../styles/roleThemes';
import DesktopSidebar, { SIDEBAR_WIDTH_PX } from './DesktopSidebar';

//Rutas que NO deben mostrar la sidebar (auth/onboarding).
const UNAUTHED_ROUTES = new Set(['Splash', 'Login', 'Register', 'RegisterFarmer']);

const FARMER_ROUTES = new Set([
  'HomeAgricultor',
  'OrdersAgricultor',
  'OrdersScreenAgricultor',
  'OrderDetailFarmer',
  'AddProduct',
  'Inventory',
  'SearchAgricultor',
  'ProductosAgricultor',
  'ProductDetailFarmer',
  'BenefitsAgricultor',
  'ProfileAgricultor',
]);

function deriveRoleFromRoute(routeName) {
  if (!routeName) return null;
  if (UNAUTHED_ROUTES.has(routeName)) return null;
  if (FARMER_ROUTES.has(routeName)) return 'farmer';
  return 'user';
}

const LIGHT_BACKGROUNDS = new Set([
  '#fff',
  '#ffffff',
  '#fefefe',
  '#f7f8f4',
  '#f4eeea',
  '#fbf2ee',
  '#fbf8f6',
  '#f8f8f5',
  '#f3f5ed',
  '#f7f5ef',
  '#fafaf8',
]);

const SOFT_BACKGROUNDS = new Set([
  '#eef5e3',
  '#fbe5dc',
  '#fbf2ee',
  '#f2f2f2',
  '#f1f1f1',
  '#f7f8f4',
  '#fff9f2',
  '#fbe9e5',
  '#f6edda',
  '#e9f2e3',
  '#e5eef8',
  '#e7f3e8',
]);

const DARK_TEXTS = new Set([
  '#000',
  '#000000',
  '#3a3a3a',
  '#3d3a34',
  '#5a5a5a',
  '#666',
  '#7a7a7a',
  '#7b766d',
  '#7c766d',
  '#8a8a8a',
  '#8c8c8c',
  '#b5b5b5',
]);

const FIXED_ACCENTS = new Set([
  '#668b0d',
  '#6e8b3d',
  '#4f672a',
  '#d25e2c',
  '#b84c25',
  '#b3533d',
  '#a06a2c',
  '#8d5b2d',
]);

const TRANSLATIONS = {
  en: {
    'Bienvenido de nuevo': 'Welcome back',
    'Buscar productos frescos...': 'Search fresh products...',
    'Buscar productos...': 'Search products...',
    'Buscar en Harbest...': 'Search in Harbest...',
    'Buscar producto': 'Search product',
    'Buscar': 'Search',
    'Favoritos': 'Favorites',
    'Carrito': 'Cart',
    'Perfil': 'Profile',
    'Mis pedidos': 'My orders',
    'Mis datos': 'My data',
    'Mis favoritos': 'My favorites',
    'Mis productos': 'My products',
    'Mis beneficios': 'My earnings',
    'Inventario': 'Inventory',
    'Cerrar sesión': 'Log out',
    'Cuenta': 'Account',
    'Tu cuenta': 'Your account',
    'Categorias': 'Categories',
    'Categorías': 'Categories',
    'Recomendados': 'Recommended',
    'Seleccionados para ti': 'Picked for you',
    'Ver más': 'See more',
    'Ver todo': 'See all',
    'Frutas': 'Fruit',
    'Verduras': 'Vegetables',
    'Especias': 'Spices',
    'Todo': 'All',
    'Todos': 'All',
    'Resultados': 'Results',
    'Comprar': 'Buy',
    'Continuar compra': 'Continue checkout',
    'Resumen del pedido': 'Order summary',
    'Subtotal': 'Subtotal',
    'Envío': 'Shipping',
    'Envio': 'Shipping',
    'Total': 'Total',
    'Productos': 'Products',
    'Vaciar': 'Clear',
    'Tu carrito esta vacio': 'Your cart is empty',
    'Tu carrito está vacío': 'Your cart is empty',
    'Ver productos': 'See products',
    'Añadir al carrito': 'Add to cart',
    'Anadir al carrito': 'Add to cart',
    'Detalle del producto': 'Product detail',
    'Descripción': 'Description',
    'Descripcion': 'Description',
    'Cantidad': 'Quantity',
    'Vendido por': 'Sold by',
    'Compra actual': 'Current purchase',
    'Tu selección': 'Your selection',
    'Tu seleccion': 'Your selection',
    'Productos añadidos al carrito': 'Products added to cart',
    'Productos anadidos al carrito': 'Products added to cart',
    'Historial de compras': 'Purchase history',
    'Cargando tus pedidos...': 'Loading your orders...',
    'Aún no tienes pedidos': 'You do not have orders yet',
    'Ir al catálogo': 'Go to catalog',
    'Pedido': 'Order',
    'Pedidos': 'Orders',
    'Pedidos recibidos': 'Received orders',
    'Ultimos pedidos': 'Latest orders',
    'Últimos pedidos': 'Latest orders',
    'Panel agricultor': 'Farmer dashboard',
    'Panel del agricultor': 'Farmer dashboard',
    'Gestionar pedido': 'Manage order',
    'Ver detalle': 'View detail',
    'Pendiente': 'Pending',
    'En preparación': 'Preparing',
    'Enviado': 'Sent',
    'Entregado': 'Delivered',
    'Activos': 'Active',
    'En reparto': 'Out for delivery',
    'Completados': 'Completed',
    'Cliente Harbest': 'Harbest customer',
    'Agricultor verificado': 'Verified farmer',
    'Tu espacio personal': 'Your personal space',
    'Tu selección guardada': 'Your saved selection',
    'Tu seleccion guardada': 'Your saved selection',
    'Productos guardados': 'Saved products',
    'Tus favoritos': 'Your favorites',
    'No tienes favoritos': 'You have no favorites',
    'Explorar productos': 'Explore products',
    'Inicio': 'Home',
  },
};

function normalizeColor(value) {
  if (typeof value !== 'string') return null;
  return value.trim().toLowerCase();
}

function translateText(value, language) {
  if (language !== 'en' || typeof value !== 'string') return value;
  const dictionary = TRANSLATIONS.en;
  return dictionary[value] ?? value.replace(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ][^{}\n]*/g, (chunk) => {
    const trimmed = chunk.trim();
    return dictionary[trimmed]
      ? chunk.replace(trimmed, dictionary[trimmed])
      : chunk;
  });
}

function themedStyle(style, display, mode) {
  if (!mode || !style) return style;
  const flat = StyleSheet.flatten(style);
  if (!flat) return style;
  const next = { ...flat };
  const bg = normalizeColor(next.backgroundColor);
  const color = normalizeColor(next.color);
  const border = normalizeColor(next.borderColor);
  const shadow = normalizeColor(next.shadowColor);

  if (bg && LIGHT_BACKGROUNDS.has(bg)) next.backgroundColor = display.surface;
  if (bg && SOFT_BACKGROUNDS.has(bg)) next.backgroundColor = display.surfaceAlt;
  if (mode === 'contrast' && bg && FIXED_ACCENTS.has(bg)) {
    next.backgroundColor = display.surfaceAlt;
    next.borderColor = display.border;
    next.borderWidth = Math.max(Number(next.borderWidth) || 0, 1);
  }

  if (color && DARK_TEXTS.has(color)) next.color = display.text;
  if (mode === 'contrast' && color && FIXED_ACCENTS.has(color)) next.color = display.primary;
  if (mode === 'contrast' && color === '#fff') next.color = '#FFFFFF';

  if (border && border !== 'transparent') next.borderColor = display.border;
  if (shadow && shadow !== 'transparent') next.shadowColor = display.shadow;

  return next;
}

function themedIconColor(color, display, mode) {
  if (!mode) return color;
  const normalized = normalizeColor(color);
  if (!normalized) return color;
  if (DARK_TEXTS.has(normalized) || FIXED_ACCENTS.has(normalized)) return display.icon;
  return color;
}

function withDisplayMode(node, display, settings) {
  const mode = settings.highContrast ? 'contrast' : settings.darkMode ? 'dark' : null;
  const language = settings.language;

  if (typeof node === 'string') return translateText(node, language);
  if (!React.isValidElement(node)) return node;

  const children = React.Children.map(node.props.children, (child) =>
    withDisplayMode(child, display, settings),
  );
  const props = {};
  if (node.props.children !== undefined) {
    props.children = children;
  }
  const type = node.type;

  if (mode) {
    if (
      type === View ||
      type === ScrollView ||
      type === TouchableOpacity ||
      type === Pressable ||
      type === Text ||
      type === TextInput
    ) {
      props.style = themedStyle(node.props.style, display, mode);
    }

    if (type === Text) {
      props.style = [
        themedStyle(node.props.style, display, mode),
        !StyleSheet.flatten(node.props.style)?.color && { color: display.text },
      ];
    }

    if (type === TextInput) {
      props.placeholderTextColor = display.textSoft;
    }

    if (node.props.color) {
      props.color = themedIconColor(node.props.color, display, mode);
    }
  }

  if (node.props.placeholder) {
    props.placeholder = translateText(node.props.placeholder, language);
  }

  return React.cloneElement(node, props);
}

export default function ScreenContainer({ children }) {
  const { settings } = useDisplaySettings();
  const { isDesktop } = useResponsive();

  //Ruta activa para decidir el rol y resaltar el item de sidebar.
  const activeRoute = useNavigationState(
    (state) => (state ? state.routes[state.index]?.name : null),
  );
  const role = deriveRoleFromRoute(activeRoute);
  const showSidebar = isDesktop && role !== null;
  const roleTheme = role === 'farmer' ? ROLE_THEMES.farmer : ROLE_THEMES.user;
  const display = getDisplayMode(settings, roleTheme);
  const themedChildren = withDisplayMode(children, display, settings);

  return (
    <View
      style={[
        styles.outer,
        showSidebar && styles.outerDesktop,
        settings.darkMode && styles.outerDark,
        settings.highContrast && styles.outerContrast,
      ]}
    >
      {showSidebar && <DesktopSidebar role={role} activeRoute={activeRoute} />}

      <View
        style={[
          styles.inner,
          showSidebar ? styles.innerDesktop : styles.innerCompact,
          settings.darkMode && styles.innerDark,
          settings.highContrast && styles.innerContrast,
        ]}
      >
        <View
          style={[
            styles.content,
            settings.largeText && styles.contentLargeText,
          ]}
        >
          {themedChildren}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
  },
  //Cuando hay sidebar, el outer pasa a layout horizontal sin paddingTop
  //(la sidebar ocupa toda la altura) y sin centrado horizontal.
  outerDesktop: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingTop: 0,
  },
  inner: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  //Layout móvil/tablet: simulamos un teléfono centrado en web.
  innerCompact: {
    maxWidth: Platform.OS === 'web' ? 480 : '100%',
  },
  //Layout desktop: ocupa el resto del ancho, con un máximo razonable y centrado.
  innerDesktop: {
    maxWidth: 1200,
    alignSelf: 'center',
    marginLeft: SIDEBAR_WIDTH_PX,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
  },
  contentLargeText: {
    width: '90.91%',
    alignSelf: 'center',
    transform: [{ scale: 1.1 }],
  },
  outerDark: {
    backgroundColor: '#000',
  },
  innerDark: {
    backgroundColor: '#2F3030',
  },
  outerContrast: {
    backgroundColor: '#000',
  },
  innerContrast: {
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#000',
  },
});
