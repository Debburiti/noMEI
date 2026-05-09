import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBadge } from "./StatusBadge";
import { colors, spacing, borderRadius, shadows, textPresets } from "../theme";
import type { BidStatus } from "../types";

export interface RecommendedBid {
   id: string;
   title: string;
   status: BidStatus;
   value: number;
   deadline: string;
   compatibility: "Alta" | "Média" | "Baixa";
}

export interface RecommendedCardProps {
   bid: RecommendedBid;
   onPress?: () => void;
}

function formatBRL(value: number): string {
   return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function RecommendedCard({
   bid,
   onPress,
}: RecommendedCardProps): React.JSX.Element {
   const compatColor =
      bid.compatibility === "Alta"
         ? colors.primary
         : bid.compatibility === "Média"
           ? colors.warning
           : colors.error;

   return (
      <TouchableOpacity
         style={cardStyles.card}
         onPress={onPress}
         activeOpacity={0.85}
      >
         {/* Título + Badge */}
         <View style={cardStyles.topRow}>
            <Text style={cardStyles.title} numberOfLines={3}>
               {bid.title}
            </Text>
            <StatusBadge status={bid.status} />
         </View>

         {/* Valor Estimado */}
         <View style={cardStyles.valueBlock}>
            <Text style={cardStyles.valueLabel}>VALOR ESTIMADO</Text>
            <Text style={cardStyles.valueAmount}>{formatBRL(bid.value)}</Text>
         </View>

         {/* Chips: Prazo + Compatibilidade */}
         <View style={cardStyles.chipsRow}>
            <View style={cardStyles.chip}>
               <Ionicons
                  name="calendar-outline"
                  size={13}
                  color={colors.textSecondary}
               />
               <Text style={cardStyles.chipText}> Prazo: {bid.deadline}</Text>
            </View>
            <View style={[cardStyles.chip, cardStyles.compatChip]}>
               <Ionicons
                  name="shield-checkmark-outline"
                  size={13}
                  color={compatColor}
               />
               <Text style={[cardStyles.chipText, { color: compatColor }]}>
                  {" "}
                  {bid.compatibility} Compatibilidade
               </Text>
            </View>
         </View>
      </TouchableOpacity>
   );
}

const cardStyles = StyleSheet.create({
   card: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.md,
      padding: spacing[4],
      gap: spacing[3],
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.sm,
   },
   topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: spacing[3],
   },
   title: {
      ...textPresets.labelMd,
      color: colors.textPrimary,
      flex: 1,
      lineHeight: 20,
   },
   valueBlock: {
      gap: 2,
   },
   valueLabel: {
      fontSize: 10,
      fontWeight: "700",
      letterSpacing: 1.2,
      color: colors.textSecondary,
   },
   valueAmount: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.success,
      lineHeight: 34,
   },
   chipsRow: {
      flexDirection: "row",
      gap: spacing[2],
      flexWrap: "wrap",
   },
   chip: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.inputBg,
      borderRadius: borderRadius.full,
      paddingVertical: spacing[1],
      paddingHorizontal: spacing[2],
   },
   compatChip: {
      backgroundColor: colors.primaryLight,
   },
   chipText: {
      ...textPresets.bodySm,
      color: colors.textSecondary,
   },
});
