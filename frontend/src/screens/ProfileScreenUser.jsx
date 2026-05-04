import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../styles/colors";
import ScreenContainer from "../components/common/ScreenContainer";
import ClientTabBar from "../components/common/ClientTabBar";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreenUser({ navigation }) {
  const { logout } = useAuth();

  //Cerrar sesión limpia el token + estado del contexto y deja la pila en
  //Splash, así el usuario aterriza en la pantalla de elección de rol.
  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: "Splash" }] });
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HEADER VERDE */}
          <View style={styles.topSection}>
            <View style={styles.topRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>

              <View style={styles.headerActions}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                  <Image
                    source={require("../../assets/images/logo-harbest.png")}
                    style={styles.headerLogo}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.headerTextBlock}>
              <Text style={styles.headerMiniText}>Tu espacio personal</Text>
              <Text style={styles.headerTitle}>Perfil</Text>
              <Text style={styles.headerSubtitle}>
                Consulta tus datos, pedidos guardados y accesos rápidos de tu
                cuenta.
              </Text>
            </View>

            <View style={styles.decorLeafOne} />
            <View style={styles.decorLeafTwo} />
          </View>

          {/* TARJETA DE PERFIL */}
          <View style={styles.profileCard}>
            <Image
              source={require("../../assets/images/pepe.jpg")}
              style={styles.avatarImage}
            />

            <Text style={styles.username}>Pepe27</Text>
            <Text style={styles.email}>harbest@alu.ua.es</Text>

            <View style={styles.badgeRow}>
              <View style={styles.userBadge}>
                <Text style={styles.userBadgeText}>Cliente Harbest</Text>
              </View>
            </View>
          </View>

          {/* SECCIÓN CUENTA */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cuenta</Text>

            <ProfileOption
              icon="person-circle-outline"
              label="Mis datos"
              onPress={() => navigation.navigate("MyData")}
            />

            <ProfileOption
              icon="heart-outline"
              label="Mis favoritos"
              onPress={() => navigation.navigate("Favorites")}
            />

            <ProfileOption
              icon="receipt-outline"
              label="Mis pedidos"
              onPress={() => navigation.navigate("Orders")}
            />
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.primary} />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* BOTTOM BAR BLINDADA DEL CLIENTE */}
        <ClientTabBar Navigation={navigation} ActiveRoute="ProfileUser" />
      </View>
    </ScreenContainer>
  );
}

const ProfileOption = ({ icon, label, onPress }) => (
  <TouchableOpacity
    style={styles.option}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <View style={styles.optionLeft}>
      <View style={styles.optionIconWrap}>
        <Ionicons name={icon} size={18} color={colors.text} />
      </View>
      <Text style={styles.optionText}>{label}</Text>
    </View>

    <Ionicons name="chevron-forward" size={18} color={colors.textSoft} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8F4",
  },
  scrollContent: {
    paddingBottom: 120, // Espacio extra para que no estorbe la barra flotante
  },
  topSection: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 34,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: "relative",
    overflow: "hidden",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 26,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerLogo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  headerTextBlock: {
    paddingRight: 30,
  },
  headerMiniText: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 10,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 290,
  },
  decorLeafOne: {
    position: "absolute",
    right: 24,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    transform: [{ rotate: "28deg" }],
  },
  decorLeafTwo: {
    position: "absolute",
    right: 60,
    bottom: 46,
    width: 28,
    height: 28,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.10)",
    transform: [{ rotate: "-20deg" }],
  },
  profileCard: {
    marginHorizontal: 20,
    marginTop: -18,
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarImage: {
    width: 92,
    height: 92,
    borderRadius: 46,
    marginBottom: 14,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: colors.primaryLight,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  username: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 13,
    color: colors.textSoft,
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: "row",
  },
  userBadge: {
    backgroundColor: "#EEF5E3",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  userBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 12,
  },
  option: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F3F5ED",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  logoutButton: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E7E7E7",
  },
  logoutText: {
    marginLeft: 8,
    color: colors.primary,
    fontSize: 15,
    fontWeight: "800",
  },
});
