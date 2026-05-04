/**
 * @file src/screens/HomeScreen.tsx
 * @placeholder — Dashboard Principal
 *
 * Sprint de implementação: Sprint 2
 * TODO: Barra de busca, filtros por categoria, banner de oportunidades, lista de editais.
 */

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Header, BidCard, EmptyState } from '../components';
import { colors, spacing, textPresets } from '../theme';
import type { MainTabScreenProps } from '../types';

type Props = MainTabScreenProps<'Inicio'>;

export function HomeScreen({ navigation }: Props): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        variant="default"
        notificationCount={3}
        onNotificationPress={() => navigation.navigate('Alertas')}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Olá, João! 👋</Text>
        <Text style={styles.subtitle}>Bem-vindo ao seu painel de licitações.</Text>

        {/* Sprint 2: busca, filtros e banner aqui */}
        <View style={styles.placeholderSection}>
          <Text style={styles.placeholderLabel}>🔍 Busca e Filtros — Sprint 2</Text>
        </View>

        <Text style={styles.sectionTitle}>Recomendadas para você</Text>

        <BidCard
          title="Fornecimento de Material de Escritório"
          agency="Prefeitura Municipal de São Paulo"
          value={14500}
          status="open"
          deadline="Prazo: 30/11"
          compatibility={95}
          onPress={() =>
            navigation.navigate('DetalhesLicitacao', {
              bidId: '1',
              bidTitle: 'Fornecimento de Material de Escritório',
            })
          }
        />
        <BidCard
          title="Serviços de Manutenção Predial"
          agency="Tribunal de Justiça do Estado"
          value={8900}
          status="analysis"
          deadline="Prazo: 15/12"
          compatibility={78}
          onPress={() =>
            navigation.navigate('DetalhesLicitacao', {
              bidId: '2',
              bidTitle: 'Serviços de Manutenção Predial',
            })
          }
        />

        <EmptyState
          icon="search-outline"
          title="Sem mais recomendações"
          description="Complete seu perfil para receber mais oportunidades alinhadas ao seu CNAE."
          actionLabel="Completar perfil"
          onAction={() => navigation.navigate('Perfil')}
        />
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
  greeting: {
    ...textPresets.h3,
    color: colors.textPrimary,
  },
  subtitle: {
    ...textPresets.bodyMd,
    color: colors.textSecondary,
    marginTop: -spacing[1],
  },
  sectionTitle: {
    ...textPresets.h5,
    color: colors.textPrimary,
    marginTop: spacing[2],
  },
  placeholderSection: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  placeholderLabel: {
    ...textPresets.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
