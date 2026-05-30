import React from "react";
import {
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
   type StyleProp,
   type ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, shadows, textPresets } from "../theme";
import { StatusBadge } from "./StatusBadge";
import type { BidStatus } from "../types";

export interface BidCardProps {
   title: string;
   agency: string;
   value: number;
   status: BidStatus;
   deadline: string;
   compatibility: number;
   progress?: number;
   onPress?: () => void;
   style?: StyleProp<ViewStyle>;
}

function formatBRL(value: number): string {
   return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
   });
}

export function BidCard({
   title,
   agency,
   value,
   status,
   deadline,
   compatibility,
   progress,
   onPress,
   style,
}: BidCardProps): React.JSX.Element {
   const compatibilityColor =
      compatibility >= 80
         ? colors.success
         : compatibility >= 50
           ? colors.warning
           : colors.error;

   return (
      <TouchableOpacity
         activeOpacity={onPress != null ? 0.85 : 1}
         onPress={onPress}
         style={[styles.card, style]}
      >
         {/* Acento lateral de status */}
         <View
            style={[styles.accentBar, { backgroundColor: colors.primary }]}
         />

         <View style={styles.content}>
            {/* Header do card */}
            <View style={styles.header}>
               <StatusBadge status={status} />
               <Text style={styles.compatibility} numberOfLines={1}>
                  <Text
                     style={[
                        styles.compatibilityValue,
                        { color: compatibilityColor },
                     ]}
                  >
                     {compatibility}%
                  </Text>{" "}
                  compatível
               </Text>
            </View>

            {/* Título */}
            <Text style={styles.title} numberOfLines={2}>
               {title}
            </Text>

            {/* Órgão */}
            <View style={styles.agencyRow}>
               <Ionicons
                  name="business-outline"
                  size={13}
                  color={colors.textSecondary}
               />
               <Text style={styles.agency} numberOfLines={1}>
                  {" "}
                  {agency}
               </Text>
            </View>

            {/* Valor */}
            <Text style={styles.value}>{formatBRL(value)}</Text>

            {/* Barra de progresso (opcional — tela Disputas) */}
            {progress != null && (
               <View style={styles.progressContainer}>
                  <View style={styles.progressTrack}>
                     <View
                        style={[
                           styles.progressFill,
                           {
                              width: `${Math.min(Math.max(progress, 0), 100)}%`,
                           },
                        ]}
                     />
                  </View>
                  <Text style={styles.progressLabel}>{progress}%</Text>
               </View>
            )}

            {/* Footer: prazo */}
            <View style={styles.footer}>
               <Ionicons
                  name="time-outline"
                  size={13}
                  color={colors.textSecondary}
               />
               <Text style={styles.deadline}> {deadline}</Text>
            </View>
         </View>
      </TouchableOpacity>
   );
}

const styles = StyleSheet.create({
   card: {
      flexDirection: "row",
      backgroundColor: colors.white,
      borderRadius: borderRadius.md,
      ...shadows.sm,
      overflow: "hidden",
      marginBottom: spacing[3],
   },
   accentBar: {
      width: 4,
   },
   content: {
      flex: 1,
      padding: spacing[3],
      gap: spacing[2],
   },
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   compatibility: {
      ...textPresets.bodySm,
      color: colors.textSecondary,
   },
   compatibilityValue: {
      fontWeight: "700",
   },
   title: {
      ...textPresets.labelMd,
      color: colors.textPrimary,
   },
   agencyRow: {
      flexDirection: "row",
      alignItems: "center",
   },
   agency: {
      ...textPresets.bodySm,
      color: colors.textSecondary,
      flex: 1,
   },
   value: {
      ...textPresets.currencySm,
      color: colors.dark,
   },
   progressContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[2],
   },
   progressTrack: {
      flex: 1,
      height: 4,
      backgroundColor: colors.border,
      borderRadius: borderRadius.full,
      overflow: "hidden",
   },
   progressFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: borderRadius.full,
   },
   progressLabel: {
      ...textPresets.labelSm,
      color: colors.textSecondary,
      minWidth: 32,
      textAlign: "right",
   },
   footer: {
      flexDirection: "row",
      alignItems: "center",
   },
   deadline: {
      ...textPresets.bodySm,
      color: colors.textSecondary,
   },
});
