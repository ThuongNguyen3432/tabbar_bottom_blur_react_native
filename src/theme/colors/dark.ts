import type { ThemeColors } from '../theme.types';
import { commonColors } from './common';

/**
 * Surfaces get lighter as they rise, rather than darker.
 *
 * Shadows are close to invisible on a dark background, so elevation has to be
 * signalled by brightness instead.
 */
export const darkColors: ThemeColors = {
  background: '#000000',
  surface: '#1c1c1e',
  surfaceElevated: '#2c2c2e',
  border: '#38383a',

  text: '#ffffff',
  textMuted: '#8e8e93',
  textOnPrimary: commonColors.white,

  primary: commonColors.primary,
  danger: commonColors.danger,
  warning: commonColors.warning,
  success: commonColors.success,

  scrim: 'rgba(0, 0, 0, 0.45)',
  blurTint: 'dark',
};
