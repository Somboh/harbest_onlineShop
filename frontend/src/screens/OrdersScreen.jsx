import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ScreenContainer from "../components/common/ScreenContainer";
import ClientTabBar from "../components/common/ClientTabBar";
import DisplayModeMenu from "../components/common/DisplayModeMenu";
import authService from "../services/authService";
import ordersService, {
  groupOrdersByPurchase,
} from "../services/ordersService";
import colors from "../styles/colors";
import { useResponsive } from "../hooks/useResponsive";

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd} · ${mm} · ${yyyy}`;
}

export default function OrdersScreen({ navigation }) {
  const { isDesktop, isTablet } = useResponsive();
  const wide = isDesktop || isTablet;

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      if (!user?.email) {
        setError("Sesión caducada. Vuelve a iniciar sesión.");
        setPurchases([]);
        return;
      }
      const data = await ordersService.getOrdersByUser(user.email);
      //Agrupamos los pedidos de un mismo checkout en una "compra" — la lista
      //muestra una tarjeta por compra, no por pedido suelto.
      setPurchases(groupOrdersByPurchase(data));
    } catch (err) {
      console.error("Error cargando pedidos:", err);
      setError(err?.message ?? "No se pudieron cargar los pedidos");
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  }, []);

  //Refrescar cada vez que la pantalla recibe el foco (volver del checkout o
  //de un detalle).
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate("Home");
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.topSection}>
            <View style={styles.topRow}>
              <TouchableOpacity onPress={handleBack}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>

              <DisplayModeMenu role="user" trigger="logo" />
            </View>

            <View style={styles.headerTextBlock}>
              <Text style={styles.headerMiniText}>Historial de compras</Text>
              <Text style={styles.headerTitle}>Mis pedidos</Text>
              <Text style={styles.headerSubtitle}>
                Consulta el estado actual de tus pedidos de forma rápida.
              </Text>
            </View>
          </View>

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.centerText}>Cargando tus pedidos...</Text>
            </View>
          ) : error ? (
            <View style={[styles.card, styles.errorCard]}>
              <Ionicons name="cloud-offline-outline" size={26} color="#B3533D" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={reload}>
                <Text style={styles.retryText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : purchases.length === 0 ? (
            <View style={styles.card}>
              <Ionicons name="receipt-outline" size={28} color={colors.primary} />
              <Text style={styles.emptyTitle}>Aún no tienes pedidos</Text>
              <Text style={styles.emptySubtitle}>
                Cuando hagas tu primera compra aparecerá aquí.
              </Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate("Home")}
              >
                <Text style={styles.primaryButtonText}>Ir al catálogo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.listWrap}>
              <View style={wide ? styles.ordersGridWide : null}>
                {purchases.map((purchase) => (
                  <PurchaseCard
                    key={purchase.id}
                    purchase={purchase}
                    wide={wide}
                    onPress={() =>
                      navigation.navigate("PurchaseDetail", {
                        purchaseKey: purchase.id,
                      })
                    }
                  />
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        <ClientTabBar Navigation={navigation} ActiveRoute="ProfileUser" />
      </View>
    </ScreenContainer>
  );
}

function PurchaseCard({ purchase, wide, onPress }) {
  const orderWord = purchase.orderCount === 1 ? "pedido" : "pedidos";
  const farmerWord = purchase.farmerCount === 1 ? "agricultor" : "agricultores";

  return (
    <TouchableOpacity
      style={[styles.orderCard, wide && styles.orderCardWide]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.orderTop}>
        <View style={styles.iconWrap}>
          <Ionicons name="bag-handle-outline" size={42} color={colors.primary} />
        </View>

        <View style={styles.orderInfo}>
          <Text style={styles.orderTitle}>Compra del {formatDate(purchase.fecha)}</Text>
          <Text style={styles.orderText}>
            {purchase.orderCount} {orderWord} · {purchase.farmerCount} {farmerWord}
          </Text>
          <Text style={styles.orderTotal}>{purchase.total.toFixed(2)} €</Text>
        </View>

        <Ionicons name="chevron-forward" size={22} color="#B5B5B5" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8F4" },
  scrollContent: { paddingBottom: 120 },

  topSection: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 18,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  headerLogo: { width: 40, height: 40, resizeMode: "contain" },
  headerTextBlock: { paddingRight: 30 },
  headerMiniText: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  headerTitle: { color: "#fff", fontSize: 28, fontWeight: "800", marginBottom: 8 },
  headerSubtitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 340,
  },

  center: { paddingVertical: 40, alignItems: "center", gap: 10 },
  centerText: { color: colors.textSoft, fontWeight: "600" },

  card: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  errorCard: { backgroundColor: "#FBE9E5" },
  errorText: {
    color: "#8C2A1A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  retryText: { color: "#8C2A1A", fontWeight: "800" },

  emptyTitle: { fontSize: 18, fontWeight: "800", color: colors.text, marginTop: 4 },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSoft,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  primaryButtonText: { color: "#fff", fontWeight: "800", fontSize: 14 },

  listWrap: { paddingHorizontal: 20 },
  ordersGridWide: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },

  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  orderCardWide: {
    flexBasis: 360,
    flexGrow: 1,
    minWidth: 320,
    marginBottom: 0,
  },
  orderTop: { flexDirection: "row", alignItems: "center" },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#EEF5E3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  orderInfo: { flex: 1, gap: 4 },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 4,
  },
  statusText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.4 },
  orderTitle: { fontSize: 15, fontWeight: "800", color: colors.text },
  orderText: { fontSize: 12, color: colors.textSoft },
  orderTotal: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "800",
    color: colors.primary,
  },

});
