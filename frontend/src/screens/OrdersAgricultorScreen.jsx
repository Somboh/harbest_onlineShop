import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
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

import FarmerTabBar from "../components/common/FarmerTabBar";
import ScreenContainer from "../components/common/ScreenContainer";
import authService from "../services/authService";
import ordersService, {
  STATUS_COLORS,
  STATUS_LABEL_FARMER,
} from "../services/ordersService";
import { useResponsive } from "../hooks/useResponsive";
import { ROLE_THEMES } from "../styles/roleThemes";

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd} · ${mm} · ${yyyy}`;
}

export default function OrdersAgricultorScreen({ navigation }) {
  const FarmerColor = ROLE_THEMES.farmer.primary;
  const { isDesktop, isTablet } = useResponsive();
  const wide = isDesktop || isTablet;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const reload = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      if (!user?.email) {
        setError("Sesión caducada. Vuelve a iniciar sesión.");
        setOrders([]);
        return;
      }
      const data = await ordersService.getOrdersByFarmer(user.email);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando pedidos del agricultor:", err);
      setError(err?.message ?? "No se pudieron cargar los pedidos");
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

  const filtered = orders.filter((o) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      o.id?.toLowerCase().includes(q) ||
      o.user_email?.toLowerCase().includes(q) ||
      o.estado?.toLowerCase().includes(q)
    );
  });

  return (
    <ScreenContainer>
      <View style={Styles.MainContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={Styles.ScrollPadding}
        >
          <View style={Styles.HeaderRow}>
            <TouchableOpacity
              style={Styles.HeaderLeft}
              onPress={() => navigation.navigate("HomeAgricultor")}
            >
              <Ionicons name="arrow-back" size={24} color="#8A8A8A" />
              <Text style={Styles.HeaderText}>Pedidos</Text>
            </TouchableOpacity>

            <View style={Styles.HeaderRight}>
              <TouchableOpacity onPress={() => navigation.navigate("ProfileAgricultor")}>
                <View style={[Styles.LogoCircle, { backgroundColor: FarmerColor }]}>
                  <Image source={ROLE_THEMES.farmer.logo} style={Styles.TopLogo} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={Styles.SearchBar}>
            <Ionicons name="search" size={20} color="#B8B8B8" />
            <TextInput
              style={Styles.SearchInputText}
              placeholder="Buscar por id, cliente o estado..."
              placeholderTextColor="#B8B8B8"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {loading ? (
            <View style={Styles.Center}>
              <ActivityIndicator color={FarmerColor} />
              <Text style={Styles.CenterText}>Cargando pedidos...</Text>
            </View>
          ) : error ? (
            <View style={[Styles.EmptyCard, { backgroundColor: "#FBE9E5" }]}>
              <Ionicons name="cloud-offline-outline" size={26} color="#B3533D" />
              <Text style={Styles.ErrorText}>{error}</Text>
              <TouchableOpacity style={Styles.RetryBtn} onPress={reload}>
                <Text style={Styles.RetryBtnText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : filtered.length === 0 ? (
            <View style={Styles.EmptyCard}>
              <Ionicons name="receipt-outline" size={28} color={FarmerColor} />
              <Text style={Styles.EmptyTitle}>
                {search.trim() ? "Sin coincidencias" : "Aún no tienes pedidos"}
              </Text>
              <Text style={Styles.EmptySubtitle}>
                {search.trim()
                  ? "Prueba con otro término de búsqueda."
                  : "Cuando un cliente te haga un pedido aparecerá aquí."}
              </Text>
            </View>
          ) : (
            <View style={wide ? Styles.OrdersGridWide : null}>
              {filtered.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  wide={wide}
                  onPress={() =>
                    navigation.navigate("OrderDetailFarmer", { orderId: order.id })
                  }
                />
              ))}
            </View>
          )}
        </ScrollView>

        <FarmerTabBar Navigation={navigation} ActiveRoute="OrdersAgricultor" />
      </View>
    </ScreenContainer>
  );
}

function OrderCard({ order, wide, onPress }) {
  const palette = STATUS_COLORS[order.estado] ?? { bg: "#EEE", text: "#555" };
  const label = STATUS_LABEL_FARMER[order.estado] ?? order.estado ?? "—";

  return (
    <TouchableOpacity
      style={[Styles.Card, wide && Styles.CardWide]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={Styles.CardTop}>
        <View style={Styles.BoxIconWrap}>
          <Ionicons name="cube" size={56} color="rgba(125, 125, 125, 0.4)" />
        </View>
        <View style={Styles.OrderInfo}>
          <View style={[Styles.StatusPill, { backgroundColor: palette.bg }]}>
            <Text style={[Styles.StatusPillText, { color: palette.text }]}>
              {label.toUpperCase()}
            </Text>
          </View>
          <Text style={Styles.OrderTitle}>Pedido #{order.id}</Text>
          <Text style={Styles.OrderText}>De: {order.user_email}</Text>
          <Text style={Styles.OrderText}>Fecha: {formatDate(order.fecha)}</Text>
          <Text style={Styles.OrderTotal}>
            {Number(order.total ?? 0).toFixed(2)} €
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#B5B5B5" />
      </View>
    </TouchableOpacity>
  );
}

const Styles = StyleSheet.create({
  MainContainer: { flex: 1, backgroundColor: ROLE_THEMES.farmer.background },
  ScrollPadding: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 110 },
  HeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  HeaderLeft: { flexDirection: "row", alignItems: "center" },
  HeaderText: { fontSize: 20, color: "#8A8A8A", marginLeft: 15, fontWeight: "500" },
  HeaderRight: { flexDirection: "row", alignItems: "center" },
  LogoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  TopLogo: { width: 22, height: 22, resizeMode: "contain" },
  SearchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  SearchInputText: { flex: 1, marginLeft: 10, fontSize: 15, color: "#7A7A7A" },

  Center: { alignItems: "center", paddingVertical: 30, gap: 8 },
  CenterText: { color: "#8A8A8A", fontWeight: "600" },

  EmptyCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  EmptyTitle: { fontSize: 17, fontWeight: "800", color: "#7A7A7A", marginTop: 4 },
  EmptySubtitle: {
    fontSize: 13,
    color: "#A8A8A8",
    textAlign: "center",
    lineHeight: 18,
  },
  ErrorText: { color: "#8C2A1A", fontWeight: "600", textAlign: "center" },
  RetryBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    marginTop: 8,
  },
  RetryBtnText: { color: "#8C2A1A", fontWeight: "800" },

  OrdersGridWide: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  Card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  CardWide: {
    flexBasis: 360,
    flexGrow: 1,
    minWidth: 320,
    marginBottom: 0,
  },
  CardTop: { flexDirection: "row", alignItems: "center" },
  BoxIconWrap: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  OrderInfo: { flex: 1, gap: 4 },
  StatusPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 4,
  },
  StatusPillText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.4 },
  OrderTitle: { fontSize: 15, fontWeight: "800", color: "#7A7A7A" },
  OrderText: { fontSize: 12, color: "#A8A8A8" },
  OrderTotal: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "800",
    color: ROLE_THEMES.farmer.primary,
  },
});
