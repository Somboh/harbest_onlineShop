import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../styles/colors';
import ScreenContainer from '../components/common/ScreenContainer';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { hydrateProducts } from '../data/productAdapter';
import productsService from '../services/productsService';
import { formatUnitPrice } from '../utils/formatPrice';

export default function CategoryAllScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await productsService.getProducts();
        if (cancelled) return;
        setProducts(hydrateProducts(raw));
      } catch (err) {
        console.error('Error cargando productos:', err);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.text}
                style={styles.backIcon}
              />
            </TouchableOpacity>

            <Text style={styles.title}>Todos los productos</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Image
                source={require('../../assets/images/logo-harbest.png')}
                style={styles.logoImage}
              />
            </TouchableOpacity>
          </View>

          {/* HERO DE CATEGORÍA */}
          <View style={styles.heroCard}>
            <View style={styles.heroContent}>
              <View style={styles.heroBadge}>
                <Ionicons name="cube" size={14} color="#fff" />
                <Text style={styles.heroBadgeText}>Categoría</Text>
              </View>

              <Text style={styles.heroTitle}>
                Todo lo que necesitas{'\n'}en un solo lugar
              </Text>

              <Text style={styles.heroSubtitle}>
                Frutas, verduras y especias frescas directamente del productor, sin intermediarios.
              </Text>

              <View style={styles.heroInfoRow}>
                <View style={styles.heroInfoPill}>
                  <Ionicons name="leaf" size={14} color={colors.gris} />
                  <Text style={styles.heroInfoText}>73 productos</Text>
                </View>

                <View style={styles.heroInfoPill}>
                  <Ionicons name="flash-outline" size={14} color={colors.gris} />
                  <Text style={styles.heroInfoText}>Entrega rápida</Text>
                </View>
              </View>
            </View>

            <Image
              source={require('../../assets/images/comida/todo.png')}
              style={styles.heroImage}
            />
          </View>

          {/* BLOQUE TITULAR */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Productos destacados</Text>
              <Text style={styles.sectionSubtitle}>Seleccionados para ti</Text>
            </View>

            <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* LISTADO EN 2 COLUMNAS */}
          {loading && products.length === 0 ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
          ) : (
            <View style={styles.productsGrid}>
              {products.map((product) => (
                <FruitProductCard
                  key={product.id}
                  navigation={navigation}
                  product={product}
                />
              ))}
            </View>
          )}
        </ScrollView>
        {/* BOTÓN FLOTANTE AJUSTES */}
        <TouchableOpacity style={styles.floatingButton}>
            <Ionicons name="options-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const FruitProductCard = ({ navigation, product }) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(product.id);

  return (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
    >
      <View style={styles.imageWrapper}>
        {product.image ? (
          <Image source={product.image} style={styles.productImage} />
        ) : (
          <View style={[styles.productImage, styles.productImagePlaceholder]}>
            <Ionicons name="leaf" size={28} color={colors.primary} />
          </View>
        )}

        {product.badge ? (
          <View style={styles.productOverlayBadge}>
            <Text style={styles.productOverlayBadgeText}>{product.badge}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.favoriteOverlay}
          onPress={() => toggleFavorite(product)}
          activeOpacity={0.85}
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={16}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.productContent}>
        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.productSeller} numberOfLines={1}>
          {product.seller}
        </Text>

        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>
            {formatUnitPrice(product.price, product.unit)}
          </Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              addToCart(product, 1);
              navigation.navigate('Cart');
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F4',
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  backIcon: {
    marginRight: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    color: colors.text,
  },

  logoImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },

  heroCard: {
    backgroundColor: '#dddddd',
    borderRadius: 30,
    padding: 20,
    marginBottom: 18,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 220,
    justifyContent: 'space-between',
  },

  heroContent: {
    width: '62%',
    zIndex: 2,
  },

  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.gris,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  heroBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 5,
  },

  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2B2B2B',
    lineHeight: 34,
    marginBottom: 10,
  },

  heroSubtitle: {
    fontSize: 14,
    color: '#5F5F5F',
    lineHeight: 20,
    marginBottom: 16,
  },

  heroInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  heroInfoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginRight: 8,
    marginBottom: 8,
  },

  heroInfoText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },

  heroImage: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 190,
    height: 190,
    resizeMode: 'contain',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },

  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSoft,
    marginTop: 2,
  },

  sortButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  imageWrapper: {
    position: 'relative',
  },

  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },

  productOverlayBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  productOverlayBadgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },

  productImagePlaceholder: {
    backgroundColor: '#EEF5E3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  favoriteOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  productContent: {
    padding: 12,
  },

  productName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },

  productSeller: {
    fontSize: 12,
    color: colors.textSoft,
    marginBottom: 12,
  },

  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  productPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    flex: 1,
    marginRight: 8,
  },

  addButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchButton: {
  width: 42,
  height: 42,
  borderRadius: 14,
  borderColor: colors.primary,
  borderWidth: 1,
  backgroundColor: '#fff',
  justifyContent: 'center',
  alignItems: 'center',
},

floatingButton: {
  position: 'absolute',
  bottom: 20,
  right: 20,
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: colors.gris,
  justifyContent: 'center',
  alignItems: 'center',

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.2,
  shadowRadius: 10,
  elevation: 8,
}

});
