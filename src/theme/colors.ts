// Color tokens for both themes. Every screen should read colors
// from useTheme() (see ThemeContext.tsx) instead of hardcoding
// hex strings directly — that's what actually makes dark mode
// work per-screen. These two palettes are deliberately close in
// structure (same keys) so a screen retrofitted once works
// correctly in both themes without further changes.
//
// Values come from the Foursquare Church brand guide (page 06).
// Every key that existed before is kept, so existing screens pick
// up the brand colours with no code changes. Keys marked NEW are
// optional extras for the redesigned screens.

// Raw brand palette, exactly as the guide lists it. Screens should
// not use these directly; use the semantic tokens below.
export const brand = {
  // Main colours
  crossRed: "#A61B24",
  doveYellow: "#F8D562",
  cupBlue: "#4251A3",
  crownPurple: "#795EBC",
  mainCream: "#F2EAD1",

  // Supporting colours
  orange: "#EF6736",
  blueGreen: "#A1CBB5",
  darkBlue: "#1F5986",
  coolBlue: "#4158F8",
  darkPurple: "#441475",
  softPurple: "#B5A4E1",
  aimeeRed: "#FF2735",
  aimeeYellow: "#F8D562",
  aimeeBlue: "#34A7F7",
  aimeePurple: "#B67EE7",
};
// Note: no `as const` on `brand`. With it, tokens like
// `primary: brand.cupBlue` get typed as the literal "#4251A3",
// and darkColors can't assign a different value to them.

// Brand gradients, for expo-linear-gradient's `colors` prop.
// Decorative only: the light end of most is too pale for text.
export const gradients = {
  sunrise: [brand.aimeeYellow, brand.orange],
  royal: [brand.crownPurple, brand.aimeePurple],
  ocean: [brand.blueGreen, brand.darkBlue],
  lavender: [brand.blueGreen, brand.aimeePurple],
  sky: [brand.aimeeBlue, brand.coolBlue],
  ember: [brand.aimeeRed, brand.aimeePurple],
} as const;

export type ColorTokens =
  typeof lightColors;

export const lightColors = {
  // Base surfaces
  background: "#F7F4EC", // warm off-white from Main Cream
  surface: "#FFFFFF",
  surfaceAlt: "#F1EDE2",

  // Text
  textPrimary: "rgba(17, 17, 17, 0.92)",
  textSecondary: "rgba(17, 17, 17, 0.7)",
  textMuted: "rgba(0, 0, 0, 0.6)", // was 0.5; 0.6 keeps 4.5:1 on the warm background
  textOnPrimary: "#FFFFFF",

  // Brand / accent
  primary: brand.cupBlue, // 7.1:1 with white text
  primaryMuted: "#E7E9F5",

  // NEW: brand roles
  onPrimaryMuted: "#2B3570", // text/icons on primaryMuted
  accent: brand.doveYellow, // highlights, badges, labels on primary
  textOnAccent: "#2B1D00",
  warmSurface: brand.mainCream, // reflection card, scripture quotes
  onWarmSurface: "#7A4E00",
  secondary: brand.crownPurple, // notes, blog, secondary icons
  secondaryMuted: "#EEE9F7",
  onSecondaryMuted: brand.darkPurple,
  info: brand.darkBlue, // groups, "Going" tags
  infoMuted: "#E3EFE8", // Blue Green at low strength
  media: brand.darkPurple, // video thumbnail / player background

  // Borders / dividers
  border: "rgba(80, 60, 20, 0.12)", // warm-tinted to sit on the cream background
  divider: "rgba(80, 60, 20, 0.08)",

  // Status
  danger: brand.crossRed, // unread dots, counts, delete, log out
  dangerMuted: "#F6E3E4",

  // Misc
  overlay: "rgba(20, 15, 40, 0.35)",
  placeholder: "#1F2937",

  statusBarStyle: "dark" as
    | "dark"
    | "light",
};

export const darkColors: ColorTokens = {
  background: "#13111F",
  surface: "#1D1A2E",
  surfaceAlt: "#252238",

  textPrimary: "rgba(255, 255, 255, 0.92)",
  textSecondary: "rgba(255, 255, 255, 0.68)",
  textMuted: "rgba(255, 255, 255, 0.5)",
  textOnPrimary: "#FFFFFF",

  // Cup Blue lifted so it shows on dark surfaces but still
  // carries white text (4.9:1) — same contract as before.
  primary: "#5B6BC0",
  primaryMuted: "#2A2F55",

  onPrimaryMuted: "#D9DDF8",
  accent: brand.doveYellow,
  textOnAccent: "#2B1D00",
  warmSurface: "#2E2A22",
  onWarmSurface: brand.mainCream,
  secondary: brand.softPurple,
  secondaryMuted: "#2E2546",
  onSecondaryMuted: "#DCD2F3",
  info: brand.blueGreen,
  infoMuted: "#1E3533",
  media: brand.darkPurple,

  border: "rgba(255, 255, 255, 0.1)",
  divider: "rgba(255, 255, 255, 0.08)",

  danger: "#FF6B73", // Cross Red is too dark to read on dark surfaces
  dangerMuted: "#3A1C22",

  overlay: "rgba(0, 0, 0, 0.55)",
  placeholder: "#2A2E38",

  statusBarStyle: "light",
};