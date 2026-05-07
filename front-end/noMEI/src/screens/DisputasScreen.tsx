/**
 * @file src/screens/DisputasScreen.tsx
 * @description Minhas Disputas — lista de participações ativas e encerradas.
 *
 * Seções:
 *  1. Header variante "screen" — título "Licitações" + sino
 *  2. Área de título + subtítulo + abas (Em Aberto / Encerradas)
 *  3. Cards de disputa com badge, progresso e CTA condicional
 */

import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header, StatusBadge, Button, EmptyState } from '../components';
import { colors, spacing, borderRadius, shadows, textPresets } from '../theme';
import type { MainTabScreenProps, BidStatus } from '../types';

type Props = MainTabScreenProps<'Disputas'>;
type Tab = 'open' | 'closed';

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface DisputaItem {
  id: string;
  title: string;
  modality: string;
  status: BidStatus;
  updatedAt: string;
  progress: number;
  isWinner?: boolean;
}

const OPEN_DISPUTAS: DisputaItem[] = [
  {
    id: '1',
    title: 'Fornecimento de Material de Escritório',
    modality: 'Pregão Eletrônico 012/2023 - Prefeitura Municipal',
    status: 'analysis',
    updatedAt: 'Atualizado há 2 horas',
    progress: 45,
  },
  {
    id: '2',
    title: 'Serviços de Manutenção Predial',
    modality: 'Tomada de Preços 045/2023 - Secretaria da Fazenda',
    status: 'sent',
    updatedAt: 'Atualizado ontem',
    progress: 80,
  },
];

const CLOSED_DISPUTAS: DisputaItem[] = [
  {
    id: '3',
    title: 'Aquisição de Equipamentos de TI',
    modality: 'Pregão Eletrônico 088/2023 - Tribunal de Justiça',
    status: 'winner',
    updatedAt: 'Atualizado há 3 dias',
    progress: 100,
    isWinner: true,
  },
];

// ─── DisputaCard ──────────────────────────────────────────────────────────────

function DisputaCard({
  item,
  onPressDetails,
  onPressContract,
}: {
  item: DisputaItem;
  onPressDetails?: () => void;
  onPressContract?: () => void;
}): React.JSX.Element {
  const progressColor =
    item.isWinner === true
      ? colors.success
      : item.progress >= 70
      ? colors.primary
      : colors.primary;

  return (
    <View style={cardStyles.card}>
      {/* Topo: Badge + Timestamp */}
      <View style={cardStyles.topRow}>
        <StatusBadge status={item.status} />
        <Text style={cardStyles.updatedAt}>{item.updatedAt}</Text>
      </View>

      {/* Título */}
      <Text style={cardStyles.title}>{item.title}</Text>

      {/* Modalidade */}
      <Text style={cardStyles.modality}>{item.modality}</Text>

      {/* Barra de progresso */}
      <View style={cardStyles.progressSection}>
        <View style={cardStyles.progressLabels}>
          <Text style={cardStyles.progressLabel}>Progresso</Text>
          <Text style={[cardStyles.progressPct, { color: progressColor }]}>
            {item.progress}%
          </Text>
        </View>
        <View style={cardStyles.progressTrack}>
          <View
            style={[
              cardStyles.progressFill,
              {
                width: `${item.progress}%` as `${number}%`,
                backgroundColor: progressColor,
              },
            ]}
          />
        </View>
      </View>

      {/* CTA */}
      <View style={cardStyles.ctaRow}>
        {item.isWinner === true ? (
          <Button
            label="Acompanhar Contrato"
            onPress={onPressContract ?? (() => {})}
            variant="primary"
            size="sm"
            fullWidth
          />
        ) : (
          <Button
            label="Ver Detalhes"
            onPress={onPressDetails ?? (() => {})}
            variant="outline"
            size="sm"
            rightIcon={<Ionicons name="chevron-forward" size={16} color={colors.primary} />}
          />
        )}
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    gap: spacing[3],
    ...shadows.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  updatedAt: {
    ...textPresets.bodySm,
    color: colors.textSecondary,
  },
  title: {
    ...textPresets.labelMd,
    color: colors.primary,
    fontSize: 16,
    lineHeight: 22,
  },
  modality: {
    ...textPresets.bodySm,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: -spacing[1],
  },
  progressSection: {
    gap: spacing[1],
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    ...textPresets.bodySm,
    color: colors.textSecondary,
  },
  progressPct: {
    ...textPresets.labelSm,
    fontWeight: '700',
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  ctaRow: {
    alignItems: 'flex-end',
  },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export function DisputasScreen({ navigation }: Props): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<Tab>('open');

  const disputas = activeTab === 'open' ? OPEN_DISPUTAS : CLOSED_DISPUTAS;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* Header — título centralizado + sino */}
      <Header
        variant="screen"
        title="Licitações"
        notificationCount={0}
        onNotificationPress={() => {}}
      />

      {/* Área de título + subtítulo */}
      <View style={styles.titleArea}>
        <Text style={styles.screenTitle}>Minhas Disputas</Text>
        <Text style={styles.screenSubtitle}>
          Acompanhe o andamento das suas participações.
        </Text>

        {/* Abas com underline */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab('open')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabLabel, activeTab === 'open' && styles.tabLabelActive]}>
              Em Aberto
            </Text>
            {activeTab === 'open' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab('closed')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabLabel, activeTab === 'closed' && styles.tabLabelActive]}>
              Encerradas
            </Text>
            {activeTab === 'closed' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        </View>
        {/* Linha separadora completa */}
        <View style={styles.tabsDivider} />
      </View>

      {/* Lista de disputas */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {disputas.length === 0 ? (
          <EmptyState
            icon="checkmark-done-circle-outline"
            title="Nenhuma disputa encerrada"
            description="Suas disputas finalizadas aparecerão aqui."
          />
        ) : (
          disputas.map((item) => (
            <DisputaCard
              key={item.id}
              item={item}
              onPressDetails={() =>
                navigation.navigate('DetalhesLicitacao', {
                  bidId: item.id,
                  bidTitle: item.title,
                })
              }
              onPressContract={() => {}}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── Título + Abas ────────────────────────────────────────────────────────
  titleArea: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 28,
  },
  screenSubtitle: {
    ...textPresets.bodyMd,
    color: colors.textSecondary,
    marginTop: spacing[1],
  },
  tabsRow: {
    flexDirection: 'row',
    marginTop: spacing[4],
  },
  tab: {
    paddingBottom: spacing[2],
    marginRight: spacing[5],
    position: 'relative',
  },
  tabLabel: {
    ...textPresets.labelMd,
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: colors.primary,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  tabsDivider: {
    height: 1,
    backgroundColor: colors.border,
  },

  // ── Lista ────────────────────────────────────────────────────────────────
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing[4],
    gap: spacing[3],
    paddingBottom: spacing[8],
  },
});
