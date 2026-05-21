import React, { useState, useEffect } from "react";
import {
   SafeAreaView,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Input, ValidationItem } from "../components";
import { colors, spacing } from "../theme";
import type { RootStackScreenProps } from "../types";

type Props = RootStackScreenProps<"CadastroSenha">;

interface PasswordValidation {
   minLength: boolean;
   hasNumber: boolean;
   hasSymbol: boolean;
}

export function CadastroSenhaScreen({ navigation, route }: Props): React.JSX.Element {
   const [senha, setSenha] = useState("");
   const [confirmarSenha, setConfirmarSenha] = useState("");
   const [showSenha, setShowSenha] = useState(false);
   const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
   const [validation, setValidation] = useState<PasswordValidation>({
      minLength: false,
      hasNumber: false,
      hasSymbol: false,
   });

   const { nome, email, cpfCnpj } = route.params;

   useEffect(() => {
      setValidation({
         minLength: senha.length >= 8,
         hasNumber: /\d/.test(senha),
         hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha),
      });
   }, [senha]);

   const isValidPassword =
      validation.minLength && validation.hasNumber && validation.hasSymbol;
   const passwordsMatch = senha === confirmarSenha && isValidPassword;

   function handleContinuar(): void {
      if (passwordsMatch) {
         navigation.navigate("CadastroConfirmacao", {
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
               <View style={styles.progressDotActive} />
               <View style={styles.progressLine} />
               <View style={[styles.progressDot, styles.progressDotActive]} />
               <View style={styles.progressLine} />
               <View style={styles.progressDot} />
            </View>

            <Text style={styles.title}>Crie sua senha</Text>
            <Text style={styles.subtitle}>
               Escolha uma senha forte para proteger seu acesso
            </Text>

            <View style={styles.formContainer}>
               <Input
                  label="SENHA"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!showSenha}
                  rightIcon={showSenha ? "eye-off" : "eye"}
                  onRightIconPress={() => setShowSenha(!showSenha)}
               />

               <Input
                  label="CONFIRMAR SENHA"
                  placeholder="Repita sua senha"
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  secureTextEntry={!showConfirmarSenha}
                  rightIcon={showConfirmarSenha ? "eye-off" : "eye"}
                  onRightIconPress={() =>
                     setShowConfirmarSenha(!showConfirmarSenha)
                  }
               />
            </View>

            <View style={styles.validationContainer}>
               <Text style={styles.validationTitle}>Sua senha deve conter:</Text>

               <ValidationItem
                  icon="checkmark-circle"
                  label="Mínimo de 8 caracteres"
                  isValid={validation.minLength}
               />
               <ValidationItem
                  icon="checkmark-circle"
                  label="Pelo menos um número"
                  isValid={validation.hasNumber}
               />
               <ValidationItem
                  icon="checkmark-circle"
                  label="Pelo menos um símbolo (ex: @, #, $, %)"
                  isValid={validation.hasSymbol}
               />
            </View>

            <View style={styles.buttonContainer}>
               <Button
                  label="Continuar"
                  onPress={handleContinuar}
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!passwordsMatch}
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
      width: 10,
      height: 10,
      borderRadius: 5,
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
      marginBottom: spacing[6],
   },
   validationContainer: {
      marginBottom: spacing[8],
   },
   validationTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.dark,
      marginBottom: spacing[3],
   },
   buttonContainer: {
      width: "100%",
   },
});
