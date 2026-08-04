import { darkColors } from './colors/dark';
import { lightColors } from './colors/light';
import { radius } from './radius';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { typography } from './typography';
import type { AppTheme, ThemeName } from './theme.types';

/**
 * The two themes, assembled once at module load.
 *
 * Frozen objects rather than factories: nothing here depends on runtime state,
 * and a stable identity means consumers can compare by reference.
 */
export const lightTheme: AppTheme = {
  name: 'light',
  isDark: false,
  colors: lightColors,
  spacing,
  radius,
  typography,
  shadows,
};

export const darkTheme: AppTheme = {
  name: 'dark',
  isDark: true,
  colors: darkColors,
  spacing,
  radius,
  typography,
  shadows,
};

export const themes: Record<ThemeName, AppTheme> = {
  light: lightTheme,
  dark: darkTheme,
};
