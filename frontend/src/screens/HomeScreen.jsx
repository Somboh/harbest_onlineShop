import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import ScreenContainer from "../components/common/ScreenContainer";
import colors from "../styles/colors";
import ClientTabBar from "../components/common/ClientTabBar";
import DisplayModeMenu from "../components/common/DisplayModeMenu";
import { useCart } from "../context/CartContext";
import { useDisplaySettings } from "../context/DisplaySettingsContext";
import { useFavorites } from "../context/FavoritesContext";
import { useResponsive } from "../hooks/useResponsive";
import productsService from "../services/productsService";
import { hydrateProducts } from "../data/productAdapter";
import { getDisplayMode } from "../styles/displayModes";
import { ROLE_THEMES } from "../styles/roleThemes";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userService from "../services/userService";
export default function HomeScreen({ navigation }) {
  const { settings } = useDisplaySettings();
  const display = getDisplayMode(settings, ROLE_THEMES.user);
  const { isDesktop, isTablet } = useResponsive();

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [recommended, setRecommended] = useState([]);

  const trimmed = searchText.trim();
  const isSearching = trimmed.length > 0;

  const [nombre, setNombre] = useState("");

  const getName = async () => {
    const me = await userService.getMe();
    setNombre(me.nombre);
  }
  //Recomendados: solo lo que devuelva el backend (máx 6).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await productsService.getProducts();
        if (cancelled) return;
        setRecommended(hydrateProducts(raw).slice(0, 6));
      } catch (err) {
        console.error("Error cargando productos recomendados:", err);
        if (!cancelled) setRecommended([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  //Debounce: solo lanzamos la petición 300ms después de que el usuario deje de
  //escribir. Si vuelve a teclear, cancelamos el timer y reseteamos.
  useEffect(() => {
    if (!isSearching) {
      setSearchResults([]);
      setSearchError("");
      setSearching(false);
      return;
    }

    let cancelled = false;
    setSearching(true);
    setSearchError("");

    const timer = setTimeout(async () => {
      try {
        const raw = await productsService.searchProducts(trimmed);
        if (cancelled) return;
        setSearchResults(hydrateProducts(raw));
      } catch (err) {
        if (cancelled) return;
        console.error("Error buscando productos:", err);
        setSearchError("No se pudo buscar. Comprueba tu conexión.");
        setSearchResults([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed, isSearching]);

  useEffect(()=>{
    getName();
  },[])
  return (
    <ScreenContainer>
      <View style={[styles.container, { backgroundColor: display.background }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.headerTextBlock}>
              <Text style={[styles.headerMini, { color: display.textSoft }]}>Bienvenido de nuevo</Text>
              <Text style={[styles.title, { color: display.text }]}>Hola, {nombre}</Text>
            </View>

            <View style={styles.headerActions}>
              <DisplayModeMenu role="user" trigger="logo" />
            </View>
          </View>

          {/* HERO */}
          <View
            style={[
              styles.heroCard,
              { backgroundColor: display.surface, borderColor: display.border },
            ]}
          >
            <View style={styles.heroContent}>
              <View style={[styles.heroBadge, { backgroundColor: display.primary }]}>
                <Text style={[styles.heroBadgeText, { color: settings.highContrast ? "#000" : colors.primaryLight }]}>Harbest Market</Text>
              </View>

              <Text style={[styles.heroTitle, { color: display.text }]}>
                Frescura real,{"\n"}directa del campo
              </Text>

              <Text style={[styles.heroSubtitle, { color: display.textSoft }]}>
                Compra frutas, verduras y especias de proximidad sin
                intermediarios.
              </Text>
            </View>

            <Image
              source={require("../../assets/images/logo-inicio.png")}
              style={styles.heroImage}
            />
          </View>

          {/* SEARCH */}
          <View style={styles.searchWrapper}>
            <View
              style={[
                styles.searchContainer,
                {
                  backgroundColor: display.surface,
                  borderColor: display.border,
                  borderWidth: 1,
                },
              ]}
            >
              <Ionicons
                name="search"
                size={18}
                color={display.icon}
                style={styles.searchIcon}
              />
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Buscar productos frescos..."
                placeholderTextColor={display.textSoft}
                style={[styles.search, { color: display.text }]}
                autoCorrect={false}
                returnKeyType="search"
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText("")} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color={display.textSoft} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {isSearching ? (
            <SearchResults
              navigation={navigation}
              results={searchResults}
              loading={searching}
              error={searchError}
              query={trimmed}
              display={display}
            />
          ) : (
            <HomeBrowseContent
              navigation={navigation}
              display={display}
              isDesktop={isDesktop}
              isTablet={isTablet}
              recommended={recommended}
            />
          )}
        </ScrollView>

        {/* BOTTOM BAR BLINDADA DEL CLIENTE */}
        <ClientTabBar Navigation={navigation} ActiveRoute="Home" />
      </View>
    </ScreenContainer>
  );
}

//Bloque "modo navegación" del home: categorías + recomendados. Lo extraemos
//para que cuando el usuario está buscando se oculte limpiamente y solo se vean
//los resultados.
function HomeBrowseContent({ navigation, display, isDesktop, isTablet, recommended }) {
  const wide = isDesktop || isTablet;
  return (
    <>
      {/* CATEGORÍAS */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Categorías</Text>
              <Text style={[styles.sectionSubtitle, { color: display.textSoft }]}>
                Explora por tipo de producto
              </Text>
            </View>
          </View>

          <View style={styles.categories}>
            <Category
              color={display.categoryColors[0]}
              icon="nutrition"
              text="Frutas"
              subtitle="Dulces y frescas"
              onPress={() => navigation.navigate("CategoryFruits")}
              wide={isDesktop || isTablet}
            />
            <Category
              color={display.categoryColors[1]}
              icon="leaf"
              text="Verduras"
              subtitle="Del campo a casa"
              onPress={() => navigation.navigate("CategoryVegetables")}
              wide={isDesktop || isTablet}
            />
            <Category
              color={display.categoryColors[2]}
              icon="flame"
              text="Especias"
              subtitle="Aroma y sabor"
              onPress={() => navigation.navigate("CategorySpices")}
              wide={isDesktop || isTablet}
            />
            <Category
              color={display.categoryColors[3]}
              icon="grid"
              text="Ver todo"
              subtitle="Todo el catálogo"
              onPress={() => navigation.navigate("CategoryAll")}
              wide={isDesktop || isTablet}
            />
          </View>

          {/* RECOMENDADOS */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Recomendados</Text>
              <Text style={[styles.sectionSubtitle, { color: display.textSoft }]}>Seleccionados para ti</Text>
            </View>

            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver más</Text>
            </TouchableOpacity>
          </View>

          {wide ? (
            <View style={styles.recommendedGrid}>
              {recommended.map((product) => (
                <ProductCard
                  key={product.id}
                  navigation={navigation}
                  product={product}
                  productId={product.id}
                  name={product.name}
                  seller={product.seller}
                  time={product.deliveryTime || ""}
                  image={product.image}
                  badge={product.badge || product.category}
                  display={display}
                  wide
                />
              ))}
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendedRow}
            >
              {recommended.map((product) => (
                <ProductCard
                  key={product.id}
                  navigation={navigation}
                  product={product}
                  productId={product.id}
                  name={product.name}
                  seller={product.seller}
                  time={product.deliveryTime || ""}
                  image={product.image}
                  badge={product.badge || product.category}
                  display={display}
                />
              ))}
            </ScrollView>
          )}
    </>
  );
}

function SearchResults({ navigation, results, loading, error, query, display }) {
  if (loading) {
    return (
      <View style={styles.searchStatus}>
        <ActivityIndicator color={display.primary} />
        <Text style={[styles.searchStatusText, { color: display.textSoft }]}>
          {`Buscando “${query}”...`}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.searchStatus}>
        <Ionicons name="cloud-offline-outline" size={26} color={display.textSoft} />
        <Text style={[styles.searchStatusText, { color: display.textSoft }]}>{error}</Text>
      </View>
    );
  }

  if (!results || results.length === 0) {
    return (
      <View style={styles.searchStatus}>
        <Ionicons name="search-outline" size={26} color={display.textSoft} />
        <Text style={[styles.searchStatusText, { color: display.textSoft }]}>
          {`Sin resultados para “${query}”`}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.searchResultsWrapper}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionTitle, { color: display.text }]}>Resultados</Text>
          <Text style={[styles.sectionSubtitle, { color: display.textSoft }]}>
            {`${results.length} ${results.length === 1 ? "producto" : "productos"} para “${query}”`}
          </Text>
        </View>
      </View>

      {results.map((item) => (
        <SearchResultCard
          key={item.id}
          item={item}
          display={display}
          navigation={navigation}
        />
      ))}
    </View>
  );
}

function SearchResultCard({ item, display, navigation }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const productIsFavorite = isFavorite(item.id);

  return (
    <TouchableOpacity
      style={[
        styles.resultCard,
        { backgroundColor: display.surface, shadowColor: display.shadow },
      ]}
      activeOpacity={0.9}
      onPress={() => navigation.navigate("ProductDetail", { productId: item.id })}
    >
      {item.image ? (
        <Image source={item.image} style={styles.resultThumbImage} />
      ) : (
        <View style={[styles.resultThumb, { backgroundColor: display.primarySoft }]}>
          <Ionicons name="leaf" size={26} color={display.primary} />
        </View>
      )}

      <View style={styles.resultContent}>
        {item.category ? (
          <Text
            style={[
              styles.resultCategory,
              { backgroundColor: display.primarySoft, color: display.primary },
            ]}
            numberOfLines={1}
          >
            {item.category}
          </Text>
        ) : null}

        <Text style={[styles.resultName, { color: display.text }]} numberOfLines={2}>
          {item.name}
        </Text>

        {item.seller ? (
          <Text style={[styles.resultSeller, { color: display.textSoft }]} numberOfLines={1}>
            {item.seller}
          </Text>
        ) : null}

        <View style={styles.resultFooter}>
          <Text style={[styles.resultPrice, { color: display.text }]}>
            {typeof item.price === "number" ? `${item.price.toFixed(2)} €` : item.price}
          </Text>

          <View style={styles.resultActions}>
            <TouchableOpacity
              style={[
                styles.favoriteButton,
                { backgroundColor: display.primarySoft, borderColor: display.primary },
              ]}
              onPress={() => toggleFavorite(item)}
              activeOpacity={0.85}
              hitSlop={6}
            >
              <Ionicons
                name={productIsFavorite ? "heart" : "heart-outline"}
                size={16}
                color={display.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: display.primary }]}
              onPress={() => {
                addToCart(item, 1);
                navigation.navigate("Cart");
              }}
              activeOpacity={0.85}
            >
              <Ionicons
                name="add"
                size={16}
                color={display?.border === "#7CFF00" ? "#000" : "#fff"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ... SUBCOMPONENTES INTACTOS ...
const Category = ({ color, icon, text, subtitle, onPress, wide }) => (
  <TouchableOpacity
    style={[
      styles.category,
      { backgroundColor: color },
      wide && styles.categoryWide,
    ]}
    onPress={onPress}
    activeOpacity={0.88}
  >
    <View style={styles.categoryIconWrap}>
      <Ionicons name={icon} size={20} color="#fff" />
    </View>
    <Text style={styles.categoryText}>{text}</Text>
    <Text style={styles.categorySubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

const ProductCard = ({ navigation, productId, name, seller, time, image, badge, display, wide, product }) => {
  const { addToCart } = useCart();

  return (
    <TouchableOpacity
      style={[
        styles.productCard,
        wide && styles.productCardWide,
        display && { backgroundColor: display.surface, shadowColor: display.shadow },
        display?.border === "#7CFF00" && { borderWidth: 1, borderColor: display.border },
      ]}
      activeOpacity={0.85}
      onPress={() => navigation.navigate("ProductDetail", { productId })}
    >
      {image ? (
        <Image source={image} style={styles.productCardImage} />
      ) : (
        <View style={[styles.productCardImage, { backgroundColor: "#EEF5E3", justifyContent: "center", alignItems: "center" }]}>
          <Ionicons name="leaf" size={32} color={colors.primary} />
        </View>
      )}

      <View style={styles.productCardContent}>
        {badge ? (
          <Text
            style={[
              styles.productCardBadge,
              display && { backgroundColor: display.primarySoft, color: display.primary },
            ]}
          >
            {badge}
          </Text>
        ) : null}

        <Text style={[styles.productCardName, display && { color: display.text }]} numberOfLines={2}>
          {name}
        </Text>

        <Text style={[styles.productCardSeller, display && { color: display.textSoft }]} numberOfLines={1}>
          {seller}
        </Text>

        <View style={styles.productCardFooter}>
          <Text style={[styles.productCardTime, display && { color: display.textSoft }]}>{time}</Text>

          <TouchableOpacity
            style={[styles.addButton, display && { backgroundColor: display.primary }]}
            onPress={() => {
              if (product) addToCart(product, 1);
              navigation.navigate("Cart");
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={16} color={display?.border === "#7CFF00" ? "#000" : "#fff"} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8F4",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 110, // Aumentado para dejar hueco a la barra flotante
  },
  logoImage: {
    width: 38,
    height: 38,
    resizeMode: "contain",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  backIcon: {
    marginRight: 12,
  },
  headerTextBlock: {
    flex: 1,
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
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  heroCard: {
    backgroundColor: colors.white,
    borderColor: colors.primaryTr,
    borderWidth: 3,
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
    position: "relative",
    overflow: "hidden",
    minHeight: 180,
    justifyContent: "space-between",
  },
  heroContent: {
    width: "62%",
    zIndex: 2,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(125, 155, 69, 0.81)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 14,
  },
  heroBadgeText: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: "700",
  },
  heroTitle: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSoft,
  },
  heroImage: {
    position: "absolute",
    right: -8,
    bottom: 0,
    width: 165,
    height: 165,
    resizeMode: "contain",
  },
  searchWrapper: {
    marginBottom: 22,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#92aa7e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  search: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  searchStatus: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 36,
    gap: 12,
  },
  searchStatusText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  searchResultsWrapper: {
    marginBottom: 18,
  },
  resultCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#4a5f18b4",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  resultThumb: {
    width: 76,
    height: 76,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  resultThumbImage: {
    width: 76,
    height: 76,
    borderRadius: 18,
    marginRight: 14,
    resizeMode: "cover",
  },
  resultContent: {
    flex: 1,
  },
  resultCategory: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF5E3",
    color: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 6,
    overflow: "hidden",
  },
  resultName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 2,
  },
  resultSeller: {
    fontSize: 12,
    color: colors.textSoft,
    marginBottom: 8,
  },
  resultFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  resultActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  favoriteButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
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
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  category: {
    width: "48%",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    minHeight: 118,
    justifyContent: "space-between",
  },
  categoryWide: {
    width: "23.5%",
  },
  recommendedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 18,
  },
  productCardWide: {
    width: 0,
    flexGrow: 1,
    flexBasis: 240,
    marginRight: 0,
  },
  categoryIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 4,
  },
  categorySubtitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 12,
    fontWeight: "500",
  },
  recommendedRow: {
    paddingRight: 10,
  },
  productCard: {
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
  productCardImage: {
    width: "100%",
    height: 130,
    resizeMode: "cover",
  },
  productCardContent: {
    padding: 14,
  },
  productCardBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF5E3",
    color: colors.primary,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 10,
  },
  productCardName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
    minHeight: 40,
  },
  productCardSeller: {
    color: colors.textSoft,
    fontSize: 12,
    marginBottom: 14,
  },
  productCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productCardTime: {
    fontSize: 12,
    color: colors.textSoft,
    fontWeight: "600",
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
