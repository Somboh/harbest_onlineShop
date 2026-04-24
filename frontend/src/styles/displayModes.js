export const getDisplayMode = (settings, baseTheme) => {
  if (settings.highContrast) {
    return {
      background: "#000000",
      surface: "#050505",
      surfaceAlt: "#101010",
      border: "#7CFF00",
      text: "#FFFFFF",
      textSoft: "#D8FFD0",
      primary: "#7CFF00",
      primarySoft: "#153D00",
      icon: "#7CFF00",
      shadow: "#7CFF00",
      categoryColors: ["#7CFF00", "#00FF66", "#D6FF00", "#6B6B6B"],
    };
  }

  if (settings.darkMode) {
    return {
      background: "#2F3030",
      surface: "#3A3B3B",
      surfaceAlt: "#454646",
      border: "#595B5B",
      text: "#F5F5F5",
      textSoft: "#D0D0D0",
      primary: baseTheme.primary,
      primarySoft: "#4A342D",
      icon: "#F2F2F2",
      shadow: "#000000",
      categoryColors: ["#B75530", "#5F771E", "#A79552", "#777777"],
    };
  }

  return {
    background: baseTheme.background,
    surface: "#FFFFFF",
    surfaceAlt: "#FBF8F6",
    border: baseTheme.role === "farmer" ? "#F1D3C5" : "#E8E1DB",
    text: baseTheme.text,
    textSoft: baseTheme.textSoft,
    primary: baseTheme.primary,
    primarySoft: baseTheme.primarySoft,
    icon: baseTheme.textSoft,
    shadow: baseTheme.role === "farmer" ? "#8B3E24" : "#4a5f18b4",
    categoryColors:
      baseTheme.role === "farmer"
        ? ["#D25E2C", "#B84C25", "#E89068", "#9F9A95"]
        : ["#DE7B54", "#789A3D", "#E8D499", "#BCBCBC"],
  };
};

export default getDisplayMode;
