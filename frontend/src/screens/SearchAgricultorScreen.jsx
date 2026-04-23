import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenContainer from "../components/common/ScreenContainer";
import { ROLE_THEMES } from "../styles/roleThemes";

export default function SearchAgricultorScreen({ navigation }) {
  const FarmerColor = ROLE_THEMES.farmer.primary;
  const [SearchQuery, SetSearchQuery] = useState("");

  return (
    <ScreenContainer>
      <View style={Styles.MainContainer}>
        {/* HEADER CON BUSCADOR ACTIVO */}
        <View style={Styles.HeaderRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate("HomeAgricultor")}
            style={Styles.BackButton}
          >
            <Ionicons name="arrow-back" size={24} color="#2D2D2D" />
          </TouchableOpacity>

          <View style={[Styles.SearchInputArea, { borderColor: FarmerColor }]}>
            <Ionicons name="search" size={18} color={FarmerColor} />
            <TextInput
              style={Styles.Input}
              placeholder="Buscar tomate, aguacate..."
              placeholderTextColor="#8A8A8A"
              autoFocus={true}
              value={SearchQuery}
              onChangeText={SetSearchQuery}
            />
            {SearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => SetSearchQuery("")}>
                <Ionicons name="close-circle" size={18} color="#8A8A8A" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* RESULTADOS DE BÚSQUEDA */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={Styles.ResultsArea}
        >
          <Text style={Styles.SectionTitle}>Resultados para tu inventario</Text>

          <SearchResultItem
            Name="Tomates de la huerta"
            Qty="50 kg"
            Price="2.50 €/kg"
          />
          <SearchResultItem
            Name="Tomate Cherry"
            Qty="15 kg"
            Price="3.20 €/kg"
          />
          <SearchResultItem
            Name="Tomate Pera"
            Qty="0 kg (Agotado)"
            Price="1.80 €/kg"
            IsEmpty={true}
          />
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

// COMPONENTE DE RESULTADO (CapsCase)
const SearchResultItem = ({ Name, Qty, Price, IsEmpty }) => (
  <TouchableOpacity style={Styles.ResultCard} activeOpacity={0.7}>
    <View style={Styles.ResultIcon}>
      <Ionicons name="leaf-outline" size={20} color={ROLE_THEMES.farmer.primary} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={Styles.ResultName}>{Name}</Text>
      <Text
        style={[
          Styles.ResultQty,
          IsEmpty && { color: ROLE_THEMES.farmer.primary, fontWeight: "700" },
        ]}
      >
        {Qty}
      </Text>
    </View>
    <Text style={Styles.ResultPrice}>{Price}</Text>
    <Ionicons
      name="chevron-forward"
      size={18}
      color="#D1D1D1"
      style={{ marginLeft: 8 }}
    />
  </TouchableOpacity>
);

const Styles = StyleSheet.create({
  MainContainer: { flex: 1, backgroundColor: ROLE_THEMES.farmer.background, paddingTop: 20 },
  HeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  BackButton: { marginRight: 15 },
  SearchInputArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    elevation: 2,
  },
  Input: { flex: 1, marginLeft: 10, fontSize: 14, color: "#2D2D2D" },
  ResultsArea: { paddingHorizontal: 20 },
  SectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#8A8A8A",
    marginBottom: 15,
  },
  ResultCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
    elevation: 1,
  },
  ResultIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FCEEEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  ResultName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2D2D2D",
    marginBottom: 4,
  },
  ResultQty: { fontSize: 13, color: "#8A8A8A" },
  ResultPrice: { fontSize: 14, fontWeight: "800", color: "#2D2D2D" },
});
