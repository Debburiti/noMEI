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
import { colors, spacing } from "../theme";
import type { RootStackScreenProps } from "../types";

type Props = RootStackScreenProps<"CadastroConfirmacao">;

export function CadastroConfirmacaoScreen({
   navigation,
   route,
}: Props): React.JSX.Element {
   const { nome, email, cpfCnpj } = route.params;

   function handleConfirmar(): void {
      navigation.navigate("CadastroSucesso");
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
               <View style={styles.progressDotActive} />
               <View style={styles.progressLine} />
               <View style={[styles.progressDot, styles.progressDotActive]} />
            </View>

            <Text style={styles.title}>Confirme seus dados</Text>
            <Text style={styles.subtitle}>
               Revise as informações antes de finalizar o cadastro
            </Text>

            <View style={styles.cardContainer}>
               <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Nome Completo</Text>
                  <Text style={styles.dataValue}>{nome}</Text>
               </View>

               <View style={styles.divider} />

               <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>E-mail</Text>
                  <Text style={styles.dataValue}>{email}</Text>
               </View>

               <View style={styles.divider} />

               <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>CNPJ</Text>
                  <Text style={styles.dataValue}>{cpfCnpj}</Text>
               </View>
            </View>

            <View style={styles.buttonContainer}>
               <Button
                  label="Confirmar e Finalizar"
                  onPress={handleConfirmar}
                  variant="primary"
                  size="lg"
                  fullWidth
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
   cardContainer: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: spacing[4],
      marginBottom: spacing[8],
      borderWidth: 1,
      borderColor: "rgba(0, 0, 0, 0.05)",
   },
   dataRow: {
      paddingVertical: spacing[2],
   },
   dataLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: "rgba(0, 0, 0, 0.5)",
      textTransform: "uppercase",
      marginBottom: 4,
   },
   dataValue: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.dark,
   },
   divider: {
      height: 1,
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      marginVertical: spacing[2],
   },
   buttonContainer: {
      width: "100%",
      marginTop: "auto",
   },
});
