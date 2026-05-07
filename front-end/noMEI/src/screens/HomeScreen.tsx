import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Header, StatusBadge, RecommendedCard } from "../components";
import type { RecommendedBid } from "../components";
import { colors, spacing, borderRadius, shadows, textPresets } from "../theme";
import type { MainTabScreenProps, BidStatus } from "../types";

type Props = MainTabScreenProps<"Inicio">;

const FILTERS = [
   "Todos",
   "Serviços",
   "Produtos",
   "Maior Valor",
   "Próximo Prazo",
];

const RECOMMENDED: RecommendedBid[] = [
   {
      id: "1",
      title: "Aquisição de Materiais de Escritório para Secretaria de Educação",
      status: "open",
      value: 12450,
      deadline: "15/11",
      compatibility: "Alta",
   },
   {
      id: "2",
      title: "Serviços de Manutenção Preventiva de Ar Condicionado",
      status: "open",
      value: 8900,
      deadline: "22/11",
      compatibility: "Alta",
   },
];

export function HomeScreen({ navigation }: Props): React.JSX.Element {
   const [activeFilter, setActiveFilter] = useState("Todos");
   const [search, setSearch] = useState("");

   return (
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
         {/* Header */}
         <Header
            variant="default"
            notificationCount={3}
            onNotificationPress={() => navigation.navigate("Alertas")}
         />

         <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
         >
            {/* Saudação */}
            <View style={styles.greetingBlock}>
               <Text style={styles.greeting}>Olá, João!</Text>
               <Text style={styles.subtitle}>
                  Bem-vindo ao seu painel de licitações.
               </Text>
            </View>

            {/* Busca */}
            <View style={styles.searchBar}>
               <Ionicons
                  name="search-outline"
                  size={18}
                  color={colors.placeholder}
               />
               <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar licitações..."
                  placeholderTextColor={colors.placeholder}
                  value={search}
                  onChangeText={setSearch}
                  returnKeyType="search"
               />
            </View>

            {/* Filtros */}
            <ScrollView
               horizontal
               showsHorizontalScrollIndicator={false}
               contentContainerStyle={styles.filtersContainer}
            >
               {FILTERS.map((filter) => (
                  <TouchableOpacity
                     key={filter}
                     style={[
                        styles.filterChip,
                        activeFilter === filter && styles.filterChipActive,
                     ]}
                     onPress={() => setActiveFilter(filter)}
                     activeOpacity={0.75}
                  >
                     <Text
                        style={[
                           styles.filterLabel,
                           activeFilter === filter && styles.filterLabelActive,
                        ]}
                     >
                        {filter}
                     </Text>
                  </TouchableOpacity>
               ))}
            </ScrollView>

            {/* Banner de oportunidades */}
            <TouchableOpacity style={styles.banner} activeOpacity={0.9}>
               <View style={styles.bannerContent}>
                  <Text style={styles.bannerTag}>OPORTUNIDADES</Text>
                  <Text style={styles.bannerText}>
                     3 novas licitações para{"\n"}seu CNAE
                  </Text>
               </View>
               <View style={styles.bannerArrow}>
                  <Ionicons
                     name="arrow-forward"
                     size={22}
                     color={colors.primary}
                  />
               </View>
            </TouchableOpacity>

            {/* Recomendadas */}
            <View style={styles.sectionRow}>
               <Text style={styles.sectionTitle}>Recomendadas para você</Text>
               <TouchableOpacity onPress={() => {}}>
                  <Text style={styles.sectionLink}>Ver todas</Text>
               </TouchableOpacity>
            </View>

            {RECOMMENDED.map((bid) => (
               <RecommendedCard
                  key={bid.id}
                  bid={bid}
                  onPress={() =>
                     navigation.navigate("DetalhesLicitacao", {
                        bidId: bid.id,
                        bidTitle: bid.title,
                     })
                  }
               />
            ))}
         </ScrollView>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   safeArea: {
      flex: 1,
      backgroundColor: colors.background,
   },
   scroll: {
      flex: 1,
   },
   content: {
      padding: spacing[4],
      paddingBottom: spacing[10],
      gap: spacing[4],
   },
   greetingBlock: {
      gap: spacing[1],
   },
   greeting: {
      fontSize: 26,
      fontWeight: "800",
      color: colors.textPrimary,
      lineHeight: 32,
   },
   subtitle: {
      ...textPresets.bodyMd,
      color: colors.textSecondary,
   },
   searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.white,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      gap: spacing[2],
      ...shadows.xs,
   },
   searchInput: {
      flex: 1,
      ...textPresets.bodyMd,
      color: colors.textPrimary,
      padding: 0,
   },
   filtersContainer: {
      gap: spacing[2],
      paddingRight: spacing[4],
   },
   filterChip: {
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[4],
      borderRadius: borderRadius.full,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
   },
   filterChipActive: {
      backgroundColor: colors.dark,
      borderColor: colors.dark,
   },
   filterLabel: {
      ...textPresets.labelSm,
      color: colors.textSecondary,
   },
   filterLabelActive: {
      color: colors.white,
   },
   banner: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.lg,
      padding: spacing[5],
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
   bannerContent: {
      flex: 1,
      gap: spacing[1],
   },
   bannerTag: {
      fontSize: 10,
      fontWeight: "700",
      letterSpacing: 1.5,
      color: "rgba(255,255,255,0.75)",
   },
   bannerText: {
      fontSize: 20,
      fontWeight: "800",
      color: colors.white,
      lineHeight: 26,
   },
   bannerArrow: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.full,
      backgroundColor: colors.white,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: spacing[4],
   },
   sectionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   sectionTitle: {
      ...textPresets.h5,
      color: colors.textPrimary,
   },
   sectionLink: {
      ...textPresets.labelSm,
      color: colors.primary,
   },
});
