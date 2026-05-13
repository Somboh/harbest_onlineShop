import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

import ScreenContainer from "../components/common/ScreenContainer";
import colors from "../styles/colors";
import userService from "../services/userService";

export default function MyDataScreen({ navigation }) {
  //--- Estado de carga inicial: leer mis datos del backend
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  //--- Bloque "Datos personales"
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  //--- Bloque "Cambiar contraseña"
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await userService.getMe();
        if (cancelled) return;
        setNombre(data?.nombre ?? "");
        setEmail(data?.email ?? "");
      } catch (err) {
        if (cancelled) return;
        console.error("Error cargando 'mis datos':", err);
        setLoadError(
          err?.message ?? "No se pudo cargar tu información. Inténtalo más tarde.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveProfile = async () => {
    setProfileMessage(null);
    const cleanedNombre = nombre.trim();
    const cleanedEmail = email.trim().toLowerCase();
    if (!cleanedNombre) {
      setProfileMessage({ type: "error", text: "Introduce tu nombre." });
      return;
    }
    if (!cleanedEmail.includes("@")) {
      setProfileMessage({ type: "error", text: "Introduce un email válido." });
      return;
    }

    setSavingProfile(true);
    try {
      const res = await userService.updateProfile({
        nombre: cleanedNombre,
        email: cleanedEmail,
      });
      if (res?.status === "OK") {
        if (res.user) {
          setNombre(res.user.nombre);
          setEmail(res.user.email);
        }
        setProfileMessage({ type: "success", text: "Datos guardados correctamente." });
      } else {
        setProfileMessage({
          type: "error",
          text: res?.message ?? "No se pudo guardar.",
        });
      }
    } catch (err) {
      console.error("Error guardando perfil:", err);
      setProfileMessage({
        type: "error",
        text: err?.message ?? "Error de conexión.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordMessage(null);
    if (!currentPassword) {
      setPasswordMessage({ type: "error", text: "Introduce tu contraseña actual." });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "La nueva contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }
    if (newPassword !== repeatPassword) {
      setPasswordMessage({ type: "error", text: "Las contraseñas no coinciden." });
      return;
    }

    setSavingPassword(true);
    try {
      const res = await userService.changePassword({
        currentPassword,
        newPassword,
      });
      if (res?.status === "OK") {
        setCurrentPassword("");
        setNewPassword("");
        setRepeatPassword("");
        setPasswordMessage({
          type: "success",
          text: "Contraseña actualizada correctamente.",
        });
      } else {
        setPasswordMessage({
          type: "error",
          text: res?.message ?? "No se pudo cambiar la contraseña.",
        });
      }
    } catch (err) {
      console.error("Error cambiando contraseña:", err);
      setPasswordMessage({
        type: "error",
        text: err?.message ?? "Error de conexión.",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <ScreenContainer>
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.topSection}>
            <View style={styles.topRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.headerMini}>Cuenta</Text>
            <Text style={styles.headerTitle}>Mis datos</Text>
            <Text style={styles.headerSubtitle}>
              Edita tu nombre, email y contraseña. Los cambios se guardan al pulsar
              el botón de cada bloque.
            </Text>
          </View>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.loadingText}>Cargando tus datos...</Text>
            </View>
          ) : loadError ? (
            <View style={styles.errorBoxStandalone}>
              <Ionicons name="cloud-offline-outline" size={26} color="#B3533D" />
              <Text style={styles.errorBoxStandaloneText}>{loadError}</Text>
            </View>
          ) : (
            <>
              {/* BLOQUE: DATOS PERSONALES */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Datos personales</Text>
                <Text style={styles.cardSubtitle}>
                  Tu nombre y email aparecen en tu perfil y en tus pedidos.
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nombre</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Tu nombre"
                    placeholderTextColor={colors.textSoft}
                    value={nombre}
                    onChangeText={setNombre}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="tu@email.com"
                    placeholderTextColor={colors.textSoft}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                {profileMessage ? (
                  <MessageBanner message={profileMessage} />
                ) : null}

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    savingProfile && styles.primaryButtonDisabled,
                  ]}
                  onPress={handleSaveProfile}
                  disabled={savingProfile}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryButtonText}>
                    {savingProfile ? "Guardando..." : "Guardar cambios"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* BLOQUE: CAMBIAR CONTRASEÑA */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Cambiar contraseña</Text>
                <Text style={styles.cardSubtitle}>
                  Necesitamos tu contraseña actual para confirmar el cambio.
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Contraseña actual</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Tu contraseña actual"
                    placeholderTextColor={colors.textSoft}
                    secureTextEntry
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nueva contraseña</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor={colors.textSoft}
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Repetir nueva contraseña</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Repite la nueva contraseña"
                    placeholderTextColor={colors.textSoft}
                    secureTextEntry
                    value={repeatPassword}
                    onChangeText={setRepeatPassword}
                  />
                </View>

                {passwordMessage ? (
                  <MessageBanner message={passwordMessage} />
                ) : null}

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    savingPassword && styles.primaryButtonDisabled,
                  ]}
                  onPress={handleChangePassword}
                  disabled={savingPassword}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryButtonText}>
                    {savingPassword ? "Cambiando..." : "Cambiar contraseña"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </ScreenContainer>
  );
}

function MessageBanner({ message }) {
  const isSuccess = message.type === "success";
  return (
    <View style={[styles.banner, isSuccess ? styles.bannerSuccess : styles.bannerError]}>
      <Ionicons
        name={isSuccess ? "checkmark-circle" : "alert-circle"}
        size={18}
        color={isSuccess ? "#2F7A3D" : "#B3533D"}
      />
      <Text style={[styles.bannerText, { color: isSuccess ? "#1F5A2B" : "#8C2A1A" }]}>
        {message.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8F4",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  topSection: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 30,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  headerMini: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 320,
  },

  loadingBox: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 30,
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: "600",
  },
  errorBoxStandalone: {
    margin: 20,
    backgroundColor: "#FBE9E5",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
    gap: 10,
  },
  errorBoxStandaloneText: {
    color: "#8C2A1A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  card: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.textSoft,
    marginBottom: 18,
    lineHeight: 18,
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
  banner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    gap: 8,
  },
  bannerSuccess: {
    backgroundColor: "#E4F2D7",
  },
  bannerError: {
    backgroundColor: "#FBE9E5",
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
});
