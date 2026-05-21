import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";

import ScreenContainer from "../components/common/ScreenContainer";
import { useCart } from "../context/CartContext";
import authService from "../services/authService";
import ordersService from "../services/ordersService";
import colors from "../styles/colors";
import { formatPrice, formatUnitPrice } from "../utils/formatPrice";

//Agrupa los items del carrito por email_agricultor → { email, items[], subtotal }.
//El backend acepta UN pedido por agricultor, así que un carrito con productos
//de varios agricultores se transforma en N pedidos al hacer "Finalizar compra".
function groupItemsByFarmer(items) {
  const map = new Map();
  for (const item of items) {
    const email = item.email_agricultor;
    if (!email) continue;
    if (!map.has(email)) {
      map.set(email, { email, sellerName: item.seller, items: [], subtotal: 0 });
    }
    const group = map.get(email);
    group.items.push(item);
    group.subtotal += item.price * item.quantity;
  }
  return Array.from(map.values());
}

export default function CheckoutScreen({ navigation }) {
  const { items, subtotal, shipping, total, clearCart } = useCart();

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [cp, setCp] = useState("");
  const [telefono, setTelefono] = useState("");
  const [notas, setNotas] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const groups = useMemo(() => groupItemsByFarmer(items), [items]);
  const itemsWithoutFarmer = items.filter((i) => !i.email_agricultor);

  const validate = () => {
    if (!nombre.trim()) return "Introduce tu nombre";
    if (!direccion.trim()) return "Introduce la dirección";
    if (!ciudad.trim()) return "Introduce la ciudad";
    if (!cp.trim()) return "Introduce el código postal";
    return null;
  };

  const handleFinalize = async () => {
    setErrorMessage("");

    if (items.length === 0) {
      setErrorMessage("Tu carrito está vacío.");
      return;
    }
    if (itemsWithoutFarmer.length > 0) {
      setErrorMessage(
        "Algunos productos no tienen agricultor asignado y no se pueden comprar.",
      );
      return;
    }
    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const user = await authService.getCurrentUser();
    if (!user?.email) {
      setErrorMessage("Tu sesión ha caducado. Vuelve a iniciar sesión.");
      return;
    }

    //Construimos un único string con la información de envío. Lo guardaremos
    //en cada pedido en `direccion_envio` para que el agricultor lo vea.
    const direccionCompleta = [
      nombre.trim(),
      direccion.trim(),
      `${cp.trim()} ${ciudad.trim()}`.trim(),
      `Tel: ${telefono.trim()}`,
      notas.trim() ? `Notas: ${notas.trim()}` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    setSubmitting(true);
    try {
      //Lanzamos los pedidos en paralelo: uno por agricultor.
      const results = await Promise.all(
        groups.map((g) =>
          ordersService
            .createOrder({
              user_email: user.email,
              farmer_email: g.email,
              direccion_envio: direccionCompleta,
              lineas: g.items.map((it) => ({
                product_id: it.id,
                cantidad: it.quantity,
              })),
            })
            .then((res) => ({ farmer: g.email, res, ok: res?.status === "OK" || res?.id }))
            .catch((err) => ({ farmer: g.email, error: err?.message ?? "Error", ok: false })),
        ),
      );

      const failed = results.filter((r) => !r.ok);
      if (failed.length === 0) {
        clearCart();
        navigation.reset({
          index: 0,
          routes: [{ name: "Orders" }],
        });
      } else if (failed.length === results.length) {
        const reason =
          failed[0].error ?? failed[0].res?.message ?? "No se pudo crear el pedido.";
        setErrorMessage(reason);
      } else {
        //Algunos sí, otros no — no limpiamos el carrito automáticamente;
        //que el usuario decida qué hacer con los que fallaron.
        const farmers = failed.map((f) => f.farmer).join(", ");
        setErrorMessage(
          `Se crearon ${results.length - failed.length} de ${
            results.length
          } pedidos. Falló para: ${farmers}`,
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topSection}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerMini}>Compra</Text>
            <Text style={styles.headerTitle}>Información de envío</Text>
            <Text style={styles.headerSubtitle}>
              Rellena los datos para recibir el pedido. Crearemos un pedido por agricultor
              y los podrás seguir desde &quot;Mis pedidos&quot;.
            </Text>
          </View>

          {items.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="basket-outline" size={28} color={colors.primary} />
              <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
              <Text style={styles.emptySubtitle}>
                Vuelve al catálogo y añade productos antes de continuar.
              </Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate("Home")}
              >
                <Text style={styles.primaryButtonText}>Ir al inicio</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* DATOS */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Datos de envío</Text>

                <FormField label="Nombre completo" value={nombre} onChange={setNombre} placeholder="Tu nombre" />
                <FormField label="Dirección" value={direccion} onChange={setDireccion} placeholder="Calle, número, piso" />
                <View style={styles.row}>
                  <View style={styles.flexHalf}>
                    <FormField label="Código postal" value={cp} onChange={setCp} placeholder="46001" keyboardType="number-pad" />
                  </View>
                  <View style={styles.flexHalf}>
                    <FormField label="Ciudad" value={ciudad} onChange={setCiudad} placeholder="Valencia" />
                  </View>
                </View>
                <FormField
                  label="Teléfono"
                  value={telefono}
                  onChange={setTelefono}
                  placeholder="600000000"
                  keyboardType="phone-pad"
                />
                <FormField
                  label="Notas (opcional)"
                  value={notas}
                  onChange={setNotas}
                  placeholder="Indicaciones para el agricultor o el repartidor"
                  multiline
                />
              </View>

              {/* RESUMEN POR AGRICULTOR */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  Resumen ({groups.length === 1 ? "1 pedido" : `${groups.length} pedidos`})
                </Text>
                <Text style={styles.cardSubtitle}>
                  Tu compra se divide en un pedido por agricultor.
                </Text>

                {groups.map((g) => (
                  <View key={g.email} style={styles.groupBlock}>
                    <View style={styles.groupHeader}>
                      <View style={styles.groupBadge}>
                        <Ionicons name="leaf-outline" size={14} color={colors.primary} />
                      </View>
                      <View style={styles.flex}>
                        <Text style={styles.groupSeller}>{g.sellerName}</Text>
                        <Text style={styles.groupEmail}>{g.email}</Text>
                      </View>
                      <Text style={styles.groupSubtotal}>{formatPrice(g.subtotal)}</Text>
                    </View>

                    {g.items.map((it) => (
                      <View key={it.id} style={styles.groupItem}>
                        <Image source={it.image} style={styles.groupItemImage} />
                        <View style={styles.flex}>
                          <Text style={styles.groupItemName} numberOfLines={1}>
                            {it.name}
                          </Text>
                          <Text style={styles.groupItemMeta}>
                            {it.quantity.toFixed(1)} {it.unit} · {formatUnitPrice(it.price, it.unit)}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ))}

                {itemsWithoutFarmer.length > 0 ? (
                  <View style={styles.warningBanner}>
                    <Ionicons name="alert-circle" size={18} color="#B3533D" />
                    <Text style={styles.warningText}>
                      {itemsWithoutFarmer.length} producto(s) no tienen agricultor asignado.
                      Quítalos del carrito antes de continuar.
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* TOTAL */}
              <View style={styles.card}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Subtotal</Text>
                  <Text style={styles.totalValue}>{formatPrice(subtotal)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Envío</Text>
                  <Text style={styles.totalValue}>{formatPrice(shipping)}</Text>
                </View>
                <View style={[styles.totalRow, styles.totalRowFinal]}>
                  <Text style={styles.totalFinalLabel}>Total</Text>
                  <Text style={styles.totalFinalValue}>{formatPrice(total)}</Text>
                </View>

                {errorMessage ? (
                  <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle" size={18} color="#B3533D" />
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    styles.paymentButton,
                    submitting && styles.primaryButtonDisabled,
                  ]}
                  onPress={handleFinalize}
                  disabled={submitting}
                  activeOpacity={0.85}
                >
                  {submitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="card-outline" size={18} color="#fff" />
                      <Text style={styles.primaryButtonText}>Pagar pedido</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </ScreenContainer>
  );
}

function FormField({ label, value, onChange, placeholder, keyboardType, multiline }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textSoft}
        keyboardType={keyboardType}
        multiline={multiline}
        autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7F8F4" },
  flex: { flex: 1 },
  flexHalf: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  topSection: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 30,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backButton: { marginBottom: 16 },
  headerMini: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  headerTitle: { color: "#fff", fontSize: 26, fontWeight: "800", marginBottom: 8 },
  headerSubtitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 360,
  },

  card: {
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: { fontSize: 17, fontWeight: "800", color: colors.text, marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: colors.textSoft, marginBottom: 14 },

  inputGroup: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: "700", color: colors.text, marginBottom: 6 },
  input: {
    backgroundColor: "#F3F5ED",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  inputMultiline: { minHeight: 70, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 10 },

  groupBlock: {
    borderTopWidth: 1,
    borderTopColor: "#ECECEC",
    paddingTop: 12,
    marginTop: 12,
  },
  groupHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  groupBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EEF5E3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  groupSeller: { fontSize: 14, fontWeight: "800", color: colors.text },
  groupEmail: { fontSize: 11, color: colors.textSoft },
  groupSubtotal: { fontSize: 14, fontWeight: "800", color: colors.text },
  groupItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    gap: 10,
  },
  groupItemImage: { width: 36, height: 36, borderRadius: 10, resizeMode: "cover" },
  groupItemName: { fontSize: 13, fontWeight: "700", color: colors.text },
  groupItemMeta: { fontSize: 11, color: colors.textSoft, marginTop: 2 },

  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  totalLabel: { fontSize: 13, color: colors.textSoft },
  totalValue: { fontSize: 13, fontWeight: "700", color: colors.text },
  totalRowFinal: {
    borderTopWidth: 1,
    borderTopColor: "#ECECEC",
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 18,
  },
  totalFinalLabel: { fontSize: 15, fontWeight: "800", color: colors.text },
  totalFinalValue: { fontSize: 18, fontWeight: "800", color: colors.primary },

  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  paymentButton: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  primaryButtonDisabled: { opacity: 0.6 },
  primaryButtonText: { color: "#fff", fontSize: 15, fontWeight: "800" },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBE9E5",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    gap: 8,
  },
  errorText: { flex: 1, color: "#8C2A1A", fontSize: 13, fontWeight: "600" },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBE9E5",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
    gap: 8,
  },
  warningText: { flex: 1, color: "#8C2A1A", fontSize: 12, fontWeight: "600" },

  emptyCard: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 30,
    alignItems: "center",
    gap: 10,
  },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: colors.text, marginTop: 4 },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSoft,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 8,
  },
});
