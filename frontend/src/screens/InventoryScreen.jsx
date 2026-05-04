import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenContainer from "../components/common/ScreenContainer";
import FarmerTabBar from "../components/common/FarmerTabBar";
import { mockProducts } from "../data/mockProducts";
import { useResponsive } from "../hooks/useResponsive";
import { ROLE_THEMES } from "../styles/roleThemes";

export default function InventoryScreen({ navigation }) {
  const { isDesktop, isTablet } = useResponsive();
  const wide = isDesktop || isTablet;
  // <-- RENOMBRADO PARA QUE COINCIDA CON EL STACK
  const inventory = [
    {
      id: "1",
      name: "Tomate raff",
      category: "Hortalizas",
      stock: 48,
      unit: "kg",
      status: "Disponible",
      image: mockProducts[0].image,
    },
    {
      id: "2",
      name: "Calabacín",
      category: "Hortalizas",
      stock: 12,
      unit: "kg",
      status: "Stock bajo",
      image: require("../../assets/images/comida/calabacin.jpg"),
    },
    {
      id: "3",
      name: "Naranjas",
      category: "Frutas",
      stock: 86,
      unit: "kg",
      status: "Disponible",
      image: require("../../assets/images/comida/naranjas.webp"),
    },
    {
      id: "4",
      name: "Lechuga romana",
      category: "Verduras",
      stock: 0,
      unit: "uds",
      status: "Agotado",
      image: require("../../assets/images/comida/lechuga.webp"),
    },
    {
      id: "5",
      name: "Pimiento rojo",
      category: "Hortalizas",
      stock: 19,
      unit: "kg",
      status: "Stock bajo",
      image: require("../../assets/images/comida/pimiento.jpg"),
    },
  ];

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
              <Text style={styles.statNumber}>52</Text>
              <Text style={styles.statLabel}>Productos</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="alert-outline"
                size={20}
                color={theme.secondary}
              />
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Stock bajo</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="close-circle-outline"
                size={20}
                color={theme.secondary}
              />
              <Text style={styles.statNumber}>3</Text>
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
            />
          </View>

          {/* FILTROS */}
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterChip, styles.filterChipActive]}
            >
              <Text style={[styles.filterText, styles.filterTextActive]}>
                Todos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>Disponibles</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>Stock bajo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>Agotados</Text>
            </TouchableOpacity>
          </View>

          {/* LISTADO */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tus productos</Text>

            <View style={wide ? styles.inventoryGridWide : null}>
            {inventory.map((item) => (
              <View key={item.id} style={[styles.productCard, wide && styles.productCardWide]}>
                <View style={styles.productTopRow}>
                  <Image source={item.image} style={styles.productImage} />

                  <View style={styles.productMainInfo}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productCategory}>{item.category}</Text>
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
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.secondaryButtonText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.primaryButton}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.primaryButtonText}>Reponer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
            </View>
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
