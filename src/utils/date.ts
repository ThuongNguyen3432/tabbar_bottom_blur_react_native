/**
 * Date helpers built on `Intl`, which Hermes ships with.
 *
 * Formatting takes an explicit locale rather than reading the app language, so
 * these stay pure and testable; callers pass `i18n.language`.
 */

export function toDate(value: string | number | Date): Date | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(
  value: string | number | Date,
  locale = 'en',
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
): string {
  const date = toDate(value);
  return date ? new Intl.DateTimeFormat(locale, options).format(date) : '';
}

export function formatDateTime(value: string | number | Date, locale = 'en'): string {
  return formatDate(value, locale, { dateStyle: 'medium', timeStyle: 'short' });
}

/** "3 days ago", "in 2 hours". Falls back to an absolute date past a month. */
export function formatRelative(value: string | number | Date, locale = 'en'): string {
  const date = toDate(value);
  if (!date) {
    return '';
  }

  const diffMs = date.getTime() - Date.now();
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['second', 1000],
    ['minute', 60 * 1000],
    ['hour', 60 * 60 * 1000],
    ['day', 24 * 60 * 60 * 1000],
    ['week', 7 * 24 * 60 * 60 * 1000],
  ];

  const absMs = Math.abs(diffMs);
  if (absMs > 30 * 24 * 60 * 60 * 1000) {
    return formatDate(date, locale);
  }

  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  let [unit, ms] = units[0];
  for (const [nextUnit, nextMs] of units) {
    if (absMs >= nextMs) {
      [unit, ms] = [nextUnit, nextMs];
    }
  }
  return formatter.format(Math.round(diffMs / ms), unit);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
