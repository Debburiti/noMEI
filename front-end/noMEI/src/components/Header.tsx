/**
 * @file src/components/Header.tsx
 * @description Cabeçalho customizado de telas do noMEI.
 *
 * Variantes:
 *  - "default" → logo "noMEI" à esquerda + sino de notificação à direita
 *  - "back"    → botão de voltar + título centralizado
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, textPresets } from '../theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeaderDefaultProps {
  variant: 'default';
  onNotificationPress?: () => void;
  notificationCount?: number;
}

interface HeaderBackProps {
  variant: 'back';
  title: string;
  onBackPress: () => void;
}

type HeaderProps = (HeaderDefaultProps | HeaderBackProps) & {
  style?: StyleProp<ViewStyle>;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Header(props: HeaderProps): React.JSX.Element {
  const insets = useSafeAreaInsets();

  if (props.variant === 'back') {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing[2] }, props.style]}>
        <TouchableOpacity
          onPress={props.onBackPress}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.backTitle} numberOfLines={1}>
          {props.title}
        </Text>
        <View style={styles.backPlaceholder} />
      </View>
    );
  }

  const hasNotification = (props.notificationCount ?? 0) > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing[2] }, props.style]}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>no</Text>
        <Text style={styles.logoTextBold}>MEI</Text>
      </View>
      <TouchableOpacity
        onPress={props.onNotificationPress}
        style={styles.notificationButton}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="notifications-outline" size={22} color={colors.white} />
        {hasNotification && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>
              {(props.notificationCount ?? 0) > 9 ? '9+' : props.notificationCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '400',
    color: colors.white,
    letterSpacing: -0.5,
  },
  logoTextBold: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryLight,
    letterSpacing: -0.5,
  },
  notificationButton: {
    position: 'relative',
    padding: spacing[1],
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.error,
    borderRadius: borderRadius.full,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  notificationBadgeText: {
    ...textPresets.labelSm,
    color: colors.white,
    fontSize: 9,
  },
  backButton: {
    padding: spacing[1],
  },
  backTitle: {
    ...textPresets.h5,
    color: colors.white,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing[2],
  },
  backPlaceholder: {
    width: 32,
  },
});
