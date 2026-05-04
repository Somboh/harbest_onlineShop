import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useResponsive } from "../../hooks/useResponsive";
import { ROLE_THEMES } from "../../styles/roleThemes";

export default function FarmerTabBar({ Navigation, ActiveRoute }) {
  const { isDesktop } = useResponsive();
  //En desktop la navegación se hace por la sidebar (ScreenContainer).
  if (isDesktop) return null;

  const FarmerColor = ROLE_THEMES.farmer.primary;
  const InactiveColor = "#8A8A8A";

  return (
    <View style={Styles.TabBarWrapper}>
      <View style={Styles.Pill}>
        {/* BUSCAR / HOME */}
        <TouchableOpacity
          style={[
            Styles.TabIcon,
            ActiveRoute === "HomeAgricultor" && Styles.ActiveTabBg,
          ]}
          onPress={() => Navigation.navigate("HomeAgricultor")}
        >
          <Ionicons
            name="search-outline"
            size={22}
            color={
              ActiveRoute === "HomeAgricultor" ? FarmerColor : InactiveColor
            }
          />
        </TouchableOpacity>

        {/* PEDIDOS */}
        <TouchableOpacity
          style={[
            Styles.TabIcon,
            ActiveRoute === "OrdersAgricultor" && Styles.ActiveTabBg,
          ]}
          onPress={() => Navigation.navigate("OrdersAgricultor")}
        >
          <Ionicons
            name="albums-outline"
            size={22}
            color={
              ActiveRoute === "OrdersAgricultor" ? FarmerColor : InactiveColor
            }
          />
        </TouchableOpacity>

        {/* AÑADIR PRODUCTO */}
        <TouchableOpacity
          style={[
            Styles.TabIcon,
            ActiveRoute === "AddProduct" && Styles.ActiveTabBg,
          ]}
          onPress={() => Navigation.navigate("AddProduct")}
        >
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={ActiveRoute === "AddProduct" ? FarmerColor : InactiveColor}
          />
        </TouchableOpacity>

        {/* PERFIL */}
        <TouchableOpacity
          style={[
            Styles.TabIcon,
            ActiveRoute === "ProfileAgricultor" && Styles.ActiveTabBg,
          ]}
          onPress={() => Navigation.navigate("ProfileAgricultor")}
        >
          <Ionicons
            name="person-outline"
            size={22}
            color={
              ActiveRoute === "ProfileAgricultor" ? FarmerColor : InactiveColor
            }
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
  ActiveTabBg: { backgroundColor: ROLE_THEMES.farmer.primarySoft },
});
