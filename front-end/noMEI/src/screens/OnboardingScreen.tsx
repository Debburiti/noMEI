import React from "react";
import {
   SafeAreaView,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../components";
import { colors, spacing, borderRadius, textPresets } from "../theme";
import type { RootStackScreenProps } from "../types";

type Props = RootStackScreenProps<"Onboarding">;

export function OnboardingScreen({ navigation }: Props): React.JSX.Element {
   function handleEnterWithEmail(): void {
      navigation.navigate("ProfileSetup");
   }

   return (
      <SafeAreaView style={styles.safeArea}>
         <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
         >
            {/* Logo */}
            <View style={styles.logoContainer}>
               <Text style={styles.logoText}>no</Text>
               <Text style={styles.logoTextBold}>MEI</Text>
            </View>

            {/* Ilustração placeholder */}
            <View style={styles.illustrationContainer}>
               <View style={styles.illustrationCircle}>
                  <Ionicons
                     name="briefcase-outline"
                     size={64}
                     color={colors.primaryLight}
                  />
               </View>
               {/* Elementos decorativos */}
               <View style={[styles.decorDot, styles.decorDot1]} />
               <View style={[styles.decorDot, styles.decorDot2]} />
               <View style={[styles.decorDot, styles.decorDot3]} />
            </View>

            {/* Textos */}
            <View style={styles.textContainer}>
               <Text style={styles.title}>Licitações sem{"\n"}complicação</Text>
               <Text style={styles.subtitle}>
                  Descomplique e aumente seu poder de vender para o governo com
                  segurança e confiança.
               </Text>
            </View>

            {/* CTAs */}
            <View style={styles.ctaContainer}>
               <Button
                  label="Entrar com e-mail"
                  onPress={handleEnterWithEmail}
                  variant="primary"
                  size="lg"
                  fullWidth
                  leftIcon={
                     <Ionicons
                        name="mail-outline"
                        size={20}
                        color={colors.white}
                     />
                  }
               />

               <TouchableOpacity
                  style={styles.govbrButton}
                  onPress={handleEnterWithEmail}
                  activeOpacity={0.8}
               >
                  <Ionicons
                     name="shield-checkmark-outline"
                     size={18}
                     color={colors.dark}
                  />
                  <Text style={styles.govbrText}>Entrar com Gov.br</Text>
               </TouchableOpacity>
            </View>

            {/* Link informativo */}
            <TouchableOpacity style={styles.infoLink} activeOpacity={0.7}>
               <Text style={styles.infoLinkText}>O que é o noMEI?</Text>
            </TouchableOpacity>
         </ScrollView>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   safeArea: {
      flex: 1,
      backgroundColor: colors.dark,
   },
   scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing[6],
      paddingTop: spacing[8],
      paddingBottom: spacing[8],
      alignItems: "center",
   },
   logoContainer: {
      flexDirection: "row",
      alignItems: "baseline",
      alignSelf: "flex-start",
      marginBottom: spacing[8],
   },
   logoText: {
      fontSize: 28,
      fontWeight: "400",
      color: colors.white,
      letterSpacing: -0.5,
   },
   logoTextBold: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.primaryLight,
      letterSpacing: -0.5,
   },
   illustrationContainer: {
      width: 220,
      height: 220,
      marginBottom: spacing[8],
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
   },
   illustrationCircle: {
      width: 160,
      height: 160,
      borderRadius: borderRadius.full,
      backgroundColor: "rgba(45, 91, 227, 0.25)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: "rgba(45, 91, 227, 0.4)",
   },
   decorDot: {
      position: "absolute",
      borderRadius: borderRadius.full,
      backgroundColor: colors.primary,
      opacity: 0.6,
   },
   decorDot1: {
      width: 12,
      height: 12,
      top: 20,
      right: 30,
   },
   decorDot2: {
      width: 8,
      height: 8,
      bottom: 30,
      left: 20,
      backgroundColor: colors.warning,
   },
   decorDot3: {
      width: 16,
      height: 16,
      top: 40,
      left: 10,
      opacity: 0.3,
   },
   textContainer: {
      alignItems: "center",
      marginBottom: spacing[8],
      gap: spacing[3],
   },
   title: {
      ...textPresets.h2,
      color: colors.white,
      textAlign: "center",
   },
   subtitle: {
      ...textPresets.bodyLg,
      color: "rgba(255,255,255,0.7)",
      textAlign: "center",
      lineHeight: 24,
   },
   ctaContainer: {
      width: "100%",
      gap: spacing[3],
      marginBottom: spacing[6],
   },
   govbrButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing[2],
      backgroundColor: colors.white,
      borderRadius: borderRadius.md,
      paddingVertical: spacing[4],
      minHeight: 56,
   },
   govbrText: {
      ...textPresets.labelLg,
      color: colors.dark,
   },
   infoLink: {
      paddingVertical: spacing[2],
   },
   infoLinkText: {
      ...textPresets.bodyMd,
      color: "rgba(255,255,255,0.5)",
      textDecorationLine: "underline",
   },
});
