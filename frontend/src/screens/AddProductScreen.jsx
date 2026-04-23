import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
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

const categoryOptions = [
  { id: "Frutas", label: "Frutas", icon: "nutrition-outline" },
  { id: "Verduras", label: "Verduras", icon: "leaf-outline" },
  { id: "Especias", label: "Especias", icon: "flame-outline" },
];

const previewImages = {
  Frutas: require("../../assets/images/comida/naranjas.webp"),
  Verduras: require("../../assets/images/comida/tomates.jpeg"),
  Especias: require("../../assets/images/comida/pimenton.jpg"),
};

export default function AddProductScreen({ navigation }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Verduras");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("kg");

  const previewName = name.trim() || "Tomates de la huerta";
  const previewStock = stock.trim() || "0";
  const previewPrice = price.trim() || "0.00";

  const canSave = useMemo(() => {
    return name.trim() && stock.trim() && price.trim();
  }, [name, stock, price]);

  const handleSave = () => {
    navigation.navigate("Inventory");
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.headerLeft}
                onPress={() => navigation.navigate("HomeAgricultor")}
                activeOpacity={0.85}
              >
                <Ionicons name="arrow-back" size={22} color={theme.text} />
                <Text style={styles.headerText}>Anadir nuevo producto</Text>
              </TouchableOpacity>

              <View style={styles.headerRight}>
                <TouchableOpacity
                  style={styles.logoButton}
                  onPress={() => navigation.navigate("ProfileAgricultor")}
                  activeOpacity={0.85}
                >
                  <Image source={theme.logo} style={styles.logoImage} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.previewCard}>
              <Image source={previewImages[category]} style={styles.previewImage} />

              <View style={styles.previewOverlay}>
                <View style={styles.previewBadge}>
                  <Ionicons name="camera-outline" size={14} color={theme.primary} />
                  <Text style={styles.previewBadgeText}>Preview</Text>
                </View>

                <TouchableOpacity style={styles.photoButton} activeOpacity={0.85}>
                  <Ionicons name="image-outline" size={16} color="#fff" />
                  <Text style={styles.photoButtonText}>Cambiar foto</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.previewInfoCard}>
              <View style={styles.previewInfoMain}>
                <Text style={styles.previewProductName} numberOfLines={1}>
                  {previewName}
                </Text>
                <Text style={styles.previewProductMeta}>
                  {category} · {previewStock} {unit} disponibles
                </Text>
              </View>

              <View style={styles.priceBadge}>
                <Text style={styles.priceBadgeValue}>{previewPrice} €</Text>
                <Text style={styles.priceBadgeUnit}>/{unit}</Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Datos del producto</Text>
              <Text style={styles.sectionSubtitle}>
                Completa la informacion que vera el cliente.
              </Text>
            </View>

            <View style={styles.formCard}>
              <InputField
                label="Nombre"
                value={name}
                onChangeText={setName}
                placeholder="Ej. Tomates de la huerta"
                icon="pricetag-outline"
              />

              <Text style={styles.label}>Categoria</Text>
              <View style={styles.categoryRow}>
                {categoryOptions.map((item) => {
                  const isActive = category === item.id;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                      onPress={() => setCategory(item.id)}
                      activeOpacity={0.85}
                    >
                      <Ionicons
                        name={item.icon}
                        size={16}
                        color={isActive ? "#fff" : theme.primary}
                      />
                      <Text
                        style={[
                          styles.categoryChipText,
                          isActive && styles.categoryChipTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <InputField
                label="Descripcion"
                value={description}
                onChangeText={setDescription}
                placeholder="Ej. Recolectados esta semana, dulces y firmes"
                icon="document-text-outline"
                multiline
              />

              <View style={styles.doubleRow}>
                <InputField
                  label="Stock"
                  value={stock}
                  onChangeText={setStock}
                  placeholder="0"
                  keyboardType="numeric"
                  icon="cube-outline"
                  suffix={unit}
                  containerStyle={styles.doubleInput}
                />

                <InputField
                  label="Precio"
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  icon="cash-outline"
                  suffix={`€/${unit}`}
                  containerStyle={styles.doubleInput}
                />
              </View>

              <Text style={styles.label}>Unidad</Text>
              <View style={styles.unitRow}>
                {["kg", "ud", "caja"].map((item) => {
                  const isActive = unit === item;

                  return (
                    <TouchableOpacity
                      key={item}
                      style={[styles.unitChip, isActive && styles.unitChipActive]}
                      onPress={() => setUnit(item)}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.unitChipText, isActive && styles.unitChipTextActive]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Ionicons name="storefront-outline" size={20} color={theme.primary} />
              </View>

              <View style={styles.summaryTextBlock}>
                <Text style={styles.summaryTitle}>Listo para publicar</Text>
                <Text style={styles.summaryText}>
                  El producto aparecera en tu inventario y podras editarlo cuando lo necesites.
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Inventory")}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
              onPress={handleSave}
              activeOpacity={0.85}
              disabled={!canSave}
            >
              <Ionicons name="checkmark" size={18} color="#fff" />
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>

          <FarmerTabBar Navigation={navigation} ActiveRoute="AddProduct" />
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  suffix,
  multiline,
  containerStyle,
  ...props
}) => (
  <View style={[styles.inputGroup, containerStyle]}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputBox, multiline && styles.textAreaBox]}>
      <Ionicons
        name={icon}
        size={18}
        color={theme.primary}
        style={styles.inputIcon}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B8B8B8"
        style={[styles.input, multiline && styles.textArea]}
        multiline={multiline}
        {...props}
      />
      {suffix && (
        <View style={styles.suffixBox}>
          <Text style={styles.suffixText}>{suffix}</Text>
        </View>
      )}
    </View>
  </View>
);

const theme = ROLE_THEMES.farmer;

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 190,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontSize: 18,
    color: theme.text,
    marginLeft: 10,
    fontWeight: "800",
  },
  logoButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1D3C5",
  },
  logoImage: {
    width: 34,
    height: 34,
    resizeMode: "contain",
  },
  previewCard: {
    height: 210,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1D3C5",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  previewOverlay: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewBadge: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  previewBadgeText: {
    marginLeft: 6,
    color: theme.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  photoButton: {
    backgroundColor: theme.primary,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
  },
  photoButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 6,
  },
  previewInfoCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    marginBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1D3C5",
  },
  previewInfoMain: {
    flex: 1,
    paddingRight: 12,
  },
  previewProductName: {
    color: theme.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 5,
  },
  previewProductMeta: {
    color: theme.textSoft,
    fontSize: 13,
    fontWeight: "600",
  },
  priceBadge: {
    backgroundColor: theme.primarySoft,
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 10,
    alignItems: "center",
  },
  priceBadgeValue: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: "800",
  },
  priceBadgeUnit: {
    color: theme.textSoft,
    fontSize: 11,
    marginTop: 2,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: theme.textSoft,
    marginTop: 2,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1D3C5",
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.text,
    marginBottom: 8,
  },
  inputBox: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBF8F6",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F2DFD6",
    paddingHorizontal: 13,
  },
  textAreaBox: {
    minHeight: 92,
    alignItems: "flex-start",
    paddingTop: 13,
  },
  inputIcon: {
    marginRight: 9,
    marginTop: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: theme.text,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
  },
  textArea: {
    minHeight: 66,
    textAlignVertical: "top",
  },
  suffixBox: {
    backgroundColor: theme.primarySoft,
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 7,
    marginLeft: 8,
  },
  suffixText: {
    color: theme.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBF8F6",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#F2DFD6",
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  categoryChipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  categoryChipText: {
    marginLeft: 6,
    color: theme.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  categoryChipTextActive: {
    color: "#fff",
  },
  doubleRow: {
    flexDirection: "row",
    gap: 10,
  },
  doubleInput: {
    flex: 1,
  },
  unitRow: {
    flexDirection: "row",
    gap: 8,
  },
  unitChip: {
    minWidth: 64,
    alignItems: "center",
    backgroundColor: "#FBF8F6",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#F2DFD6",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  unitChipActive: {
    backgroundColor: theme.primarySoft,
    borderColor: "#F0B59D",
  },
  unitChipText: {
    color: theme.textSoft,
    fontSize: 13,
    fontWeight: "800",
  },
  unitChipTextActive: {
    color: theme.primary,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1D3C5",
  },
  summaryIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: theme.primarySoft,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  summaryTextBlock: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 15,
    color: theme.text,
    fontWeight: "800",
    marginBottom: 3,
  },
  summaryText: {
    fontSize: 12,
    lineHeight: 18,
    color: theme.textSoft,
  },
  bottomBar: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 102,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 12,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#F1D3C5",
    shadowColor: "#8B3E24",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F2DFD6",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  secondaryButtonText: {
    color: theme.text,
    fontSize: 14,
    fontWeight: "800",
  },
  saveButton: {
    flex: 1,
    backgroundColor: theme.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    marginLeft: 7,
  },
});
