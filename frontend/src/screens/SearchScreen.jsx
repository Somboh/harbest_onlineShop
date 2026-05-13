import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../styles/colors';
import ClientTabBar from '../components/common/ClientTabBar';
import DisplayModeMenu from '../components/common/DisplayModeMenu';
import ScreenContainer from '../components/common/ScreenContainer';

export default function SearchScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const recentSearches = ['naranjas', 'aguacates', 'canela', 'verduras frescas'];

  const quickCategories = [
    { label: 'Todos', icon: 'grid-outline', color: '#E9EFE0' },
    { label: 'Frutas', icon: 'nutrition-outline', color: '#E9EFE0' },
    { label: 'Verduras', icon: 'leaf-outline', color: '#E9EFE0' },
    { label: 'Especias', icon: 'flame-outline', color: '#E9EFE0' },
  ];

  const products = useMemo(() => [
    {
      id: 1,
      name: 'Naranjas Valencianas',
      seller: 'Granjas Jaume',
      price: '4,90 €/kg',
      category: 'Frutas',
      image: require('../../assets/images/comida/naranjas.jpg'),
    },
    {
      id: 2,
      name: 'Aguacates de Granada',
      seller: 'Illo verdulerías',
      price: '6,20 €/kg',
      category: 'Frutas',
      image: require('../../assets/images/comida/aguacate.jpg'),
    },
    {
      id: 3,
      name: 'Pimentón de la Vera',
      seller: 'Antonio & Co',
      price: '3,80 €',
      category: 'Especias',
      image: require('../../assets/images/comida/pimenton.jpg'),
    },
    {
      id: 4,
      name: 'Brócoli fresco',
      seller: 'Verde Vivo',
      price: '2,95 €/kg',
      category: 'Verduras',
      image: require('../../assets/images/comida/brocoli.jpg'),
    },
    {
      id: 5,
      name: 'Canela molida',
      seller: 'Esencias del Sur',
      price: '2,50 €',
      category: 'Especias',
      image: require('../../assets/images/comida/canela.jpg'),
    },
    {
      id: 6,
      name: 'Fresas de temporada',
      seller: 'Huerta del Sur',
      price: '5,10 €/kg',
      category: 'Frutas',
      image: require('../../assets/images/comida/fresas.jpg'),
    },
  ], []);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        activeCategory === 'Todos' || item.category === activeCategory;

      const matchesSearch =
        searchText.trim() === '' ||
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.seller.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category.toLowerCase().includes(searchText.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, searchText, activeCategory]);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HEADER MÁS COMPACTO */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.headerTextBlock}>
              <Text style={styles.headerMini}>Explorar catálogo</Text>
              <Text style={styles.headerTitle}>Buscar</Text>
            </View>

            <View style={styles.headerActions}>
              <DisplayModeMenu role="user" trigger="logo" />
            </View>
          </View>

          {/* BLOQUE PRINCIPAL DE BÚSQUEDA */}
          <View style={styles.searchHero}>
            <Text style={styles.searchHeroTitle}>
              Encuentra lo que necesitas
            </Text>
            <Text style={styles.searchHeroSubtitle}>
              Busca productos frescos, agricultores y categorías de forma rápida.
            </Text>

            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={18}
                color={colors.textSoft}
                style={styles.searchIcon}
              />
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Buscar en Harbest..."
                placeholderTextColor={colors.textSoft}
                style={styles.searchInput}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={colors.textSoft}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* BÚSQUEDAS RECIENTES */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Búsquedas recientes</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentRow}
          >
            {recentSearches.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.recentChip}
                onPress={() => setSearchText(item)}
                activeOpacity={0.85}
              >
                <Ionicons name="time-outline" size={14} color={colors.primary} />
                <Text style={styles.recentChipText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* CATEGORÍAS RÁPIDAS */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explorar por categoría</Text>
          </View>

          <View style={styles.categoriesGrid}>
            {quickCategories.map((item) => {
              const isActive = activeCategory === item.label;

              return (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.categoryBox,
                    { backgroundColor: item.color },
                    isActive && styles.categoryBoxActive,
                  ]}
                  onPress={() => setActiveCategory(item.label)}
                  activeOpacity={0.88}
                >
                  <View
                    style={[
                      styles.categoryIconWrap,
                      isActive && styles.categoryIconWrapActive,
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={18}
                      color={isActive ? '#fff' : colors.text}
                    />
                  </View>

                  <Text
                    style={[
                      styles.categoryLabel,
                      isActive && styles.categoryLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* RESULTADOS */}
          <View style={styles.resultsHeader}>
            <View>
              <Text style={styles.sectionTitle}>Resultados</Text>
              <Text style={styles.sectionSubtitle}>
                {filteredProducts.length} productos disponibles
              </Text>
            </View>
          </View>

          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <SearchCard key={item.id} item={item} navigation={navigation} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={28} color={colors.primary} />
              <Text style={styles.emptyTitle}>No hay coincidencias</Text>
              <Text style={styles.emptySubtitle}>
                Cambia el texto de búsqueda o selecciona otra categoría.
              </Text>
            </View>
          )}
        </ScrollView>

        <ClientTabBar Navigation={navigation} ActiveRoute="Home" />
      </View>
    </ScreenContainer>
  );
}

const SearchCard = ({ item, navigation }) => (
  <TouchableOpacity
    style={styles.resultCard}
    activeOpacity={0.9}
    onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
  >
    <Image source={item.image} style={styles.resultImage} />

    <View style={styles.resultContent}>
      <Text style={styles.resultCategory}>{item.category}</Text>
      <Text style={styles.resultName} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.resultSeller} numberOfLines={1}>
        {item.seller}
      </Text>

      <View style={styles.resultFooter}>
        <Text style={styles.resultPrice}>{item.price}</Text>

        <View style={styles.resultActions}>
          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={() => navigation.navigate('Favorites')}
            activeOpacity={0.85}
          >
            <Ionicons name="heart-outline" size={16} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryAction}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
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
    paddingBottom: 120,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  headerTextBlock: {
    flex: 1,
    marginLeft: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  headerMini: {
    fontSize: 12,
    color: colors.textSoft,
    marginBottom: 2,
    fontWeight: '600',
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },

  logoImage: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },

  searchHero: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    padding: 20,
    marginBottom: 24,
    overflow: 'hidden',
  },

  searchHeroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },

  searchHeroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.88)',
    marginBottom: 16,
    maxWidth: 290,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },

  sectionHeader: {
    marginBottom: 12,
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

  recentRow: {
    paddingRight: 8,
    marginBottom: 24,
  },

  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 10,
  },

  recentChipText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
    marginLeft: 6,
  },

  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  categoryBox: {
    width: '48%',
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    minHeight: 96,
    justifyContent: 'space-between',
  },

  categoryBoxActive: {
    backgroundColor: colors.primary,
  },

  categoryIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoryIconWrapActive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  categoryLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },

  categoryLabelActive: {
    color: '#fff',
  },

  resultsHeader: {
    marginBottom: 14,
  },

  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: '#4a5f18b4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 4,
  },

  resultImage: {
    width: 92,
    height: 92,
    borderRadius: 18,
    resizeMode: 'cover',
    marginRight: 14,
  },

  resultContent: {
    flex: 1,
  },

  resultCategory: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF5E3',
    color: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 8,
  },

  resultName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },

  resultSeller: {
    fontSize: 12,
    color: colors.textSoft,
    marginBottom: 12,
  },

  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  resultPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },

  resultActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  secondaryAction: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#F8F8F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  primaryAction: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 13,
    color: colors.textSoft,
    textAlign: 'center',
    lineHeight: 20,
  },

});
