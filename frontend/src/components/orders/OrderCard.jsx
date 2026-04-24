import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../styles/colors";
import { formatPrice } from "../../utils/formatPrice";

export default function OrderCard({ order, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.header}>
        <View>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.meta}>{order.date}</Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Ionicons name="basket-outline" size={18} color={colors.primary} />
        <Text style={styles.summary} numberOfLines={1}>
          {order.items.length} productos - {order.farmerName}
        </Text>
      </View>

      <Text style={styles.total}>{formatPrice(order.total)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderId: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  meta: {
    fontSize: 12,
    color: colors.textSoft,
    marginTop: 3,
  },
  statusBadge: {
    backgroundColor: "#EEF5E3",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  body: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  summary: {
    flex: 1,
    marginLeft: 8,
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: "600",
  },
  total: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
});
