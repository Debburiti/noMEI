/**
 * @file src/screens/ConfiguracaoPerfilScreen.tsx
 * @description Tela de Configuração de Perfil (ProfileSetup) do noMEI.
 *
 * Layout baseado no protótipo:
 *  - Header azul escuro com título "Confirme seus dados"
 *  - Seção "Dados do Gov.br" com nome, CNPJ, CNAE (read-only)
 *  - Seção "Áreas de Interesse" com chips selecionáveis
 *  - Botão CTA "Salvar e Ver Oportunidades"
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components';
import { colors, spacing, borderRadius, shadows, textPresets } from '../theme';
import type { RootStackScreenProps } from '../types';

type Props = RootStackScreenProps<'ProfileSetup'>;

// ─── Áreas de Interesse Disponíveis ──────────────────────────────────────────

const INTEREST_AREAS = [
  { id: 'tech', label: 'Tecnologia', icon: 'laptop-outline' as const },
  { id: 'office', label: 'Material de Escritório', icon: 'documents-outline' as const },
  { id: 'cleaning', label: 'Limpeza', icon: 'sparkles-outline' as const },
  { id: 'food', label: 'Alimentação', icon: 'restaurant-outline' as const },
  { id: 'construction', label: 'Construção', icon: 'construct-outline' as const },
  { id: 'health', label: 'Saúde', icon: 'medkit-outline' as const },
  { id: 'transport', label: 'Transporte', icon: 'car-outline' as const },
  { id: 'consulting', label: 'Consultoria', icon: 'briefcase-outline' as const },
  { id: 'security', label: 'Segurança', icon: 'shield-outline' as const },
  { id: 'events', label: 'Eventos', icon: 'calendar-outline' as const },
];

// ─── Mock Gov.br Data ─────────────────────────────────────────────────────────

const GOV_BR_DATA = {
  name: 'João Silva',
  cnpj: '12.345.678/0001-90',
  cnae: '6201-5/00 — Desenvolvimento de programas de computador sob encomenda',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ConfiguracaoPerfilScreen({ navigation }: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [selectedAreas, setSelectedAreas] = useState<string[]>(['tech', 'office']);

  function toggleArea(id: string): void {
    setSelectedAreas((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  }

  function handleSave(): void {
    navigation.navigate('MainTabs');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing[2] }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Confirme seus dados</Text>
          <Text style={styles.headerSubtitle}>
            Revise suas informações na base do governo.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção Gov.br */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
            <Text style={styles.sectionTitle}>Dados do Gov.br</Text>
          </View>

          <View style={styles.card}>
            <DataRow icon="person-outline" label="Nome" value={GOV_BR_DATA.name} />
            <View style={styles.divider} />
            <DataRow icon="business-outline" label="CNPJ" value={GOV_BR_DATA.cnpj} />
            <View style={styles.divider} />
            <DataRow icon="grid-outline" label="CNAE" value={GOV_BR_DATA.cnae} />
          </View>

          <View style={styles.govbrBadge}>
            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            <Text style={styles.govbrBadgeText}>Verificado pelo Gov.br</Text>
          </View>
        </View>

        {/* Seção Áreas de Interesse */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Áreas de Interesse</Text>
          <Text style={styles.sectionDescription}>
            Selecione as áreas que você deseja receber oportunidades.
          </Text>

          <View style={styles.chipsContainer}>
            {INTEREST_AREAS.map((area) => {
              const isSelected = selectedAreas.includes(area.id);
              return (
                <TouchableOpacity
                  key={area.id}
                  onPress={() => toggleArea(area.id)}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  activeOpacity={0.75}
                >
                  <Ionicons
                    name={area.icon}
                    size={14}
                    color={isSelected ? colors.primary : colors.textSecondary}
                  />
                  <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>
                    {area.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedAreas.length > 0 && (
            <Text style={styles.selectedCount}>
              {selectedAreas.length} área{selectedAreas.length > 1 ? 's' : ''} selecionada{selectedAreas.length > 1 ? 's' : ''}
            </Text>
          )}
        </View>

        {/* CTA */}
        <Button
          label="Salvar e Ver Oportunidades"
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          rightIcon={<Ionicons name="arrow-forward" size={20} color={colors.white} />}
          style={styles.ctaButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── DataRow Helper ───────────────────────────────────────────────────────────

interface DataRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

function DataRow({ icon, label, value }: DataRowProps): React.JSX.Element {
  return (
    <View style={dataRowStyles.row}>
      <View style={dataRowStyles.iconWrapper}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <View style={dataRowStyles.textWrapper}>
        <Text style={dataRowStyles.label}>{label}</Text>
        <Text style={dataRowStyles.value} numberOfLines={2}>{value}</Text>
      </View>
    </View>
  );
}

const dataRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    paddingVertical: spacing[3],
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  textWrapper: {
    flex: 1,
  },
  label: {
    ...textPresets.labelSm,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  value: {
    ...textPresets.bodyMd,
    color: colors.textPrimary,
  },
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.dark,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[5],
    gap: spacing[3],
  },
  headerCenter: {
    gap: spacing[1],
  },
  headerTitle: {
    ...textPresets.h3,
    color: colors.white,
  },
  headerSubtitle: {
    ...textPresets.bodyMd,
    color: 'rgba(255,255,255,0.7)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[4],
    paddingBottom: spacing[10],
    gap: spacing[5],
  },

  // Section
  section: {
    gap: spacing[3],
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  sectionTitle: {
    ...textPresets.h5,
    color: colors.textPrimary,
  },
  sectionDescription: {
    ...textPresets.bodyMd,
    color: colors.textSecondary,
    marginTop: -spacing[1],
  },

  // Card Gov.br
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[4],
    ...shadows.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  govbrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    alignSelf: 'flex-start',
  },
  govbrBadgeText: {
    ...textPresets.bodySm,
    color: colors.success,
  },

  // Chips
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  chipLabel: {
    ...textPresets.labelSm,
    color: colors.textSecondary,
  },
  chipLabelSelected: {
    color: colors.primary,
  },
  selectedCount: {
    ...textPresets.bodySm,
    color: colors.textSecondary,
  },

  // CTA
  ctaButton: {
    marginTop: spacing[2],
  },
});
