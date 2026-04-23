import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenContainer from '../components/common/ScreenContainer';
import { ROLE_THEMES } from '../styles/roleThemes';

export default function OrdersScreenAgricultor({ navigation }) {
  const orders = [
    {
      id: '#HB-2401',
      client: 'EcoMarket Alicante',
      date: '25 Mar 2026',
      total: '84,90 €',
      status: 'Pendiente',
      items: 6,
    },
    {
      id: '#HB-2402',
      client: 'Laura Gómez',
      date: '24 Mar 2026',
      total: '42,50 €',
      status: 'En preparación',
      items: 4,
    },
    {
      id: '#HB-2403',
      client: 'Restaurante La Huerta',
      date: '23 Mar 2026',
      total: '126,20 €',
      status: 'Enviado',
      items: 9,
    },
    {
      id: '#HB-2404',
      client: 'Carlos Pérez',
      date: '22 Mar 2026',
      total: '31,00 €',
      status: 'Entregado',
      items: 3,
    },
  ];

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate("HomeAgricultor")}
                activeOpacity={0.85}
              >
                <Ionicons name="arrow-back" size={20} color={theme.textDark} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.profileShortcut}
                onPress={() => navigation.navigate('ProfileScreenAgricultor')}
                activeOpacity={0.85}
              >
                <Ionicons name="person-outline" size={19} color={theme.textDark} />
              </TouchableOpacity>
            </View>

            <Text style={styles.headerTitle}>Pedidos recibidos</Text>
            <Text style={styles.headerSubtitle}>
              Supervisa los pedidos de tus clientes, su estado y la gestión diaria
              de tu producción.
            </Text>
          </View>

          {/* RESUMEN */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="clipboard-list-outline"
                size={20}
                color={theme.primaryDark}
              />
              <Text style={styles.statNumber}>18</Text>
              <Text style={styles.statLabel}>Activos</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="truck-delivery-outline"
                size={20}
                color={theme.primaryDark}
              />
              <Text style={styles.statNumber}>6</Text>
              <Text style={styles.statLabel}>En reparto</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={20}
                color={theme.primaryDark}
              />
              <Text style={styles.statNumber}>42</Text>
              <Text style={styles.statLabel}>Completados</Text>
            </View>
          </View>

          {/* FILTROS */}
          <View style={styles.filterRow}>
            <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
              <Text style={[styles.filterText, styles.filterTextActive]}>Todos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>Pendientes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>En preparación</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>Enviados</Text>
            </TouchableOpacity>
          </View>

          {/* LISTADO */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Últimos pedidos</Text>

            {orders.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                activeOpacity={0.88}
              >
                <View style={styles.orderTopRow}>
                  <View>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <Text style={styles.clientName}>{order.client}</Text>
                  </View>

                  <View style={[styles.statusBadge, getStatusBadgeStyle(order.status)]}>
                    <Text style={[styles.statusText, getStatusTextStyle(order.status)]}>
                      {order.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderInfoRow}>
                  <View style={styles.infoItem}>
                    <Ionicons name="calendar-outline" size={15} color={theme.textSoft} />
                    <Text style={styles.infoText}>{order.date}</Text>
                  </View>

                  <View style={styles.infoItem}>
                    <MaterialCommunityIcons
                      name="basket-outline"
                      size={15}
                      color={theme.textSoft}
                    />
                    <Text style={styles.infoText}>{order.items} productos</Text>
                  </View>
                </View>

                <View style={styles.orderBottomRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>{order.total}</Text>
                </View>

                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.85}>
                    <Text style={styles.secondaryButtonText}>Ver detalle</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
                    <Text style={styles.primaryButtonText}>Gestionar pedido</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* BOTTOM BAR */}
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search-outline" size={20} color="#7B7B7B" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
            <Ionicons name="heart-outline" size={20} color="#7B7B7B" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.activeButton}>
            <Ionicons name="receipt-outline" size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ProfileAgricultor')}>
            <Ionicons name="person-outline" size={20} color="#7B7B7B" />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}

const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'Pendiente':
      return { backgroundColor: '#F6EDDA' };
    case 'En preparación':
      return { backgroundColor: '#E9F2E3' };
    case 'Enviado':
      return { backgroundColor: '#E5EEF8' };
    case 'Entregado':
      return { backgroundColor: '#E7F3E8' };
    default:
      return { backgroundColor: '#F1F1F1' };
  }
};

const getStatusTextStyle = (status) => {
  switch (status) {
    case 'Pendiente':
      return { color: '#A06A2C' };
    case 'En preparación':
      return { color: '#58753A' };
    case 'Enviado':
      return { color: '#456B93' };
    case 'Entregado':
      return { color: '#3E7A4A' };
    default:
      return { color: '#666' };
  }
};

const theme = {
  bg: ROLE_THEMES.farmer.background,
  card: '#FFFFFF',
  primary: ROLE_THEMES.farmer.primary,
  primaryDark: ROLE_THEMES.farmer.primaryDark,
  primarySoft: ROLE_THEMES.farmer.primarySoft,
  border: '#E5DED0',
  textDark: '#3D3A34',
  textSoft: '#7C766D',
  highlight: '#F4F0E4',
  secondary: ROLE_THEMES.farmer.primary,
  secondarySoft: '#F0A181',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 120,
  },

  header: {
    marginBottom: 18,
  },

  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },

  profileShortcut: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.textDark,
    marginBottom: 8,
  },

  headerSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.textSoft,
    maxWidth: 320,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 10,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },

  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.textDark,
    marginTop: 8,
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSoft,
    textAlign: 'center',
  },

  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
  },

  filterChip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },

  filterChipActive: {
    backgroundColor: theme.highlight,
    borderColor: '#E4D9BC',
  },

  filterText: {
    color: theme.textSoft,
    fontSize: 13,
    fontWeight: '600',
  },

  filterTextActive: {
    color: '#8D5B2D',
    fontWeight: '700',
  },

  section: {
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: theme.textDark,
    marginBottom: 12,
  },

  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 16,
    marginBottom: 14,
  },

  orderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  orderId: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.textDark,
    marginBottom: 4,
  },

  clientName: {
    fontSize: 14,
    color: theme.textSoft,
    fontWeight: '600',
    maxWidth: 180,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    flexWrap: 'wrap',
    gap: 10,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoText: {
    marginLeft: 6,
    color: theme.textSoft,
    fontSize: 13,
    fontWeight: '500',
  },

  orderBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
    marginBottom: 14,
  },

  totalLabel: {
    fontSize: 13,
    color: theme.textSoft,
    fontWeight: '600',
  },

  totalValue: {
    fontSize: 19,
    color: theme.textDark,
    fontWeight: '800',
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },

  secondaryButton: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FAFAF8',
  },

  secondaryButtonText: {
    color: theme.textDark,
    fontSize: 13,
    fontWeight: '700',
  },

  primaryButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: theme.secondary,
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },

  bottomBar: {
    position: 'absolute',
    bottom: 18,
    left: 24,
    right: 24,
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },

  activeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.secondary,
  },
});
