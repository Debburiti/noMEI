/**
 * @file src/screens/DetalhesLicitacaoScreen.tsx
 * @description Detalhe da Licitação — layout alinhado ao design system noMEI.
 *
 * Seções:
 *  1. Header (variante "detail") — voltar, bookmark, share
 *  2. Badge de status + Título + Órgão + Valor Estimado
 *  3. Tradução do Edital — card azul com bullets + link PDF
 *  4. Checklist de Documentos — itens com título e descrição
 *  5. CTA fixo — "Participar desta Licitação"
 */

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header, StatusBadge, Button } from '../components';
import { colors, spacing, borderRadius, shadows, textPresets } from '../theme';
import type { RootStackScreenProps } from '../types';

type Props = RootStackScreenProps<'DetalhesLicitacao'>;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_TRANSLATION_ITEMS = [
  {
    id: '1',
    icon: 'clipboard-outline' as const,
    text: 'Fornecer 50 resmas de papel A4 branco padrão.',
  },
  {
    id: '2',
    icon: 'create-outline' as const,
    text: 'Fornecer 100 canetas esferográficas azuis.',
  },
  {
    id: '3',
    icon: 'car-outline' as const,
    text: 'Realizar entrega única no almoxarifado central em até 15 dias corridos após a aprovação.',
  },
];

const MOCK_CHECKLIST = [
  {
    id: '1',
    label: 'Certidões',
    description: 'Negativas Federal, Estadual e Municipal atualizadas.',
    done: false,
  },
  {
    id: '2',
    label: 'Alvará',
    description: 'Alvará de funcionamento válido do ano corrente.',
    done: false,
  },
  {
    id: '3',
    label: 'Proposta Comercial',
    description: 'Documento assinado com os valores detalhados.',
    done: false,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function DetalhesLicitacaoScreen({ navigation, route }: Props): React.JSX.Element {
  const { bidTitle } = route.params;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* Header — fundo branco, botões circulares */}
      <Header
        variant="detail"
        onBackPress={() => navigation.goBack()}
        onBookmarkPress={() => {}}
        onSharePress={() => {}}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Seção 1: Status + Título + Órgão + Valor ─────────────────── */}
        <View style={styles.heroSection}>
          <StatusBadge status="open" showIcon />

          <Text style={styles.title}>{bidTitle}</Text>

          <View style={styles.agencyRow}>
            <Ionicons name="business-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.agencyText}> Prefeitura Municipal de São Paulo</Text>
          </View>

          <View style={styles.valueBlock}>
            <Text style={styles.valueLabel}>VALOR ESTIMADO</Text>
            <Text style={styles.valueAmount}>R$ 14.500,00</Text>
          </View>
        </View>

        {/* ── Seção 2: Tradução do Edital ───────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="language-outline" size={18} color={colors.textPrimary} />
            <Text style={styles.sectionTitle}> Tradução do Edital</Text>
          </View>

          <View style={styles.translationCard}>
            <Text style={styles.translationIntro}>
              Resumo simplificado do que o MEI precisa entregar para esta licitação:
            </Text>

            {MOCK_TRANSLATION_ITEMS.map((item) => (
              <View key={item.id} style={styles.bulletRow}>
                <View style={styles.bulletIconWrap}>
                  <Ionicons name={item.icon} size={16} color={colors.primary} />
                </View>
                <Text style={styles.bulletText}>{item.text}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.pdfLink} onPress={() => {}}>
            <Ionicons name="document-outline" size={16} color={colors.primary} />
            <Text style={styles.pdfLinkText}> Baixar Edital Original (PDF)</Text>
          </TouchableOpacity>
        </View>

        {/* ── Seção 3: Checklist de Documentos ─────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkbox-outline" size={18} color={colors.textPrimary} />
            <Text style={styles.sectionTitle}> Checklist de Documentos</Text>
          </View>

          <View style={styles.checklistCard}>
            {MOCK_CHECKLIST.map((item, index) => (
              <React.Fragment key={item.id}>
                <View style={styles.checklistItem}>
                  <View style={[styles.radio, item.done && styles.radioDone]}>
                    {item.done && (
                      <Ionicons name="checkmark" size={12} color={colors.white} />
                    )}
                  </View>
                  <View style={styles.checklistText}>
                    <Text style={[styles.checklistLabel, item.done && styles.checklistLabelDone]}>
                      {item.label}
                    </Text>
                    <Text style={styles.checklistDesc}>{item.description}</Text>
                  </View>
                </View>
                {index < MOCK_CHECKLIST.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Espaço extra para não ficar atrás do botão fixo */}
        <View style={{ height: spacing[4] }} />
      </ScrollView>

      {/* ── CTA Fixo ─────────────────────────────────────────────────────── */}
      <View style={styles.ctaContainer}>
        <Button
          label="Participar desta Licitação"
          onPress={() => {}}
          variant="primary"
          size="lg"
          fullWidth
          leftIcon={<Ionicons name="list-outline" size={20} color={colors.white} />}
        />
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
    gap: spacing[5],
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  heroSection: {
    gap: spacing[2],
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 34,
    marginTop: spacing[1],
  },
  agencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agencyText: {
    ...textPresets.bodyMd,
    color: colors.textSecondary,
  },
  valueBlock: {
    marginTop: spacing[1],
    gap: 2,
  },
  valueLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.textSecondary,
  },
  valueAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.success,
    lineHeight: 34,
  },

  // ── Section ───────────────────────────────────────────────────────────────
  section: {
    gap: spacing[3],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    ...textPresets.h5,
    color: colors.textPrimary,
  },

  // ── Tradução ──────────────────────────────────────────────────────────────
  translationCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    gap: spacing[3],
  },
  translationIntro: {
    ...textPresets.bodySm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  bulletIconWrap: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    ...shadows.sm,
  },
  bulletText: {
    ...textPresets.bodyMd,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 22,
  },
  pdfLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[2],
    gap: spacing[1],
  },
  pdfLinkText: {
    ...textPresets.labelMd,
    color: colors.primary,
    textDecorationLine: 'underline',
  },

  // ── Checklist ─────────────────────────────────────────────────────────────
  checklistCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    padding: spacing[4],
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.placeholder,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  radioDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checklistText: {
    flex: 1,
    gap: 2,
  },
  checklistLabel: {
    ...textPresets.labelMd,
    color: colors.textPrimary,
  },
  checklistLabelDone: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  checklistDesc: {
    ...textPresets.bodySm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing[4],
  },

  // ── CTA ───────────────────────────────────────────────────────────────────
  ctaContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.sm,
  },
});
