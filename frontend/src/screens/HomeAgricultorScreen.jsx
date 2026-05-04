import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import FarmerTabBar from "../components/common/FarmerTabBar";
import ScreenContainer from "../components/common/ScreenContainer";
import PendingOrdersBanner from "../components/orders/PendingOrdersBanner";
import { useDisplaySettings } from "../context/DisplaySettingsContext";
import { mockProducts } from "../data/mockProducts";
import { getDisplayMode } from "../styles/displayModes";
import { ROLE_THEMES } from "../styles/roleThemes";

export default function HomeAgricultorScreen({ navigation }) {
  const { settings } = useDisplaySettings();
  const display = getDisplayMode(settings, ROLE_THEMES.farmer);
  const latestProducts = mockProducts.slice(0, 3);

  return (
    <ScreenContainer>
      <View style={[styles.container, { backgroundColor: display.background }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerLeft}
              onPress={() => navigation.navigate("Splash")}
              activeOpacity={0.85}
            >
              <Ionicons name="arrow-back" size={22} color={display.text} />
              <Text style={[styles.headerText, { color: display.text }]}>
                Inicio
              </Text>
            </TouchableOpacity>

            <View style={styles.headerRight}>
              <TouchableOpacity
                style={[
                  styles.logoButton,
                  {
                    backgroundColor: display.surface,
                    borderColor: display.border,
                  },
                ]}
                onPress={() => navigation.navigate("ProfileAgricultor")}
                activeOpacity={0.85}
              >
                <Image
                  source={ROLE_THEMES.farmer.logo}
                  style={styles.logoImage}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.searchBar,
              { backgroundColor: display.surface, borderColor: display.border },
            ]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("SearchAgricultor")}
          >
            <Ionicons name="search" size={18} color={display.icon} />
            <Text style={[styles.searchText, { color: display.textSoft }]}>
              Buscar productos...
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: display.surface,
                borderColor: display.border,
                shadowColor: display.shadow,
              },
            ]}
          >
            <View style={styles.heroContent}>
              <View
                style={[
                  styles.heroBadge,
                  { backgroundColor: display.primarySoft },
                ]}
              >
                <Text
                  style={[styles.heroBadgeText, { color: display.primary }]}
                >
                  Panel agricultor
                </Text>
              </View>

              <Text style={[styles.heroTitle, { color: display.text }]}>
                Gestiona tu campo{"\n"}desde Harbest
              </Text>

              <Text style={[styles.heroSubtitle, { color: display.textSoft }]}>
                Controla productos, stock y pedidos con una vista clara de tu
                actividad.
              </Text>
            </View>

            <Image source={ROLE_THEMES.farmer.logo} style={styles.heroImage} />
          </View>

          <Text style={[styles.mainTitle, { color: display.text }]}>
            Mis productos
          </Text>

          <View style={styles.categories}>
            <CategoryItem
              color={display.categoryColors[0]}
              icon="logo-apple"
              title="FRUTAS"
              onPress={() =>
                navigation.navigate("ProductosAgricultor", {
                  category: "Frutas",
                })
              }
            />
            <CategoryItem
              color={display.categoryColors[1]}
              icon="leaf"
              title="VERDURAS"
              onPress={() =>
                navigation.navigate("ProductosAgricultor", {
                  category: "Verduras",
                })
              }
            />
            <CategoryItem
              color={display.categoryColors[2]}
              icon="nutrition"
              title="ESPECIAS"
              onPress={() =>
                navigation.navigate("ProductosAgricultor", {
                  category: "Especias",
                })
              }
            />
            <CategoryItem
              color={display.categoryColors[3]}
              icon="barcode-outline"
              title="VER TODO"
              onPress={() =>
                navigation.navigate("ProductosAgricultor", {
                  category: "Todos",
                })
              }
            />
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: display.text }]}>
                Ultimos añadidos
              </Text>
              <Text
                style={[styles.sectionSubtitle, { color: display.textSoft }]}
              >
                Productos visibles en tu inventario
              </Text>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("Inventory")}>
              <Text style={[styles.seeAllText, { color: display.primary }]}>
                Ver todo
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.productList}>
            {latestProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                display={display}
                onPress={() => navigation.navigate("Inventory")}
              />
            ))}
          </View>
        </ScrollView>

        <PendingOrdersBanner navigation={navigation} bottom={100} />
        <FarmerTabBar Navigation={navigation} ActiveRoute="HomeAgricultor" />
      </View>
    </ScreenContainer>
  );
}

