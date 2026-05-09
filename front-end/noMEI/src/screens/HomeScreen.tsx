/**
 * @file src/screens/HomeScreen.tsx
 * @placeholder — Dashboard Principal
 *
 * Sprint de implementação: Sprint 2
 * TODO: Barra de busca, filtros por categoria, banner de oportunidades, lista de editais.
 */

import React, { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Header, BidCard, EmptyState, ErrorState } from '../components';
import { colors, spacing, textPresets } from '../theme';
import { useLicitacoes } from '../hooks';
import { useProfile } from '../context/ProfileContext';
import type { MainTabScreenProps } from '../types';

type Props = MainTabScreenProps<"Inicio">;

export function HomeScreen({ navigation }: Props): React.JSX.Element {
   const { selectedCategories, selectedLabels } = useProfile();
   const { items, loading, error } = useLicitacoes({ limit: 100 });

   const recommendedItems = useMemo(() => {
      const hasPreferences = selectedCategories.length > 0 || selectedLabels.length > 0;
      if (!hasPreferences) return items;

      const labelsLower = selectedLabels.map((l) => l.toLowerCase());

      const scored = items.flatMap((bid) => {
         const categoryMatch = selectedCategories.includes(bid.category);
         const titleLower = bid.title.toLowerCase();
         const textMatch = labelsLower.some((label) => titleLower.includes(label));

         if (categoryMatch) return [{ ...bid, compatibility: 100 }];
         if (textMatch) return [{ ...bid, compatibility: 50 }];
         return [];
      });

      // Ordena: 100% primeiro, depois 50%
      return scored.sort((a, b) => b.compatibility - a.compatibility);
   }, [items, selectedCategories, selectedLabels]);

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

            {loading && (
               <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
            )}

            {error && !loading && (
               <ErrorState
                  title="Erro ao carregar licitações"
                  description={error}
               />
            )}

            {!loading && !error && recommendedItems.map(bid => (
               <BidCard
                  key={bid.id}
                  title={bid.title}
                  agency={bid.agency}
                  value={bid.value}
                  status={bid.status}
                  deadline={bid.deadline}
                  compatibility={bid.compatibility}
                  onPress={() =>
                     navigation.navigate('DetalhesLicitacao', {
                        bidId: bid.id,
                        bidTitle: bid.title,
                     })
                  }
               />
            ))}

            {!loading && !error && recommendedItems.length === 0 && (
               <EmptyState
                  icon="search-outline"
                  title="Sem recomendações no momento"
                  description="Complete seu perfil para receber oportunidades alinhadas ao seu CNAE."
                  actionLabel="Completar perfil"
                  onAction={() => navigation.navigate('Perfil')}
               />
            )}
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
   loader: {
      marginVertical: spacing[6],
   },
});
