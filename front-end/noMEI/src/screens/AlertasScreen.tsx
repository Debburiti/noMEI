import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Header, EmptyState } from "../components";
import { colors, spacing, borderRadius, shadows, textPresets } from "../theme";
import type { RootStackScreenProps } from "../types";

type Props = RootStackScreenProps<"Alertas">;

const ALERT_TYPE_CONFIG = {
   new_bid: {
      icon: "megaphone-outline" as const,
      color: colors.primary,
      bg: colors.primaryLight,
   },
   deadline: {
      icon: "time-outline" as const,
      color: colors.warning,
      bg: colors.warningLight,
   },
   status_change: {
      icon: "swap-horizontal-outline" as const,
      color: colors.success,
      bg: colors.successLight,
   },
   document: {
      icon: "document-outline" as const,
      color: colors.error,
      bg: colors.errorLight,
   },
};

const MOCK_ALERTS = [
   {
      id: "1",
      type: "new_bid" as const,
      title: "Novo Edital compatível",
      message: "Uma nova oportunidade foi aberta para o seu CNAE.",
      date: "Agora",
   },
   {
      id: "2",
      type: "deadline" as const,
      title: "Prazo se aproximando",
      message: 'A licitação "Fornecimento de Material" vence em 3 dias.',
      date: "2h atrás",
   },
   {
      id: "3",
      type: "status_change" as const,
      title: "Proposta aprovada",
      message: "Sua proposta para o pregão 45/2023 foi aprovada.",
      date: "Ontem",
   },
];

export function AlertasScreen({ navigation }: Props): React.JSX.Element {
   return (
      <SafeAreaView style={styles.safeArea}>
         <Header
            variant="modal"
            title="Alertas & Notificações"
            onClosePress={() => navigation.goBack()}
         />

         <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
         >
            <View style={styles.calendarPlaceholder}>
               <Text style={styles.calendarTitle}>
                  📅 Calendário Semanal — Sprint 3
               </Text>
               <Text style={styles.calendarSubtitle}>
                  Visualização de prazos e compromissos da semana
               </Text>
            </View>

            <Text style={styles.sectionTitle}>Recentes</Text>

            {MOCK_ALERTS.length === 0 ? (
               <EmptyState
                  icon="notifications-off-outline"
                  title="Sem alertas"
                  description="Você será notificado de novas oportunidades e prazos aqui."
               />
            ) : (
               MOCK_ALERTS.map((alert) => {
                  const config = ALERT_TYPE_CONFIG[alert.type];
                  return (
                     <View key={alert.id} style={styles.alertCard}>
                        <View
                           style={[
                              styles.alertIcon,
                              { backgroundColor: config.bg },
                           ]}
                        >
                           <Ionicons
                              name={config.icon}
                              size={20}
                              color={config.color}
                           />
                        </View>
                        <View style={styles.alertContent}>
                           <View style={styles.alertHeader}>
                              <Text style={styles.alertTitle} numberOfLines={1}>
                                 {alert.title}
                              </Text>
                              <Text style={styles.alertDate}>{alert.date}</Text>
                           </View>
                           <Text style={styles.alertMessage} numberOfLines={2}>
                              {alert.message}
                           </Text>
                        </View>
                     </View>
                  );
               })
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
      color: "rgba(255,255,255,0.65)",
   },
   scroll: {
      flex: 1,
   },
   content: {
      padding: spacing[4],
      paddingBottom: spacing[10],
      gap: spacing[3],
   },
   calendarPlaceholder: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.md,
      padding: spacing[5],
      alignItems: "center",
      gap: spacing[2],
      borderWidth: 1,
      borderColor: colors.border,
      borderStyle: "dashed",
   },
   calendarTitle: {
      ...textPresets.labelMd,
      color: colors.textPrimary,
      textAlign: "center",
   },
   calendarSubtitle: {
      ...textPresets.bodySm,
      color: colors.textSecondary,
      textAlign: "center",
   },
   sectionTitle: {
      ...textPresets.h5,
      color: colors.textPrimary,
      marginTop: spacing[2],
   },
   alertCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: colors.white,
      borderRadius: borderRadius.md,
      padding: spacing[3],
      gap: spacing[3],
      ...shadows.sm,
   },
   alertIcon: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.full,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
   },
   alertContent: {
      flex: 1,
      gap: spacing[1],
   },
   alertHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: spacing[2],
   },
   alertTitle: {
      ...textPresets.labelMd,
      color: colors.textPrimary,
      flex: 1,
   },
   alertDate: {
      ...textPresets.bodySm,
      color: colors.textSecondary,
      flexShrink: 0,
   },
   alertMessage: {
      ...textPresets.bodyMd,
      color: colors.textSecondary,
   },
});
