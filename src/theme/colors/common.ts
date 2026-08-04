/**
 * Values that do not change between palettes.
 *
 * Brand and status colours read the same on either background; only the
 * neutrals flip, and those live in light.ts and dark.ts.
 */
export const commonColors = {
  primary: '#ff2d55',
  danger: '#ff3b30',
  warning: '#ff9500',
  success: '#34c759',
  white: '#ffffff',
  black: '#000000',
} as const;
