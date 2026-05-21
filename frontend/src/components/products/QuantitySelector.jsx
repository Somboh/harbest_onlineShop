import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../styles/colors";

export default function QuantitySelector({
  value,
  onChange,
  min = 0.5,
  step = 0.5,
  unit = "kg",
}) {
  const decrease = () => {
    const nextValue = +(value - step).toFixed(1);
    onChange(nextValue < min ? min : nextValue);
  };

  const increase = () => {
    onChange(+(value + step).toFixed(1));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={decrease}
        activeOpacity={0.8}
      >
        <Ionicons name="remove" size={18} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.value}>
        {value.toFixed(1)} {unit}
      </Text>

      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={increase}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F7F8F4",
    borderRadius: 20,
    padding: 8,
  },
  button: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  value: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },
});
