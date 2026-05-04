import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ScreenContainer from "../components/common/ScreenContainer";
import QuantitySelector from "../components/products/QuantitySelector";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { hydrateProduct } from "../data/productAdapter";
import productsService from "../services/productsService";
import colors from "../styles/colors";
import { formatPrice } from "../utils/formatPrice";

export default function ProductDetailScreen({ navigation, route }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const requestedId = route?.params?.productId;

  //product = null mientras carga; "not-found" si el backend no lo encontró.
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "ok" | "not-found" | "error"

  useEffect(() => {
    if (!requestedId) {
      setStatus("not-found");
      return;
    }
    let cancelled = false;
    setStatus("loading");
    (async () => {
      try {
        const raw = await productsService.getProductById(requestedId);
        if (cancelled) return;
        const row = Array.isArray(raw) ? raw[0] : raw;
        const hydrated = hydrateProduct(row);
        if (hydrated) {
          setProduct(hydrated);
          setStatus("ok");
        } else {
          setStatus("not-found");
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Error cargando producto:", err);
        setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [requestedId]);

  //IMPORTANTE: todos los hooks deben llamarse antes de cualquier early return,
  //si no React rompe con "rendered fewer hooks than expected".
  const total = useMemo(() => {
    if (!product) return formatPrice(0);
    return formatPrice(quantity * product.price);
  }, [quantity, product]);

  if (status !== "ok" || !product) {
    const message =
      status === "loading"
        ? "Cargando producto..."
        : status === "not-found"
          ? "Este producto ya no está disponible."
          : "No se pudo cargar el producto. Comprueba tu conexión.";

    return (
      <ScreenContainer>
        <View style={[styles.container, { padding: 20 }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={colors.text} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.title}>Detalle del producto</Text>
          </View>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {status === "loading" ? (
              <Ionicons name="hourglass-outline" size={32} color={colors.textSoft} />
            ) : (
              <Ionicons name="alert-circle-outline" size={32} color={colors.textSoft} />
            )}
            <Text style={{ color: colors.textSoft, marginTop: 12, textAlign: "center" }}>
              {message}
            </Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  const productIsFavorite = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigation.navigate("Cart");
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.text}
                style={styles.backIcon}
              />
            </TouchableOpacity>

            <Text style={styles.title}>Detalle del producto</Text>

            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Image
                  source={require("../../assets/images/logo-harbest.png")}
                  style={styles.logoImage}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.imageCard}>
            {product.image ? (
              <Image source={product.image} style={styles.productImage} />
            ) : (
              <View style={[styles.productImage, { justifyContent: "center", alignItems: "center", backgroundColor: "#EEF5E3" }]}>
                <Ionicons name="leaf" size={48} color={colors.primary} />
              </View>
            )}

            {product.badge ? (
              <View style={styles.floatingTag}>
                <Ionicons name="leaf" size={13} color={colors.primary} />
                <Text style={styles.floatingTagText}>{product.badge}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.infoCard}>
            <View style={styles.topRow}>
              <View style={styles.titleBlock}>
                <Text style={styles.productTitle}>{product.name}</Text>
                <Text style={styles.productSubtitle}>{product.subtitle}</Text>
              </View>

              <View style={styles.priceBadge}>
                <Text style={styles.priceBadgeValue}>
                  {formatPrice(product.price)}
                </Text>
                <Text style={styles.priceBadgeUnit}>/ {product.unit}</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.sellerBox}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={14} color="#fff" />
                </View>

                <View>
                  <Text style={styles.metaLabel}>Vendido por</Text>
                  <Text style={styles.sellerName}>{product.seller}</Text>
                </View>
              </View>

              <View style={styles.ratingBox}>
                <Ionicons name="star" size={14} color="#F5B301" />
                <Text style={styles.ratingText}>{product.rating}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Descripcion</Text>
            <Text style={styles.description}>{product.description}</Text>

            {(product.location || product.deliveryTime) ? (
              <View style={styles.extraInfoRow}>
                {product.location ? (
                  <View style={styles.infoPill}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color={colors.primary}
                    />
                    <Text style={styles.infoPillText}>{product.location}</Text>
                  </View>
                ) : null}

                {product.deliveryTime ? (
                  <View style={styles.infoPill}>
                    <Ionicons
                      name="time-outline"
                      size={14}
                      color={colors.primary}
                    />
                    <Text style={styles.infoPillText}>{product.deliveryTime}</Text>
                  </View>
                ) : null}
              </View>
            ) : null}

            <Text style={styles.sectionTitle}>Cantidad</Text>

            <View style={styles.quantityRow}>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                unit={product.unit}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>{total}</Text>
          </View>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(product)}
            activeOpacity={0.85}
          >
            <Ionicons
              name={productIsFavorite ? "heart" : "heart-outline"}
              size={19}
              color={colors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
            activeOpacity={0.85}
          >
            <Ionicons name="cart-outline" size={18} color="#fff" />
            <Text style={styles.addToCartText}>Anadir al carrito</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8F4",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 130,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  backIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    color: colors.text,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoImage: {
    width: 36,
    height: 36,
    resizeMode: "contain",
  },
  imageCard: {
    position: "relative",
    marginBottom: 18,
  },
  productImage: {
    width: "100%",
    height: 260,
    borderRadius: 28,
    resizeMode: "cover",
  },
  floatingTag: {
    position: "absolute",
    left: 16,
    bottom: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  floatingTagText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  titleBlock: {
    flex: 1,
    paddingRight: 10,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
  },
  productSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSoft,
  },
  priceBadge: {
    backgroundColor: "#EEF5E3",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 84,
  },
  priceBadgeValue: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primary,
  },
  priceBadgeUnit: {
    fontSize: 12,
    color: colors.textSoft,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sellerBox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#69C6BE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  metaLabel: {
    fontSize: 11,
    color: colors.textSoft,
    marginBottom: 2,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E6",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 13,
    fontWeight: "700",
    color: "#8B6A00",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSoft,
    marginBottom: 14,
  },
  extraInfoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 18,
  },
  infoPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8F4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 10,
    marginBottom: 8,
  },
  infoPillText: {
    marginLeft: 6,
    fontSize: 13,
    color: colors.text,
    fontWeight: "600",
  },
  quantityRow: {
    marginTop: 4,
  },
  bottomBar: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
  },
  totalLabel: {
    fontSize: 12,
    color: colors.textSoft,
    marginBottom: 3,
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primary,
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: "#EEF5E3",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: 10,
  },
  addToCartText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
  },
});
