import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import colors from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';
import { useDisplaySettings } from '../../context/DisplaySettingsContext';
import DisplayModeMenu from './DisplayModeMenu';

export default function ScreenContainer({ children }) {
  const { settings } = useDisplaySettings();
  const { role } = useAuth();
  const menuRole = role === 'farmer' ? 'farmer' : 'user';

  return (
    <View
      style={[
        styles.outer,
        settings.darkMode && styles.outerDark,
        settings.highContrast && styles.outerContrast,
      ]}
    >
      <View
        style={[
          styles.inner,
          settings.darkMode && styles.innerDark,
          settings.highContrast && styles.innerContrast,
        ]}
      >
        <View
          style={[
            styles.content,
            settings.largeText && styles.contentLargeText,
          ]}
        >
          {children}
        </View>
        {settings.darkMode && <View pointerEvents="none" style={styles.nightOverlay} />}
        {settings.highContrast && (
          <>
            <View pointerEvents="none" style={styles.contrastWash} />
            <View pointerEvents="none" style={styles.contrastFrame} />
          </>
        )}
        <View style={styles.globalMenu}>
          <DisplayModeMenu role={menuRole} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 390 : '100%',
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  contentLargeText: {
    width: '90.91%',
    alignSelf: 'center',
    transform: [{ scale: 1.1 }],
  },
  outerDark: {
    backgroundColor: '#000',
  },
  innerDark: {
    backgroundColor: '#2F3030',
  },
  outerContrast: {
    backgroundColor: '#000',
  },
  innerContrast: {
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#000',
  },
  nightOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.46)',
  },
  contrastWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.74)',
  },
  contrastFrame: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 4,
    borderColor: '#7CFF00',
  },
  globalMenu: {
    position: 'absolute',
    top: 10,
    right: 64,
    zIndex: 100,
    elevation: 100,
  },
});
