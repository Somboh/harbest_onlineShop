import colors from "./colors";

export const ROLE_THEMES = {
  user: {
    role: "user",
    primary: colors.primary,
    primaryDark: "#4F672A",
    primarySoft: "#EEF5E3",
    primaryTint: "#6E8B3D",
    background: "#F7F8F4",
    card: "#FFFFFF",
    text: colors.text,
    textSoft: colors.textSoft,
    logo: require("../../assets/images/logo-harbest.png"),
  },
  farmer: {
    role: "farmer",
    primary: colors.secondary,
    primaryDark: "#9F3F1E",
    primarySoft: "#FBE5DC",
    primaryTint: "#D25E2C",
    background: "#FBF2EE",
    card: "#FFFFFF",
    text: colors.text,
    textSoft: colors.textSoft,
    logo: require("../../assets/images/agricultor-logo.png"),
  },
};

export const getRoleTheme = (role) => {
  return role === "farmer" || role === "admin"
    ? ROLE_THEMES.farmer
    : ROLE_THEMES.user;
};

export default ROLE_THEMES;
