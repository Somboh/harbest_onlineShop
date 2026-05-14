import React, { useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import ClientTabBar from "../components/common/ClientTabBar";
import DisplayModeMenu from "../components/common/DisplayModeMenu";
import ScreenContainer from "../components/common/ScreenContainer";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useResponsive } from "../hooks/useResponsive";
import colors from "../styles/colors";
import { formatUnitPrice } from "../utils/formatPrice";

export default function FavoritesScreen({ navigation }) {
  const { favorites, removeFavorite, reloadFavorites } = useFavorites();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isDesktop, isTablet } = useResponsive();
  const wide = isDesktop || isTablet;

  //Refrescamos cada vez que el usuario entra a esta pantalla. Así si guardó un
  //favorito desde Home/Categorías el listado aparece al instante con la última
  //versión de la BD (incluyendo foto_url y datos completos del producto).
  useFocusEffect(
    React.useCallback(() => {
      if (isAuthenticated) reloadFavorites();
    }, [isAuthenticated, reloadFavorites]),
  );

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.topSection}>
            <View style={styles.topRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>

              <View style={styles.headerActions}>
                <DisplayModeMenu role="user" trigger="logo" />
              </View>
            </View>

            <View style={styles.headerTextBlock}>
              <Text style={styles.headerMiniText}>Tu selección guardada</Text>
              <Text style={styles.headerTitle}>Favoritos</Text>
              <Text style={styles.headerSubtitle}>
                Accede rápidamente a los productos que más te interesan y vuelve
                a comprarlos cuando quieras.
              </Text>
            </View>

            <View style={styles.decorLeafOne} />
            <View style={styles.decorLeafTwo} />
          </View>

          <View style={styles.summaryCard}>
            <View>
              <Text style={styles.summaryLabel}>Productos guardados</Text>
              <Text style={styles.summaryValue}>{favorites.length}</Text>
            </View>

            <View style={styles.summaryRight}>
              <Ionicons name="heart" size={22} color={colors.primary} />
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Tus favoritos</Text>
              <Text style={styles.sectionSubtitle}>
                Productos guardados recientemente
              </Text>
            </View>
          </View>

          {favorites.length > 0 ? (
            <View style={wide ? styles.gridWide : null}>
              {favorites.map((item) => (
                <FavoriteCard
                  key={item.id}
                  item={item}
                  navigation={navigation}
                  wide={wide}
                  onRemove={() => removeFavorite(item.id)}
                  onAddToCart={() => {
                    addToCart(item, 1);
                    navigation.navigate("Cart");
                  }}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="heart-outline" size={32} color={colors.primary} />
              <Text style={styles.emptyTitle}>No tienes favoritos</Text>
              <Text style={styles.emptySubtitle}>
                Guarda productos desde su detalle para encontrarlos aqui.
              </Text>
              <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => navigation.navigate("Home")}
                activeOpacity={0.85}
              >
                <Text style={styles.exploreButtonText}>Explorar productos</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <ClientTabBar Navigation={navigation} ActiveRoute="Favorites" />
      </View>
    </ScreenContainer>
  );
}

const FavoriteCard = ({ item, navigation, onRemove, onAddToCart, wide }) => (
  <TouchableOpacity
    style={[styles.card, wide && styles.cardWide]}
    activeOpacity={0.88}
    onPress={() => navigation.navigate("ProductDetail", { productId: item.id })}
  >
    <Image source={item.image} style={styles.cardImage} />

    <View style={styles.cardContent}>
      <View style={styles.cardTopRow}>
        <Text style={styles.cardBadge}>{item.badge}</Text>

        <TouchableOpacity style={styles.iconButton} onPress={onRemove} activeOpacity={0.8}>
          <Ionicons name="heart" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.name}
      </Text>

      <Text style={styles.cardSeller} numberOfLines={1}>
        {item.seller}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.cardPrice}>{formatUnitPrice(item.price, item.unit)}</Text>

        <TouchableOpacity style={styles.addButton} onPress={onAddToCart} activeOpacity={0.85}>
          <Ionicons name="cart" size={15} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8F4",
  },
  scrollContent: {
    paddingBottom: 120,
  },
  topSection: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: "relative",
    overflow: "hidden",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 26,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  headerTextBlock: {
    paddingRight: 32,
  },
  headerMiniText: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 10,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 290,
  },
  decorLeafOne: {
    position: "absolute",
    right: 24,
    bottom: 30,
    width: 52,
    height: 52,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    transform: [{ rotate: "28deg" }],
  },
  decorLeafTwo: {
    position: "absolute",
    right: 58,
    bottom: 48,
    width: 26,
    height: 26,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.10)",
    transform: [{ rotate: "-20deg" }],
  },
  summaryCard: {
    marginHorizontal: 20,
    marginTop: 18,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#4a5f18b4",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textSoft,
    fontWeight: "700",
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
  },
  summaryRight: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: "#EEF5E3",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    marginHorizontal: 20,
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
  card: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 12,
    flexDirection: "row",
    marginBottom: 14,
    shadowColor: "#4a5f18b4",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 4,
  },
  gridWide: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    paddingHorizontal: 20,
  },
  cardWide: {
    marginHorizontal: 0,
    marginBottom: 0,
    flexBasis: 320,
    flexGrow: 1,
    minWidth: 280,
  },
  cardImage: {
    width: 105,
    height: 112,
    borderRadius: 18,
    resizeMode: "cover",
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardBadge: {
    backgroundColor: "#EEF5E3",
    color: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 10,
    fontWeight: "800",
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: "#F8F8F5",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 5,
  },
  cardSeller: {
    fontSize: 12,
    color: colors.textSoft,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardPrice: {
    flex: 1,
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
    marginRight: 8,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 13,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: "center",
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
  exploreButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
});
