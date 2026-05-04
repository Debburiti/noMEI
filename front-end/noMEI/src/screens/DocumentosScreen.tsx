/**
 * @file src/screens/DocumentosScreen.tsx
 * @placeholder — Gestão de Documentos
 *
 * Sprint de implementação: Sprint 3
 * TODO: Área de upload, lista de documentos com status (Pendente, Enviado, Erro).
 */

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header, StatusBadge, Button, EmptyState } from '../components';
import { colors, spacing, borderRadius, shadows, textPresets } from '../theme';
import type { MainTabScreenProps } from '../types';

type Props = MainTabScreenProps<'Documentos'>;

const MOCK_DOCUMENTS = [
  { id: '1', name: 'Certidão Negativa Federal', status: 'sent' as const, expires: '31/12/2024' },
  { id: '2', name: 'Alvará de Funcionamento', status: 'error' as const, expires: null },
  { id: '3', name: 'Proposta Comercial', status: 'pending' as const, expires: null },
];

export function DocumentosScreen({ navigation: _navigation }: Props): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header variant="default" notificationCount={0} />

      <View style={styles.titleSection}>
        <Text style={styles.screenTitle}>Gestão de Documentos</Text>
        <Text style={styles.screenSubtitle}>
          Mantenha sua documentação atualizada para garantir sua participação em licitações.
        </Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Upload area */}
        <View style={styles.uploadArea}>
          <View style={styles.uploadIconWrapper}>
            <Ionicons name="cloud-upload-outline" size={32} color={colors.primary} />
          </View>
          <Text style={styles.uploadTitle}>Fazer Upload de Novo Documento</Text>
          <Text style={styles.uploadSubtitle}>
            Adicione e atualize seus documentos aqui. Clique para fazer upload.
          </Text>
          <Button
            label="Selecionar arquivo"
            onPress={() => {}}
            variant="outline"
            size="sm"
          />
        </View>

        {/* Lista de documentos */}
        <Text style={styles.sectionTitle}>Documentos Necessários</Text>

        {MOCK_DOCUMENTS.length === 0 ? (
          <EmptyState
            icon="document-outline"
            title="Nenhum documento"
            description="Faça upload dos documentos necessários para participar de licitações."
          />
        ) : (
          MOCK_DOCUMENTS.map((doc) => (
            <View key={doc.id} style={styles.docCard}>
              <View style={styles.docIconWrapper}>
                <Ionicons name="document-text-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.docInfo}>
                <Text style={styles.docName} numberOfLines={2}>{doc.name}</Text>
                {doc.expires != null && (
                  <Text style={styles.docExpiry}>Validade: {doc.expires}</Text>
                )}
                <StatusBadge status={doc.status} />
              </View>
              <Ionicons name="ellipsis-vertical" size={18} color={colors.textSecondary} />
            </View>
          ))
        )}

        {/* Sprint 3 placeholder */}
        <View style={styles.sprintPlaceholder}>
          <Text style={styles.sprintLabel}>📎 Upload real e preview — Sprint 3</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  titleSection: {
    backgroundColor: colors.dark,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[5],
    gap: spacing[1],
  },
  screenTitle: {
    ...textPresets.h4,
    color: colors.white,
  },
  screenSubtitle: {
    ...textPresets.bodySm,
    color: 'rgba(255,255,255,0.65)',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing[4],
    paddingBottom: spacing[10],
    gap: spacing[3],
  },
  uploadArea: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing[5],
    alignItems: 'center',
    gap: spacing[2],
    borderWidth: 2,
    borderColor: colors.primaryLight,
    borderStyle: 'dashed',
  },
  uploadIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[1],
  },
  uploadTitle: {
    ...textPresets.labelMd,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  uploadSubtitle: {
    ...textPresets.bodySm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sectionTitle: {
    ...textPresets.h5,
    color: colors.textPrimary,
    marginTop: spacing[2],
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing[3],
    gap: spacing[3],
    ...shadows.sm,
  },
  docIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docInfo: {
    flex: 1,
    gap: spacing[1],
  },
  docName: {
    ...textPresets.labelMd,
    color: colors.textPrimary,
  },
  docExpiry: {
    ...textPresets.bodySm,
    color: colors.textSecondary,
  },
  sprintPlaceholder: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    padding: spacing[3],
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginTop: spacing[2],
  },
  sprintLabel: {
    ...textPresets.bodySm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
