import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../styles/colors";
import { formatUnitPrice } from "../../utils/formatPrice";

export default function ProductCard({ product, navigation, onAddPress, compact = false }) {
  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.compactCard]}
      activeOpacity={0.9}
      onPress={() => navigation?.navigate("ProductDetail", { productId: product.id })}
    >
      <View style={styles.imageWrapper}>
        <Image source={product.image} style={styles.image} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{product.badge}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.seller} numberOfLines={1}>
          {product.seller}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>{formatUnitPrice(product.price, product.unit)}</Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={(event) => {
              event.stopPropagation();
              onAddPress?.(product);
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    backgroundColor: "#fff",
    borderRadius: 24,
    marginRight: 14,
    overflow: "hidden",
    shadowColor: "#4a5f18b4",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 4,
  },
  compactCard: {
    width: "48%",
    marginRight: 0,
    marginBottom: 14,
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 130,
    resizeMode: "cover",
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "800",
  },
  content: {
    padding: 14,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
    minHeight: 40,
  },
  seller: {
    color: colors.textSoft,
    fontSize: 12,
    marginBottom: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    fontWeight: "800",
    marginRight: 8,
  },
  addButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
