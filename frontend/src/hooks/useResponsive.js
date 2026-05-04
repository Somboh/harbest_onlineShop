import { useWindowDimensions } from "react-native";

//Breakpoints alineados con las convenciones más comunes en web:
//   mobile  : <  768
//   tablet  : 768 - 1023
//   desktop : >= 1024
export const BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
};

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isMobile = width < BREAKPOINTS.tablet;
  const isTablet = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
  const isDesktop = width >= BREAKPOINTS.desktop;

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    //atajo: layout móvil cuando NO es desktop (ni tablet en horizontal grande).
    //Para sidebar/topbar usamos `isDesktop`. Para grids con varias columnas
    //podemos elegir según la pantalla.
    isCompact: !isDesktop,
  };
}

export default useResponsive;
