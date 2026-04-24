import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../styles/colors";

export default function ProductImage({ source, badge }) {
  return (
    <View style={styles.wrapper}>
      <Image source={source} style={styles.image} />

      {badge && (
        <View style={styles.badge}>
          <Ionicons name="leaf" size={13} color={colors.primary} />
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 260,
    borderRadius: 28,
    resizeMode: "cover",
  },
  badge: {
    position: "absolute",
    left: 16,
    bottom: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  badgeText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
});
