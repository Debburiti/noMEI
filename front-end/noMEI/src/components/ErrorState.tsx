/**
 * @file src/components/ErrorState.tsx
 * @description Estado de erro com botão de retry.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, textPresets } from '../theme';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Algo deu errado',
  description = 'Verifique sua conexão e tente novamente.',
  onRetry,
}: ErrorStateProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons name="alert-circle-outline" size={40} color={colors.error} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {onRetry != null && (
        <Button
          label="Tentar novamente"
          onPress={onRetry}
          variant="outline"
          size="sm"
          style={styles.retryButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[10],
    gap: spacing[3],
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  title: {
    ...textPresets.h5,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    ...textPresets.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: spacing[2],
  },
});