const CategoryItem = ({ color, icon, title, onPress }) => (
  <TouchableOpacity
    style={[styles.categoryBox, { backgroundColor: color }]}
    activeOpacity={0.9}
    onPress={onPress}
  >
    <Ionicons name={icon} size={22} color="#FFF" style={styles.categoryIcon} />
    <Text style={styles.categoryTitle}>{title}</Text>
  </TouchableOpacity>
);

const ProductCard = ({ product, display, onPress }) => (
  <TouchableOpacity
    style={[
      styles.card,
      {
        backgroundColor: display.surface,
        borderColor: display.border,
        shadowColor: display.shadow,
      },
    ]}
    onPress={onPress}
    activeOpacity={0.86}
  >
    <Image source={product.image} style={styles.cardImage} />

    <View style={styles.cardInfo}>
      <Text
        style={[styles.cardName, { color: display.text }]}
        numberOfLines={1}
      >
        {product.name}
      </Text>
      <Text style={[styles.cardQty, { color: display.textSoft }]}>
        {product.stock} {product.unit} disponibles
      </Text>
    </View>

    <View style={[styles.cardBadge, { backgroundColor: display.primarySoft }]}>
      <Text style={[styles.cardBadgeText, { color: display.primary }]}>
        {product.category}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ROLE_THEMES.farmer.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 110,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontSize: 18,
    color: ROLE_THEMES.farmer.text,
    marginLeft: 10,
    fontWeight: "700",
  },
  logoButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1D3C5",
  },
  logoImage: {
    width: 34,
    height: 34,
    resizeMode: "contain",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#F1D3C5",
  },
  searchText: {
    marginLeft: 10,
    fontSize: 14,
    color: ROLE_THEMES.farmer.textSoft,
  },
  heroCard: {
    backgroundColor: "#fff",
    borderColor: "#F1D3C5",
    borderWidth: 2,
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
    minHeight: 178,
    overflow: "hidden",
    position: "relative",
  },
  heroContent: {
    width: "66%",
    zIndex: 2,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: ROLE_THEMES.farmer.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 12,
  },
  heroBadgeText: {
    color: ROLE_THEMES.farmer.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  heroTitle: {
    fontSize: 25,
    lineHeight: 31,
    fontWeight: "800",
    color: ROLE_THEMES.farmer.text,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: ROLE_THEMES.farmer.textSoft,
  },
  heroImage: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: 116,
    height: 116,
    resizeMode: "contain",
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: ROLE_THEMES.farmer.text,
    marginBottom: 15,
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  categoryBox: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    paddingVertical: 18,
    marginBottom: 12,
  },
  categoryIcon: {
    marginRight: 8,
  },
  categoryTitle: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: ROLE_THEMES.farmer.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: ROLE_THEMES.farmer.textSoft,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 13,
    color: ROLE_THEMES.farmer.primary,
    fontWeight: "800",
  },
  productList: {
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F1D3C5",
    shadowColor: "#8B3E24",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardImage: {
    width: 62,
    height: 62,
    borderRadius: 14,
    resizeMode: "cover",
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  cardName: {
    fontWeight: "800",
    color: ROLE_THEMES.farmer.text,
    fontSize: 15,
    marginBottom: 5,
  },
  cardQty: {
    fontSize: 12,
    color: ROLE_THEMES.farmer.textSoft,
  },
  cardBadge: {
    backgroundColor: ROLE_THEMES.farmer.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 6,
    marginLeft: 8,
  },
  cardBadgeText: {
    fontSize: 11,
    color: ROLE_THEMES.farmer.primary,
    fontWeight: "800",
  },
});
