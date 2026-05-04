import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import authService from "../../services/authService";
import ordersService from "../../services/ordersService";
import { ROLE_THEMES } from "../../styles/roleThemes";

//Estados que requieren acción del agricultor (los que aparecen en el banner).
const ACTIONABLE = new Set(["pendiente", "preparando"]);

//Acciones según el estado actual del pedido. Mismo mapping que en
//OrderDetailFarmerScreen.
function actionsFor(estado) {
  if (estado === "pendiente") {
    return [
      { key: "reject", label: "Rechazar", target: "cancelado", danger: true },
      { key: "accept", label: "Aceptar", target: "preparando" },
    ];
  }
  if (estado === "preparando") {
    return [
      { key: "cancel", label: "Cancelar", target: "cancelado", danger: true },
      { key: "send", label: "Enviar", target: "enviado" },
    ];
  }
  return [];
}

//Banner flotante que vive en HomeAgricultor. Muestra el primer pedido que
//requiere acción y permite aceptar/rechazar (o enviar/cancelar). Al actuar,
//recarga y muestra el siguiente.
//
//`bottom` permite empujarlo hacia arriba si hay una tab bar debajo (la
//FarmerTabBar mide ~88px en mobile).
export default function PendingOrdersBanner({ navigation, bottom = 100 }) {
  const farmerColor = ROLE_THEMES.farmer.primary;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      if (!user?.email) {
        setOrders([]);
        return;
      }
      const data = await ordersService.getOrdersByFarmer(user.email);
      const pending = (Array.isArray(data) ? data : []).filter((o) =>
        ACTIONABLE.has(o.estado),
      );
      //La fila más vieja primero: el agricultor responde a las que llevan más
      //tiempo esperando.
      pending.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      setOrders(pending);
    } catch (err) {
      console.error("Error cargando pendientes:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  if (loading || orders.length === 0) return null;

  const order = orders[0];
  const actions = actionsFor(order.estado);

  //Para el preview del producto cargamos las líneas perezosamente — hacemos
  //click → vamos al detalle. Aquí mostramos un resumen mínimo.
  const summary =
    order.estado === "pendiente"
      ? "quiere comprarte un pedido"
      : "está esperando que envíes su pedido";

  const handleAction = async (action) => {
    setActionLoading(action.key);
    try {
      await ordersService.updateOrderStatus(order.id, action.target);
      await reload();
    } catch (err) {
      console.error("Error actualizando pedido desde el banner:", err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <View style={[styles.wrap, { bottom }]} pointerEvents="box-none">
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => navigation.navigate("OrderDetailFarmer", { orderId: order.id })}
        style={styles.card}
      >
        <View style={styles.topRow}>
          <View style={[styles.avatar, { backgroundColor: farmerColor + "33" }]}>
            <Ionicons name="person-outline" size={20} color={farmerColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.line1} numberOfLines={1}>
              {order.user_email}
            </Text>
            <Text style={styles.line2} numberOfLines={1}>
              {summary}
            </Text>
            <Text style={styles.line3}>
              Pedido #{order.id} · {Number(order.total ?? 0).toFixed(2)} €
            </Text>
          </View>
          {orders.length > 1 ? (
            <View style={[styles.countBadge, { backgroundColor: farmerColor }]}>
              <Text style={styles.countBadgeText}>+{orders.length - 1}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.actionsRow}>
          {actions.map((a) => (
            <TouchableOpacity
              key={a.key}
              style={[
                styles.actionButton,
                a.danger
                  ? styles.actionDanger
                  : { backgroundColor: farmerColor },
                actionLoading && styles.disabled,
              ]}
              disabled={!!actionLoading}
              onPress={() => handleAction(a)}
              activeOpacity={0.85}
            >
              {actionLoading === a.key ? (
                <ActivityIndicator color={a.danger ? "#8C2A1A" : "#fff"} />
              ) : (
                <Text
                  style={[
                    styles.actionText,
                    { color: a.danger ? "#8C2A1A" : "#fff" },
                  ]}
                >
                  {a.label}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 16,
    right: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
    gap: 12,
  },
  topRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  line1: { fontSize: 14, fontWeight: "800", color: "#5A5A5A" },
  line2: { fontSize: 12, color: "#7A7A7A", marginTop: 2 },
  line3: { fontSize: 11, color: "#A8A8A8", marginTop: 2, fontWeight: "600" },
  countBadge: {
    minWidth: 30,
    height: 24,
    paddingHorizontal: 6,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  countBadgeText: { color: "#fff", fontWeight: "800", fontSize: 12 },

  actionsRow: { flexDirection: "row", gap: 10 },
  actionButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  actionDanger: { backgroundColor: "#FBE9E5" },
  actionText: { fontWeight: "800", fontSize: 14 },
  disabled: { opacity: 0.6 },
});
