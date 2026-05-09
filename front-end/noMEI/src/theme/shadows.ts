import type { ViewStyle } from "react-native";

type ShadowStyle = Pick<
   ViewStyle,
   | "shadowColor"
   | "shadowOffset"
   | "shadowOpacity"
   | "shadowRadius"
   | "elevation"
>;

export const shadows = {
   xs: {
      shadowColor: "#1A2B5E",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
   } satisfies ShadowStyle,
   sm: {
      shadowColor: "#1A2B5E",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
   } satisfies ShadowStyle,
   md: {
      shadowColor: "#1A2B5E",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
   } satisfies ShadowStyle,
   lg: {
      shadowColor: "#1A2B5E",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
   } satisfies ShadowStyle,
} as const;
