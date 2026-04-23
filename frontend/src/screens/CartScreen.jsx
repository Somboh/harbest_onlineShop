import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ClientTabBar from "../components/common/ClientTabBar";
import ScreenContainer from "../components/common/ScreenContainer";
import { useCart } from "../context/CartContext";
import colors from "../styles/colors";
import { formatPrice, formatUnitPrice } from "../utils/formatPrice";

export default function CartScreen({ navigation }) {
  const {
    items,
    subtotal,
    shipping,
    total,
    clearCart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.headerTextBlock}>
              <Text style={styles.headerMini}>Compra actual</Text>
              <Text style={styles.headerTitle}>Carrito</Text>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Image
                  source={require("../../assets/images/logo-harbest.png")}
                  style={styles.logoImage}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroLeft}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>Harbest Market</Text>
              </View>

              <Text style={styles.heroTitle}>Todo listo{"\n"}para tu compra</Text>

              <Text style={styles.heroSubtitle}>
                Revisa tus productos frescos antes de confirmar el pedido.
              </Text>
            </View>

            <View style={styles.heroIconWrap}>
              <Ionicons name="cart-outline" size={48} color={colors.primary} />
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Productos</Text>
              <Text style={styles.summaryValue}>{items.length}</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Total actual</Text>
              <Text style={styles.summaryValue}>{formatPrice(total)}</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Tu seleccion</Text>
              <Text style={styles.sectionSubtitle}>
                Productos anadidos al carrito
              </Text>
            </View>

            {items.length > 0 && (
              <TouchableOpacity onPress={clearCart}>
                <Text style={styles.seeAllText}>Vaciar</Text>
              </TouchableOpacity>
            )}
          </View>

          {items.length > 0 ? (
            items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onRemove={() => removeFromCart(item.id)}
                onDecrease={() => updateQuantity(item.id, item.quantity - 0.5)}
                onIncrease={() => updateQuantity(item.id, item.quantity + 0.5)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="basket-outline" size={32} color={colors.primary} />
              <Text style={styles.emptyTitle}>Tu carrito esta vacio</Text>
              <Text style={styles.emptySubtitle}>
                Explora el catalogo y anade productos frescos para verlos aqui.
              </Text>
              <TouchableOpacity
                style={styles.browseButton}
                onPress={() => navigation.navigate("Home")}
                activeOpacity={0.85}
              >
                <Text style={styles.browseButtonText}>Ver productos</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.totalCard}>
            <Text style={styles.totalCardTitle}>Resumen del pedido</Text>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{formatPrice(subtotal)}</Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Envio</Text>
              <Text style={styles.totalValue}>{formatPrice(shipping)}</Text>
            </View>

            <View style={[styles.totalRow, styles.totalRowFinal]}>
              <Text style={styles.totalFinalLabel}>Total</Text>
              <Text style={styles.totalFinalValue}>{formatPrice(total)}</Text>
            </View>

            <TouchableOpacity
              style={[styles.checkoutButton, items.length === 0 && styles.disabledButton]}
              activeOpacity={0.85}
              disabled={items.length === 0}
            >
              <Text style={styles.checkoutButtonText}>Finalizar compra</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <ClientTabBar Navigation={navigation} ActiveRoute="Cart" />
      </View>
    </ScreenContainer>
  );
}

const CartItemCard = ({ item, onRemove, onDecrease, onIncrease }) => (
  <View style={styles.itemCard}>
    <Image source={item.image} style={styles.itemImage} />

    <View style={styles.itemContent}>
      <View style={styles.itemTopRow}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>

        <TouchableOpacity style={styles.removeButton} onPress={onRemove} activeOpacity={0.85}>
          <Ionicons name="trash-outline" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.itemSeller}>{item.seller}</Text>

      <View style={styles.itemFooter}>
        <Text style={styles.itemPrice}>
          {formatUnitPrice(item.price, item.unit)}
        </Text>

        <View style={styles.quantityBox}>
          <TouchableOpacity style={styles.quantityButton} onPress={onDecrease} activeOpacity={0.85}>
            <Ionicons name="remove" size={14} color={colors.text} />
          </TouchableOpacity>

          <Text style={styles.quantityText}>{item.quantity.toFixed(1)}</Text>

          <TouchableOpacity style={styles.quantityButton} onPress={onIncrease} activeOpacity={0.85}>
            <Ionicons name="add" size={14} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8F4",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTextBlock: {
    flex: 1,
    marginLeft: 12,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerMini: {
    fontSize: 12,
    color: colors.textSoft,
    marginBottom: 2,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
  },
  logoImage: {
    width: 38,
    height: 38,
    resizeMode: "contain",
  },
  heroCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#4a5f18b4",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 4,
  },
  heroLeft: {
    flex: 1,
    paddingRight: 14,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF5E3",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 12,
  },
  heroBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  heroTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSoft,
  },
  heroIconWrap: {
    width: 82,
    height: 82,
    borderRadius: 24,
    backgroundColor: "#F3F5ED",
    justifyContent: "center",
    alignItems: "center",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  summaryBox: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSoft,
    fontWeight: "700",
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSoft,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#4a5f18b4",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 4,
  },
  itemImage: {
    width: 92,
    height: 92,
    borderRadius: 18,
    resizeMode: "cover",
    marginRight: 14,
  },
  itemContent: {
    flex: 1,
  },
  itemTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginRight: 10,
  },
  removeButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#F8F8F5",
    justifyContent: "center",
    alignItems: "center",
  },
  itemSeller: {
    fontSize: 12,
    color: colors.textSoft,
    marginBottom: 12,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  quantityBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F5ED",
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    minWidth: 30,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  emptyState: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: "center",
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSoft,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  browseButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
  totalCard: {
    marginTop: 6,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 4,
  },
  totalCardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: colors.textSoft,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  totalRowFinal: {
    borderTopWidth: 1,
    borderTopColor: "#ECECEC",
    paddingTop: 14,
    marginTop: 4,
    marginBottom: 18,
  },
  totalFinalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  totalFinalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.55,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
});
