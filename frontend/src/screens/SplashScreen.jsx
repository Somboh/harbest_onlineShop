import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../styles/colors';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen({ navigation }) {
  const { isLoading, isAuthenticated, role } = useAuth();

  //Cuando AuthContext termina de hidratarse desde AsyncStorage, si hay sesión
  //válida saltamos directamente al home correcto y borramos Splash de la pila
  //para que el botón atrás del navegador no nos devuelva al login.
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) return;
    const target = role === 'farmer' ? 'HomeAgricultor' : 'Home';
    navigation.reset({ index: 0, routes: [{ name: target }] });
  }, [isLoading, isAuthenticated, role, navigation]);

  if (isLoading || isAuthenticated) {
    return (
      <ImageBackground
        source={require('../../assets/images/fondo.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator color={colors.primaryLight} size="large" />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/fondo.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.container}>
        {/* Capa suave para mejorar contraste */}
        <View style={styles.overlay}>
          {/* Logo */}
          <View style={styles.logoWrapper}>
            <View>
              <Image
                source={require('../../assets/images/logo-harbest.png')}
                style={styles.logoImage}
              />
            </View>
          </View>

          {/* Contenido superior */}
          <View style={styles.topContent}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Marketplace agrícola</Text>
            </View>

            <Text style={styles.welcomeText}>
              Compra fresco,{'\n'}directo del campo
            </Text>

            <Text style={styles.introText}>
              Descubre frutas, verduras y especias de proximidad sin intermediarios.
            </Text>

            <TouchableOpacity
              style={[styles.roleButton, styles.userButton]}
              onPress={() => navigation.navigate('Login', { role: 'user' })}
              activeOpacity={0.85}
            >
              <Text style={styles.roleButtonText}>Soy Usuario</Text>
            </TouchableOpacity>
          </View>

          {/* Zona inferior */}
          <View style={styles.bottomArea}>
            <TouchableOpacity
              style={[styles.roleButton, styles.adminButton]}
              onPress={() => navigation.navigate('Login', { role: 'farmer' })}
              activeOpacity={0.85}
            >
              <Text style={styles.roleButtonText}>Soy Agricultor</Text>
            </TouchableOpacity>

            <Text style={styles.bottomText}>
              Elige cómo quieres acceder a Harbest
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
  },

  logoWrapper: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 26,
  },

  logoImage: {
    width: 92,
    height: 92,
    resizeMode: 'contain',
  },

  topContent: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 10,
  },

  badge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 250, 223, 0.78)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 18,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },

  welcomeText: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    color: colors.primaryLight,
    textAlign: 'center',
    marginBottom: 12,
  },

  introText: {
    fontSize: 16,
    lineHeight: 23,
    color: colors.primaryLightTr,
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 26,
  },

  roleButton: {
    borderRadius: 999,
    paddingVertical: 15,
    paddingHorizontal: 45, 
    alignItems: 'center',
    alignSelf: 'center', 
  },

  userButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 10,
    shadowColor: '#fffccc',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },

  adminButton: {
    backgroundColor: colors.secondary,
    marginHorizontal: 18,
    shadowColor: '#b9b68f',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 5,
  },

  roleButtonText: {
    color: colors.primaryLight,
    fontSize: 15,
    fontWeight: '800',
  },

  bottomArea: {
    paddingBottom: 28,
    justifyContent: 'flex-end',
  },

  bottomText: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.textTr,
    marginTop: 14,
    fontWeight: '500',
  },
});
