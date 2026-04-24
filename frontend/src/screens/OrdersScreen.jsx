import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../styles/colors';
import ScreenContainer from '../components/common/ScreenContainer';

export default function OrdersScreen({ navigation }) {
  const orders = [
    {
      id: '0000000000',
      user: 'Pepe',
      date: '12 · 02 · 2026',
      status: 'Pendiente',
    },
    {
      id: '0000000000',
      user: 'Pepe',
      date: '12 · 02 · 2026',
      status: 'Entregado',
    },
    {
      id: '0000000000',
      user: 'Pepe',
      date: '12 · 02 · 2026',
      status: 'Pendiente',
    },
  ];

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.topSection}>
            <View style={styles.topRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Image
                  source={require('../../assets/images/logo-harbest.png')}
                  style={styles.headerLogo}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.headerTextBlock}>
              <Text style={styles.headerMiniText}>Historial de compras</Text>
              <Text style={styles.headerTitle}>Mis pedidos</Text>
              <Text style={styles.headerSubtitle}>
                Consulta el estado actual de tus pedidos de forma rápida.
              </Text>
            </View>

            <View style={styles.decorLeafOne} />
            <View style={styles.decorLeafTwo} />
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Tus pedidos</Text>
              <Text style={styles.sectionSubtitle}>
                Seguimiento del proceso de entrega
              </Text>
            </View>
          </View>

          {orders.map((order, index) => (
            <OrderCard key={index} order={order} />
          ))}
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search-outline" size={20} color="#8A8A8A" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
            <Ionicons name="heart-outline" size={20} color="#8A8A8A" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Ionicons name="cart-outline" size={20} color="#8A8A8A" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ProfileUser')}>
            <Ionicons name="person-outline" size={20} color="#8A8A8A" />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}

const OrderCard = ({ order }) => {
  const isDelivered = order.status === 'Entregado';

  return (
    <TouchableOpacity
      style={[
        styles.orderCard,
        isDelivered ? styles.orderCardDelivered : styles.orderCardPending,
      ]}
      activeOpacity={0.9}
    >
      <View style={styles.orderTop}>
        <View style={styles.boxIconWrap}>
          <Ionicons
            name="cube-outline"
            size={54}
            color={isDelivered ? '#B8D88B' : '#E4D78D'}
          />
        </View>

        <View style={styles.orderInfo}>
          <Text
            style={[
              styles.orderStatus,
              isDelivered ? styles.orderStatusDelivered : styles.orderStatusPending,
            ]}
          >
            {order.status.toUpperCase()}
          </Text>

          <Text style={styles.orderTitle}>Pedido #{order.id}</Text>
          <Text style={styles.orderText}>Para: {order.user}</Text>
          <Text style={styles.orderText}>Fecha: {order.date}</Text>
        </View>

        <TouchableOpacity style={styles.arrowButton} activeOpacity={0.8}>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={isDelivered ? '#8EBE71' : '#C77A72'}
          />
        </TouchableOpacity>
      </View>

      {!isDelivered ? (
        <View style={styles.progressWrap}>
          <View style={styles.progressStartCircle}>
            <View style={styles.progressStartInner} />
          </View>

          <View style={styles.progressLine} />

          <View style={styles.progressCenterIcon}>
            <Ionicons
              name="car-sport-outline"
              size={34}
              color="#8A8A8A"
            />
          </View>

          <View style={styles.progressLineDashed} />

          <View style={styles.progressEndDot} />
        </View>
      ) : (
        <View style={styles.progressWrapDelivered}>
          <View style={styles.progressStartCircle}>
            <View style={styles.progressStartInner} />
          </View>

          <View style={styles.progressLineDelivered} />

          <View style={styles.progressDeliveredCheck}>
            <Ionicons
              name="checkmark"
              size={20}
              color="#7DB56A"
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F4',
  },

  scrollContent: {
    paddingBottom: 120,
  },

  topSection: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 34,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 18,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
  },

  headerLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },

  headerTextBlock: {
    paddingRight: 30,
  },

  headerMiniText: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 10,
  },

  headerSubtitle: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 290,
  },

  decorLeafOne: {
    position: 'absolute',
    right: 24,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: [{ rotate: '28deg' }],
  },

  decorLeafTwo: {
    position: 'absolute',
    right: 60,
    bottom: 46,
    width: 28,
    height: 28,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.10)',
    transform: [{ rotate: '-20deg' }],
  },

  sectionHeader: {
    marginHorizontal: 20,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },

  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSoft,
    marginTop: 2,
  },

  orderCard: {
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
  },

  orderCardPending: {
    backgroundColor: '#F1EFCF',
  },

  orderCardDelivered: {
    backgroundColor: '#E4F0CF',
  },

  orderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  boxIconWrap: {
    width: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },

  boxPending: {},

  boxDelivered: {},

  orderInfo: {
    flex: 1,
    justifyContent: 'center',
  },

  orderStatus: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
    alignSelf: 'flex-end',
  },

  orderStatusPending: {
    color: '#C77A72',
  },

  orderStatusDelivered: {
    color: '#7DB56A',
  },

  orderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#7E7E7E',
    marginBottom: 6,
  },

  orderText: {
    fontSize: 13,
    color: '#8A8A8A',
    marginBottom: 2,
    fontWeight: '500',
  },

  arrowButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },

  progressEndDotDelivered: {
    backgroundColor: '#8A8A8A',
  },

  bottomBar: {
    position: 'absolute',
    bottom: 18,
    left: 32,
    right: 32,
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
  },

  progressWrap: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 8,
},

progressWrapDelivered: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 8,
},

progressStartCircle: {
  width: 26,
  height: 26,
  borderRadius: 13,
  borderWidth: 3,
  borderColor: '#8A8A8A',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'transparent',
},

progressStartInner: {
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: '#8A8A8A',
},

progressLine: {
  flex: 1,
  height: 2,
  backgroundColor: '#9A9A9A',
},

progressCenterIcon: {
  marginHorizontal: 8,
  justifyContent: 'center',
  alignItems: 'center',
},

progressLineDashed: {
  flex: 1,
  height: 1,
  borderStyle: 'dashed',
  borderWidth: 1,
  borderColor: '#B6B6B6',
  borderRadius: 1,
},

progressEndDot: {
  width: 16,
  height: 16,
  borderRadius: 8,
  backgroundColor: '#8A8A8A',
  marginLeft: 8,
},

progressLineDelivered: {
  flex: 1,
  height: 2,
  backgroundColor: '#9A9A9A',
  marginLeft: 8,
  marginRight: 10,
},

progressDeliveredCheck: {
  width: 34,
  height: 34,
  borderRadius: 17,
  borderWidth: 3,
  borderColor: '#8A8A8A',
  backgroundColor: 'transparent',
  justifyContent: 'center',
  alignItems: 'center',
}

});
