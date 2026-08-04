import type { ThemeRadius } from './theme.types';

export const radius: ThemeRadius = {
  sm: 8,
  md: 12,
  lg: 24,
  /** Larger than any height it will be applied to, which clamps to a pill. */
  full: 9999,
};
