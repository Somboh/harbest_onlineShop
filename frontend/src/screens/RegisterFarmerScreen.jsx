import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useResponsive } from "../hooks/useResponsive";
import authService from "../services/authService";
import colors from "../styles/colors";

const defaultAvatar = require("../../assets/images/icon.png");
const farmerLogo = require("../../assets/images/agricultor-logo.png");

export default function RegisterFarmerScreen({ navigation }) {
  const { isDesktop } = useResponsive();
  const isSplit = isDesktop;

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const handlePickPhoto = () => {
    if (Platform.OS === "web") {
      if (!fileInputRef.current) {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (event) => {
          const file = event.target.files?.[0];
          if (file) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
          }
        };
        fileInputRef.current = input;
      }
      fileInputRef.current.click();
    } else {
      setErrorMessage(
        "El selector de foto solo está disponible en web. Se usará un avatar por defecto.",
      );
    }
  };

  const buildFotoForUpload = async () => {
    if (photo) return photo;

    const asset = Image.resolveAssetSource(defaultAvatar);
    const response = await fetch(asset.uri);
    const blob = await response.blob();
    if (Platform.OS === "web") {
      return new File([blob], "default-avatar.png", {
        type: blob.type || "image/png",
      });
    }
    return { uri: asset.uri, name: "default-avatar.png", type: "image/png" };
  };

  const handleRegister = async () => {
    setErrorMessage("");

    if (
      !nombre.trim() ||
      !email.trim() ||
      !direccion.trim() ||
      !telefono.trim() ||
      !password ||
      !confirm
    ) {
      setErrorMessage("Completa todos los campos para continuar.");
      return;
    }

    const emailNormalized = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailNormalized)) {
      setErrorMessage("Introduce un email con un formato válido.");
      return;
    }

    const telefonoDigits = telefono.replace(/\s+/g, "");
    if (!/^\d{6,15}$/.test(telefonoDigits)) {
      setErrorMessage("Introduce un teléfono válido (solo dígitos).");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirm) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    setSubmitting(true);
    try {
      const foto = await buildFotoForUpload();
      const formData = new FormData();
      formData.append("nombre", nombre.trim());
      formData.append("email", emailNormalized);
      formData.append("contra", password);
      formData.append("direccion", direccion.trim());
      formData.append("telefono", telefonoDigits);
      formData.append("foto", foto);

      const res = await authService.farmerRegister(formData);

      if (res && res.status === "OK") {
        navigation.navigate("Login", { role: "farmer" });
      } else {
        setErrorMessage(
          res?.message ?? "No se pudo completar el registro. Inténtalo de nuevo.",
        );
      }
    } catch (error) {
      console.error("Error ejecutando el registro de agricultor:", error);
      setErrorMessage(
        "No se pudo conectar con el servidor. Reintenta en unos segundos.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const Header = (
    <View style={[styles.topSection, isSplit && styles.topSectionDesktop]}>
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login", { role: "farmer" })}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Splash")}>
          <Image source={farmerLogo} style={styles.logoImage} />
        </TouchableOpacity>
      </View>

      <View style={styles.headerTextBlock}>
        <Text style={styles.headerMiniText}>Alta agricultor</Text>
        <Text style={[styles.headerTitle, isSplit && styles.headerTitleDesktop]}>
          Crea tu cuenta de agricultor
        </Text>
        <Text style={styles.headerSubtitle}>
          Únete a Harbest y empieza a vender tus productos directamente a quienes
          los disfrutan.
        </Text>
      </View>

      <View style={styles.decorLeafOne} />
      <View style={styles.decorLeafTwo} />
    </View>
  );

  const Card = (
    <View style={[styles.card, isSplit && styles.cardDesktop]}>
      <View style={styles.avatarRow}>
        <TouchableOpacity
          style={[styles.avatarCircle, { borderColor: colors.secondary }]}
          onPress={handlePickPhoto}
          activeOpacity={0.85}
        >
          {photoPreview ? (
            <Image source={{ uri: photoPreview }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="leaf-outline" size={32} color={colors.secondary} />
          )}
          <View style={[styles.avatarBadge, { backgroundColor: colors.secondary }]}>
            <Ionicons name="camera" size={12} color="#fff" />
          </View>
        </TouchableOpacity>
        <View style={styles.avatarTextBlock}>
          <Text style={styles.avatarTitle}>Foto de tu explotación</Text>
          <Text style={styles.avatarSubtitle}>
            Opcional. Puedes añadirla ahora o más tarde desde tu perfil.
          </Text>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nombre o razón social</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Granjas Jaume"
          placeholderTextColor={colors.textSoft}
          value={nombre}
          onChangeText={setNombre}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="tu@email.com"
          placeholderTextColor={colors.textSoft}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          placeholder="Calle, número, localidad"
          placeholderTextColor={colors.textSoft}
          value={direccion}
          onChangeText={setDireccion}
          autoCapitalize="sentences"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="600 000 000"
          placeholderTextColor={colors.textSoft}
          keyboardType="phone-pad"
          value={telefono}
          onChangeText={setTelefono}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
          placeholderTextColor={colors.textSoft}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirmar contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Repite tu contraseña"
          placeholderTextColor={colors.textSoft}
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
        />
      </View>

      {errorMessage ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={18} color="#B3533D" />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[
          styles.mainButton,
          { backgroundColor: colors.secondary },
          submitting && styles.mainButtonDisabled,
        ]}
        onPress={handleRegister}
        disabled={submitting}
        activeOpacity={0.85}
      >
        <Text style={styles.mainButtonText}>
          {submitting ? "Creando cuenta..." : "Crear cuenta de agricultor"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.legalText}>
        Al continuar aceptas los términos de uso y la política de privacidad de
        Harbest.
      </Text>

      <Text style={styles.loginText}>
        ¿Ya tienes cuenta?{" "}
        <Text
          style={[styles.loginLink, { color: colors.secondary }]}
          onPress={() => navigation.navigate("Login", { role: "farmer" })}
        >
          Inicia sesión
        </Text>
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.container,
          { backgroundColor: colors.secondary },
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
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  mobileWrapper: { flex: 1 },
  mobileScroll: { flex: 1 },
  mobileScrollContent: { flexGrow: 1 },

  containerDesktop: { alignItems: "center", justifyContent: "center" },
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
  splitRight: { flex: 1, backgroundColor: "#FFFFFF" },
  splitScroll: { flex: 1 },
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
  topSectionDesktop: { paddingHorizontal: 0, paddingBottom: 0 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 26,
  },
  logoImage: { width: 42, height: 42, resizeMode: "contain" },
  headerTextBlock: { paddingRight: 24 },
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
  headerTitleDesktop: { fontSize: 44, lineHeight: 50 },
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
    maxWidth: 460,
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 32,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
  },

  avatarRow: { flexDirection: "row", alignItems: "center", marginBottom: 22 },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#F3F5ED",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    marginRight: 14,
  },
  avatarImage: { width: "100%", height: "100%", resizeMode: "cover" },
  avatarBadge: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarTextBlock: { flex: 1 },
  avatarTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  avatarSubtitle: { fontSize: 12, color: colors.textSoft, lineHeight: 17 },

  inputGroup: { marginBottom: 14 },
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

  mainButton: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 14,
  },
  mainButtonDisabled: { opacity: 0.6 },
  mainButtonText: { color: "#fff", fontSize: 15, fontWeight: "800" },

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

  legalText: {
    fontSize: 11,
    color: colors.textSoft,
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 14,
  },
  loginText: { textAlign: "center", fontSize: 13, color: colors.textSoft },
  loginLink: { fontWeight: "800" },
});
