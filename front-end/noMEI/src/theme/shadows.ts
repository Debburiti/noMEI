/**
 * @file src/theme/shadows.ts
 * @description Tokens de sombra cross-platform do Design System noMEI.
 *
 * Cada nível combina propriedades iOS (shadow*) com Android (elevation)
 * e deve ser espalhado diretamente no estilo do componente:
 *
 * @example
 * import { shadows } from '@/src/theme';
 * const styles = StyleSheet.create({
 *   card: { ...shadows.md, backgroundColor: '#fff' }
 * });
 */

import type { ViewStyle } from 'react-native';

type ShadowStyle = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

export const shadows = {
  /** Sombra muito sutil — inputs, chips */
  xs: {
    shadowColor: '#1A2B5E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  } satisfies ShadowStyle,

  /** Sombra leve — cards de lista */
  sm: {
    shadowColor: '#1A2B5E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  } satisfies ShadowStyle,

  /** Sombra padrão — cards principais, tab bar */
  md: {
    shadowColor: '#1A2B5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  } satisfies ShadowStyle,

  /** Sombra forte — modais, bottom sheets */
  lg: {
    shadowColor: '#1A2B5E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  } satisfies ShadowStyle,
} as const;
