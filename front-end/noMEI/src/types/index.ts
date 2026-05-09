/**
 * @file src/types/index.ts
 * @description Tipos globais do app noMEI.
 *
 * Contém:
 *  - Parâmetros de rota (RootStackParamList, MainTabParamList)
 *  - Tipos de domínio (BidStatus, DocumentStatus, Bid, Document)
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

// ─── Status Types ────────────────────────────────────────────────────────────

export type BidStatus =
  | 'open'      // Aberto
  | 'analysis'  // Em análise
  | 'sent'      // Enviado
  | 'winner'    // Vencedor
  | 'closed';   // Encerrado

export type DocumentStatus =
  | 'pending'   // Pendente
  | 'sent'      // Enviado
  | 'error';    // Erro

// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface Bid {
  id: string;
  title: string;
  agency: string;
  value: number;
  status: BidStatus;
  deadline: string;
  compatibility: number; // 0–100
  category: string;
  description?: string;
}

export interface BidDocument {
  id: string;
  name: string;
  status: DocumentStatus;
  description?: string;
  uploadedAt?: string;
}

export interface Alert {
  id: string;
  type: 'new_bid' | 'deadline' | 'status_change' | 'document';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

// ─── Navigation Param Lists ───────────────────────────────────────────────────

export type RootStackParamList = {
  Onboarding: undefined;
  ProfileSetup: undefined;
  MainTabs: undefined;
  DetalhesLicitacao: {
    bidId: string;
    bidTitle: string;
  };
  Alertas: undefined;
};

export type MainTabParamList = {
  Inicio: undefined;
  Disputas: undefined;
  Documentos: undefined;
  Perfil: undefined;
};

// ─── Screen Props Helpers ─────────────────────────────────────────────────────

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;
