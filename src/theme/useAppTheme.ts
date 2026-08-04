import { createContext, useContext } from 'react';
import type { ThemeMode } from '../constants/app';
import { lightTheme } from './themes';
import type { AppTheme } from './theme.types';

export type ThemeContextValue = {
  theme: AppTheme;
  /** What the user picked, which may be `system`. */
  mode: ThemeMode;
  /** Which palette that resolved to right now. */
  setMode: (mode: ThemeMode) => void;
  /** False until the stored choice has been read back. */
  isReady: boolean;
};

/**
 * Defaults to the light theme rather than throwing when used outside the
 * provider: a missing provider should not blank a screen, and the wrong colours
 * are obvious enough in development.
 */
export const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  mode: 'system',
  setMode: () => {},
  isReady: false,
});

/** The whole context — theme plus the mode controls. */
export function useThemeContext(): ThemeContextValue {
  return useContext(ThemeContext);
}

/** Just the palette, which is what most components want. */
export function useAppTheme(): AppTheme {
  return useContext(ThemeContext).theme;
}
