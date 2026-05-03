/**
 * @file src/navigation/CustomTabBar.tsx
 * @description Tab bar customizada do noMEI.
 *
 * Visual (fiel ao design de referência):
 *  - Fundo branco com sombra superior suave
 *  - Aba ativa: pill de fundo azul suave + ícone na cor primária
 *  - Aba inativa: ícone cinza + label cinza
 *  - 5 abas: Início, Disputas, Documentos, Alertas, Perfil
 *  - Safe area respeitada na parte inferior
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, spacing, borderRadius, shadows, textPresets } from '../theme';
import type { MainTabParamList } from '../types';

// ─── Tab Config ───────────────────────────────────────────────────────────────

type TabName = keyof MainTabParamList;

interface TabConfig {
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
  label: string;
}

const TAB_CONFIG: Record<TabName, TabConfig> = {
  Inicio: {
    icon: 'home-outline',
    iconActive: 'home',
    label: 'Início',
  },
  Disputas: {
    icon: 'shield-outline',
    iconActive: 'shield',
    label: 'Disputas',
  },
  Documentos: {
    icon: 'document-text-outline',
    iconActive: 'document-text',
    label: 'Documentos',
  },
  Alertas: {
    icon: 'notifications-outline',
    iconActive: 'notifications',
    label: 'Alertas',
  },
  Perfil: {
    icon: 'person-outline',
    iconActive: 'person',
    label: 'Perfil',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + spacing[1] }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const tabName = route.name as TabName;
        const config = TAB_CONFIG[tabName];

        const { options } = descriptors[route.key];
        const label = options.tabBarLabel?.toString() ?? config.label;

        function onPress(): void {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        }

        function onLongPress(): void {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
            activeOpacity={0.75}
          >
            {/* Pill ativo */}
            <View style={[styles.iconWrapper, isFocused && styles.iconWrapperActive]}>
              <Ionicons
                name={isFocused ? config.iconActive : config.icon}
                size={22}
                color={isFocused ? colors.primary : colors.textSecondary}
              />
            </View>

            {/* Label */}
            <Text
              style={[
                styles.label,
                isFocused ? styles.labelActive : styles.labelInactive,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingTop: spacing[2],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
  },
  iconWrapper: {
    width: 44,
    height: 32,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    backgroundColor: colors.primaryLight,
  },
  label: {
    ...textPresets.labelSm,
  },
  labelActive: {
    color: colors.primary,
  },
  labelInactive: {
    color: colors.textSecondary,
    fontWeight: '400',
  },
});
