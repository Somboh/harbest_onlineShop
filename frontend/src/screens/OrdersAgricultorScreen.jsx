import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
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
import { ROLE_THEMES } from "../styles/roleThemes";

export default function OrdersAgricultorScreen({ navigation }) {
  const FarmerColor = ROLE_THEMES.farmer.primary;

  const orders = [
    {
      id: "0000000000",
      user: "Pepe",
      date: "12 · 02 · 2026",
      status: "PENDIENTE",
    },
    {
      id: "0000000001",
      user: "Ana",
      date: "10 · 02 · 2026",
      status: "ENTREGADO",
    },
    {
      id: "0000000002",
      user: "Luis",
      date: "08 · 02 · 2026",
      status: "PENDIENTE",
    },
  ];

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
              <TouchableOpacity
                onPress={() => navigation.navigate("ProfileAgricultor")}
              >
                <View
                  style={[Styles.LogoCircle, { backgroundColor: FarmerColor }]}
                >
                  <Image
                    source={ROLE_THEMES.farmer.logo}
                    style={Styles.TopLogo}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={Styles.SearchBar}>
            <Ionicons name="search" size={20} color="#B8B8B8" />
            <TextInput
              style={Styles.SearchInputText}
              placeholder="Buscar pedidos..."
              placeholderTextColor="#B8B8B8"
            />
          </View>

          {orders.map((order, index) => (
            <OrderCard key={index} order={order} />
          ))}
        </ScrollView>

        <FarmerTabBar Navigation={navigation} ActiveRoute="OrdersAgricultor" />
      </View>
    </ScreenContainer>
  );
}

const OrderCard = ({ order }) => {
  const isDelivered = order.status === "ENTREGADO";

  return (
    <TouchableOpacity
      style={[
        Styles.Card,
        isDelivered ? Styles.CardDelivered : Styles.CardPending,
      ]}
      activeOpacity={0.9}
    >
      <View style={Styles.CardTop}>
        <View style={Styles.BoxIconWrap}>
          <Ionicons
            name="cube"
            size={70}
            color={
              isDelivered
                ? "rgba(125, 181, 106, 0.4)"
                : "rgba(210, 180, 100, 0.4)"
            }
          />
        </View>
        <View style={Styles.OrderInfo}>
          <Text
            style={[
              Styles.OrderStatus,
              isDelivered
                ? Styles.StatusTextDelivered
                : Styles.StatusTextPending,
            ]}
          >
            {order.status}
          </Text>
          <Text style={Styles.OrderTitle}>Pedido #{order.id}</Text>
          <Text style={Styles.OrderText}>Para: {order.user}</Text>
          <Text style={Styles.OrderText}>Fecha: {order.date}</Text>
        </View>
        <View style={Styles.ArrowWrap}>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={isDelivered ? "#7DB56A" : "#C77A72"}
          />
        </View>
      </View>

      <View style={Styles.ProgressContainer}>
        <View style={Styles.ProgressStartCircle}>
          <View style={Styles.ProgressStartInner} />
        </View>
        <View style={Styles.ProgressLineSolid} />
        {!isDelivered && (
          <View style={Styles.ProgressTruckWrap}>
            <MaterialCommunityIcons
              name="truck-outline"
              size={32}
              color="#8A8A8A"
            />
          </View>
        )}
        {isDelivered ? (
          <View style={Styles.ProgressLineSolid} />
        ) : (
          <View style={Styles.ProgressLineDashed} />
        )}
        {isDelivered ? (
          <View style={Styles.ProgressEndCheck}>
            <Ionicons name="checkmark" size={24} color="#8A8A8A" />
          </View>
        ) : (
          <View style={Styles.ProgressEndDot} />
        )}
      </View>
    </TouchableOpacity>
  );
};

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
  HeaderText: {
    fontSize: 20,
    color: "#8A8A8A",
    marginLeft: 15,
    fontWeight: "500",
  },
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
  SearchInputText: { flex: 1, marginLeft: 10, fontSize: 15, color: "#B8B8B8" },
  Card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 15,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  CardPending: { backgroundColor: "#F6F5E3" },
  CardDelivered: { backgroundColor: "#E9F5E1" },
  CardTop: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  BoxIconWrap: {
    width: 70,
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 10,
  },
  OrderInfo: { flex: 1, paddingTop: 5 },
  OrderStatus: {
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 8,
    alignSelf: "flex-end",
    letterSpacing: 0.5,
  },
  StatusTextPending: { color: "#C77A72" },
  StatusTextDelivered: { color: "#7DB56A" },
  OrderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7A7A7A",
    marginBottom: 4,
  },
  OrderText: {
    fontSize: 12,
    color: "#A8A8A8",
    fontWeight: "500",
    marginBottom: 2,
  },
  ArrowWrap: {
    justifyContent: "flex-end",
    alignItems: "center",
    paddingLeft: 10,
    paddingTop: 60,
  },
  ProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    marginTop: 5,
  },
  ProgressStartCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2.5,
    borderColor: "#8A8A8A",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  ProgressStartInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8A8A8A",
  },
  ProgressLineSolid: {
    flex: 1,
    height: 2,
    backgroundColor: "#B8B8B8",
    marginHorizontal: 2,
  },
  ProgressTruckWrap: { marginHorizontal: 5, marginTop: -5 },
  ProgressLineDashed: {
    flex: 1,
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#C4C4C4",
    borderRadius: 1,
    marginHorizontal: 2,
  },
  ProgressEndDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#8A8A8A",
    marginLeft: 5,
  },
  ProgressEndCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: "#8A8A8A",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
});
