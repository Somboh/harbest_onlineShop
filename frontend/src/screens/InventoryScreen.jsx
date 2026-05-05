import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenContainer from "../components/common/ScreenContainer";
import FarmerTabBar from "../components/common/FarmerTabBar";
import { useAuth } from "../context/AuthContext";
import { hydrateProducts } from "../data/productAdapter";
import productsService from "../services/productsService";
import { useResponsive } from "../hooks/useResponsive";
import { ROLE_THEMES } from "../styles/roleThemes";

const LOW_STOCK_THRESHOLD = 15;

const getStatus = (stock) => {
  if (stock <= 0) return "Agotado";
  if (stock <= LOW_STOCK_THRESHOLD) return "Stock bajo";
  return "Disponible";
};

const FILTERS = ["Todos", "Disponibles", "Stock bajo", "Agotados"];

export default function InventoryScreen({ navigation }) {
  const { user } = useAuth();
  const { isDesktop, isTablet } = useResponsive();
  const wide = isDesktop || isTablet;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [actionId, setActionId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const loadProducts = React.useCallback(async () => {
    if (!user?.email) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const raw = await productsService.getProductsByFarmer(user.email);
      setProducts(hydrateProducts(raw));
      setErrorMessage("");
    } catch (err) {
      console.error("Error cargando inventario:", err);
      setErrorMessage("No se pudo cargar el inventario.");
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useFocusEffect(
    React.useCallback(() => {
      let cancelled = false;
      (async () => {
        await loadProducts();
        if (cancelled) return;
      })();
      return () => {
        cancelled = true;
      };
    }, [loadProducts]),
  );

  const inventory = useMemo(() => {
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category || "Sin categoría",
      stock: p.stock ?? 0,
      stockMax: p.stockMax ?? p.stock ?? 0,
      unit: p.unit || "kg",
      status: getStatus(p.stock ?? 0),
      image: p.image,
    }));
  }, [products]);

  const filteredInventory = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inventory.filter((item) => {
      if (q && !item.name.toLowerCase().includes(q)) return false;
      if (filter === "Disponibles" && item.status !== "Disponible") return false;
      if (filter === "Stock bajo" && item.status !== "Stock bajo") return false;
      if (filter === "Agotados" && item.status !== "Agotado") return false;
      return true;
    });
  }, [inventory, search, filter]);

  const stats = useMemo(() => {
    const total = inventory.length;
    const low = inventory.filter((i) => i.status === "Stock bajo").length;
    const out = inventory.filter((i) => i.status === "Agotado").length;
    return { total, low, out };
  }, [inventory]);

  const handleReponer = async (id) => {
    setActionId(id);
    setErrorMessage("");
    try {
      const res = await productsService.reponerProduct(id);
      if (res?.status !== "OK") {
        setErrorMessage(res?.message ?? "No se pudo reponer.");
      }
      await loadProducts();
    } catch (err) {
      console.error("Error reponiendo:", err);
      setErrorMessage(err?.message ?? "No se pudo reponer.");
    } finally {
      setActionId(null);
    }
  };

  const handleEdit = (item) => {
    const original = products.find((p) => p.id === item.id);
    navigation.navigate("AddProduct", {
      mode: "edit",
      productId: item.id,
      prefill: original
        ? {
            nombre: original.name,
            categoria: original.category,
            descripcion: original.description,
            precio: original.price,
            cantidad: original.stock,
            unit: original.unit,
            imageUri: original.image?.uri ?? null,
          }
        : null,
    });
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate("HomeAgricultor")}
                activeOpacity={0.85}
              >
                <Ionicons name="arrow-back" size={20} color={theme.textDark} />
              </TouchableOpacity>

              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.headerAction}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate("AddProduct")}
                >
                  <Ionicons name="add" size={22} color={theme.textDark} />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.headerTitle}>Inventario</Text>
            <Text style={styles.headerSubtitle}>
              Controla el stock de tus productos, consulta disponibilidad y
              repón mercancía cuando lo necesites.
            </Text>
          </View>

          {/* RESUMEN */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="sprout-outline"
                size={20}
                color={theme.secondary}
              />
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Productos</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="alert-outline"
                size={20}
                color={theme.secondary}
              />
              <Text style={styles.statNumber}>{stats.low}</Text>
              <Text style={styles.statLabel}>Stock bajo</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="close-circle-outline"
                size={20}
                color={theme.secondary}
              />
              <Text style={styles.statNumber}>{stats.out}</Text>
              <Text style={styles.statLabel}>Agotados</Text>
            </View>
          </View>

          {/* BUSCADOR */}
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color={theme.textSoft} />
            <TextInput
              placeholder="Buscar producto"
              placeholderTextColor={theme.textSoft}
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* FILTROS */}
          <View style={styles.filterRow}>
            {FILTERS.map((label) => {
              const active = filter === label;
              return (
                <TouchableOpacity
                  key={label}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => setFilter(label)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[styles.filterText, active && styles.filterTextActive]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color="#B3533D" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* LISTADO */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tus productos</Text>

            {loading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator color={theme.primary} />
              </View>
            ) : filteredInventory.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons
                  name="basket-outline"
                  size={28}
                  color={theme.textSoft}
                />
                <Text style={styles.emptyTitle}>Sin productos</Text>
                <Text style={styles.emptySubtitle}>
                  {products.length === 0
                    ? "Aún no has creado ningún producto."
                    : "Ningún producto coincide con los filtros."}
                </Text>
                {products.length === 0 ? (
                  <TouchableOpacity
                    style={styles.emptyButton}
                    onPress={() => navigation.navigate("AddProduct")}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="add-circle" size={18} color="#fff" />
                    <Text style={styles.emptyButtonText}>Añadir producto</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : (
              <View style={wide ? styles.inventoryGridWide : null}>
                {filteredInventory.map((item) => {
                  const isWorking = actionId === item.id;
                  const canRefill = item.stockMax > item.stock;
                  return (
                    <View
                      key={item.id}
                      style={[styles.productCard, wide && styles.productCardWide]}
                    >
                      <View style={styles.productTopRow}>
                        {item.image ? (
                          <Image
                            source={item.image}
                            style={styles.productImage}
                          />
                        ) : (
                          <View
                            style={[
                              styles.productImage,
                              styles.productImageEmpty,
                            ]}
                          >
                            <Ionicons
                              name="leaf"
                              size={20}
                              color={theme.primary}
                            />
                          </View>
                        )}

                        <View style={styles.productMainInfo}>
                          <Text style={styles.productName}>{item.name}</Text>
                          <Text style={styles.productCategory}>
                            {item.category}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.statusBadge,
                            getStatusBadgeStyle(item.status),
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              getStatusTextStyle(item.status),
                            ]}
                          >
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
                          {item.stockMax > 0 ? (
                            <Text style={styles.stockMaxLabel}>
                              Lleno: {item.stockMax} {item.unit}
                            </Text>
                          ) : null}
                        </View>

                        <View style={styles.actionButtons}>
                          <TouchableOpacity
                            style={styles.secondaryButton}
                            activeOpacity={0.85}
                            onPress={() => handleEdit(item)}
                            disabled={isWorking}
                          >
                            <Text style={styles.secondaryButtonText}>
                              Editar
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.primaryButton,
                              (!canRefill || isWorking) &&
                                styles.primaryButtonDisabled,
                            ]}
                            activeOpacity={0.85}
                            onPress={() => handleReponer(item.id)}
                            disabled={!canRefill || isWorking}
                          >
                            {isWorking ? (
                              <ActivityIndicator color="#fff" size="small" />
                            ) : (
                              <Text style={styles.primaryButtonText}>
                                Reponer
                              </Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>

        {/* BOTTOM BAR BLINDADA */}
        <FarmerTabBar Navigation={navigation} ActiveRoute="HomeAgricultor" />
      </View>
    </ScreenContainer>
  );
}

const getStatusBadgeStyle = (status) => {
  switch (status) {
    case "Disponible":
      return { backgroundColor: "#E7F3E8" };
    case "Stock bajo":
      return { backgroundColor: "#FBEBD8" };
    case "Agotado":
      return { backgroundColor: "#F7E1DD" };
    default:
      return { backgroundColor: "#EFEFEF" };
  }
};

const getStatusTextStyle = (status) => {
  switch (status) {
    case "Disponible":
      return { color: "#3E7A4A" };
    case "Stock bajo":
      return { color: "#A06A2C" };
    case "Agotado":
      return { color: "#B3533D" };
    default:
      return { color: "#666" };
  }
};

const theme = {
  bg: ROLE_THEMES.farmer.background,
  card: "#FFFFFF",
  primary: ROLE_THEMES.farmer.primary,
  primaryDark: ROLE_THEMES.farmer.primaryDark,
  secondary: ROLE_THEMES.farmer.primary,
  secondarySoft: ROLE_THEMES.farmer.primarySoft,
  border: "#E6E1D5",
  textDark: "#3D3A34",
  textSoft: "#7B766D",
  highlight: "#F3F0E2",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 120, // Ajustado para que el TabBar no tape nada
  },

  header: {
    marginBottom: 18,
  },

  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.border,
  },

  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.border,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.textDark,
    marginBottom: 8,
  },

  headerSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.textSoft,
    maxWidth: 320,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    gap: 10,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.border,
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.textDark,
    marginTop: 8,
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.textSoft,
    textAlign: "center",
  },

  searchBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: theme.textDark,
    fontSize: 14,
  },

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    gap: 10,
  },

  filterChip: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },

  filterChipActive: {
    backgroundColor: theme.highlight,
    borderColor: "#E4D9BC",
  },

  filterText: {
    color: theme.textSoft,
    fontSize: 13,
    fontWeight: "600",
  },

  filterTextActive: {
    color: "#8D5B2D",
    fontWeight: "700",
  },

  section: {
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: theme.textDark,
    marginBottom: 12,
  },

  productCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 16,
    marginBottom: 14,
  },

  inventoryGridWide: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },

  productCardWide: {
    flexBasis: 360,
    flexGrow: 1,
    minWidth: 320,
    marginBottom: 0,
  },

  productTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  productImage: {
    width: 44,
    height: 44,
    borderRadius: 14,
    resizeMode: "cover",
    marginRight: 12,
  },

  productImageEmpty: {
    backgroundColor: theme.secondarySoft,
    justifyContent: "center",
    alignItems: "center",
  },

  stockMaxLabel: {
    fontSize: 11,
    color: theme.textSoft,
    fontWeight: "600",
    marginTop: 2,
  },

  loadingBox: {
    paddingVertical: 32,
    alignItems: "center",
  },

  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.border,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.textDark,
    marginTop: 10,
  },

  emptySubtitle: {
    fontSize: 12,
    color: theme.textSoft,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 12,
  },

  emptyButton: {
    flexDirection: "row",
    backgroundColor: theme.secondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    gap: 8,
  },

  emptyButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
  },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBE9E5",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    gap: 8,
  },

  errorText: {
    flex: 1,
    color: "#8C2A1A",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },

  primaryButtonDisabled: {
    opacity: 0.5,
  },

  productMainInfo: {
    flex: 1,
  },

  productName: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.textDark,
    marginBottom: 4,
  },

  productCategory: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.textSoft,
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
    color: theme.textSoft,
    fontWeight: "600",
    marginBottom: 4,
  },

  stockValue: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.textDark,
  },

  actionButtons: {
    flexDirection: "row",
  },

  secondaryButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#FAFAF8",
    marginRight: 8,
  },

  secondaryButtonText: {
    color: theme.textDark,
    fontSize: 13,
    fontWeight: "700",
  },

  primaryButton: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: theme.secondary,
  },

  primaryButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
  },
});
