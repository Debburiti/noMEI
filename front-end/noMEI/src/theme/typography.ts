/**
 * @file src/theme/typography.ts
 * @description Tokens de tipografia do Design System noMEI.
 *
 * Inclui:
 *  - Tamanhos de fonte (fontSizes)
 *  - Pesos de fonte (fontWeights)
 *  - Alturas de linha (lineHeights)
 *  - Presets nomeados (TextStyle objects prontos para uso)
 */

import type { TextStyle } from 'react-native';

// ─── Tamanhos de Fonte ────────────────────────────────────────────────────────

export const fontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
} as const;

// ─── Pesos de Fonte ───────────────────────────────────────────────────────────

export const fontWeights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
} as const satisfies Record<string, TextStyle['fontWeight']>;

// ─── Alturas de Linha ─────────────────────────────────────────────────────────

export const lineHeights = {
  tight: 1.2,   // Títulos grandes
  snug: 1.35,   // Subtítulos
  normal: 1.5,  // Corpo de texto
  relaxed: 1.65,// Texto corrido
} as const;

// ─── Presets Nomeados ─────────────────────────────────────────────────────────
// Objetos TextStyle prontos — use diretamente no StyleSheet.

export const textPresets = {
  // Headings
  h1: {
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.extraBold,
    lineHeight: fontSizes['4xl'] * lineHeights.tight,
  } satisfies TextStyle,

  h2: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes['3xl'] * lineHeights.tight,
  } satisfies TextStyle,

  h3: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes['2xl'] * lineHeights.snug,
  } satisfies TextStyle,

  h4: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.xl * lineHeights.snug,
  } satisfies TextStyle,

  h5: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.lg * lineHeights.snug,
  } satisfies TextStyle,

  // Body
  bodyLg: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.base * lineHeights.normal,
  } satisfies TextStyle,

  bodyMd: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.md * lineHeights.normal,
  } satisfies TextStyle,

  bodySm: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.sm * lineHeights.normal,
  } satisfies TextStyle,

  // Labels (texto de UI — botões, badges, tabs)
  labelLg: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.base * lineHeights.tight,
  } satisfies TextStyle,

  labelMd: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.md * lineHeights.tight,
  } satisfies TextStyle,

  labelSm: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.sm * lineHeights.tight,
  } satisfies TextStyle,

  // Currency (valores monetários em BRL)
  currency: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes['2xl'] * lineHeights.tight,
  } satisfies TextStyle,

  currencySm: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.lg * lineHeights.tight,
  } satisfies TextStyle,
} as const;
