import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
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

function summaryFor(estado) {
  if (estado === "pendiente") return "quiere comprarte un producto";
  if (estado === "preparando") return "está esperando que envíes su pedido";
  return "";
}

//Banner flotante que vive en HomeAgricultor. Muestra el primer pedido que
//requiere acción y permite aceptar/rechazar (o enviar/cancelar). Al actuar,
//recarga y muestra el siguiente.
//
//`bottom` permite empujarlo hacia arriba si hay una tab bar debajo (la
//FarmerTabBar mide ~88px en mobile).
export default function PendingOrdersBanner({ navigation, bottom = 100 }) {
  const farmerColor = ROLE_THEMES.farmer.primary;

  const [pendings, setPendings] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      if (!user?.email) {
        setPendings([]);
        return;
      }
      const data = await ordersService.getOrdersByFarmer(user.email);
      const pending = (Array.isArray(data) ? data : []).filter((o) =>
        ACTIONABLE.has(o.estado),
      );
      //La fila más vieja primero: el agricultor responde a las que llevan más
      //tiempo esperando.
      pending.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      setPendings(pending);
    } catch (err) {
      console.error("Error cargando pendientes:", err);
      setPendings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  //Carga las líneas+productos+fotos del primer pedido pendiente para poder
  //mostrar foto/nombre/cantidad/precio en el popup. La API /pedidos/:id ya
  //devuelve `foto_url` aplanada por línea.
  const firstId = pendings[0]?.id;
  useEffect(() => {
    if (!firstId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await ordersService.getOrderById(firstId);
        if (!cancelled) setDetail(data);
      } catch (err) {
        console.error("Error cargando detalle del pendiente:", err);
        if (!cancelled) setDetail(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [firstId]);

  if (loading || pendings.length === 0) return null;

  const order = pendings[0];
  const actions = actionsFor(order.estado);

  //Producto principal a destacar en el popup; el resto se resume con un
  //contador. Si aún no hemos cargado el detalle, dejamos firstLine en null y
  //mostramos un placeholder.
  const lineas = detail?.lineas ?? [];
  const firstLine = lineas[0] ?? null;
  const extraProducts = Math.max(lineas.length - 1, 0);
  const fotoUrl = firstLine?.producto?.foto_url ?? null;
  const productName = firstLine?.producto?.nombre ?? "Pedido";
  const cantidad = firstLine ? Number(firstLine.cantidad) : null;
  const precioUnit = firstLine ? Number(firstLine.precio_unitario) : null;
  const lineSubtotal =
    firstLine && cantidad != null && precioUnit != null
      ? cantidad * precioUnit
      : null;

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
        onPress={() =>
          navigation.navigate("OrderDetailFarmer", { orderId: order.id })
        }
        style={styles.card}
      >
        <View style={styles.headerRow}>
          <View style={[styles.avatar, { backgroundColor: farmerColor + "33" }]}>
            <Ionicons name="person-outline" size={18} color={farmerColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userEmail} numberOfLines={1}>
              {order.user_email}
            </Text>
            <Text style={styles.userSummary} numberOfLines={1}>
              {summaryFor(order.estado)}
            </Text>
          </View>
          {pendings.length > 1 ? (
            <View style={[styles.countBadge, { backgroundColor: farmerColor }]}>
              <Text style={styles.countBadgeText}>+{pendings.length - 1}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.productRow}>
          {fotoUrl ? (
            <Image source={{ uri: fotoUrl }} style={styles.productImage} />
          ) : (
            <View
              style={[
                styles.productImage,
                styles.productImageFallback,
                { backgroundColor: farmerColor + "22" },
              ]}
            >
              <Ionicons name="basket-outline" size={26} color={farmerColor} />
            </View>
          )}

          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={1}>
              {productName}
            </Text>
            {cantidad != null ? (
              <Text style={styles.productMeta}>
                {cantidad.toFixed(1)} kg
              </Text>
            ) : null}
            {precioUnit != null ? (
              <Text style={[styles.productPrice, { color: farmerColor }]}>
                {lineSubtotal != null
                  ? `${lineSubtotal.toFixed(2)} €`
                  : `${precioUnit.toFixed(2)} €/kg`}
              </Text>
            ) : (
              <Text style={[styles.productPrice, { color: farmerColor }]}>
                {Number(order.total ?? 0).toFixed(2)} €
              </Text>
            )}
            {extraProducts > 0 ? (
              <Text style={styles.extraProducts}>
                +{extraProducts} producto{extraProducts === 1 ? "" : "s"} más
              </Text>
            ) : null}
          </View>
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
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 12,
    gap: 12,
  },

  headerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  userEmail: { fontSize: 13, fontWeight: "800", color: "#5A5A5A" },
  userSummary: { fontSize: 11, color: "#A8A8A8", marginTop: 2 },
  countBadge: {
    minWidth: 30,
    height: 24,
    paddingHorizontal: 6,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  countBadgeText: { color: "#fff", fontWeight: "800", fontSize: 12 },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 4,
  },
  productImage: {
    width: 78,
    height: 78,
    borderRadius: 18,
    resizeMode: "cover",
  },
  productImageFallback: {
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: { flex: 1, minWidth: 0 },
  productName: { fontSize: 17, fontWeight: "800", color: "#5A5A5A" },
  productMeta: { fontSize: 13, color: "#7A7A7A", marginTop: 4, fontWeight: "600" },
  productPrice: { fontSize: 15, fontWeight: "800", marginTop: 4 },
  extraProducts: { fontSize: 11, color: "#A8A8A8", marginTop: 4, fontWeight: "600" },

  actionsRow: { flexDirection: "row", gap: 10 },
  actionButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  actionDanger: { backgroundColor: "#FBE9E5" },
  actionText: { fontWeight: "800", fontSize: 15 },
  disabled: { opacity: 0.6 },
});
