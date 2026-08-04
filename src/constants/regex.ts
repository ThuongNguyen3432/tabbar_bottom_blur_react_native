/**
 * Patterns shared between validation schemas and inline checks.
 *
 * Kept deliberately loose. Over-strict client-side patterns reject valid input
 * — the server is the authority; these only catch obvious typos early.
 */
export const REGEX = {
  /** Something@something.tld — not RFC 5322, and not trying to be. */
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  /** Digits, optional leading +, 8-15 long. */
  phone: /^\+?\d{8,15}$/,
  /** At least one letter and one digit. Length is checked separately so the
   *  error message can say which rule failed. */
  password: /^(?=.*[A-Za-z])(?=.*\d).+$/,
  /** Leading/trailing whitespace, for trimming display strings. */
  surroundingWhitespace: /^\s+|\s+$/g,
} as const;
