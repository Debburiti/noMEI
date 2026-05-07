import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { statusColors, borderRadius, spacing, textPresets } from "../theme";
import type { BidStatus, DocumentStatus } from "../types";

type BadgeStatus = BidStatus | DocumentStatus;

const STATUS_LABELS: Record<BadgeStatus, string> = {
   open: "Aberto",
   analysis: "Em Análise",
   sent: "Enviado",
   winner: "Vencedor",
   closed: "Encerrado",
   pending: "Pendente",
   error: "Erro",
};

const STATUS_ICONS: Record<BadgeStatus, keyof typeof Ionicons.glyphMap> = {
   open: "checkmark-circle",
   analysis: "time",
   sent: "paper-plane",
   winner: "trophy",
   closed: "close-circle",
   pending: "alert-circle",
   error: "close-circle",
};

export interface StatusBadgeProps {
   status: BadgeStatus;
   label?: string;
   showIcon?: boolean;
}

export function StatusBadge({
   status,
   label,
   showIcon,
}: StatusBadgeProps): React.JSX.Element {
   const palette = statusColors[status];
   const displayLabel = label ?? STATUS_LABELS[status];
   const iconName = STATUS_ICONS[status];

   return (
      <View
         style={[
            styles.badge,
            { backgroundColor: palette.bg, borderColor: palette.border },
         ]}
      >
         {showIcon === true && (
            <Ionicons
               name={iconName}
               size={12}
               color={palette.text}
               style={styles.icon}
            />
         )}
         <Text style={[styles.text, { color: palette.text }]}>
            {displayLabel}
         </Text>
      </View>
   );
}

const styles = StyleSheet.create({
   badge: {
      borderRadius: borderRadius.full,
      borderWidth: 1,
      paddingVertical: spacing[1],
      paddingHorizontal: spacing[2],
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
   },
   icon: {},
   text: {
      ...textPresets.labelSm,
   },
});
