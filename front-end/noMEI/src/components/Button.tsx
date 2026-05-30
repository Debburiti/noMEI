import React from "react";
import {
   ActivityIndicator,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
   type StyleProp,
   type ViewStyle,
} from "react-native";
import { colors, spacing, borderRadius, textPresets } from "../theme";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
   label: string;
   onPress: () => void;
   variant?: ButtonVariant;
   size?: ButtonSize;
   loading?: boolean;
   disabled?: boolean;
   leftIcon?: React.ReactNode;
   rightIcon?: React.ReactNode;
   style?: StyleProp<ViewStyle>;
   fullWidth?: boolean;
}

export function Button({
   label,
   onPress,
   variant = "primary",
   size = "md",
   loading = false,
   disabled = false,
   leftIcon,
   rightIcon,
   style,
   fullWidth = false,
}: ButtonProps): React.JSX.Element {
   const isDisabled = disabled || loading;

   return (
      <TouchableOpacity
         activeOpacity={0.8}
         onPress={onPress}
         disabled={isDisabled}
         style={[
            styles.base,
            styles[`variant_${variant}`],
            styles[`size_${size}`],
            isDisabled && styles.disabled,
            fullWidth && styles.fullWidth,
            style,
         ]}
      >
         {loading ? (
            <ActivityIndicator
               size="small"
               color={
                  variant === "outline" || variant === "ghost"
                     ? colors.primary
                     : colors.white
               }
            />
         ) : (
            <View style={styles.content}>
               {leftIcon != null && (
                  <View style={styles.iconLeft}>{leftIcon}</View>
               )}
               <Text
                  style={[
                     styles.label,
                     styles[`labelVariant_${variant}`],
                     styles[`labelSize_${size}`],
                  ]}
               >
                  {label}
               </Text>
               {rightIcon != null && (
                  <View style={styles.iconRight}>{rightIcon}</View>
               )}
            </View>
         )}
      </TouchableOpacity>
   );
}

const styles = StyleSheet.create({
   base: {
      borderRadius: borderRadius.md,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
   },
   fullWidth: {
      width: "100%",
   },
   disabled: {
      opacity: 0.45,
   },
   content: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
   },
   iconLeft: {
      marginRight: spacing[2],
   },
   iconRight: {
      marginLeft: spacing[2],
   },
   variant_primary: {
      backgroundColor: colors.primary,
   },
   variant_secondary: {
      backgroundColor: colors.dark,
   },
   variant_outline: {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: colors.primary,
   },
   variant_ghost: {
      backgroundColor: "transparent",
   },
   variant_danger: {
      backgroundColor: colors.error,
   },
   size_sm: {
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[3],
      minHeight: 36,
   },
   size_md: {
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[5],
      minHeight: 48,
   },
   size_lg: {
      paddingVertical: spacing[4],
      paddingHorizontal: spacing[6],
      minHeight: 56,
   },
   label: {
      textAlign: "center",
   },
   labelVariant_primary: {
      color: colors.white,
   },
   labelVariant_secondary: {
      color: colors.white,
   },
   labelVariant_outline: {
      color: colors.primary,
   },
   labelVariant_ghost: {
      color: colors.primary,
   },
   labelVariant_danger: {
      color: colors.white,
   },
   labelSize_sm: {
      ...textPresets.labelSm,
   },
   labelSize_md: {
      ...textPresets.labelMd,
   },
   labelSize_lg: {
      ...textPresets.labelLg,
   },
});
