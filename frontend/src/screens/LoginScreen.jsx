import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useResponsive } from "../hooks/useResponsive";
import colors from "../styles/colors";

export default function LoginScreen({ navigation }) {
  const route = useRoute();
  const { role } = route.params || {};
  const isFarmer = role === "farmer";
  const { isDesktop } = useResponsive();
  const isSplit = isDesktop;
  const { loginUser, loginFarmer } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Introduce tu email y contraseña.");
      return;
    }

    setSubmitting(true);
    try {
      const data = { email: email.trim().toLowerCase(), contra: password };
      //loginUser/loginFarmer guardan el JWT en AsyncStorage Y refrescan el
      //contexto, así el resto de la app ya ve la sesión sin recargar.
      const res = isFarmer ? await loginFarmer(data) : await loginUser(data);

      if (res && res.status === "OK") {
        //reset para que el back del navegador no devuelva al login.
        navigation.reset({
          index: 0,
          routes: [{ name: isFarmer ? "HomeAgricultor" : "Home" }],
        });
      } else {
        setErrorMessage(
          res?.message ?? "Email o contraseña incorrectos. Inténtalo de nuevo.",
        );
      }
    } catch (error) {
      console.error("Error ejecutando el login:", error);
      setErrorMessage("No se pudo conectar con el servidor. Reintenta en unos segundos.");
    } finally {
      setSubmitting(false);
    }
  };

  //Atrás siempre vuelve a la elección de rol. Usamos reset para no depender
  //del historial del navegador ni del estado de la pila —si llegaste al Login
  //por URL directa, recarga, deep link o desde "Cerrar sesión", siempre
  //acabas en Splash con la pila limpia.
  const goToSplash = () => {
    navigation.reset({ index: 0, routes: [{ name: "Splash" }] });
  };

  const Header = (
    <View style={[styles.topSection, isSplit && styles.topSectionDesktop]}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={goToSplash}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToSplash}>
          <Image source={logoSource} style={styles.logoImage} />
        </TouchableOpacity>
      </View>

      <View style={styles.headerTextBlock}>
        <Text style={styles.headerMiniText}>
          {isFarmer ? "Acceso agricultor" : "Acceso usuario"}
        </Text>
        <Text style={[styles.headerTitle, isSplit && styles.headerTitleDesktop]}>
          Iniciar sesión
        </Text>
        <Text style={styles.headerSubtitle}>
          Accede a Harbest y continúa comprando producto fresco y de proximidad.
        </Text>
      </View>

      <View style={styles.decorLeafOne} />
      <View style={styles.decorLeafTwo} />
    </View>
  );

  const Card = (
    <View style={[styles.card, isSplit && styles.cardDesktop]}>
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

      {errorMessage ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={18} color="#B3533D" />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[
          styles.mainButton,
          { backgroundColor: themeColors.primary },
          submitting && styles.mainButtonDisabled,
        ]}
        onPress={handleLogin}
        disabled={submitting}
        activeOpacity={0.85}
      >
        <Text style={styles.mainButtonText}>
          {submitting ? "Iniciando sesión..." : "Iniciar sesión"}
        </Text>
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
        <Text
          style={[styles.registerLink, { color: themeColors.primary }]}
          onPress={() =>
            navigation.navigate(
              isFarmer ? "RegisterFarmer" : "Register",
              isFarmer ? undefined : { role },
            )
          }
        >
          Regístrate
        </Text>
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.container,
          { backgroundColor: themeColors.primary },
          isSplit && styles.containerDesktop,
        ]}
      >
        {isSplit ? (
          <View style={styles.splitWrapper}>
            <View style={styles.splitLeft}>{Header}</View>
            <View style={styles.splitRight}>
              <ScrollView
                style={styles.splitScroll}
                contentContainerStyle={styles.splitScrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {Card}
              </ScrollView>
            </View>
          </View>
        ) : (
          <KeyboardAvoidingView
            style={styles.mobileWrapper}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              style={styles.mobileScroll}
              contentContainerStyle={styles.mobileScrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {Header}
              {Card}
            </ScrollView>
          </KeyboardAvoidingView>
        )}
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

  //--- Mobile wrapper (KeyboardAvoidingView + ScrollView) ---
  mobileWrapper: {
    flex: 1,
  },

  mobileScroll: {
    flex: 1,
  },

  //flexGrow:1 garantiza que el card pueda usar flex:1 para ocupar todo el alto
  //restante cuando el contenido cabe sin scroll.
  mobileScrollContent: {
    flexGrow: 1,
  },

  //--- Desktop split layout ---
  containerDesktop: {
    alignItems: "center",
    justifyContent: "center",
  },

  splitWrapper: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignSelf: "stretch",
  },

  splitLeft: {
    flex: 1,
    minWidth: 320,
    justifyContent: "center",
    paddingHorizontal: 48,
  },

  splitRight: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  splitScroll: {
    flex: 1,
  },

  //flexGrow:1 + alignItems/justifyContent:center → la card queda centrada cuando
  //hay sitio; cuando la ventana es muy baja, el scroll se activa.
  splitScrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 48,
    paddingVertical: 32,
  },

  topSection: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 34,
    position: "relative",
  },

  topSectionDesktop: {
    paddingHorizontal: 0,
    paddingBottom: 0,
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

  headerTitleDesktop: {
    fontSize: 44,
    lineHeight: 50,
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 360,
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

  cardDesktop: {
    flex: 0,
    width: "100%",
    maxWidth: 440,
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 32,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
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

  mainButtonDisabled: {
    opacity: 0.6,
  },

  mainButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBE9E5",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    gap: 8,
  },

  errorText: {
    flex: 1,
    color: "#8C2A1A",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
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
