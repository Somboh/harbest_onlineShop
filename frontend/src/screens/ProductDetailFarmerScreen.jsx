import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import FarmerTabBar from "../components/common/FarmerTabBar";
import ScreenContainer from "../components/common/ScreenContainer";
import { hydrateProduct } from "../data/productAdapter";
import productsService from "../services/productsService";
import { ROLE_THEMES } from "../styles/roleThemes";
import { formatPrice } from "../utils/formatPrice";

const theme = ROLE_THEMES.farmer;

export default function ProductDetailFarmerScreen({ navigation, route }) {
  const requestedId = route?.params?.productId;

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "ok" | "not-found" | "error"
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleDelete = async () => {
    if (!product) return;
    setDeleting(true);
    setErrorMessage("");
    try {
      const res = await productsService.deleteProduct(product.id);
      if (res?.status === "OK") {
        navigation.navigate("ProductosAgricultor", { category: "Todos" });
        return;
      }
      setErrorMessage(res?.message ?? "No se pudo eliminar el producto.");
    } catch (err) {
      console.error("Error eliminando producto:", err);
      setErrorMessage(err?.message ?? "No se pudo eliminar el producto.");
    } finally {
      setDeleting(false);
    }
  };

  if (status !== "ok" || !product) {
    const message =
      status === "loading"
        ? "Cargando producto..."
        : status === "not-found"
          ? "Este producto ya no existe."
          : "No se pudo cargar el producto. Comprueba tu conexión.";

    return (
      <ScreenContainer>
        <View style={[styles.container, { padding: 20 }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={theme.text}
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Mi producto</Text>
          </View>
          <View style={styles.statusWrap}>
            {status === "loading" ? (
              <ActivityIndicator color={theme.primary} />
            ) : (
              <Ionicons
                name="alert-circle-outline"
                size={32}
                color={theme.textSoft}
              />
            )}
            <Text style={styles.statusText}>{message}</Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

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
                color={theme.text}
                style={styles.backIcon}
              />
            </TouchableOpacity>

            <Text style={styles.title}>Mi producto</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("HomeAgricultor")}
            >
              <Image source={theme.logo} style={styles.logoImage} />
            </TouchableOpacity>
          </View>

          <View style={styles.imageCard}>
            {product.image ? (
              <Image source={product.image} style={styles.productImage} />
            ) : (
              <View style={[styles.productImage, styles.productImageEmpty]}>
                <Ionicons name="leaf" size={48} color={theme.primary} />
              </View>
            )}
          </View>

          <View style={styles.infoCard}>
            <View style={styles.topRow}>
              <View style={styles.titleBlock}>
                <Text style={styles.productTitle}>{product.name}</Text>
                {product.category ? (
                  <Text style={styles.productCategory}>{product.category}</Text>
                ) : null}
              </View>

              <View style={styles.priceBadge}>
                <Text style={styles.priceBadgeValue}>
                  {formatPrice(product.price)}
                </Text>
                <Text style={styles.priceBadgeUnit}>/ {product.unit}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Ionicons name="cube-outline" size={18} color={theme.primary} />
                <Text style={styles.statLabel}>Stock</Text>
                <Text style={styles.statValue}>
                  {product.stock} {product.unit}
                </Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons name="star" size={18} color="#F5B301" />
                <Text style={styles.statLabel}>Valoración</Text>
                <Text style={styles.statValue}>
                  {Number(product.rating ?? 0).toFixed(1)}
                </Text>
              </View>
            </View>

            {product.description ? (
              <>
                <Text style={styles.sectionTitle}>Descripción</Text>
                <Text style={styles.description}>{product.description}</Text>
              </>
            ) : null}
          </View>

          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color="#B3533D" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.bottomBar}>
          {confirming ? (
            <>
              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  deleting && styles.buttonDisabled,
                ]}
                onPress={() => setConfirming(false)}
                activeOpacity={0.85}
                disabled={deleting}
              >
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.deleteButton,
                  deleting && styles.buttonDisabled,
                ]}
                onPress={handleDelete}
                activeOpacity={0.85}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Ionicons name="trash" size={18} color="#fff" />
                )}
                <Text style={styles.deleteButtonText}>
                  {deleting ? "Eliminando..." : "Confirmar"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => setConfirming(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="trash-outline" size={18} color="#fff" />
              <Text style={styles.deleteButtonText}>Eliminar producto</Text>
            </TouchableOpacity>
          )}
        </View>

        <FarmerTabBar Navigation={navigation} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 200,
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
    fontWeight: "700",
    flex: 1,
    color: theme.text,
  },
  logoImage: {
    width: 36,
    height: 36,
    resizeMode: "contain",
  },
  imageCard: {
    marginBottom: 18,
  },
  productImage: {
    width: "100%",
    height: 260,
    borderRadius: 28,
    resizeMode: "cover",
  },
  productImageEmpty: {
    backgroundColor: theme.primarySoft,
    justifyContent: "center",
    alignItems: "center",
  },
  infoCard: {
    backgroundColor: theme.card,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1D3C5",
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
    fontSize: 22,
    fontWeight: "800",
    color: theme.text,
    marginBottom: 6,
  },
  productCategory: {
    fontSize: 13,
    color: theme.textSoft,
    fontWeight: "600",
  },
  priceBadge: {
    backgroundColor: theme.primarySoft,
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
    color: theme.primary,
  },
  priceBadgeUnit: {
    fontSize: 12,
    color: theme.textSoft,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#FBF2EE",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1D3C5",
  },
  statLabel: {
    fontSize: 12,
    color: theme.textSoft,
    fontWeight: "600",
    marginTop: 6,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.text,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.textSoft,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBE9E5",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 14,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: "#8C2A1A",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  bottomBar: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 102,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 12,
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderColor: "#F1D3C5",
    shadowColor: "#8B3E24",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F2DFD6",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: theme.text,
    fontSize: 14,
    fontWeight: "800",
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#B3533D",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  statusWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    color: theme.textSoft,
    marginTop: 12,
    textAlign: "center",
  },
});
