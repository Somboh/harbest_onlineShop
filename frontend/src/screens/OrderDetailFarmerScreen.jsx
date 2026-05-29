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
import ordersService, {
  STATUS_COLORS,
  STATUS_LABEL_FARMER,
} from "../services/ordersService";
import { ROLE_THEMES } from "../styles/roleThemes";

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

//Acciones disponibles según el estado del pedido. Una acción = (label, color,
//ícono, estado destino).
function actionsFor(estado) {
  if (estado === "pendiente") {
    return [
      { key: "reject", label: "Rechazar", icon: "close-outline", target: "cancelado", danger: true },
      { key: "accept", label: "Aceptar", icon: "checkmark-outline", target: "preparando" },
    ];
  }
  if (estado === "preparando") {
    return [
      { key: "cancel", label: "Cancelar", icon: "close-outline", target: "cancelado", danger: true },
      { key: "send", label: "Enviar", icon: "paper-plane-outline", target: "enviado" },
    ];
  }
  return [];
}

export default function OrderDetailFarmerScreen({ navigation, route }) {
  const orderId = route?.params?.orderId;
  const farmerColor = ROLE_THEMES.farmer.primary;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

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

  const handleAction = async (action) => {
    if (!order) return;
    setActionLoading(action.key);
    setError("");
    try {
      const res = await ordersService.updateOrderStatus(order.id, action.target);
      if (res?.status === "OK") {
        await reload();
      } else {
        setError(res?.message ?? "No se pudo actualizar el pedido");
      }
    } catch (err) {
      setError(err?.message ?? "Error al actualizar el pedido");
    } finally {
      setActionLoading(null);
    }
  };

  const estado = order?.estado;
  const palette = STATUS_COLORS[estado] ?? { bg: "#EEE", text: "#555" };
  const label = STATUS_LABEL_FARMER[estado] ?? estado ?? "—";
  const actions = actionsFor(estado);
  const lineas = order?.lineas ?? [];

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color="#7A7A7A" />
            </TouchableOpacity>
            <Text style={styles.topTitle}>
              {orderId ? `Pedido #${orderId}` : "Pedido"}
            </Text>
            <View style={{ width: 22 }} />
          </View>

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator color={farmerColor} />
              <Text style={styles.centerText}>Cargando...</Text>
            </View>
          ) : error ? (
            <View style={[styles.card, { alignItems: "center" }]}>
              <Ionicons name="cloud-offline-outline" size={28} color="#B3533D" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: farmerColor }]}
                onPress={reload}
              >
                <Text style={styles.primaryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : order ? (
            <>
              {/* ESTADO */}
              <View style={styles.card}>
                <View style={styles.statusRow}>
                  <View style={[styles.statusBadge, { backgroundColor: palette.bg }]}>
                    <Text style={[styles.statusText, { color: palette.text }]}>{label}</Text>
                  </View>
                  <Text style={styles.dateText}>{formatDate(order.fecha)}</Text>
                </View>

                <Text style={styles.cardTitle}>Cliente</Text>
                <View style={styles.clientRow}>
                  <View style={[styles.clientBadge, { backgroundColor: farmerColor + "22" }]}>
                    <Ionicons name="person-outline" size={18} color={farmerColor} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.clientEmail}>{order.user_email}</Text>
                    {order.direccion_envio ? (
                      <Text style={styles.clientMeta}>
                        Envío: {order.direccion_envio}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              {/* PRODUCTOS */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Productos ({lineas.length})</Text>
                {lineas.map((linea) => (
                  <View key={linea.id} style={styles.linea}>
                    <View
                      style={[styles.lineaIcon, { backgroundColor: farmerColor + "22" }]}
                    >
                      <Ionicons name="basket-outline" size={20} color={farmerColor} />
                    </View>
                    <View style={{ flex: 1 }}>
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
                ))}

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={[styles.totalValue, { color: farmerColor }]}>
                    {Number(order.total ?? 0).toFixed(2)} €
                  </Text>
                </View>
              </View>

              {/* ACCIONES */}
              {actions.length > 0 ? (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>¿Qué quieres hacer?</Text>
                  <Text style={styles.cardSubtitle}>
                    {estado === "pendiente"
                      ? "Acepta el pedido si puedes prepararlo. El cliente verá tu decisión."
                      : "Cuando termines de prepararlo, dale a Enviar para que el cliente lo sepa."}
                  </Text>

                  <View style={styles.actionsRow}>
                    {actions.map((a) => (
                      <TouchableOpacity
                        key={a.key}
                        style={[
                          styles.actionButton,
                          a.danger
                            ? styles.actionDanger
                            : { backgroundColor: farmerColor },
                          actionLoading && styles.disabledButton,
                        ]}
                        onPress={() => handleAction(a)}
                        disabled={!!actionLoading}
                      >
                        {actionLoading === a.key ? (
                          <ActivityIndicator color={a.danger ? "#8C2A1A" : "#fff"} />
                        ) : (
                          <>
                            <Ionicons
                              name={a.icon}
                              size={18}
                              color={a.danger ? "#8C2A1A" : "#fff"}
                            />
                            <Text
                              style={[
                                styles.actionLabel,
                                { color: a.danger ? "#8C2A1A" : "#fff" },
                              ]}
                            >
                              {a.label}
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>
                    {estado === "enviado"
                      ? "El pedido está en camino"
                      : estado === "entregado"
                        ? "Pedido entregado"
                        : estado === "cancelado"
                          ? "Pedido cancelado"
                          : "Sin acciones disponibles"}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    {estado === "enviado"
                      ? "Ya no puedes modificarlo. El cliente lo confirmará al recibirlo."
                      : "Este pedido está cerrado y no requiere más acciones."}
                  </Text>
                </View>
              )}
            </>
          ) : null}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ROLE_THEMES.farmer.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  topTitle: { fontSize: 16, fontWeight: "800", color: "#7A7A7A" },

  center: { paddingVertical: 40, alignItems: "center", gap: 10 },
  centerText: { color: "#8A8A8A", fontWeight: "600" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#5A5A5A", marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: "#A8A8A8", marginBottom: 14, lineHeight: 18 },

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
  dateText: { fontSize: 12, color: "#A8A8A8", fontWeight: "600" },

  clientRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  clientBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  clientEmail: { fontSize: 14, fontWeight: "800", color: "#5A5A5A" },
  clientMeta: { fontSize: 12, color: "#A8A8A8", marginTop: 4, lineHeight: 16 },

  linea: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0EC",
    gap: 10,
  },
  lineaIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  lineaName: { fontSize: 14, fontWeight: "700", color: "#5A5A5A" },
  lineaMeta: { fontSize: 12, color: "#A8A8A8", marginTop: 2 },
  lineaTotal: { fontSize: 14, fontWeight: "800", color: "#5A5A5A" },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ECECEC",
  },
  totalLabel: { fontSize: 15, fontWeight: "800", color: "#5A5A5A" },
  totalValue: { fontSize: 18, fontWeight: "800" },

  actionsRow: { flexDirection: "row", gap: 12 },
  actionButton: {
    flex: 1,
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },
  actionDanger: { backgroundColor: "#FBE9E5" },
  actionLabel: { fontSize: 14, fontWeight: "800" },
  disabledButton: { opacity: 0.6 },

  primaryButton: {
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "800", fontSize: 14 },

  errorText: {
    color: "#8C2A1A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 8,
  },
});
