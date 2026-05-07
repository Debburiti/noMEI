export { colors, statusColors } from "./colors";
export type { ColorKey, StatusColorKey } from "./colors";
export { fontSizes, fontWeights, lineHeights, textPresets } from "./typography";
export { spacing, borderRadius } from "./spacing";
export { shadows } from "./shadows";

import { colors, statusColors } from "./colors";
import { fontSizes, fontWeights, lineHeights, textPresets } from "./typography";
import { spacing, borderRadius } from "./spacing";
import { shadows } from "./shadows";

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
