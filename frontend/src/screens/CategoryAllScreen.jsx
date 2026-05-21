import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ScreenContainer from '../components/common/ScreenContainer';
import { useCart } from '../context/CartContext';
import { useDisplaySettings } from '../context/DisplaySettingsContext';
import { useFavorites } from '../context/FavoritesContext';
import { hydrateProducts } from '../data/productAdapter';
import productsService from '../services/productsService';
import colors from '../styles/colors';
import { getDisplayMode } from '../styles/displayModes';
import { ROLE_THEMES } from '../styles/roleThemes';
import { formatUnitPrice } from '../utils/formatPrice';

export default function CategoryAllScreen({ navigation }) {
  const { settings } = useDisplaySettings();
  const display = getDisplayMode(settings, ROLE_THEMES.user);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLength, setProductsLength] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productsSorted, setProductsSorted] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await productsService.getProducts();
        if (cancelled) return;
        setProducts(hydrateProducts(raw).reverse());
        setProductsLength(raw.length);
        setProductsSorted(hydrateProducts(raw).reverse());
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

  const showFilters = () =>{
    setIsModalVisible(true);
  }
  const closeFilters = () =>{
    setIsModalVisible(false);
  }

  const handleSort = (type)=>{
    if(type === 'price_asc'){
      productsSorted.sort((a,b) => a.price - b.price);
    }
    else if(type === 'price_desc'){
      productsSorted.sort((a,b) => b.price - a.price);
    }
    else if(type === 'name_asc'){
      productsSorted.sort((a,b) => a.name.localeCompare(b.name));
    }
    else if(type === 'default'){
      setProductsSorted(products);
    }
    closeFilters();
  }
  return (
    <ScreenContainer>
      <View style={[styles.container, { backgroundColor: display.background }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={display.text}
                style={styles.backIcon}
              />
            </TouchableOpacity>

            <Text style={[styles.title, { color: display.text }]}>Todos los productos</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Image
                source={require('../../assets/images/logo-harbest.png')}
                style={styles.logoImage}
              />
            </TouchableOpacity>
          </View>

          {/* HERO DE CATEGORÍA */}
          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: settings.highContrast ? display.surface : '#dddddd',
                borderColor: display.border,
              },
            ]}
          >
            <View style={styles.heroContent}>
              <View style={[styles.heroBadge, { backgroundColor: display.primary }]}>
                <Ionicons name="cube" size={14} color={settings.highContrast ? '#000' : '#fff'} />
                <Text style={[styles.heroBadgeText, { color: settings.highContrast ? '#000' : '#fff' }]}>Categoría</Text>
              </View>

              <Text style={[styles.heroTitle, { color: display.text }]}>
                Todo lo que necesitas{'\n'}en un solo lugar
              </Text>

              <Text style={[styles.heroSubtitle, { color: display.textSoft }]}>
                Frutas, verduras y especias frescas directamente del productor, sin intermediarios.
              </Text>

              <View style={styles.heroInfoRow}>
                <View style={[styles.heroInfoPill, { backgroundColor: display.surfaceAlt, borderColor: display.border }]}>
                  <Ionicons name="leaf" size={14} color={display.primary} />
                  <Text style={[styles.heroInfoText, { color: display.text }]}>{productsLength} productos</Text>
                </View>

                <View style={[styles.heroInfoPill, { backgroundColor: display.surfaceAlt, borderColor: display.border }]}>
                  <Ionicons name="flash-outline" size={14} color={display.primary} />
                  <Text style={[styles.heroInfoText, { color: display.text }]}>Entrega rápida</Text>
                </View>
              </View>
            </View>

            <Image
              source={require('../../assets/images/comida/todo.png')}
              style={styles.heroImage}
            />
          </View>

          {/* FILTROS
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
          </ScrollView> */}

          {/* BLOQUE TITULAR */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: display.text }]}>Productos destacados</Text>
              <Text style={[styles.sectionSubtitle, { color: display.textSoft }]}>Seleccionados para ti</Text>
            </View>

            <TouchableOpacity style={[styles.searchButton, { backgroundColor: display.surface, borderColor: display.border }]}>
            <Ionicons name="search" size={18} color={display.text} />
            </TouchableOpacity>
          </View>

          {/* LISTADO EN 2 COLUMNAS */}
          {loading && products.length === 0 ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
          ) : (
            <View style={styles.productsGrid}>
              {productsSorted.map((product) => (
                <FruitProductCard
                  key={product.id}
                  navigation={navigation}
                  product={product}
                  display={display}
                  highContrast={settings.highContrast}
                />
              ))}
            </View>
          )}
        </ScrollView>
        {/* BOTÓN FLOTANTE AJUSTES */}
        <TouchableOpacity style={[styles.floatingButton, { backgroundColor: display.primary }]} onPress={showFilters}>
            <Ionicons name="options-outline" size={22} color={settings.highContrast ? '#000' : '#fff'} />
        </TouchableOpacity>
      </View>

      {/* MODAL DE FILTROS */}
      <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeFilters} // Maneja el botón de retroceso en Android
        >
          {/* Pressable de fondo para cerrar al tocar fuera */}
          <Pressable style={styles.modalOverlay} onPress={closeFilters}>
            
            {/* Contenedor principal del Modal */}
            <Pressable style={[styles.modalContent, { backgroundColor: display.surface, borderColor: display.border }]} onPress={(e) => e.stopPropagation()}>
              <View style={[styles.modalHandle, { backgroundColor: display.border }]} />
              
              <Text style={[styles.modalTitle, { color: display.text }]}>Ordenar productos</Text>

              {/* Opciones de ordenación */}
              <TouchableOpacity style={[styles.sortOption, { borderBottomColor: display.border }]} onPress={() => handleSort('price_asc')}>
                <Ionicons name="arrow-up" size={20} color={display.text} />
                <Text style={[styles.sortOptionText, { color: display.text }]}>Precio: de menor a mayor</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.sortOption, { borderBottomColor: display.border }]} onPress={() => handleSort('price_desc')}>
                <Ionicons name="arrow-down" size={20} color={display.text} />
                <Text style={[styles.sortOptionText, { color: display.text }]}>Precio: de mayor a menor</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.sortOption, { borderBottomColor: display.border }]} onPress={() => handleSort('name_asc')}>
                <Ionicons name="text" size={20} color={display.text} />
                <Text style={[styles.sortOptionText, { color: display.text }]}>Nombre: A - Z</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.closeModalBtn, { backgroundColor: display.primary }]} onPress={() => handleSort('default')}>
                <Text style={[styles.closeModalBtnText, { color: settings.highContrast ? '#000' : '#fff' }]}>Reiniciar Filtros</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.closeModalBtn, { backgroundColor: display.primary }]} onPress={closeFilters}>
                <Text style={[styles.closeModalBtnText, { color: settings.highContrast ? '#000' : '#fff' }]}>Cerrar</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
    </ScreenContainer>
  );
}

