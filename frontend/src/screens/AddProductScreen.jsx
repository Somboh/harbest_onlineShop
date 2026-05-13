import { Ionicons } from "@expo/vector-icons";
import { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import { useAuth } from "../context/AuthContext";
import productsService from "../services/productsService";
import { ROLE_THEMES } from "../styles/roleThemes";

const categoryOptions = [
  { id: "Frutas", label: "Frutas", icon: "nutrition-outline" },
  { id: "Verduras", label: "Verduras", icon: "leaf-outline" },
  { id: "Especias", label: "Especias", icon: "flame-outline" },
];

const previewImages = {
  Frutas: require("../../assets/images/comida/fruta-default.png"),
  Verduras: require("../../assets/images/comida/verdura-default.png"),
  Especias: require("../../assets/images/comida/especia-default.png"),
};

const MAX_FOTOS = 5;

export default function AddProductScreen({ navigation, route }) {
  const { user } = useAuth();

  const isEdit = route?.params?.mode === "edit";
  const editingId = route?.params?.productId ?? null;
  const prefill = route?.params?.prefill ?? null;

  const [name, setName] = useState(prefill?.nombre ?? "");
  const [category, setCategory] = useState(
    categoryOptions.find((c) => c.id === prefill?.categoria)?.id ?? "Verduras",
  );
  const [description, setDescription] = useState(prefill?.descripcion ?? "");
  const [stock, setStock] = useState(
    prefill?.cantidad != null ? String(prefill.cantidad) : "",
  );
  const [price, setPrice] = useState(
    prefill?.precio != null ? String(prefill.precio) : "",
  );
  const [unit, setUnit] = useState(prefill?.unit || "kg");
  //photos: archivos nuevos elegidos por el agricultor en esta sesión (web).
  //photoPreviews: URIs locales (createObjectURL) para mostrar miniaturas.
  //existingPreviews: URIs ya guardadas en el producto (sólo en modo edit).
  //Si photos.length === 0 en modo edit, el backend mantiene las fotos
  //existentes; si hay alguna, se reemplazan todas.
  const initialExistingPreviews = useMemo(() => {
    if (Array.isArray(prefill?.imageUris) && prefill.imageUris.length > 0) {
      return prefill.imageUris.filter(Boolean);
    }
    return prefill?.imageUri ? [prefill.imageUri] : [];
  }, [prefill]);

  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [existingPreviews] = useState(initialExistingPreviews);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const hasNewPhotos = photos.length > 0;
  const displayedPreviews = hasNewPhotos ? photoPreviews : existingPreviews;
  const canAddMorePhotos = photos.length < MAX_FOTOS;

  const previewName = name.trim() || "Tomates de la huerta";
  const previewStock = stock.trim() || "0";
  const previewPrice = price.trim() || "0.00";

  const canSave = useMemo(() => {
    return name.trim() && stock.trim() && price.trim();
  }, [name, stock, price]);

  //En web abrimos un <input type="file" multiple> oculto y permitimos
  //seleccionar hasta MAX_FOTOS. Si selecciona más, recortamos. En nativo no
  //hay picker (no usamos expo-image-picker), así que se enviará una imagen
  //de preview de la categoría como fallback en modo crear.
  const handlePickPhoto = () => {
    if (Platform.OS !== "web") {
      setErrorMessage(
        "El selector de foto solo está disponible en web. Se usará la imagen de preview.",
      );
      return;
    }
    //Recreamos el input cada vez para que el callback capture el estado
    //actual de `photos` (los closures con un input cacheado se quedaban
    //con la lista vacía y no podíamos añadir más fotos en clicks sucesivos).
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = (event) => {
      const files = Array.from(event.target.files ?? []);
      if (files.length === 0) return;
      const slotsLeft = Math.max(0, MAX_FOTOS - photos.length);
      const accepted = files.slice(0, slotsLeft);
      const rejected = files.length - accepted.length;
      const newPhotos = [...photos, ...accepted];
      const newPreviews = [
        ...photoPreviews,
        ...accepted.map((f) => URL.createObjectURL(f)),
      ];
      setPhotos(newPhotos);
      setPhotoPreviews(newPreviews);
      if (rejected > 0) {
        setErrorMessage(
          `Solo puedes subir hasta ${MAX_FOTOS} fotos. ${rejected} se ${
            rejected === 1 ? "ha descartado" : "han descartado"
          }.`,
        );
      } else {
        setErrorMessage("");
      }
    };
    fileInputRef.current = input;
    input.click();
  };

  const handleRemovePhoto = (index) => {
    const removedPreview = photoPreviews[index];
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
    //Liberamos el URL local del browser para no dejar referencias colgando.
    if (Platform.OS === "web" && removedPreview && typeof URL !== "undefined" && URL.revokeObjectURL) {
      try { URL.revokeObjectURL(removedPreview); } catch { /* noop */ }
    }
  };

  //Fallback en modo crear cuando el agricultor no eligió ninguna foto:
  //usamos la imagen de preview de la categoría para que el producto siempre
  //se publique con al menos una foto. En web la convertimos a File; en
  //nativo a {uri,name,type}.
  const buildFotoForUpload = async () => {
    const asset = Image.resolveAssetSource(previewImages[category]);
    if (Platform.OS === "web") {
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      return new File([blob], `preview-${category}.jpg`, {
        type: blob.type || "image/jpeg",
      });
    }
    return {
      uri: asset.uri,
      name: `preview-${category}.jpg`,
      type: "image/jpeg",
    };
  };

  const handleSave = async () => {
    setErrorMessage("");

    if (!canSave) {
      setErrorMessage("Completa nombre, stock y precio para continuar.");
      return;
    }

    const precioNum = Number(price.replace(",", "."));
    const cantidadNum = Number(stock);
    if (!Number.isFinite(precioNum) || precioNum <= 0) {
      setErrorMessage("Introduce un precio válido (mayor que 0).");
      return;
    }
    if (!Number.isInteger(cantidadNum) || cantidadNum < 0) {
      setErrorMessage("El stock debe ser un número entero positivo.");
      return;
    }

    if (!user?.email) {
      setErrorMessage("Tu sesión ha caducado. Inicia sesión de nuevo.");
      return;
    }

    setSubmitting(true);
    try {
      const productData = {
        nombre: name.trim(),
        descripcion: description.trim() || name.trim(),
        precio: precioNum,
        cantidad: cantidadNum,
        email_agricultor: user.email,
        categoria: category,
        valoracion: 0,
      };

      let res;
      if (isEdit && editingId) {
        //En edición las fotos solo se envían si el agricultor eligió fotos
        //nuevas. Si no, el backend conserva las fotos actuales del producto.
        //Si envía nuevas, se reemplazan TODAS las anteriores.
        res = await productsService.updateProduct(editingId, productData, photos);
      } else {
        //En creación necesitamos al menos una foto. Si el agricultor no
        //eligió ninguna, mandamos la imagen de preview de la categoría.
        const fotosToSend = photos.length > 0
          ? photos
          : [await buildFotoForUpload()];
        res = await productsService.createProduct(productData, fotosToSend);
      }

      if (res?.status === "OK") {
        navigation.navigate("ProductosAgricultor", { category: "Todos" });
      } else {
        setErrorMessage(res?.message ?? "No se pudo guardar el producto.");
      }
    } catch (error) {
      console.error("Error guardando producto:", error);
      setErrorMessage(error?.message ?? "No se pudo guardar el producto.");
    } finally {
      setSubmitting(false);
    }
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
                <Text style={styles.headerText}>
                  {isEdit ? "Editar producto" : "Añadir nuevo producto"}
                </Text>
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
              <Image
                source={
                  displayedPreviews[0]
                    ? { uri: displayedPreviews[0] }
                    : previewImages[category]
                }
                style={styles.previewImage}
              />

              <View style={styles.previewOverlay}>
                <View style={styles.previewBadge}>
                  <Ionicons
                    name="camera-outline"
                    size={14}
                    color={theme.primary}
                  />
                  <Text style={styles.previewBadgeText}>
                    {displayedPreviews.length > 0
                      ? `${displayedPreviews.length}/${MAX_FOTOS}`
                      : "Preview"}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.photoButton,
                    !canAddMorePhotos && styles.photoButtonDisabled,
                  ]}
                  activeOpacity={0.85}
                  onPress={handlePickPhoto}
                  disabled={!canAddMorePhotos && hasNewPhotos}
                >
                  <Ionicons name="image-outline" size={16} color="#fff" />
                  <Text style={styles.photoButtonText}>
                    {hasNewPhotos ? "Añadir más" : "Añadir fotos"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbsRow}
            >
              {displayedPreviews.map((uri, index) => (
                <View
                  key={`${uri}-${index}`}
                  style={[
                    styles.thumb,
                    index === 0 && styles.thumbPrincipal,
                  ]}
                >
                  <Image source={{ uri }} style={styles.thumbImage} />
                  {index === 0 ? (
                    <View style={styles.thumbBadge}>
                      <Text style={styles.thumbBadgeText}>Principal</Text>
                    </View>
                  ) : null}
                  {hasNewPhotos ? (
                    <TouchableOpacity
                      style={styles.thumbRemove}
                      onPress={() => handleRemovePhoto(index)}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="close" size={14} color="#fff" />
                    </TouchableOpacity>
                  ) : null}
                </View>
              ))}

              {hasNewPhotos && canAddMorePhotos ? (
                <TouchableOpacity
                  style={styles.thumbAdd}
                  onPress={handlePickPhoto}
                  activeOpacity={0.85}
                >
                  <Ionicons name="add" size={26} color={theme.primary} />
                  <Text style={styles.thumbAddText}>Añadir</Text>
                </TouchableOpacity>
              ) : null}
            </ScrollView>

            {isEdit && existingPreviews.length > 0 && !hasNewPhotos ? (
              <Text style={styles.hintText}>
                Si añades fotos nuevas, se reemplazarán las {existingPreviews.length === 1 ? "actual" : `${existingPreviews.length} actuales`}.
              </Text>
            ) : null}

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
                Completa la información que verá el cliente.
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
                      style={[
                        styles.categoryChip,
                        isActive && styles.categoryChipActive,
                      ]}
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
                label="Descripción"
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
                      style={[
                        styles.unitChip,
                        isActive && styles.unitChipActive,
                      ]}
                      onPress={() => setUnit(item)}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.unitChipText,
                          isActive && styles.unitChipTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Ionicons
                  name="storefront-outline"
                  size={20}
                  color={theme.primary}
                />
              </View>

              <View style={styles.summaryTextBlock}>
                <Text style={styles.summaryTitle}>Listo para publicar</Text>
                <Text style={styles.summaryText}>
                  El producto aparecerá en tu inventario y podrás editarlo
                  cuando lo necesites.
                </Text>
              </View>
            </View>
          </ScrollView>

          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color="#B3533D" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() =>
                isEdit ? navigation.goBack() : navigation.navigate("HomeAgricultor")
              }
              activeOpacity={0.85}
              disabled={submitting}
            >
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                (!canSave || submitting) && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              activeOpacity={0.85}
              disabled={!canSave || submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Ionicons name="checkmark" size={18} color="#fff" />
              )}
              <Text style={styles.saveButtonText}>
                {submitting
                  ? "Guardando..."
                  : isEdit
                    ? "Actualizar"
                    : "Guardar"}
              </Text>
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
  photoButtonDisabled: {
    opacity: 0.5,
  },
  photoButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 6,
  },
  thumbsRow: {
    paddingVertical: 6,
    paddingRight: 4,
    gap: 10,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F1D3C5",
    position: "relative",
  },
  thumbPrincipal: {
    borderColor: theme.primary,
    borderWidth: 2,
  },
  thumbImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  thumbBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 999,
    paddingVertical: 2,
    alignItems: "center",
  },
  thumbBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
  },
  thumbRemove: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbAdd: {
    width: 72,
    height: 72,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: theme.primary,
    backgroundColor: "#FBF2EE",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbAddText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.primary,
    marginTop: 2,
  },
  hintText: {
    fontSize: 12,
    color: theme.textSoft,
    fontStyle: "italic",
    marginTop: 6,
    marginBottom: 6,
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
  errorBanner: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 174,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBE9E5",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: "#8C2A1A",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
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
