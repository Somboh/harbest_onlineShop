import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import ScreenContainer from "../components/common/ScreenContainer";
import { useAuth } from "../context/AuthContext";
import { hydrateProducts } from "../data/productAdapter";
import productsService from "../services/productsService";
import { ROLE_THEMES } from "../styles/roleThemes";
import { formatPrice } from "../utils/formatPrice";

export default function SearchAgricultorScreen({ navigation }) {
  const farmerColor = ROLE_THEMES.farmer.primary;
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    const email = user?.email;

    if (!email) {
      setProducts([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setErrorMessage("");

    (async () => {
      try {
        const raw = await productsService.getProductsByFarmer(email);
        if (cancelled) return;
        setProducts(hydrateProducts(raw));
      } catch (err) {
        console.error("Error cargando productos del agricultor:", err);
        if (!cancelled) {
          setProducts([]);
          setErrorMessage("No se pudieron cargar tus productos.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return products;

    return products.filter((product) =>
      [
        product.name,
        product.category,
        product.description,
        product.unit,
        product.stock,
        product.price,
      ]
        .filter((value) => value !== undefined && value !== null)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [products, searchQuery]);

  return (
    <ScreenContainer>
      <View style={styles.mainContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate("HomeAgricultor")}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#2D2D2D" />
          </TouchableOpacity>

          <View style={[styles.searchInputArea, { borderColor: farmerColor }]}>
            <Ionicons name="search" size={18} color={farmerColor} />
            <TextInput
              style={styles.input}
              placeholder="Buscar en tus productos..."
              placeholderTextColor="#8A8A8A"
              autoFocus
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              returnKeyType="search"
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color="#8A8A8A" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsArea}
        >
          <Text style={styles.sectionTitle}>
            {searchQuery.trim()
              ? `Resultados para "${searchQuery.trim()}"`
              : "Todos tus productos"}
          </Text>

          {loading ? (
            <StateBox icon={null} title="" text="Cargando tus productos...">
              <ActivityIndicator color={farmerColor} />
            </StateBox>
          ) : errorMessage ? (
            <StateBox
              icon="cloud-offline-outline"
              title="No se pudo buscar"
              text={errorMessage}
            />
          ) : filteredProducts.length === 0 ? (
            <StateBox
              icon="search-outline"
              title="Sin resultados"
              text={
                products.length === 0
                  ? "Todavía no tienes productos publicados."
                  : "Prueba con otro nombre, categoría o precio."
              }
            />
          ) : (
            filteredProducts.map((product) => (
              <SearchResultItem
                key={product.id}
                product={product}
                onPress={() =>
                  navigation.navigate("ProductDetailFarmer", {
                    productId: product.id,
                  })
                }
              />
            ))
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

const StateBox = ({ icon, title, text, children }) => (
  <View style={styles.stateBox}>
    {children}
    {icon ? (
      <Ionicons name={icon} size={28} color={ROLE_THEMES.farmer.primary} />
    ) : null}
    {title ? <Text style={styles.stateTitle}>{title}</Text> : null}
    <Text style={styles.stateText}>{text}</Text>
  </View>
);

const SearchResultItem = ({ product, onPress }) => {
  const stock = product.stock ?? 0;
  const unit = product.unit || "kg";
  const isEmpty = stock <= 0;

  return (
    <TouchableOpacity style={styles.resultCard} activeOpacity={0.75} onPress={onPress}>
      <View style={styles.resultIcon}>
        <Ionicons name="leaf-outline" size={20} color={ROLE_THEMES.farmer.primary} />
      </View>

      <View style={styles.resultInfo}>
        <Text style={styles.resultName} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={[styles.resultQty, isEmpty && styles.resultQtyEmpty]}>
          {isEmpty ? `0 ${unit} (Agotado)` : `${stock} ${unit} disponibles`}
        </Text>
      </View>

      <Text style={styles.resultPrice}>
        {formatPrice(product.price)} / {unit}
      </Text>
      <Ionicons name="chevron-forward" size={18} color="#D1D1D1" style={styles.chevron} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: ROLE_THEMES.farmer.background,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  searchInputArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#2D2D2D",
  },
  resultsArea: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#8A8A8A",
    marginBottom: 15,
  },
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
    elevation: 1,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FCEEEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  resultInfo: {
    flex: 1,
    minWidth: 0,
  },
  resultName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2D2D2D",
    marginBottom: 4,
  },
  resultQty: {
    fontSize: 13,
    color: "#8A8A8A",
  },
  resultQtyEmpty: {
    color: ROLE_THEMES.farmer.primary,
    fontWeight: "700",
  },
  resultPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2D2D2D",
    marginLeft: 8,
  },
  chevron: {
    marginLeft: 8,
  },
  stateBox: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1D3C5",
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2D2D2D",
    marginTop: 10,
    marginBottom: 4,
  },
  stateText: {
    color: "#8A8A8A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },
});
