import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import colors from "../../styles/colors";

export default function CustomInput({ label, containerStyle, style, ...props }) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholderTextColor={colors.textSoft}
        style={[styles.input, style]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
});
