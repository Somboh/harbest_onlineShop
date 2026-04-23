import { Ionicons } from "@expo/vector-icons";
import {
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
import { useDisplaySettings } from "../context/DisplaySettingsContext";
import { getDisplayMode } from "../styles/displayModes";
import { ROLE_THEMES } from "../styles/roleThemes";

export default function HomeScreen({ navigation }) {
  const { settings } = useDisplaySettings();
  const display = getDisplayMode(settings, ROLE_THEMES.user);

  return (
    <ScreenContainer>
      <View style={[styles.container, { backgroundColor: display.background }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HEADER */}
          <View style={styles.header}>
            {/* Opcional: Si no quieres flecha de atrás en el Home, puedes borrar este TouchableOpacity */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Splash")}
              style={styles.backIcon}
            >
              <Ionicons name="arrow-back" size={24} color={display.text} />
            </TouchableOpacity>

            <View style={styles.headerTextBlock}>
              <Text style={[styles.headerMini, { color: display.textSoft }]}>Bienvenido de nuevo</Text>
              <Text style={[styles.title, { color: display.text }]}>Hola, Pepe</Text>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => navigation.navigate("ProfileUser")}>
                <Image
                  source={require("../../assets/images/logo-harbest.png")}
                  style={styles.logoImage}
                />
              </TouchableOpacity>
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
                placeholder="Buscar productos frescos..."
                placeholderTextColor={display.textSoft}
                style={[styles.search, { color: display.text }]}
              />
            </View>
          </View>

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
            />
            <Category
              color={display.categoryColors[1]}
              icon="leaf"
              text="Verduras"
              subtitle="Del campo a casa"
              onPress={() => navigation.navigate("CategoryVegetables")}
            />
            <Category
              color={display.categoryColors[2]}
              icon="flame"
              text="Especias"
              subtitle="Aroma y sabor"
              onPress={() => navigation.navigate("CategorySpices")}
            />
            <Category
              color={display.categoryColors[3]}
              icon="grid"
              text="Ver todo"
              subtitle="Todo el catálogo"
              onPress={() => navigation.navigate("CategoryAll")}
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

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedRow}
          >
            <ProductCard
              navigation={navigation}
              productId="naranjas-valencianas"
              name="Naranjas Valencianas"
              seller="Granjas Jaume"
              time="11 min"
              image={require("../../assets/images/comida/naranjas.webp")}
              badge="Fresco"
              display={display}
            />

            <ProductCard
              navigation={navigation}
              productId="aguacates-granada"
              display={display}
              name="Aguacates de Granada"
              seller="Illo verdulerías"
              time="45 min"
              image={require("../../assets/images/comida/aguacate.webp")}
              badge="Orgánico"
            />

            <ProductCard
              navigation={navigation}
              productId="pimenton-vera"
              name="Pimentón de la Vera"
              seller="Antonio & Co"
              time="2 h"
              image={require("../../assets/images/comida/pimenton.jpg")}
              badge="Exclusivo"
              display={display}
            />
          </ScrollView>
        </ScrollView>

        {/* BOTTOM BAR BLINDADA DEL CLIENTE */}
        <ClientTabBar Navigation={navigation} ActiveRoute="Home" />
      </View>
    </ScreenContainer>
  );
}

// ... SUBCOMPONENTES INTACTOS ...
const Category = ({ color, icon, text, subtitle, onPress }) => (
  <TouchableOpacity
    style={[styles.category, { backgroundColor: color }]}
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

const ProductCard = ({ navigation, productId, name, seller, time, image, badge, display }) => (
  <TouchableOpacity
    style={[
      styles.productCard,
      display && { backgroundColor: display.surface, shadowColor: display.shadow },
      display?.border === "#7CFF00" && { borderWidth: 1, borderColor: display.border },
    ]}
    activeOpacity={0.85}
    onPress={() => navigation.navigate("ProductDetail", { productId })}
  >
    <Image source={image} style={styles.productCardImage} />

    <View style={styles.productCardContent}>
      <Text
        style={[
          styles.productCardBadge,
          display && { backgroundColor: display.primarySoft, color: display.primary },
        ]}
      >
        {badge}
      </Text>

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
          onPress={() => navigation.navigate("Cart")}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={16} color={display?.border === "#7CFF00" ? "#000" : "#fff"} />
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
