import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CategoryCard({ category, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: category.color }]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={category.icon} size={20} color="#fff" />
      </View>
      <Text style={styles.title}>{category.label}</Text>
      <Text style={styles.subtitle}>{category.subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    minHeight: 118,
    justifyContent: "space-between",
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 4,
  },
  subtitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 12,
    fontWeight: "500",
  },
});
