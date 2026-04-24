import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function InventoryProductCard({ item, onEdit, onRestock }) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="food-apple-outline" size={20} color="#D25E2C" />
        </View>

        <View style={styles.mainInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>

        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={[styles.statusText, getStatusTextStyle(item.status)]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.stockRow}>
        <View>
          <Text style={styles.stockLabel}>Stock actual</Text>
          <Text style={styles.stockValue}>
            {item.stock} {item.unit}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.secondaryButton} onPress={onEdit}>
            <Text style={styles.secondaryText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={onRestock}>
            <Text style={styles.primaryText}>Reponer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const getStatusStyle = (status) => {
  if (status === "Disponible") return { backgroundColor: "#E7F3E8" };
  if (status === "Stock bajo") return { backgroundColor: "#FBEBD8" };
  if (status === "Agotado") return { backgroundColor: "#F7E1DD" };
  return { backgroundColor: "#EFEFEF" };
};

const getStatusTextStyle = (status) => {
  if (status === "Disponible") return { color: "#3E7A4A" };
  if (status === "Stock bajo") return { color: "#A06A2C" };
  if (status === "Agotado") return { color: "#B3533D" };
  return { color: "#666" };
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E6E1D5",
    padding: 16,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FBE5DC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  mainInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    color: "#3D3A34",
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    fontWeight: "500",
    color: "#7B766D",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginLeft: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  stockRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stockLabel: {
    fontSize: 13,
    color: "#7B766D",
    fontWeight: "600",
    marginBottom: 4,
  },
  stockValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#3D3A34",
  },
  actions: {
    flexDirection: "row",
  },
  secondaryButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E1D5",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#FAFAF8",
    marginRight: 8,
  },
  secondaryText: {
    color: "#3D3A34",
    fontSize: 13,
    fontWeight: "700",
  },
  primaryButton: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#D25E2C",
  },
  primaryText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
  },
});
