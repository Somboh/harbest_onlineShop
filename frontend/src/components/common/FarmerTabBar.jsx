import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useResponsive } from "../../hooks/useResponsive";
import { ROLE_THEMES } from "../../styles/roleThemes";
import { tabBarStyles } from "./tabBarStyles";

export default function FarmerTabBar({ Navigation, ActiveRoute }) {
  const { isDesktop } = useResponsive();
  //En desktop la navegación se hace por la sidebar (ScreenContainer).
  if (isDesktop) return null;

  const FarmerColor = ROLE_THEMES.farmer.primary;
  const InactiveColor = "#8A8A8A";

  return (
    <View style={tabBarStyles.wrapper}>
      <View style={tabBarStyles.pill}>
        {/* BUSCAR / HOME */}
        <TouchableOpacity
          style={[
            tabBarStyles.tabIcon,
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
            tabBarStyles.tabIcon,
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
            tabBarStyles.tabIcon,
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
            tabBarStyles.tabIcon,
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
  ActiveTabBg: { backgroundColor: ROLE_THEMES.farmer.primarySoft },
});
