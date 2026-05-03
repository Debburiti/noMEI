/**
 * @file src/screens/PerfilScreen.tsx
 * @placeholder — Perfil do Microempreendedor
 *
 * Sprint de implementação: Sprint 3
 * TODO: Edição de dados, notificações, assinatura e áreas de interesse.
 */

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components';
import { colors, spacing, borderRadius, shadows, textPresets } from '../theme';
import type { MainTabScreenProps } from '../types';

type Props = MainTabScreenProps<'Perfil'>;

const MENU_ITEMS = [
  { id: 'data', icon: 'person-outline' as const, label: 'Meus dados', subtitle: 'Nome, CNPJ, CNAE' },
  { id: 'interests', icon: 'grid-outline' as const, label: 'Áreas de interesse', subtitle: 'Categorias de licitação' },
  { id: 'notifications', icon: 'notifications-outline' as const, label: 'Notificações', subtitle: 'Alertas e e-mails' },
  { id: 'plan', icon: 'star-outline' as const, label: 'Meu plano', subtitle: 'Gratuito — Fazer upgrade' },
  { id: 'help', icon: 'help-circle-outline' as const, label: 'Ajuda e suporte', subtitle: 'FAQ, chat, termos' },
];

export function PerfilScreen({ navigation: _navigation }: Props): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header variant="default" notificationCount={0} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Avatar + dados */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>JS</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>João Silva</Text>
            <Text style={styles.profileCnpj}>12.345.678/0001-90</Text>
            <View style={styles.govbrBadge}>
              <Ionicons name="shield-checkmark" size={12} color={colors.success} />
              <Text style={styles.govbrText}>Verificado pelo Gov.br</Text>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuIconWrapper}>
                  <Ionicons name={item.icon} size={18} color={colors.primary} />
                </View>
                <View style={styles.menuText}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
              {index < MENU_ITEMS.length - 1 && <View style={styles.menuDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={18} color={colors.error} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>noMEI v1.0.0 — Sprint 1</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing[4],
    paddingBottom: spacing[10],
    gap: spacing[4],
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    gap: spacing[3],
    ...shadows.sm,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    ...textPresets.h5,
    color: colors.white,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    gap: spacing[1],
  },
  profileName: {
    ...textPresets.h5,
    color: colors.textPrimary,
  },
  profileCnpj: {
    ...textPresets.bodySm,
    color: colors.textSecondary,
  },
  govbrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  govbrText: {
    ...textPresets.bodySm,
    color: colors.success,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[4],
    ...shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4],
    gap: spacing[3],
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    flex: 1,
    gap: 2,
  },
  menuLabel: {
    ...textPresets.labelMd,
    color: colors.textPrimary,
  },
  menuSubtitle: {
    ...textPresets.bodySm,
    color: colors.textSecondary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3],
  },
  logoutText: {
    ...textPresets.labelMd,
    color: colors.error,
  },
  versionText: {
    ...textPresets.bodySm,
    color: colors.placeholder,
    textAlign: 'center',
  },
});
