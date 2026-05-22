import { getAccessToken } from './authService';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AlertaType = 'new_bid' | 'deadline' | 'status_change' | 'document';

export interface Alerta {
  id: string;
  type: AlertaType;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface AlertaListResponse {
  total: number;
  items: Alerta[];
}

// ─── API call ─────────────────────────────────────────────────────────────────

export async function fetchAlertas(): Promise<AlertaListResponse> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/alertas/`, { headers });

  if (!response.ok) {
    throw new Error('Erro ao carregar notificações');
  }

  return response.json() as Promise<AlertaListResponse>;
}
