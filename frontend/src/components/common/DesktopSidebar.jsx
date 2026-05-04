import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ROLE_THEMES } from "../../styles/roleThemes";

const SIDEBAR_WIDTH = 88;

const CLIENT_TABS = [
  { route: "Home",        icon: "home-outline",   label: "Inicio" },
  { route: "Favorites",   icon: "heart-outline",  label: "Favoritos" },
  { route: "Cart",        icon: "cart-outline",   label: "Carrito" },
  { route: "Orders",      icon: "albums-outline", label: "Pedidos" },
  { route: "ProfileUser", icon: "person-outline", label: "Perfil" },
];

const FARMER_TABS = [
  { route: "HomeAgricultor",       icon: "home-outline",        label: "Inicio" },
  { route: "OrdersAgricultor",     icon: "albums-outline",      label: "Pedidos" },
  { route: "AddProduct",           icon: "add-circle-outline",  label: "Añadir" },
  { route: "Inventory",            icon: "cube-outline",        label: "Inventario" },
  { route: "ProfileAgricultor",    icon: "person-outline",      label: "Perfil" },
];

export const SIDEBAR_WIDTH_PX = SIDEBAR_WIDTH;

export default function DesktopSidebar({ role, activeRoute }) {
  const navigation = useNavigation();
  const theme = role === "farmer" ? ROLE_THEMES.farmer : ROLE_THEMES.user;
  const tabs = role === "farmer" ? FARMER_TABS : CLIENT_TABS;
  const inactiveColor = "#8A8A8A";
  const homeRoute = role === "farmer" ? "HomeAgricultor" : "Home";

  return (
    <View style={[styles.sidebar, { borderRightColor: theme.primarySoft }]}>
      <TouchableOpacity
        onPress={() => navigation.navigate(homeRoute)}
        style={styles.logoWrap}
        activeOpacity={0.85}
      >
        <Image
          source={
            role === "farmer"
              ? require("../../../assets/images/agricultor-logo.png")
              : require("../../../assets/images/logo-harbest.png")
          }
          style={styles.logo}
        />
      </TouchableOpacity>

      <View style={styles.tabs}>
        {tabs.map((tab) => {
          const isActive = activeRoute === tab.route;
          return (
            <TouchableOpacity
              key={tab.route}
              style={[
                styles.tab,
                isActive && { backgroundColor: theme.primarySoft },
              ]}
              onPress={() => navigation.navigate(tab.route)}
              activeOpacity={0.85}
            >
              <Ionicons
                name={tab.icon}
                size={22}
                color={isActive ? theme.primary : inactiveColor}
              />
              <Text
                numberOfLines={1}
                style={[
                  styles.tabLabel,
                  { color: isActive ? theme.primary : inactiveColor },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    paddingVertical: 18,
    alignItems: "center",
    gap: 6,
  },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  logo: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
  tabs: {
    width: "100%",
    paddingHorizontal: 8,
    gap: 8,
  },
  tab: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
});
