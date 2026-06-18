import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../theme";

export interface ValidationItemProps {
   icon: keyof typeof Ionicons.glyphMap;
   label: string;
   isValid: boolean;
}

export function ValidationItem({
   icon,
   label,
   isValid,
}: ValidationItemProps): React.JSX.Element {
   return (
      <View style={styles.validationItem}>
         <Ionicons
            name={icon}
            size={18}
            color={isValid ? colors.primary : "rgba(0, 0, 0, 0.2)"}
         />
         <Text
            style={[
               styles.validationText,
               !isValid && styles.validationTextInactive,
            ]}
         >
            {label}
         </Text>
      </View>
   );
}

const styles = StyleSheet.create({
   validationItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[3],
      marginBottom: spacing[2],
   },
   validationText: {
      fontSize: 14,
      fontWeight: "400",
      color: colors.dark,
   },
   validationTextInactive: {
      color: "rgba(0, 0, 0, 0.4)",
   },
});
