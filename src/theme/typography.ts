import type { ThemeTypography } from './theme.types';

/**
 * Sizes and weights only — no colour.
 *
 * Colour belongs to the palette and flips with the theme, so mixing it in here
 * would force a second copy of every style per theme.
 */
export const typography: ThemeTypography = {
  title: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
  heading: { fontSize: 20, fontWeight: '700', lineHeight: 26 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
  bodyStrong: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
};
