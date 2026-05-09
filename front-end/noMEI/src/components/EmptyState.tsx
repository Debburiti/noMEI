import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, textPresets } from "../theme";
import { Button } from "./Button";

export interface EmptyStateProps {
   icon?: keyof typeof Ionicons.glyphMap;
   title: string;
   description?: string;
   actionLabel?: string;
   onAction?: () => void;
}

export function EmptyState({
   icon = "document-text-outline",
   title,
   description,
   actionLabel,
   onAction,
}: EmptyStateProps): React.JSX.Element {
   return (
      <View style={styles.container}>
         <View style={styles.iconWrapper}>
            <Ionicons name={icon} size={40} color={colors.primary} />
         </View>
         <Text style={styles.title}>{title}</Text>
         {description != null && (
            <Text style={styles.description}>{description}</Text>
         )}
         {actionLabel != null && onAction != null && (
            <Button
               label={actionLabel}
               onPress={onAction}
               variant="outline"
               size="sm"
               style={styles.action}
            />
         )}
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing[8],
      paddingVertical: spacing[10],
      gap: spacing[3],
   },
   iconWrapper: {
      width: 80,
      height: 80,
      borderRadius: borderRadius.full,
      backgroundColor: colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing[2],
   },
   title: {
      ...textPresets.h5,
      color: colors.textPrimary,
      textAlign: "center",
   },
   description: {
      ...textPresets.bodyMd,
      color: colors.textSecondary,
      textAlign: "center",
   },
   action: {
      marginTop: spacing[2],
   },
});
