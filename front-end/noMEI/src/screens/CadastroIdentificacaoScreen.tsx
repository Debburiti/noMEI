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
import { colors, spacing, borderRadius, textPresets } from "../theme";
import type { RootStackScreenProps } from "../types";

type Props = RootStackScreenProps<"CadastroIdentificacao">;

export function CadastroIdentificacaoScreen({
   navigation,
}: Props): React.JSX.Element {
   const [nome, setNome] = useState("");
   const [email, setEmail] = useState("");
   const [cpfCnpj, setCpfCnpj] = useState("");
   const [currentStep, setCurrentStep] = useState(1);

   function handleContinuar(): void {
      if (nome && email && cpfCnpj) {
         navigation.navigate("CadastroSenha", {
            nome,
            email,
            cpfCnpj,
         });
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
            <View style={styles.progressContainer}>
               <View style={[styles.progressDot, styles.progressDotActive]} />
               <View style={styles.progressLine} />
               <View style={styles.progressDot} />
               <View style={styles.progressLine} />
               <View style={styles.progressDot} />
            </View>

            <Text style={styles.title}>Crie sua conta</Text>
            <Text style={styles.subtitle}>
               Comece preenchendo seus dados básicos
            </Text>

            <View style={styles.formContainer}>
               <Input
                  label="Nome completo"
                  placeholder="Digite seu nome completo"
                  value={nome}
                  onChangeText={setNome}
                  autoCapitalize="words"
               />

               <Input
                  label="E-mail"
                  placeholder="seu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
               />

               <Input
                  label="CPF ou CNPJ"
                  placeholder="000.000.000-00"
                  value={cpfCnpj}
                  onChangeText={setCpfCnpj}
                  keyboardType="numeric"
               />
            </View>

            <View style={styles.buttonContainer}>
               <Button
                  label="Continuar"
                  onPress={handleContinuar}
                  variant="primary"
                  size="lg"
                  fullWidth
                  rightIcon={
                     <Ionicons
                        name="arrow-forward"
                        size={20}
                        color={colors.white}
                     />
                  }
               />
            </View>
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
   },
   progressContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing[8],
   },
   progressDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: "rgba(45, 91, 227, 0.2)",
   },
   progressDotActive: {
      backgroundColor: colors.primary,
   },
   progressLine: {
      width: 40,
      height: 2,
      backgroundColor: "rgba(45, 91, 227, 0.2)",
      marginHorizontal: spacing[2],
   },
   title: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.dark,
      marginBottom: spacing[2],
   },
   subtitle: {
      fontSize: 14,
      fontWeight: "400",
      color: "rgba(0, 0, 0, 0.6)",
      marginBottom: spacing[6],
      lineHeight: 20,
   },
   formContainer: {
      gap: spacing[4],
      marginBottom: spacing[8],
   },
   buttonContainer: {
      width: "100%",
   },
});
