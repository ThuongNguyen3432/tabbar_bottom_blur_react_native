import type { ThemeColors } from '../theme.types';
import { commonColors } from './common';

export const lightColors: ThemeColors = {
  background: '#f2f2f7',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',
  border: '#d1d1d6',

  text: '#1c1c1e',
  textMuted: '#6c6c70',
  textOnPrimary: commonColors.white,

  primary: commonColors.primary,
  danger: commonColors.danger,
  warning: commonColors.warning,
  success: commonColors.success,

  scrim: 'rgba(0, 0, 0, 0.25)',
  blurTint: 'light',
};
