/**
 * @file src/theme/spacing.ts
 * @description Escala de espaçamentos e border radius do Design System noMEI.
 *
 * Escala numérica: cada unidade = 4px (grid de 4pt)
 *   spacing[1] = 4px
 *   spacing[2] = 8px
 *   spacing[4] = 16px  ← espaçamento padrão
 *   spacing[8] = 32px
 *   spacing[20] = 80px
 */

// ─── Escala de Espaçamentos (múltiplos de 4) ──────────────────────────────────

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  18: 72,
  20: 80,
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const borderRadius = {
  /** 4px — inputs, botões pequenos */
  xs: 4,
  /** 8px — cards internos, chips */
  sm: 8,
  /** 12px — cards principais */
  md: 12,
  /** 16px — cards grandes, modais */
  lg: 16,
  /** 20px — bottom sheets, painéis */
  xl: 20,
  /** 24px — modais fullscreen */
  '2xl': 24,
  /** 9999px — pílulas, badges, tab pill */
  full: 9999,
} as const;
