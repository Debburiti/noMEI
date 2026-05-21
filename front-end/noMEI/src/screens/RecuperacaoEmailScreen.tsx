import React, { useState } from "react";
import {
   SafeAreaView,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Input } from "../components";
import { colors, spacing } from "../theme";
import type { RootStackScreenProps } from "../types";

type Props = RootStackScreenProps<"RecuperacaoEmail">;

export function RecuperacaoEmailScreen({
   navigation,
}: Props): React.JSX.Element {
   const [email, setEmail] = useState("");

   function handleContinuar(): void {
      if (email) {
         navigation.navigate("RecuperacaoSenha", { email });
      }
   }

   function handleBackPress(): void {
      navigation.goBack();
   }

   return (
      <SafeAreaView style={styles.safeArea}>
         <View style={styles.header}>
            <TouchableOpacity onPress={handleBackPress} activeOpacity={0.7}>
               <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>noMEI</Text>
            <View style={{ width: 24 }} />
         </View>

         <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
         >
            <View style={styles.iconContainer}>
               <Ionicons
                  name="lock-open-outline"
                  size={48}
                  color={colors.primary}
               />
            </View>

            <Text style={styles.title}>Recuperar Acesso</Text>
            <Text style={styles.subtitle}>
               Digite o e-mail associado à sua conta. Enviaremos um link para
               redefinir sua senha.
            </Text>

            <View style={styles.formContainer}>
               <Input
                  label="E-mail"
                  placeholder="seu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
               />
            </View>

            <View style={styles.buttonContainer}>
               <Button
                  label="Continuar"
                  onPress={handleContinuar}
                  variant="primary"
                  size="lg"
                  fullWidth
               />
            </View>

            <TouchableOpacity
               onPress={handleBackPress}
               activeOpacity={0.7}
               style={styles.backLink}
            >
               <Text style={styles.backLinkText}>Voltar para Login</Text>
            </TouchableOpacity>
         </ScrollView>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   safeArea: {
      flex: 1,
      backgroundColor: colors.white,
   },
   header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.primary,
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[4],
   },
   headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.white,
   },
   scrollContent: {
      paddingHorizontal: spacing[6],
      paddingTop: spacing[6],
      paddingBottom: spacing[8],
      flexGrow: 1,
      justifyContent: "space-between",
   },
   iconContainer: {
      alignItems: "center",
      marginBottom: spacing[6],
      marginTop: spacing[4],
   },
   title: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.dark,
      marginBottom: spacing[2],
      textAlign: "center",
   },
   subtitle: {
      fontSize: 14,
      fontWeight: "400",
      color: "rgba(0, 0, 0, 0.6)",
      marginBottom: spacing[8],
      lineHeight: 20,
      textAlign: "center",
   },
   formContainer: {
      gap: spacing[4],
      marginBottom: spacing[8],
   },
   buttonContainer: {
      width: "100%",
      marginBottom: spacing[4],
   },
   backLink: {
      alignItems: "center",
      paddingVertical: spacing[3],
   },
   backLinkText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.primary,
      textDecorationLine: "underline",
   },
});
