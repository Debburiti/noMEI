import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, spacing, textPresets } from "../theme";

export interface LoadingStateProps {
   message?: string;
   size?: "small" | "large";
}

export function LoadingState({
   message = "Carregando...",
   size = "large",
}: LoadingStateProps): React.JSX.Element {
   return (
      <View style={styles.container}>
         <ActivityIndicator size={size} color={colors.primary} />
         <Text style={styles.message}>{message}</Text>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing[3],
      paddingVertical: spacing[10],
   },
   message: {
      ...textPresets.bodyMd,
      color: colors.textSecondary,
      textAlign: "center",
   },
});
