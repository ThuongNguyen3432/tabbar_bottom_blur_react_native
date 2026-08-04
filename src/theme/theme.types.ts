import type { TextStyle } from 'react-native';

/**
 * Colours are named by role, not by value.
 *
 * `surface` rather than `white`: the dark palette has to answer the same names
 * with different values, and a name like `white` cannot.
 */
export type ThemeColors = {
  /** Screen background, behind everything. */
  background: string;
  /** Cards, sheets, the tab bar — anything raised off the background. */
  surface: string;
  /** A surface raised above another surface. */
  surfaceElevated: string;
  border: string;

  text: string;
  textMuted: string;
  /** Text drawn on top of `primary`. */
  textOnPrimary: string;

  primary: string;
  danger: string;
  warning: string;
  success: string;

  /** Dimming layer behind a modal or sheet. */
  scrim: string;
  /** Tint applied over a blurred surface. */
  blurTint: 'light' | 'dark';
};

export type ThemeSpacing = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
};

export type ThemeRadius = {
  sm: number;
  md: number;
  lg: number;
  /** Half of any height, for pills. */
  full: number;
};

export type ThemeTypography = {
  title: TextStyle;
  heading: TextStyle;
  body: TextStyle;
  bodyStrong: TextStyle;
  caption: TextStyle;
};

export type ThemeShadow = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

export type ThemeShadows = {
  none: ThemeShadow;
  sm: ThemeShadow;
  md: ThemeShadow;
  lg: ThemeShadow;
};

export type ThemeName = 'light' | 'dark';

export type AppTheme = {
  name: ThemeName;
  /** True when the palette is dark, for status bar and blur decisions. */
  isDark: boolean;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  typography: ThemeTypography;
  shadows: ThemeShadows;
};
