import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../styles/colors";

export default function ScreenHeader({
  navigation,
  title,
  subtitle,
  showBack = true,
  logoPressRoute = "Home",
}) {
  return (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconSpacer} />
      )}

      <View style={styles.textBlock}>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <Text style={styles.title}>{title}</Text>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate(logoPressRoute)}>
        <Image
          source={require("../../../assets/images/logo-harbest.png")}
          style={styles.logo}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconButton: {
    marginRight: 12,
  },
  iconSpacer: {
    width: 34,
    marginRight: 12,
  },
  textBlock: {
    flex: 1,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSoft,
    marginBottom: 2,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  logo: {
    width: 38,
    height: 38,
    resizeMode: "contain",
  },
});
