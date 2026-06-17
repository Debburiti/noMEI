import { getAccessToken } from './authService';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export type AlertaType = 'new_bid' | 'deadline' | 'status_change' | 'document';

export interface Alerta {
  id: string;
  type: AlertaType;
  title: string;
  message: string;
  date: string;
  read: boolean;
  contratacao_id?: string | null;
}

export interface AlertaListResponse {
  total: number;
  items: Alerta[];
}

// ─── API call ─────────────────────────────────────────────────────────────────

export async function fetchAlertas(): Promise<AlertaListResponse> {
  const token = getAccessToken();
  if (!token) throw new Error('Usuário não autenticado');

  const response = await fetch(`${API_BASE_URL}/alertas/`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Erro ao carregar notificações');
  }

  return response.json() as Promise<AlertaListResponse>;
}
