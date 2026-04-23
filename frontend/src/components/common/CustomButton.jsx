import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../../styles/colors";

export default function CustomButton({
  title,
  onPress,
  variant = "primary",
  style,
  textStyle,
  disabled = false,
}) {
  const isSecondary = variant === "secondary";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSecondary ? styles.secondary : styles.primary,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text style={[styles.text, isSecondary && styles.secondaryText, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: "#F8F8F5",
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryText: {
    color: colors.text,
  },
});
