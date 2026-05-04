import { useNavigationState } from '@react-navigation/native';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useDisplaySettings } from '../../context/DisplaySettingsContext';
import { useResponsive } from '../../hooks/useResponsive';
import colors from '../../styles/colors';
import DesktopSidebar, { SIDEBAR_WIDTH_PX } from './DesktopSidebar';
import DisplayModeMenu from './DisplayModeMenu';

//Rutas que NO deben mostrar la sidebar (auth/onboarding).
const UNAUTHED_ROUTES = new Set(['Splash', 'Login', 'Register']);

const FARMER_ROUTES = new Set([
  'HomeAgricultor',
  'OrdersAgricultor',
  'OrdersScreenAgricultor',
  'AddProduct',
  'Inventory',
  'SearchAgricultor',
  'ProductosAgricultor',
  'ProfileAgricultor',
]);

function deriveRoleFromRoute(routeName) {
  if (!routeName) return null;
  if (UNAUTHED_ROUTES.has(routeName)) return null;
  if (FARMER_ROUTES.has(routeName)) return 'farmer';
  return 'user';
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
  const menuRole = role === 'farmer' ? 'farmer' : 'user';

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
          {children}
        </View>
        {settings.darkMode && <View pointerEvents="none" style={styles.nightOverlay} />}
        {settings.highContrast && (
          <>
            <View pointerEvents="none" style={styles.contrastWash} />
            <View pointerEvents="none" style={styles.contrastFrame} />
          </>
        )}
        <View style={styles.globalMenu}>
          <DisplayModeMenu role={menuRole} />
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
  nightOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.46)',
  },
  contrastWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.74)',
  },
  contrastFrame: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 4,
    borderColor: '#7CFF00',
  },
  globalMenu: {
    position: 'absolute',
    top: 10,
    right: 24,
    zIndex: 100,
    elevation: 100,
  },
});
