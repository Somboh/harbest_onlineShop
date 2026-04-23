import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../styles/colors';
import ScreenContainer from '../components/common/ScreenContainer';

export default function CategoryAllScreen({ navigation }) {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
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
            <Ionicons name="search" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* LISTADO EN 2 COLUMNAS */}
          <View style={styles.productsGrid}>
            
          <FruitProductCard
            navigation={navigation}
            name="Pimentón"
            seller="La Vera"
            price="6,40€/kg"
            badge="Tradicional"
            image={require('../../assets/images/comida/pimenton.jpg')}
          />

          <FruitProductCard
            navigation={navigation}
            name="Naranjas"
            seller="Granjas Jaume"
            price="1,70€/kg"
            badge="Ecológico"
            image={require('../../assets/images/comida/naranjas.webp')}
          />

          <FruitProductCard
            navigation={navigation}
            name="Aguacates"
            seller="Illo verdulerías"
            price="3,20€/kg"
            badge="Popular"
            image={require('../../assets/images/comida/aguacate.webp')}
          />

          <FruitProductCard
            navigation={navigation}
            name="Lechuga"
            seller="EcoFruit"
            price="1,50€/kg"
            badge="Natural"
            image={require('../../assets/images/comida/lechuga.webp')}
          />

          <FruitProductCard
            navigation={navigation}
            name="Zanahorias"
            seller="Huerta Viva"
            price="1,90€/kg"
            badge="Fresco"
            image={require('../../assets/images/comida/zanahorias.jpg')}
          />

          <FruitProductCard
            navigation={navigation}
            name="Canela"
            seller="Origen Natural"
            price="4,20€/kg"
            badge="Aromático"
            image={require('../../assets/images/comida/canela.webp')}
          />
          </View>
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

const FruitProductCard = ({ navigation, name, seller, price, badge, image }) => (
  <TouchableOpacity
    style={styles.productCard}
    activeOpacity={0.9}
    onPress={() => navigation.navigate('ProductDetail')}
  >
    <View style={styles.imageWrapper}>
      <Image source={image} style={styles.productImage} />

      <View style={styles.productOverlayBadge}>
        <Text style={styles.productOverlayBadgeText}>{badge}</Text>
      </View>
    </View>

    <View style={styles.productContent}>
      <Text style={styles.productName} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.productSeller} numberOfLines={1}>
        {seller}
      </Text>

      <View style={styles.productFooter}>
        <Text style={styles.productPrice}>{price}</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ProductDetail')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

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