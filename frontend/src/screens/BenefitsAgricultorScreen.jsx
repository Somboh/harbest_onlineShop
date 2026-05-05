import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import FarmerTabBar from "../components/common/FarmerTabBar";
import ScreenContainer from "../components/common/ScreenContainer";
import { useAuth } from "../context/AuthContext";
import ordersService from "../services/ordersService";
import { ROLE_THEMES } from "../styles/roleThemes";
import { formatPrice } from "../utils/formatPrice";

const theme = ROLE_THEMES.farmer;

const MONTHS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export default function BenefitsAgricultorScreen({ navigation }) {
  const { user } = useAuth();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      let cancelled = false;
      const email = user?.email;
      if (!email) {
        setRows([]);
        setLoading(false);
        return undefined;
      }
      setLoading(true);
      (async () => {
        try {
          const raw = await ordersService.getMonthlyEarnings(email);
          if (!cancelled) setRows(Array.isArray(raw) ? raw : []);
        } catch (err) {
          //Si el endpoint falla (p.ej. la tabla aún no existe) caemos al
          //estado vacío sin molestar al agricultor con un banner de error.
          console.error("Error cargando beneficios:", err);
          if (!cancelled) setRows([]);
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [user?.email]),
  );

  const now = useMemo(() => new Date(), []);
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth() + 1;

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      if (a.anio !== b.anio) return b.anio - a.anio;
      return b.mes - a.mes;
    });
  }, [rows]);

  const currentMonthRow = useMemo(() => {
    return sortedRows.find(
      (r) => r.anio === currentYear && r.mes === currentMonth,
    );
  }, [sortedRows, currentYear, currentMonth]);

  const totalAcumulado = useMemo(() => {
    return sortedRows.reduce((s, r) => s + Number(r.total ?? 0), 0);
  }, [sortedRows]);

  const monthLabel = (anio, mes) => `${MONTHS_ES[mes - 1] ?? mes} ${anio}`;

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.iconButton}
              activeOpacity={0.85}
            >
              <Ionicons name="arrow-back" size={20} color={theme.text} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("HomeAgricultor")}
              activeOpacity={0.85}
            >
              <Image source={theme.logo} style={styles.headerLogo} />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Mis beneficios</Text>
          <Text style={styles.subtitle}>
            Lo que llevas ganado este mes y el histórico mes a mes.
          </Text>

          {/* BOX MES ACTUAL */}
          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <MaterialCommunityIcons
                name="cash-multiple"
                size={26}
                color={theme.primary}
              />
            </View>
            <Text style={styles.heroLabel}>
              {monthLabel(currentYear, currentMonth)}
            </Text>
            {loading ? (
              <ActivityIndicator color={theme.primary} />
            ) : (
              <Text style={styles.heroValue}>
                {formatPrice(Number(currentMonthRow?.total ?? 0))}
              </Text>
            )}
            <Text style={styles.heroFootnote}>
              {currentMonthRow?.pedidos ?? 0} pedidos entregados este mes
            </Text>
          </View>

          {/* HISTÓRICO MENSUAL */}
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Histórico mensual</Text>
            {!loading && sortedRows.length > 0 ? (
              <Text style={styles.historyTotal}>
                Total: {formatPrice(totalAcumulado)}
              </Text>
            ) : null}
          </View>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={theme.primary} />
            </View>
          ) : sortedRows.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons
                name="bar-chart-outline"
                size={28}
                color={theme.textSoft}
              />
              <Text style={styles.emptyTitle}>Sin beneficios todavía</Text>
              <Text style={styles.emptySubtitle}>
                Cuando un pedido se marque como entregado, aparecerá aquí.
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {sortedRows.map((row) => {
                const isCurrent =
                  row.anio === currentYear && row.mes === currentMonth;
                return (
                  <View
                    key={`${row.anio}-${row.mes}`}
                    style={[
                      styles.row,
                      isCurrent && styles.rowCurrent,
                    ]}
                  >
                    <View style={styles.rowLeft}>
                      <View
                        style={[
                          styles.rowIcon,
                          isCurrent && styles.rowIconCurrent,
                        ]}
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={16}
                          color={isCurrent ? "#fff" : theme.primary}
                        />
                      </View>
                      <View>
                        <Text style={styles.rowMonth}>
                          {monthLabel(row.anio, row.mes)}
                        </Text>
                        <Text style={styles.rowMeta}>
                          {row.pedidos}{" "}
                          {Number(row.pedidos) === 1
                            ? "pedido"
                            : "pedidos"}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.rowAmount}>
                      {formatPrice(Number(row.total ?? 0))}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        <FarmerTabBar Navigation={navigation} ActiveRoute="ProfileAgricultor" />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 130,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerLogo: {
    width: 36,
    height: 36,
    resizeMode: "contain",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: theme.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: theme.textSoft,
    marginBottom: 18,
  },
  heroCard: {
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 22,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#F1D3C5",
    marginBottom: 18,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: theme.primarySoft,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.textSoft,
    marginBottom: 6,
    textTransform: "capitalize",
  },
  heroValue: {
    fontSize: 32,
    fontWeight: "800",
    color: theme.primary,
    marginBottom: 6,
  },
  heroFootnote: {
    fontSize: 12,
    color: theme.textSoft,
    fontWeight: "600",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 10,
  },
  historyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: theme.text,
  },
  historyTotal: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.textSoft,
  },
  list: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.card,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#F1D3C5",
  },
  rowCurrent: {
    borderColor: theme.primary,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: theme.primarySoft,
    justifyContent: "center",
    alignItems: "center",
  },
  rowIconCurrent: {
    backgroundColor: theme.primary,
  },
  rowMonth: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.text,
  },
  rowMeta: {
    fontSize: 12,
    color: theme.textSoft,
    fontWeight: "600",
    marginTop: 2,
  },
  rowAmount: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.primary,
  },
  loadingBox: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyCard: {
    backgroundColor: theme.card,
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1D3C5",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.text,
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    color: theme.textSoft,
    textAlign: "center",
    marginTop: 4,
  },
});
