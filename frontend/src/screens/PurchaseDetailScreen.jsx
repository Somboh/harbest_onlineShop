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
import authService from "../services/authService";
import ordersService, {
  STATUS_COLORS,
  STATUS_LABEL_USER,
  groupOrdersByPurchase,
} from "../services/ordersService";
import colors from "../styles/colors";

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

//Pantalla intermedia entre OrdersScreen y OrderDetailScreen: muestra los
//pedidos (uno por agricultor) que componen UNA compra. Cada tarjeta lleva al
//detalle individual del pedido (con su flujo de estado y productos).
export default function PurchaseDetailScreen({ navigation, route }) {
  const purchaseKey = route?.params?.purchaseKey;

  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!purchaseKey) {
      setError("Compra no especificada");
      setLoading(false);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      if (!user?.email) {
        setError("Sesión caducada. Vuelve a iniciar sesión.");
        return;
      }
      const data = await ordersService.getOrdersByUser(user.email);
      //Re-agrupamos para encontrar el grupo cuya clave coincide. Esto nos
      //permite reflejar cualquier cambio de estado que se haya producido
      //(p. ej. el agricultor marcó un pedido como enviado entre tanto).
      const groups = groupOrdersByPurchase(data);
      const found = groups.find((g) => g.id === purchaseKey);
      setPurchase(found ?? null);
    } catch (err) {
      console.error("Error cargando compra:", err);
      setError(err?.message ?? "No se pudo cargar la compra");
    } finally {
      setLoading(false);
    }
  }, [purchaseKey]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.topSection}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerMini}>Detalle de la compra</Text>
            <Text style={styles.headerTitle}>
              {purchase ? `Compra del ${formatDate(purchase.fecha)}` : "Compra"}
            </Text>
            {purchase ? (
              <Text style={styles.headerSubtitle}>
                {purchase.orderCount} {purchase.orderCount === 1 ? "pedido" : "pedidos"} · Total{" "}
                {purchase.total.toFixed(2)} €
              </Text>
            ) : null}
          </View>

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.centerText}>Cargando compra...</Text>
            </View>
          ) : error ? (
            <View style={[styles.card, { alignItems: "center" }]}>
              <Ionicons name="cloud-offline-outline" size={28} color="#B3533D" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.primaryButton} onPress={reload}>
                <Text style={styles.primaryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : !purchase ? (
            <View style={[styles.card, { alignItems: "center" }]}>
              <Ionicons name="alert-circle-outline" size={28} color={colors.textSoft} />
              <Text style={styles.emptyText}>
                Esta compra ya no está disponible.
              </Text>
            </View>
          ) : (
            <View style={styles.listWrap}>
              {purchase.direccion_envio ? (
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Dirección de envío</Text>
                  <Text style={styles.cardValue} numberOfLines={3}>
                    {purchase.direccion_envio}
                  </Text>
                </View>
              ) : null}

              <Text style={styles.sectionTitle}>Pedidos</Text>
              {purchase.orders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onPress={() =>
                    navigation.navigate("OrderDetail", { orderId: order.id })
                  }
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

function OrderRow({ order, onPress }) {
  const label = STATUS_LABEL_USER[order.estado] ?? order.estado ?? "—";
  const palette = STATUS_COLORS[order.estado] ?? { bg: "#EEE", text: "#555" };

  return (
    <TouchableOpacity style={styles.orderCard} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.iconWrap}>
        <Ionicons name="cube-outline" size={32} color={colors.primary} />
      </View>

      <View style={styles.orderInfo}>
        <View style={[styles.statusBadge, { backgroundColor: palette.bg }]}>
          <Text style={[styles.statusText, { color: palette.text }]}>{label}</Text>
        </View>
        <Text style={styles.orderTitle} numberOfLines={1}>
          {order.farmer_email}
        </Text>
        <Text style={styles.orderTotal}>{Number(order.total).toFixed(2)} €</Text>
      </View>

      <Ionicons name="chevron-forward" size={22} color="#B5B5B5" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8F4" },
  scrollContent: { paddingBottom: 40 },

  topSection: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 30,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 18,
  },
  backBtn: { marginBottom: 16 },
  headerMini: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "800" },
  headerSubtitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 13,
    marginTop: 6,
  },

  center: { paddingVertical: 40, alignItems: "center", gap: 10 },
  centerText: { color: colors.textSoft, fontWeight: "600" },

  listWrap: { paddingHorizontal: 20 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },
  cardLabel: { fontSize: 12, color: colors.textSoft, fontWeight: "700", marginBottom: 4 },
  cardValue: { fontSize: 14, color: colors.text, lineHeight: 20 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 10,
    marginTop: 4,
  },

  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#EEF5E3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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
  orderTitle: { fontSize: 14, fontWeight: "800", color: colors.text },
  orderTotal: { fontSize: 13, fontWeight: "800", color: colors.primary, marginTop: 2 },

  errorText: {
    color: "#8C2A1A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 8,
  },
  emptyText: {
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 13,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: { color: "#fff", fontWeight: "800", fontSize: 14 },
});
