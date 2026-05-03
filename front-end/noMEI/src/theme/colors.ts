/**
 * @file src/theme/colors.ts
 * @description Paleta de cores oficial do app noMEI.
 *
 * Extraída do protótipo visual. Todos os valores são literais
 * para suporte a autocompletar e type-safety.
 */

export const colors = {
  // ─── Brand ────────────────────────────────────────────────────
  /** Azul escuro — header, fundo de telas de auth */
  dark: '#1A2B5E',
  /** Azul primário — CTAs, destaques, links */
  primary: '#2D5BE3',
  /** Azul primário suave — fundo do pill ativo na tab bar */
  primaryLight: '#EBF0FF',

  // ─── Semantic ─────────────────────────────────────────────────
  /** Verde sucesso */
  success: '#27AE60',
  /** Verde sucesso suave */
  successLight: '#E8F8EF',
  /** Vermelho erro */
  error: '#E74C3C',
  /** Vermelho erro suave */
  errorLight: '#FDECEA',
  /** Amarelo warning */
  warning: '#F39C12',
  /** Amarelo warning suave */
  warningLight: '#FEF5E7',

  // ─── Neutros ──────────────────────────────────────────────────
  /** Fundo claro das telas */
  background: '#F7F7FD',
  /** Branco puro — cards, inputs, tab bar */
  white: '#FFFFFF',
  /** Texto principal */
  textPrimary: '#1A1A2E',
  /** Texto secundário / labels */
  textSecondary: '#6B6B8A',
  /** Borda sutil */
  border: '#E8E8F0',
  /** Fundo de inputs desabilitados */
  inputBg: '#F0F0F8',
  /** Placeholder de inputs */
  placeholder: '#A0A0B8',
} as const;

// ─── Status Colors ────────────────────────────────────────────────────────────

export const statusColors = {
  /** Licitação aberta para participação */
  open: {
    bg: '#E8F8EF',
    text: '#27AE60',
    border: '#27AE60',
  },
  /** Proposta em análise pelo órgão */
  analysis: {
    bg: '#FEF5E7',
    text: '#F39C12',
    border: '#F39C12',
  },
  /** Proposta enviada / aguardando resultado */
  sent: {
    bg: '#EBF0FF',
    text: '#2D5BE3',
    border: '#2D5BE3',
  },
  /** MEI vencedor da licitação */
  winner: {
    bg: '#E8F8EF',
    text: '#1A8F4A',
    border: '#1A8F4A',
  },
  /** Licitação encerrada */
  closed: {
    bg: '#F0F0F8',
    text: '#6B6B8A',
    border: '#6B6B8A',
  },
  /** Documento pendente de envio */
  pending: {
    bg: '#FEF5E7',
    text: '#F39C12',
    border: '#F39C12',
  },
  /** Documento enviado com sucesso */
  // 'sent' já coberto acima — reutilizamos o mesmo objeto

  /** Documento com erro no envio */
  error: {
    bg: '#FDECEA',
    text: '#E74C3C',
    border: '#E74C3C',
  },
} as const;

export type ColorKey = keyof typeof colors;
export type StatusColorKey = keyof typeof statusColors;
