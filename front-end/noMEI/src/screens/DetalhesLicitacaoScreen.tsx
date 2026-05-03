/**
 * @file src/screens/DetalhesLicitacaoScreen.tsx
 * @placeholder — Detalhe da Licitação
 *
 * Sprint de implementação: Sprint 2
 * TODO: Badge de status, título, valor, "Tradução do Edital", checklist de documentos, botão CTA.
 */

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header, StatusBadge, Button } from '../components';
import { colors, spacing, borderRadius, shadows, textPresets } from '../theme';
import type { RootStackScreenProps } from '../types';

type Props = RootStackScreenProps<'DetalhesLicitacao'>;

const MOCK_CHECKLIST = [
  { id: '1', label: 'Certidões (Negativa Federal, Estadual e Municipal)', done: true },
  { id: '2', label: 'Alvará de Funcionamento válido por 2 anos', done: false },
  { id: '3', label: 'Proposta Comercial com os valores estimados', done: false },
];

export function DetalhesLicitacaoScreen({ navigation, route }: Props): React.JSX.Element {
  const { bidTitle } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        variant="back"
        title={bidTitle}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Status + Título */}
        <View style={styles.card}>
          <StatusBadge status="open" />
          <Text style={styles.title}>{bidTitle}</Text>
          <View style={styles.agencyRow}>
            <Ionicons name="business-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.agency}> Prefeitura Municipal de São Paulo</Text>
          </View>
          <Text style={styles.value}>R$ 14.500,00</Text>
        </View>

        {/* Tradução do Edital */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Tradução do Edital</Text>
          </View>
          <Text style={styles.translationText}>
            O órgão precisa que você forneça 50 resmas de papel A4 branco padrão.
            Forneça 100 caixas de esferográficas azuis.
            Realize entrega única em até 15 dias corridos após a aceitação.
          </Text>
          <View style={styles.placeholderBanner}>
            <Text style={styles.placeholderText}>📄 Baixar Edital Original (PDF) — Sprint 2</Text>
          </View>
        </View>

        {/* Checklist de Documentos */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>✓ Checklist de Documentos</Text>
          {MOCK_CHECKLIST.map((item) => (
            <View key={item.id} style={styles.checkItem}>
              <View style={[styles.checkIcon, item.done && styles.checkIconDone]}>
                <Ionicons
                  name={item.done ? 'checkmark' : 'ellipse-outline'}
                  size={14}
                  color={item.done ? colors.white : colors.textSecondary}
                />
              </View>
              <Text style={[styles.checkLabel, item.done && styles.checkLabelDone]}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <Button
          label="Participar desta Licitação"
          onPress={() => {}}
          variant="primary"
          size="lg"
          fullWidth
          rightIcon={<Ionicons name="arrow-forward" size={20} color={colors.white} />}
        />
        <Text style={styles.sprintNote}>Sprint 2: integração com API de participação</Text>
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
    gap: spacing[3],
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    gap: spacing[3],
    ...shadows.sm,
  },
  title: {
    ...textPresets.h4,
    color: colors.textPrimary,
  },
  agencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agency: {
    ...textPresets.bodyMd,
    color: colors.textSecondary,
  },
  value: {
    ...textPresets.currency,
    color: colors.dark,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  sectionTitle: {
    ...textPresets.h5,
    color: colors.textPrimary,
  },
  translationText: {
    ...textPresets.bodyMd,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  placeholderBanner: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
    padding: spacing[3],
    alignItems: 'center',
  },
  placeholderText: {
    ...textPresets.bodySm,
    color: colors.primary,
    textAlign: 'center',
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  checkIcon: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.full,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  checkIconDone: {
    backgroundColor: colors.success,
  },
  checkLabel: {
    ...textPresets.bodyMd,
    color: colors.textSecondary,
    flex: 1,
  },
  checkLabelDone: {
    color: colors.textPrimary,
    textDecorationLine: 'line-through',
  },
  sprintNote: {
    ...textPresets.bodySm,
    color: colors.placeholder,
    textAlign: 'center',
    marginTop: -spacing[1],
  },
});
