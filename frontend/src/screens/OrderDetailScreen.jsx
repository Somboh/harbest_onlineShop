import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ScreenContainer from "../components/common/ScreenContainer";
import ordersService, {
  STATUS_COLORS,
  STATUS_LABEL_USER,
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

//Línea de progreso visual (Pendiente → Aceptado → En camino → Recibido).
const STEPS = [
  { key: "pendiente", label: "Pendiente", icon: "hourglass-outline" },
  { key: "preparando", label: "Aceptado", icon: "checkmark-done-outline" },
  { key: "enviado", label: "En camino", icon: "car-outline" },
  { key: "entregado", label: "Recibido", icon: "home-outline" },
];

function activeStepIndex(estado) {
  if (estado === "cancelado") return -1;
  const idx = STEPS.findIndex((s) => s.key === estado);
  return idx;
}

export default function OrderDetailScreen({ navigation, route }) {
  const orderId = route?.params?.orderId;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const reload = useCallback(async () => {
    if (!orderId) {
      setError("Pedido no especificado");
      setLoading(false);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await ordersService.getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      console.error("Error cargando pedido:", err);
      setError(err?.message ?? "No se pudo cargar el pedido");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const handleConfirmReceived = async () => {
    if (!order) return;
    setActionLoading(true);
    try {
      const res = await ordersService.updateOrderStatus(order.id, "entregado");
      if (res?.status === "OK") {
        await reload();
      } else {
        setError(res?.message ?? "No se pudo confirmar la recepción");
      }
    } catch (err) {
      setError(err?.message ?? "Error al confirmar la recepción");
    } finally {
      setActionLoading(false);
    }
  };

  const estado = order?.estado;
  const palette = STATUS_COLORS[estado] ?? { bg: "#EEE", text: "#555" };
  const label = STATUS_LABEL_USER[estado] ?? estado ?? "—";
  const stepIndex = activeStepIndex(estado);
  const lineas = order?.lineas ?? [];

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.topSection}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerMini}>Detalle</Text>
            <Text style={styles.headerTitle}>
              {orderId ? `Pedido #${orderId}` : "Pedido"}
            </Text>
          </View>

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.centerText}>Cargando...</Text>
            </View>
          ) : error ? (
            <View style={[styles.card, { alignItems: "center" }]}>
              <Ionicons name="cloud-offline-outline" size={28} color="#B3533D" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.primaryButton} onPress={reload}>
                <Text style={styles.primaryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : order ? (
            <>
              {/* ESTADO */}
              <View style={styles.card}>
                <View style={styles.statusRow}>
                  <View style={[styles.statusBadge, { backgroundColor: palette.bg }]}>
                    <Text style={[styles.statusText, { color: palette.text }]}>
                      {label}
                    </Text>
                  </View>
                  <Text style={styles.dateText}>{formatDate(order.fecha)}</Text>
                </View>

                {estado !== "cancelado" ? (
                  <View style={styles.steps}>
                    {STEPS.map((s, i) => {
                      const reached = i <= stepIndex;
                      return (
                        <View key={s.key} style={styles.stepCol}>
                          <View
                            style={[
                              styles.stepIcon,
                              reached && styles.stepIconActive,
                            ]}
                          >
                            <Ionicons
                              name={s.icon}
                              size={16}
                              color={reached ? "#fff" : "#9A9A9A"}
                            />
                          </View>
                          <Text
                            style={[
                              styles.stepLabel,
                              reached && styles.stepLabelActive,
                            ]}
                          >
                            {s.label}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <Text style={styles.cancelledText}>
                    Este pedido fue cancelado.
                  </Text>
                )}
              </View>

              {/* AGRICULTOR */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Agricultor</Text>
                <View style={styles.farmerRow}>
                  <View style={styles.farmerBadge}>
                    <Ionicons name="leaf-outline" size={18} color={colors.primary} />
                  </View>
                  <View style={styles.flex}>
                    <Text style={styles.farmerEmail}>{order.farmer_email}</Text>
                    {order.direccion_envio ? (
                      <Text style={styles.farmerMeta} numberOfLines={3}>
                        Envío: {order.direccion_envio}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              {/* PRODUCTOS */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Productos ({lineas.length})</Text>
                {lineas.map((linea) => {
                  const fotoUrl = linea.producto?.foto_url;
                  return (
                    <View key={linea.id} style={styles.linea}>
                      {fotoUrl ? (
                        <Image source={{ uri: fotoUrl }} style={styles.lineaThumb} />
                      ) : (
                        <View style={styles.lineaIcon}>
                          <Ionicons name="basket-outline" size={20} color={colors.primary} />
                        </View>
                      )}
                      <View style={styles.flex}>
                        <Text style={styles.lineaName} numberOfLines={2}>
                          {linea.producto?.nombre ?? linea.product_id}
                        </Text>
                        <Text style={styles.lineaMeta}>
                          {Number(linea.cantidad).toFixed(1)} ud ·{" "}
                          {Number(linea.precio_unitario).toFixed(2)} €/ud
                        </Text>
                      </View>
                      <Text style={styles.lineaTotal}>
                        {(Number(linea.cantidad) * Number(linea.precio_unitario)).toFixed(2)} €
                      </Text>
                    </View>
                  );
                })}

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>
                    {Number(order.total).toFixed(2)} €
                  </Text>
                </View>
              </View>

              {/* ACCIÓN: confirmar recepción si está enviado */}
              {estado === "enviado" ? (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>¿Lo has recibido?</Text>
                  <Text style={styles.cardSubtitle}>
                    Marca el pedido como recibido cuando te llegue para cerrar el seguimiento.
                  </Text>
                  <TouchableOpacity
                    style={[styles.primaryButton, actionLoading && styles.disabledButton]}
                    onPress={handleConfirmReceived}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.primaryButtonText}>Marcar como recibido</Text>
                    )}
                  </TouchableOpacity>
                </View>
              ) : null}
            </>
          ) : null}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8F4" },
  scrollContent: { paddingBottom: 40 },
  flex: { flex: 1 },

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

  center: { paddingVertical: 40, alignItems: "center", gap: 10 },
  centerText: { color: colors.textSoft, fontWeight: "600" },

  card: {
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    gap: 6,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: colors.text, marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: colors.textSoft, marginBottom: 12, lineHeight: 18 },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusText: { fontSize: 12, fontWeight: "800", letterSpacing: 0.4 },
  dateText: { fontSize: 12, color: colors.textSoft, fontWeight: "600" },
  cancelledText: {
    color: "#8C2A1A",
    fontWeight: "700",
    fontSize: 13,
    marginTop: 6,
  },

  steps: { flexDirection: "row", justifyContent: "space-between" },
  stepCol: { alignItems: "center", flex: 1 },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F0EC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  stepIconActive: { backgroundColor: colors.primary },
  stepLabel: { fontSize: 11, color: colors.textSoft, fontWeight: "600" },
  stepLabelActive: { color: colors.text, fontWeight: "800" },

  farmerRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  farmerBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#EEF5E3",
    justifyContent: "center",
    alignItems: "center",
  },
  farmerEmail: { fontSize: 14, fontWeight: "800", color: colors.text },
  farmerMeta: { fontSize: 12, color: colors.textSoft, marginTop: 4, lineHeight: 16 },

  linea: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0EC",
    gap: 10,
  },
  lineaIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EEF5E3",
    justifyContent: "center",
    alignItems: "center",
  },
  lineaThumb: {
    width: 44,
    height: 44,
    borderRadius: 12,
    resizeMode: "cover",
    backgroundColor: "#EEF5E3",
  },
  lineaName: { fontSize: 14, fontWeight: "700", color: colors.text },
  lineaMeta: { fontSize: 12, color: colors.textSoft, marginTop: 2 },
  lineaTotal: { fontSize: 14, fontWeight: "800", color: colors.text },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ECECEC",
  },
  totalLabel: { fontSize: 15, fontWeight: "800", color: colors.text },
  totalValue: { fontSize: 18, fontWeight: "800", color: colors.primary },

  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: "center",
    minHeight: 46,
    justifyContent: "center",
  },
  disabledButton: { opacity: 0.6 },
  primaryButtonText: { color: "#fff", fontWeight: "800", fontSize: 14 },

  errorText: {
    color: "#8C2A1A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 8,
  },
});
