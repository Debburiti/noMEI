import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
   Header,
   StatusBadge,
   Button,
   EmptyState,
   DisputaCard,
} from "../components";
import type { DisputaItem } from "../components";
import { colors, spacing, borderRadius, shadows, textPresets } from "../theme";
import type { MainTabScreenProps, BidStatus } from "../types";

type Props = MainTabScreenProps<"Disputas">;
type Tab = "open" | "closed";

const OPEN_DISPUTAS: DisputaItem[] = [
   {
      id: "1",
      title: "Fornecimento de Material de Escritório",
      modality: "Pregão Eletrônico 012/2023 - Prefeitura Municipal",
      status: "analysis",
      updatedAt: "Atualizado há 2 horas",
      progress: 45,
   },
   {
      id: "2",
      title: "Serviços de Manutenção Predial",
      modality: "Tomada de Preços 045/2023 - Secretaria da Fazenda",
      status: "sent",
      updatedAt: "Atualizado ontem",
      progress: 80,
   },
];

const CLOSED_DISPUTAS: DisputaItem[] = [
   {
      id: "3",
      title: "Aquisição de Equipamentos de TI",
      modality: "Pregão Eletrônico 088/2023 - Tribunal de Justiça",
      status: "winner",
      updatedAt: "Atualizado há 3 dias",
      progress: 100,
      isWinner: true,
   },
];

export function DisputasScreen({ navigation }: Props): React.JSX.Element {
   const [activeTab, setActiveTab] = useState<Tab>("open");

   const disputas = activeTab === "open" ? OPEN_DISPUTAS : CLOSED_DISPUTAS;

   return (
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
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
                  onPress={() => setActiveTab("open")}
                  activeOpacity={0.7}
               >
                  <Text
                     style={[
                        styles.tabLabel,
                        activeTab === "open" && styles.tabLabelActive,
                     ]}
                  >
                     Em Aberto
                  </Text>
                  {activeTab === "open" && <View style={styles.tabUnderline} />}
               </TouchableOpacity>

               <TouchableOpacity
                  style={styles.tab}
                  onPress={() => setActiveTab("closed")}
                  activeOpacity={0.7}
               >
                  <Text
                     style={[
                        styles.tabLabel,
                        activeTab === "closed" && styles.tabLabelActive,
                     ]}
                  >
                     Encerradas
                  </Text>
                  {activeTab === "closed" && (
                     <View style={styles.tabUnderline} />
                  )}
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
                        navigation.navigate("DetalhesLicitacao", {
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

const styles = StyleSheet.create({
   safeArea: {
      flex: 1,
      backgroundColor: colors.background,
   },
   titleArea: {
      backgroundColor: colors.white,
      paddingHorizontal: spacing[4],
      paddingTop: spacing[4],
   },
   screenTitle: {
      fontSize: 22,
      fontWeight: "800",
      color: colors.textPrimary,
      lineHeight: 28,
   },
   screenSubtitle: {
      ...textPresets.bodyMd,
      color: colors.textSecondary,
      marginTop: spacing[1],
   },
   tabsRow: {
      flexDirection: "row",
      marginTop: spacing[4],
   },
   tab: {
      paddingBottom: spacing[2],
      marginRight: spacing[5],
      position: "relative",
   },
   tabLabel: {
      ...textPresets.labelMd,
      color: colors.textSecondary,
   },
   tabLabelActive: {
      color: colors.primary,
   },
   tabUnderline: {
      position: "absolute",
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
   scroll: {
      flex: 1,
   },
   content: {
      padding: spacing[4],
      gap: spacing[3],
      paddingBottom: spacing[8],
   },
});
