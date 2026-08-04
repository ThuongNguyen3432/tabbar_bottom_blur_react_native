/**
 * Money formatting.
 *
 * Amounts are handled as minor units (cents, đồng) because floating point
 * cannot hold 0.1 exactly and money must not drift. Conversion to a decimal
 * happens only at the formatting boundary.
 */

/** Currencies with no minor unit, where the amount is already whole. */
const ZERO_DECIMAL = new Set(['VND', 'JPY', 'KRW']);

export function minorUnitsPerMajor(currency: string): number {
  return ZERO_DECIMAL.has(currency.toUpperCase()) ? 1 : 100;
}

export function formatCurrency(
  minorAmount: number,
  currency = 'VND',
  locale = 'vi',
): string {
  const amount = minorAmount / minorUnitsPerMajor(currency);
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

export function formatNumber(value: number, locale = 'en'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/** Parses user input back to minor units. Returns null if it is not a number. */
export function parseCurrency(input: string, currency = 'VND'): number | null {
  const digits = input.replace(/[^\d.-]/g, '');
  const parsed = Number.parseFloat(digits);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return Math.round(parsed * minorUnitsPerMajor(currency));
}
