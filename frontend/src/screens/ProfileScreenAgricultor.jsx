import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FarmerTabBar from "../components/common/FarmerTabBar";
import ScreenContainer from "../components/common/ScreenContainer";
import { farmerService } from "../services/farmerService";
import { ROLE_THEMES } from "../styles/roleThemes";

export default function ProfileScreenAgricultor({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [foto, setFoto] = useState("");

  const getFarmerInfo = async () => {
    const token = await AsyncStorage.getItem("token");

    if(token){
      const decodedToken = jwtDecode(token);

      const res = await farmerService.getFarmerByEmail(decodedToken.email);
      setNombre(res.nombre);
      setEmail(res.email);
      setFoto(res.foto);
    }
  }
  useEffect(()=>{
    getFarmerInfo();
  },[])
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* CABECERA */}
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate("HomeAgricultor")}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="arrow-back"
                  size={20}
                  color={stylesConst.textDark}
                />
              </TouchableOpacity>

              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.logoWrap}
                  onPress={() => navigation.navigate("HomeAgricultor")}
                  activeOpacity={0.85}
                >
                  <Image
                    source={require("../../assets/images/agricultor-logo.png")}
                    style={styles.headerLogo}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.headerTitle}>Panel del agricultor</Text>
            <Text style={styles.headerSubtitle}>
              Gestiona tu cuenta, tus productos, pedidos y rendimiento de
              ventas.
            </Text>
          </View>

          {/* TARJETA PERFIL */}
          <View style={styles.profileCard}>
            <Image
              source={foto}
              style={styles.avatarImage}
            />

            <View style={styles.profileInfo}>
              <Text style={styles.username}>{nombre}</Text>
              <Text style={styles.email}>{email}</Text>

              <View style={styles.badge}>
                <MaterialCommunityIcons
                  name="tractor-variant"
                  size={14}
                  color={stylesConst.secondary}
                />
                <Text style={styles.badgeText}>Agricultor verificado</Text>
              </View>
            </View>
          </View>

          {/* SECCIÓN GESTIÓN */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tu cuenta</Text>

            <ProfileOption
              iconType="material"
              icon="star-four-points-outline"
              label="Mis beneficios"
              highlight
              onPress={() => navigation.navigate("BenefitsAgricultor")}
            />

            <ProfileOption
              iconType="material"
              icon="sprout-outline"
              label="Mis productos"
              onPress={() =>
                navigation.navigate("ProductosAgricultor", { category: "Todos" })
              }
            />

            <ProfileOption
              iconType="ion"
              icon="document-text-outline"
              label="Mis pedidos"
              onPress={() => navigation.navigate("OrdersAgricultor")}
            />

            <ProfileOption
              iconType="material"
              icon="warehouse"
              label="Inventario"
              onPress={() => navigation.navigate("Inventory")}
            />
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.85}
          >
            <Ionicons name="log-out-outline" size={18} color="#8D5B2D" />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* BARRA INFERIOR BLINDADA */}
        <FarmerTabBar Navigation={navigation} ActiveRoute="ProfileAgricultor" />
      </View>
    </ScreenContainer>
  );
}

const ProfileOption = ({
  icon,
  label,
  onPress,
  highlight = false,
  iconType = "ion",
}) => {
  const renderIcon = () => {
    if (iconType === "material") {
      return (
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color={highlight ? "#A06A2C" : stylesConst.textDark}
        />
      );
    }

    return (
      <Ionicons
        name={icon}
        size={18}
        color={highlight ? "#A06A2C" : stylesConst.textDark}
      />
    );
  };

  return (
    <TouchableOpacity
      style={[styles.option, highlight && styles.optionHighlight]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.optionLeft}>
        <View
          style={[
            styles.optionIconWrap,
            highlight && styles.optionIconWrapHighlight,
          ]}
        >
          {renderIcon()}
        </View>
        <Text
          style={[styles.optionText, highlight && styles.optionTextHighlight]}
        >
          {label}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={highlight ? "#A06A2C" : "#8C8C8C"}
      />
    </TouchableOpacity>
  );
};

const stylesConst = {
  bg: ROLE_THEMES.farmer.background,
  card: "#FFFFFF",
  primary: ROLE_THEMES.farmer.primary,
  primarySoft: ROLE_THEMES.farmer.primarySoft,
  primaryDark: ROLE_THEMES.farmer.primaryDark,
  earth: "#F0C4B0",
  earthSoft: "#FBE5DC",
  highlight: "#FBE5DC",
  border: "#E6E1D5",
  textDark: "#3D3A34",
  textSoft: "#7B766D",
  secondary: ROLE_THEMES.farmer.primary,
  secondarySoft: ROLE_THEMES.farmer.primarySoft,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: stylesConst.bg,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 120, // Espacio para que la barra flotante no tape el botón de cerrar sesión
  },

  header: {
    marginBottom: 18,
  },

  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  logoWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  headerLogo: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: stylesConst.textDark,
    marginBottom: 8,
  },

  headerSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: stylesConst.textSoft,
    maxWidth: 310,
  },

  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    borderWidth: 1,
    borderColor: stylesConst.border,
  },

  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 18,
    marginRight: 14,
  },

  profileInfo: {
    flex: 1,
  },

  username: {
    fontSize: 20,
    fontWeight: "800",
    color: stylesConst.textDark,
    marginBottom: 4,
  },

  email: {
    fontSize: 13,
    color: stylesConst.textSoft,
    marginBottom: 10,
  },

  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: stylesConst.secondarySoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: "hidden",
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: stylesConst.secondary,
    marginLeft: 6,
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: stylesConst.textDark,
    marginBottom: 12,
    paddingLeft: 2,
  },

  option: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: stylesConst.border,
  },

  optionHighlight: {
    backgroundColor: stylesConst.highlight,
    borderColor: "#E7DFC7",
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  optionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F7F5EF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  optionIconWrapHighlight: {
    backgroundColor: "#ECE4CC",
  },

  optionText: {
    fontSize: 15,
    fontWeight: "600",
    color: stylesConst.textDark,
  },

  optionTextHighlight: {
    color: "#8C5B1D",
    fontWeight: "700",
  },

  logoutButton: {
    backgroundColor: "#FFF9F2",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8D6B7",
    paddingVertical: 15,
    marginTop: 6,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8,
  },
});
