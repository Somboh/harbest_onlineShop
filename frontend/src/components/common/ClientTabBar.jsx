import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ROLE_THEMES } from "../../styles/roleThemes";

export default function ClientTabBar({ Navigation, ActiveRoute }) {
  const ClientColor = ROLE_THEMES.user.primaryTint;
  const InactiveColor = "#8A8A8A";

  return (
    <View style={Styles.TabBarWrapper}>
      <View style={Styles.Pill}>
        {/* BUSCAR / HOME */}
        <TouchableOpacity
          style={[Styles.TabIcon, ActiveRoute === "Home" && Styles.ActiveTabBg]}
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
            Styles.TabIcon,
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
          style={[Styles.TabIcon, ActiveRoute === "Cart" && Styles.ActiveTabBg]}
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
            Styles.TabIcon,
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
  TabBarWrapper: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  Pill: {
    backgroundColor: "#F2F2F2",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 40,
    paddingVertical: 8,
    width: "75%",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  TabIcon: { padding: 10, borderRadius: 25 },
  ActiveTabBg: { backgroundColor: ROLE_THEMES.user.primarySoft },
});
