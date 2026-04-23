import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../styles/colors";

export default function SearchBar({ value, onChangeText, placeholder = "Buscar..." }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color={colors.textSoft} style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSoft}
        style={styles.input}
      />
      {Boolean(value) && (
        <TouchableOpacity onPress={() => onChangeText("")} activeOpacity={0.8}>
          <Ionicons name="close-circle" size={18} color={colors.textSoft} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
});
