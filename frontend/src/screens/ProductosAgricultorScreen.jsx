import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import colors from "../styles/colors";
import ScreenContainer from "../components/common/ScreenContainer";
import { useAuth } from "../context/AuthContext";
import { useDisplaySettings } from "../context/DisplaySettingsContext";
import { useResponsive } from "../hooks/useResponsive";
import { hydrateProducts } from "../data/productAdapter";
import productsService from "../services/productsService";
import { getDisplayMode } from "../styles/displayModes";
import { ROLE_THEMES } from "../styles/roleThemes";

export default function ProductosAgricultorScreen({ navigation, route }) {
  const { user } = useAuth();
  const { settings } = useDisplaySettings();
  const display = getDisplayMode(settings, ROLE_THEMES.farmer);
  const { isDesktop, isTablet } = useResponsive();
  const wide = isDesktop || isTablet;

  const category = route.params?.category || "Todos";
  const isAllCategories = category === "Todos";

  const [farmerProducts, setFarmerProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  //Recargamos cada vez que la pantalla recibe foco para que un producto recién
  //creado en AddProduct aparezca al volver aquí.
  useFocusEffect(
    React.useCallback(() => {
      let cancelled = false;
      const email = user?.email;
      if (!email) {
        setFarmerProducts([]);
        setLoading(false);
        return undefined;
      }
      setLoading(true);
      (async () => {
        try {
          const raw = await productsService.getProductsByFarmer(email);
          if (!cancelled) setFarmerProducts(hydrateProducts(raw));
        } catch (err) {
          console.error("Error cargando productos del agricultor:", err);
          if (!cancelled) setFarmerProducts([]);
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [user?.email]),
  );

  const filteredProducts = useMemo(() => {
    if (isAllCategories) return farmerProducts;
    const target = category.toLowerCase();
    return farmerProducts.filter(
      (product) => (product.category || "").toLowerCase() === target,
    );
  }, [farmerProducts, category, isAllCategories]);

  const getCategoryIcon = () => {
    const icons = {
      Frutas: "logo-apple",
      Verduras: "leaf",
      Especias: "nutrition",
      Todos: "barcode-outline",
    };
    return icons[category] || "barcode-outline";
  };

  const getCategoryColor = () => {
    const categoryColors = {
      Frutas: "#f1c7c7",
      Verduras: "#c7f1d0",
      Especias: "#f1e5c7",
      Todos: "#d4c7f1",
    };
    return categoryColors[category] || "#f1f1f1";
  };

  const getCategoryTitle = () => {
    const titles = {
      Frutas: "Frutas frescas\nde temporada",
      Verduras: "Verduras de\nhuerta ecológica",
      Especias: "Especias y\nsabores naturales",
      Todos: "Todos mis\nproductos",
    };
    return titles[category] || "Mis productos";
  };

  const getCategorySubtitle = () => {
    const subtitles = {
      Frutas: "Dulces, naturales y recogidas en su punto óptimo",
      Verduras: "Frescas del campo, cuidadas con dedicación",
      Especias: "Sabores intensos y aromas auténticos",
      Todos: "Vista completa de tu inventario disponible",
    };
    return subtitles[category] || "Gestiona tus productos";
  };

  return (
    <ScreenContainer>
      <View style={[styles.container, { backgroundColor: display.background }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={display.text} />
            </TouchableOpacity>

            <Text style={[styles.title, { color: display.text }]}>
              {category}
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Inventory")}
              style={[
                styles.inventoryButton,
                {
                  backgroundColor: display.primarySoft,
                  borderColor: display.primary,
                },
              ]}
            >
              <Ionicons
                name="archive-outline"
                size={16}
                color={display.primary}
              />
            </TouchableOpacity>
          </View>

          {/* HERO DE CATEGORÍA */}
          <View
            style={[styles.heroCard, { backgroundColor: getCategoryColor() }]}
          >
            <View style={styles.heroContent}>
              <View
                style={[
                  styles.heroBadge,
                  { backgroundColor: display.primarySoft },
                ]}
              >
                <Ionicons
                  name={getCategoryIcon()}
                  size={14}
                  color={display.primary}
                />
                <Text
                  style={[styles.heroBadgeText, { color: display.primary }]}
                >
                  Mi inventario
                </Text>
              </View>

              <Text style={[styles.heroTitle, { color: "#2B2B2B" }]}>
                {getCategoryTitle()}
              </Text>

              <Text style={[styles.heroSubtitle, { color: "#555" }]}>
                {getCategorySubtitle()}
              </Text>

              <View style={styles.heroInfoRow}>
                <View
                  style={[
                    styles.heroInfoPill,
                    { backgroundColor: "rgba(255,255,255,0.7)" },
                  ]}
                >
                  <Ionicons name="layers-outline" size={14} color="#2B2B2B" />
                  <Text style={[styles.heroInfoText, { color: "#2B2B2B" }]}>
                    {filteredProducts.length} productos
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.heroInfoPill,
                    { backgroundColor: display.primary },
                  ]}
                  onPress={() => navigation.navigate("Inventory")}
                >
                  <Ionicons name="add-outline" size={14} color="#fff" />
                  <Text style={[styles.heroInfoText, { color: "#fff" }]}>
                    Ir al inventario
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* SECCIÓN TITULAR */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: display.text }]}>
                {filteredProducts.length > 0
                  ? "Productos disponibles"
                  : "Sin productos"}
              </Text>
              <Text
                style={[styles.sectionSubtitle, { color: display.textSoft }]}
              >
                {filteredProducts.length > 0
                  ? `${filteredProducts.length} ${category === "Todos" ? "producto(s)" : "en esta categoría"}`
                  : "Comienza agregando productos a tu inventario"}
              </Text>
            </View>
          </View>

          {/* LISTADO DE PRODUCTOS */}
          {loading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator color={display.primary} />
              <Text style={[styles.emptySubtext, { color: display.textSoft }]}>
                Cargando tus productos...
              </Text>
            </View>
          ) : filteredProducts.length > 0 ? (
            <View style={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  display={display}
                  onPress={() =>
                    navigation.navigate("ProductDetailFarmer", {
                      productId: product.id,
                    })
                  }
                  wide={wide}
                />
              ))}
            </View>
          ) : (
            <View
              style={[styles.emptyState, { backgroundColor: display.surface }]}
            >
              <Ionicons
                name="close-circle-outline"
                size={48}
                color={display.textSoft}
              />
              <Text style={[styles.emptyText, { color: display.text }]}>
                No hay productos en {category.toLowerCase()}
              </Text>
              <Text style={[styles.emptySubtext, { color: display.textSoft }]}>
                Crea uno nuevo para empezar a vender
              </Text>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: display.primary }]}
                onPress={() => navigation.navigate("AddProduct")}
              >
                <Ionicons name="add-circle" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Agregar producto</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* BOTÓN FLOTANTE PARA AÑADIR PRODUCTO */}
        <TouchableOpacity
          style={[styles.floatingButton, { backgroundColor: display.primary }]}
          onPress={() => navigation.navigate("AddProduct")}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const ProductCard = ({ product, display, onPress, wide }) => (
  <TouchableOpacity
    style={[
      styles.productCard,
      wide && styles.productCardWide,
      {
        backgroundColor: display.surface,
        borderColor: display.border,
      },
    ]}
    activeOpacity={0.9}
    onPress={onPress}
  >
    <View style={styles.imageWrapper}>
      {product.image ? (
        <Image source={product.image} style={styles.productImage} />
      ) : (
        <View
          style={[
            styles.productImage,
            styles.productImagePlaceholder,
            { backgroundColor: display.primarySoft },
          ]}
        >
          <Ionicons name="leaf" size={32} color={display.primary} />
        </View>
      )}
      {product.badge ? (
        <View
          style={[
            styles.productOverlayBadge,
            { backgroundColor: display.primary },
          ]}
        >
          <Text style={styles.productOverlayBadgeText}>{product.badge}</Text>
        </View>
      ) : null}
    </View>

    <View style={styles.productContent}>
      <Text
        style={[styles.productName, { color: display.text }]}
        numberOfLines={1}
      >
        {product.name}
      </Text>
      <Text
        style={[styles.productCategory, { color: display.textSoft }]}
        numberOfLines={1}
      >
        {product.category}
      </Text>

      <View style={styles.productFooter}>
        <View>
          <Text style={[styles.productPrice, { color: display.primary }]}>
            {Number(product.price ?? 0).toFixed(2)}€
          </Text>
          <Text style={[styles.productUnit, { color: display.textSoft }]}>
            por {product.unit || "kg"}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.stockBadge, { backgroundColor: display.primarySoft }]}
          activeOpacity={0.85}
        >
          <Text style={[styles.stockText, { color: display.primary }]}>
            {product.stock ?? 0} {product.unit || "kg"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  backButton: {
    padding: 8,
    marginRight: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },

  inventoryButton: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },

  heroCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    minHeight: 200,
    justifyContent: "space-between",
  },

  heroContent: {
    zIndex: 2,
  },

  heroBadge: {
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  heroBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 6,
  },

  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
    marginBottom: 8,
  },

  heroSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },

  heroInfoRow: {
    flexDirection: "row",
    gap: 10,
  },

  heroInfoPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },

  heroInfoText: {
    fontSize: 11,
    fontWeight: "600",
  },

  sectionHeader: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  sectionSubtitle: {
    fontSize: 12,
  },

  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },

  productCardWide: {
    width: "23.5%",
  },

  productCard: {
    width: "48.5%",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  imageWrapper: {
    position: "relative",
    height: 140,
    overflow: "hidden",
  },

  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  productImagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  loadingState: {
    paddingVertical: 36,
    alignItems: "center",
    gap: 12,
  },

  productOverlayBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  productOverlayBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },

  productContent: {
    padding: 12,
  },

  productName: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
  },

  productCategory: {
    fontSize: 10,
    marginBottom: 8,
  },

  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  productPrice: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 2,
  },

  productUnit: {
    fontSize: 9,
  },

  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  stockText: {
    fontSize: 10,
    fontWeight: "700",
  },

  emptyState: {
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    marginBottom: 20,
  },

  emptyText: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 4,
  },

  emptySubtext: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
  },

  addButton: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
