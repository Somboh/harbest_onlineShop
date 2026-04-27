import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import authService from "../services/authService";
import colors from "../styles/colors";

export default function LoginScreen({ navigation }) {
  const route = useRoute();
  const { role } = route.params || {};
  const isUser = role === "user";
  const isFarmer = role === "farmer";

  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  const themeColors = {
    primary: isFarmer ? colors.secondary : colors.primary,
    text: colors.text,
    textSoft: colors.textSoft,
    white: colors.white,
  };

  const logoSource = isFarmer
    ? require("../../assets/images/agricultor-logo.png")
    : require("../../assets/images/logo-harbest.png");

  const handleLogin = async () => {
    let data = {
      email: email,
      contra: password,
    };

    try {
      let res;

      if (isFarmer) {
        res = await authService.farmerLogin(data);
      } else {
        res = await authService.userLogin(data);
      }

      if (res && res.status === "OK") {
        if (isFarmer) {
          navigation.navigate("HomeAgricultor");
        } else {
          navigation.navigate("Home");
        }
      } else {
        alert("Credenciales incorrectas o error en el servidor");
      }
    } catch (error) {
      console.error("Error ejecutando el login:", error);
      alert("Hubo un problema al intentar iniciar sesión");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[styles.container, { backgroundColor: themeColors.primary }]}
      >
        {/* CABECERA */}
        <View style={styles.topSection}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => navigation.navigate("Splash")}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Splash")}>
              <Image source={logoSource} style={styles.logoImage} />
            </TouchableOpacity>
          </View>

          <View style={styles.headerTextBlock}>
            <Text style={styles.headerMiniText}>
              {isFarmer ? "Acceso agricultor" : "Acceso usuario"}
            </Text>
            <Text style={styles.headerTitle}>Iniciar sesión</Text>
            <Text style={styles.headerSubtitle}>
              Accede a Harbest y continúa comprando producto fresco y de
              proximidad.
            </Text>
          </View>

          <View style={styles.decorLeafOne} />
          <View style={styles.decorLeafTwo} />
        </View>

        {/* TARJETA */}
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="Introduce tu email"
              placeholderTextColor={colors.textSoft}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Introduce tu contraseña"
                placeholderTextColor={colors.textSoft}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity>
                <Text style={[styles.showText, { color: themeColors.primary }]}>
                  Mostrar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.forgotWrapper}>
            <Text style={[styles.forgotText, { color: themeColors.primary }]}>
              ¿Has olvidado tu contraseña?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.mainButton,
              { backgroundColor: themeColors.primary },
            ]}
            onPress={() => {
              handleLogin();
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.mainButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o continúa con</Text>
            <View style={styles.dividerLine} />
          </View>
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.85}>
            <View style={styles.socialIconCircle}>
              <Text style={styles.socialIconText}>G</Text>
            </View>
            <Text style={styles.socialButtonText}>Continuar con Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.85}>
            <View style={styles.socialIconCircle}>
              <Text style={styles.socialIconText}>f</Text>
            </View>
            <Text style={styles.socialButtonText}>Continuar con Facebook</Text>
          </TouchableOpacity>
          <Text style={styles.registerText}>
            ¿No tienes cuenta?{" "}
            <Text style={[styles.registerLink, { color: themeColors.primary }]}>
              Regístrate
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
  },

  topSection: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 34,
    position: "relative",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 26,
  },

  logoImage: {
    width: 42,
    height: 42,
    resizeMode: "contain",
  },

  headerTextBlock: {
    paddingRight: 24,
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
    bottom: 32,
    width: 52,
    height: 52,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    transform: [{ rotate: "28deg" }],
  },

  decorLeafTwo: {
    position: "absolute",
    right: 58,
    bottom: 50,
    width: 26,
    height: 26,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.10)",
    transform: [{ rotate: "-20deg" }],
  },

  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 6,
  },

  inputGroup: {
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#F3F5ED",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 14,
    color: colors.text,
  },

  passwordWrapper: {
    backgroundColor: "#F3F5ED",
    borderRadius: 999,
    paddingLeft: 16,
    paddingRight: 14,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },

  showText: {
    fontSize: 12,
    fontWeight: "700",
  },

  forgotWrapper: {
    alignSelf: "flex-end",
    marginTop: 2,
    marginBottom: 18,
  },

  forgotText: {
    fontSize: 12,
    fontWeight: "600",
  },

  mainButton: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 22,
  },

  mainButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E6E6E6",
  },

  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: colors.textSoft,
    fontWeight: "600",
  },

  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F5",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  socialIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  socialIconText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },

  socialButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },

  registerText: {
    textAlign: "center",
    fontSize: 13,
    color: colors.textSoft,
    marginTop: 10,
  },

  registerLink: {
    fontWeight: "800",
  },
});
