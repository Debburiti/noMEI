/**
 * @file src/components/StatusBadge.tsx
 * @description Pílula de status para licitações e documentos do noMEI.
 *
 * Mapeia automaticamente BidStatus | DocumentStatus → cores do theme.
 *
 * @example
 * <StatusBadge status="open" />
 * <StatusBadge status="pending" label="Pendente" />
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { statusColors, borderRadius, spacing, textPresets } from '../theme';
import type { BidStatus, DocumentStatus } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

type BadgeStatus = BidStatus | DocumentStatus;

const STATUS_LABELS: Record<BadgeStatus, string> = {
  open: 'Aberto',
  analysis: 'Em Análise',
  sent: 'Enviado',
  winner: 'Vencedor',
  closed: 'Encerrado',
  pending: 'Pendente',
  error: 'Erro',
};

const STATUS_ICONS: Record<BadgeStatus, keyof typeof Ionicons.glyphMap> = {
  open: 'checkmark-circle',
  analysis: 'time',
  sent: 'paper-plane',
  winner: 'trophy',
  closed: 'close-circle',
  pending: 'alert-circle',
  error: 'close-circle',
};

export interface StatusBadgeProps {
  status: BadgeStatus;
  /** Sobrescreve o label padrão */
  label?: string;
  /** Exibe ícone antes do texto */
  showIcon?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StatusBadge({ status, label, showIcon }: StatusBadgeProps): React.JSX.Element {
  const palette = statusColors[status];
  const displayLabel = label ?? STATUS_LABELS[status];
  const iconName = STATUS_ICONS[status];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: palette.bg, borderColor: palette.border },
      ]}
    >
      {showIcon === true && (
        <Ionicons
          name={iconName}
          size={12}
          color={palette.text}
          style={styles.icon}
        />
      )}
      <Text style={[styles.text, { color: palette.text }]}>
        {displayLabel}
      </Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  badge: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2],
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    // margem já vem do gap
  },
  text: {
    ...textPresets.labelSm,
  },
});
