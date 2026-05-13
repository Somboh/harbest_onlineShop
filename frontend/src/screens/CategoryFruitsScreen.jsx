import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

const CATEGORY = 'Frutas';

export default function CategoryFruitsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await productsService.getProductsByCategory(CATEGORY);
        if (cancelled) return;
        setProducts(hydrateProducts(raw));
      } catch (err) {
        console.error('Error cargando productos de Frutas:', err);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const query = searchText.trim().toLowerCase();
  const filteredProducts = query
    ? products.filter((product) => {
        return [
          product.name,
          product.seller,
          product.category,
          product.badge,
          product.subtitle,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      })
    : products;

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

            <Text style={styles.title}>Frutas</Text>

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
                <Ionicons name="nutrition" size={14} color="#fff" />
                <Text style={styles.heroBadgeText}>Categoría</Text>
              </View>

            <Text style={styles.heroTitle}>
            Frutas frescas{'\n'}de temporada
            </Text>

            <Text style={styles.heroSubtitle}>
            Dulces, naturales y recogidas en su punto óptimo directamente del productor.
            </Text>

              <View style={styles.heroInfoRow}>
                <View style={styles.heroInfoPill}>
                  <Ionicons name="leaf" size={14} color={colors.fruta} />
                  <Text style={styles.heroInfoText}>12 productos</Text>
                </View>

                <View style={styles.heroInfoPill}>
                  <Ionicons name="flash-outline" size={14} color={colors.fruta} />
                  <Text style={styles.heroInfoText}>Entrega rápida</Text>
                </View>
              </View>
            </View>

            <Image
              source={require('../../assets/images/comida/frutas.png')}
              style={styles.heroImage}
            />
          </View>

          {/* FILTROS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersRow}
          >
            <FilterChip text="Todos" active />
            <FilterChip text="Ecológico" icon="leaf-outline" />
            <FilterChip text="Más vendidos" icon="star-outline" />
            <FilterChip text="Temporada" icon="sunny-outline" />
            <FilterChip text="Entrega hoy" icon="time-outline" />
          </ScrollView>

          {/* BLOQUE TITULAR */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Productos destacados</Text>
              <Text style={styles.sectionSubtitle}>Seleccionados para ti</Text>
            </View>

            <TouchableOpacity style={styles.searchButton}>
            <Ionicons
              name={searchOpen ? 'close' : 'search'}
              size={18}
              color={colors.text}
              onPress={() => {
                if (searchOpen) setSearchText('');
                setSearchOpen((current) => !current);
              }}
            />
            </TouchableOpacity>
          </View>

          {searchOpen ? (
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={18} color={colors.textSoft} />
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Buscar frutas..."
                placeholderTextColor={colors.textSoft}
                style={styles.searchInput}
                autoCorrect={false}
                returnKeyType="search"
              />
              {searchText.length > 0 ? (
                <TouchableOpacity onPress={() => setSearchText('')} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color={colors.textSoft} />
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}

          {/* LISTADO EN 2 COLUMNAS */}
          {loading && products.length === 0 ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
          ) : filteredProducts.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={28} color={colors.fruta} />
              <Text style={styles.emptyTitle}>No hay frutas con ese nombre</Text>
              <Text style={styles.emptySubtitle}>
                Prueba con otra búsqueda o limpia el campo.
              </Text>
            </View>
          ) : (
            <View style={styles.productsGrid}>
              {filteredProducts.map((product) => (
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

const FilterChip = ({ text, icon, active }) => (
  <TouchableOpacity
    style={[styles.filterChip, active && styles.filterChipActive]}
    activeOpacity={0.85}
  >
    {icon && (
      <Ionicons
        name={icon}
        size={14}
        color={active ? '#fff' : colors.text}
        style={styles.filterIcon}
      />
    )}
    <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
      {text}
    </Text>
  </TouchableOpacity>
);

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
    backgroundColor: '#f1c7c7',
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
    backgroundColor: colors.fruta,
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
    width: 170,
    height: 170,
    resizeMode: 'contain',
  },

  filtersRow: {
    paddingBottom: 8,
    marginBottom: 14,
  },

  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    marginRight: 10,
  },

  filterChipActive: {
    backgroundColor: colors.primary,
  },

  filterIcon: {
    marginRight: 6,
  },

  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },

  filterChipTextActive: {
    color: '#fff',
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

searchBox: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: colors.fruta,
  paddingHorizontal: 14,
  paddingVertical: 10,
  marginBottom: 16,
},

searchInput: {
  flex: 1,
  marginLeft: 8,
  fontSize: 14,
  color: colors.text,
},

emptyState: {
  backgroundColor: '#fff',
  borderRadius: 22,
  paddingHorizontal: 24,
  paddingVertical: 30,
  alignItems: 'center',
},

emptyTitle: {
  fontSize: 17,
  fontWeight: '800',
  color: colors.text,
  marginTop: 10,
  marginBottom: 6,
  textAlign: 'center',
},

emptySubtitle: {
  fontSize: 13,
  lineHeight: 19,
  color: colors.textSoft,
  textAlign: 'center',
},

floatingButton: {
  position: 'absolute',
  bottom: 20,
  right: 20,
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: colors.fruta,
  justifyContent: 'center',
  alignItems: 'center',

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.2,
  shadowRadius: 10,
  elevation: 8,
}

});
