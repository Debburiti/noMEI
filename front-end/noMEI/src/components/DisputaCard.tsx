import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./Button";
import { colors, spacing, borderRadius, shadows, textPresets } from "../theme";
import type { BidStatus } from "../types";

export interface DisputaItem {
   id: string;
   title: string;
   modality: string;
   status: BidStatus;
   updatedAt: string;
   progress: number;
   isWinner?: boolean;
}

export interface DisputaCardProps {
   item: DisputaItem;
   onPressDetails?: () => void;
   onPressContract?: () => void;
}

export function DisputaCard({
   item,
   onPressDetails,
   onPressContract,
}: DisputaCardProps): React.JSX.Element {
   const progressColor =
      item.isWinner === true
         ? colors.success
         : item.progress >= 70
           ? colors.primary
           : colors.primary;

   return (
      <View style={cardStyles.card}>
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
                  rightIcon={
                     <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={colors.primary}
                     />
                  }
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   progressLabel: {
      ...textPresets.bodySm,
      color: colors.textSecondary,
   },
   progressPct: {
      ...textPresets.labelSm,
      fontWeight: "700",
   },
   progressTrack: {
      height: 6,
      backgroundColor: colors.border,
      borderRadius: borderRadius.full,
      overflow: "hidden",
   },
   progressFill: {
      height: "100%",
      borderRadius: borderRadius.full,
   },
   ctaRow: {
      alignItems: "flex-end",
   },
});
