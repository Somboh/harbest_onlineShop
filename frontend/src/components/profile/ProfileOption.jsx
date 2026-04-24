import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../styles/colors";

export default function ProfileOption({ icon, label, value, onPress }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.label}>{label}</Text>
        {value && <Text style={styles.value}>{value}</Text>}
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.textSoft} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "#EEF5E3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textBlock: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  value: {
    fontSize: 12,
    color: colors.textSoft,
    marginTop: 3,
  },
});
