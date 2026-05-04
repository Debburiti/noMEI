/**
 * @file src/theme/index.ts
 * @description Barrel export do Design System noMEI.
 *
 * Uso recomendado:
 *   import { theme } from '@/src/theme';
 *   theme.colors.primary
 *   theme.spacing[4]
 *   theme.textPresets.h1
 *
 * Ou imports nomeados para tree-shaking:
 *   import { colors, spacing, textPresets } from '@/src/theme';
 */

export { colors, statusColors } from './colors';
export type { ColorKey, StatusColorKey } from './colors';

export { fontSizes, fontWeights, lineHeights, textPresets } from './typography';

export { spacing, borderRadius } from './spacing';

export { shadows } from './shadows';

// ─── Objeto unificado ─────────────────────────────────────────────────────────

import { colors, statusColors } from './colors';
import { fontSizes, fontWeights, lineHeights, textPresets } from './typography';
import { spacing, borderRadius } from './spacing';
import { shadows } from './shadows';

export const theme = {
  colors,
  statusColors,
  fontSizes,
  fontWeights,
  lineHeights,
  textPresets,
  spacing,
  borderRadius,
  shadows,
} as const;

export type Theme = typeof theme;
