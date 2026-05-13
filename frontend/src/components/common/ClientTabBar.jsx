import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useResponsive } from "../../hooks/useResponsive";
import { ROLE_THEMES } from "../../styles/roleThemes";
import { tabBarStyles } from "./tabBarStyles";

export default function ClientTabBar({ Navigation, ActiveRoute }) {
  const { isDesktop } = useResponsive();
  //En desktop la navegación se hace por la sidebar (ScreenContainer).
  if (isDesktop) return null;

  const ClientColor = ROLE_THEMES.user.primaryTint;
  const InactiveColor = "#8A8A8A";

  return (
    <View style={tabBarStyles.wrapper}>
      <View style={tabBarStyles.pill}>
        {/* BUSCAR / HOME */}
        <TouchableOpacity
          style={[tabBarStyles.tabIcon, ActiveRoute === "Home" && Styles.ActiveTabBg]}
          onPress={() => Navigation.navigate("Home")}
        >
          <Ionicons
            name="search-outline"
            size={22}
            color={ActiveRoute === "Home" ? ClientColor : InactiveColor}
          />
        </TouchableOpacity>

        {/* FAVORITOS */}
        <TouchableOpacity
          style={[
            tabBarStyles.tabIcon,
            ActiveRoute === "Favorites" && Styles.ActiveTabBg,
          ]}
          onPress={() => Navigation.navigate("Favorites")}
        >
          <Ionicons
            name="heart-outline"
            size={22}
            color={ActiveRoute === "Favorites" ? ClientColor : InactiveColor}
          />
        </TouchableOpacity>

        {/* CARRITO */}
        <TouchableOpacity
          style={[tabBarStyles.tabIcon, ActiveRoute === "Cart" && Styles.ActiveTabBg]}
          onPress={() => Navigation.navigate("Cart")}
        >
          <Ionicons
            name="cart-outline"
            size={24}
            color={ActiveRoute === "Cart" ? ClientColor : InactiveColor}
          />
        </TouchableOpacity>

        {/* PERFIL USUARIO */}
        <TouchableOpacity
          style={[
            tabBarStyles.tabIcon,
            ActiveRoute === "ProfileUser" && Styles.ActiveTabBg,
          ]}
          onPress={() => Navigation.navigate("ProfileUser")}
        >
          <Ionicons
            name="person-outline"
            size={22}
            color={ActiveRoute === "ProfileUser" ? ClientColor : InactiveColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Styles = StyleSheet.create({
  ActiveTabBg: { backgroundColor: ROLE_THEMES.user.primarySoft },
});