const FruitProductCard = ({ navigation, product, display, highContrast }) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(product.id);

  return (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: display.surface, borderColor: display.border, shadowColor: display.shadow }]}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
    >
      <View style={styles.imageWrapper}>
        {product.image ? (
          <Image source={product.image} style={styles.productImage} />
        ) : (
          <View style={[styles.productImage, styles.productImagePlaceholder, { backgroundColor: display.primarySoft }]}>
            <Ionicons name="leaf" size={28} color={display.primary} />
          </View>
        )}

        {product.badge ? (
          <View style={[styles.productOverlayBadge, { backgroundColor: display.surface }]}>
            <Text style={[styles.productOverlayBadgeText, { color: display.primary }]}>{product.badge}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.favoriteOverlay, { backgroundColor: display.surface }]}
          onPress={() => toggleFavorite(product)}
          activeOpacity={0.85}
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={16}
            color={display.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.productContent}>
        <Text style={[styles.productName, { color: display.text }]} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={[styles.productSeller, { color: display.textSoft }]} numberOfLines={1}>
          {product.seller}
        </Text>

        <View style={styles.productFooter}>
          <Text style={[styles.productPrice, { color: display.primary }]}>
            {formatUnitPrice(product.price, product.unit)}
          </Text>

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: display.primary }]}
            onPress={() => {
              addToCart(product, 1);
              navigation.navigate('Cart');
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={16} color={highContrast ? '#000' : '#fff'} />
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
    borderWidth: 1,
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
    borderWidth: 1,
    borderColor: 'transparent',
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
    borderWidth: 1,
    borderColor: 'transparent',
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
},

// --- ESTILOS DEL MODAL ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end', // Empuja el contenido hacia abajo
  },

  modalContent: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    minHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },

  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },

  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  sortOptionText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    fontWeight: '500',
  },

  closeModalBtn: {
    marginTop: 30,
    backgroundColor: colors.gris,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },

  closeModalBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
