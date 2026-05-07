export const colors = {
   dark: "#1558C0",
   primary: "#1A6FE0",
   primaryLight: "#E8F0FF",
   success: "#27AE60",
   successLight: "#E8F8EF",
   error: "#E74C3C",
   errorLight: "#FDECEA",
   warning: "#F39C12",
   warningLight: "#FEF5E7",
   background: "#F7F7FD",
   white: "#FFFFFF",
   textPrimary: "#1A1A2E",
   textSecondary: "#6B6B8A",
   border: "#E8E8F0",
   inputBg: "#F0F0F8",
   placeholder: "#A0A0B8",
} as const;

export const statusColors = {
   open: {
      bg: "#E8F8EF",
      text: "#27AE60",
      border: "#27AE60",
   },
   analysis: {
      bg: "#FEF5E7",
      text: "#F39C12",
      border: "#F39C12",
   },
   sent: {
      bg: "#E8F0FF",
      text: "#1A6FE0",
      border: "#1A6FE0",
   },
   winner: {
      bg: "#E8F8EF",
      text: "#1A8F4A",
      border: "#1A8F4A",
   },
   closed: {
      bg: "#F0F0F8",
      text: "#6B6B8A",
      border: "#6B6B8A",
   },
   pending: {
      bg: "#FEF5E7",
      text: "#F39C12",
      border: "#F39C12",
   },
   error: {
      bg: "#FDECEA",
      text: "#E74C3C",
      border: "#E74C3C",
   },
} as const;

export type ColorKey = keyof typeof colors;
export type StatusColorKey = keyof typeof statusColors;
