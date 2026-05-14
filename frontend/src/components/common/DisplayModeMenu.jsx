import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../../context/AuthContext";
import { useDisplaySettings } from "../../context/DisplaySettingsContext";
import { getDisplayMode } from "../../styles/displayModes";
import { ROLE_THEMES } from "../../styles/roleThemes";

const labels = {
  es: {
    title: "Modo de pantalla",
    darkMode: "Modo noche",
    highContrast: "Alto contraste",
    largeText: "Letra grande",
    language: "Idioma",
    spanish: "Español",
    english: "English",
    switchAccount: "Cerrar sesión / cambiar cuenta",
  },
  en: {
    title: "Display mode",
    darkMode: "Night mode",
    highContrast: "High contrast",
    largeText: "Large text",
    language: "Language",
    spanish: "Español",
    english: "English",
    switchAccount: "Log out / switch account",
  },
};

export default function DisplayModeMenu({ role = "user", trigger = "dots" }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();
  const { logout } = useAuth();
  const { settings, toggleSetting, setLanguage, textScale } = useDisplaySettings();
  const theme = role === "farmer" ? ROLE_THEMES.farmer : ROLE_THEMES.user;
  const display = getDisplayMode(settings, theme);
  const copy = labels[settings.language] || labels.es;
  const isLogoTrigger = trigger === "logo";

  const handleSwitchAccount = async () => {
    setIsOpen(false);
    await logout();
    navigation.reset({ index: 0, routes: [{ name: "Splash" }] });
  };

  return (
    <>
      <TouchableOpacity
        style={[
          isLogoTrigger ? styles.logoTrigger : styles.trigger,
          { backgroundColor: display.surface, borderColor: display.border },
          settings.highContrast && styles.triggerContrast,
        ]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.8}
        accessibilityLabel={copy.title}
      >
        {isLogoTrigger ? (
          <Image source={theme.logo} style={styles.logoImage} />
        ) : (
          <Ionicons name="ellipsis-vertical" size={20} color={display.icon} />
        )}
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade">
        <Pressable
          style={[
            styles.backdrop,
            settings.darkMode && styles.backdropDark,
            settings.highContrast && styles.backdropContrast,
          ]}
          onPress={() => setIsOpen(false)}
        >
          <Pressable
            style={[
              styles.menu,
              { backgroundColor: display.surface, borderColor: display.border },
              settings.highContrast && styles.menuContrast,
            ]}
          >
            <View style={styles.menuHeader}>
              <Text
                style={[
                  styles.menuTitle,
                  { color: display.text, fontSize: 16 * textScale },
                ]}
              >
                {copy.title}
              </Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={20} color={display.textSoft} />
              </TouchableOpacity>
            </View>

            <MenuToggle
              icon="moon-outline"
              label={copy.darkMode}
              active={settings.darkMode}
              display={display}
              textScale={textScale}
              onPress={() => toggleSetting("darkMode")}
            />
            <MenuToggle
              icon="contrast-outline"
              label={copy.highContrast}
              active={settings.highContrast}
              display={display}
              textScale={textScale}
              onPress={() => toggleSetting("highContrast")}
            />
            <MenuToggle
              icon="text-outline"
              label={copy.largeText}
              active={settings.largeText}
              display={display}
              textScale={textScale}
              onPress={() => toggleSetting("largeText")}
            />

            <View style={[styles.divider, { backgroundColor: display.border }]} />

            <Text
              style={[
                styles.languageLabel,
                { color: display.textSoft, fontSize: 12 * textScale },
              ]}
            >
              {copy.language}
            </Text>

            <View style={styles.languageRow}>
              <LanguageButton
                active={settings.language === "es"}
                display={display}
                textScale={textScale}
                label={copy.spanish}
                onPress={() => setLanguage("es")}
                flag={<SpainFlag />}
              />
              <LanguageButton
                active={settings.language === "en"}
                display={display}
                textScale={textScale}
                label={copy.english}
                onPress={() => setLanguage("en")}
                flag={<Text style={[styles.flagText, { color: display.text }]}>EN</Text>}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: display.border }]} />

            <MenuAction
              icon="log-out-outline"
              label={copy.switchAccount}
              display={display}
              textScale={textScale}
              onPress={handleSwitchAccount}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const MenuToggle = ({ icon, label, active, display, textScale, onPress }) => (
  <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.85}>
    <View
      style={[
        styles.menuIcon,
        { backgroundColor: active ? display.primary : display.surfaceAlt },
        display.border === "#7CFF00" && styles.menuIconContrast,
      ]}
    >
      <Ionicons name={icon} size={17} color={active ? "#000" : display.primary} />
    </View>

    <Text
      style={[
        styles.menuText,
        { color: display.text, fontSize: 14 * textScale },
      ]}
    >
      {label}
    </Text>

    <Ionicons
      name={active ? "toggle" : "toggle-outline"}
      size={30}
      color={active ? display.primary : display.textSoft}
    />
  </TouchableOpacity>
);

const MenuAction = ({ icon, label, display, textScale, onPress }) => (
  <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.85}>
    <View style={[styles.menuIcon, { backgroundColor: display.surfaceAlt }]}>
      <Ionicons name={icon} size={17} color={display.primary} />
    </View>

    <Text
      style={[
        styles.menuText,
        { color: display.text, fontSize: 14 * textScale },
      ]}
    >
      {label}
    </Text>

    <Ionicons name="chevron-forward" size={20} color={display.textSoft} />
  </TouchableOpacity>
);

const LanguageButton = ({ active, display, textScale, label, flag, onPress }) => (
  <TouchableOpacity
    style={[
      styles.languageButton,
      { backgroundColor: display.surfaceAlt, borderColor: display.border },
      active && { backgroundColor: display.primary, borderColor: display.primary },
    ]}
    onPress={onPress}
    activeOpacity={0.85}
  >
    {flag}
    <Text
      style={[
        styles.languageText,
        { color: active ? "#000" : display.text, fontSize: 13 * textScale },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const SpainFlag = () => (
  <View style={styles.spainFlag}>
    <View style={styles.flagRed} />
    <View style={styles.flagYellow} />
    <View style={styles.flagRed} />
  </View>
);

const styles = StyleSheet.create({
  trigger: {
    width: 38,
    height: 38,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  triggerContrast: {
    borderWidth: 2,
  },
  logoTrigger: {
    width: 42,
    height: 42,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  logoImage: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.22)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 72,
    paddingRight: 20,
  },
  backdropDark: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  backdropContrast: {
    backgroundColor: "rgba(0,0,0,0.76)",
  },
  menu: {
    width: 285,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
  },
  menuContrast: {
    borderWidth: 3,
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  menuTitle: {
    fontWeight: "800",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  menuIconContrast: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  menuText: {
    flex: 1,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  languageLabel: {
    fontWeight: "800",
    marginBottom: 8,
  },
  languageRow: {
    flexDirection: "row",
    gap: 8,
  },
  languageButton: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  flagText: {
    marginBottom: 6,
    fontWeight: "900",
  },
  spainFlag: {
    width: 24,
    height: 16,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.24)",
  },
  flagRed: {
    flex: 1,
    backgroundColor: "#C60B1E",
  },
  flagYellow: {
    flex: 2,
    backgroundColor: "#FFC400",
  },
  languageText: {
    fontWeight: "900",
  },
});
