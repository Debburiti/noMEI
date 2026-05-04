/**
 * @file src/screens/DisputasScreen.tsx
 * @placeholder — Minhas Disputas
 *
 * Sprint de implementação: Sprint 2
 * TODO: Abas "Em Aberto" / "Encerradas", cards com badge, barra de progresso, botão detalhes.
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
import { Header, BidCard, EmptyState } from '../components';
import { colors, spacing, borderRadius, textPresets } from '../theme';
import type { MainTabScreenProps } from '../types';

type Props = MainTabScreenProps<'Disputas'>;

type Tab = 'open' | 'closed';

export function DisputasScreen({ navigation }: Props): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<Tab>('open');

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header variant="default" notificationCount={0} />

      {/* Título e abas */}
      <View style={styles.tabsHeader}>
        <Text style={styles.screenTitle}>Minhas Disputas</Text>
        <Text style={styles.screenSubtitle}>
          Acompanhe o andamento das suas participações.
        </Text>
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'open' && styles.tabActive]}
            onPress={() => setActiveTab('open')}
          >
            <Text style={[styles.tabLabel, activeTab === 'open' && styles.tabLabelActive]}>
              Em Aberto
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'closed' && styles.tabActive]}
            onPress={() => setActiveTab('closed')}
          >
            <Text style={[styles.tabLabel, activeTab === 'closed' && styles.tabLabelActive]}>
              Encerradas
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {activeTab === 'open' ? (
          <>
            <BidCard
              title="Fornecimento de Material de Escritório"
              agency="Prefeitura Municipal de São Paulo"
              value={14500}
              status="sent"
              deadline="Prazo: 30/11"
              compatibility={95}
              progress={65}
              onPress={() =>
                navigation.navigate('DetalhesLicitacao', {
                  bidId: '1',
                  bidTitle: 'Fornecimento de Material de Escritório',
                })
              }
            />
            <BidCard
              title="Aquisição de Equipamentos de TI"
              agency="Tribunal de Justiça"
              value={28000}
              status="analysis"
              deadline="Prazo: 08/12"
              compatibility={82}
              progress={40}
              onPress={() =>
                navigation.navigate('DetalhesLicitacao', {
                  bidId: '3',
                  bidTitle: 'Aquisição de Equipamentos de TI',
                })
              }
            />
          </>
        ) : (
          <EmptyState
            icon="checkmark-done-circle-outline"
            title="Nenhuma disputa encerrada"
            description="Suas disputas finalizadas aparecerão aqui."
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
  tabsHeader: {
    backgroundColor: colors.dark,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
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
  tabsRow: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: spacing[3],
  },
  tab: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    ...textPresets.labelMd,
    color: 'rgba(255,255,255,0.6)',
  },
  tabLabelActive: {
    color: colors.white,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing[4],
    paddingBottom: spacing[10],
  },
});
