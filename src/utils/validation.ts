import { REGEX } from '../constants/regex';

/**
 * Predicates shared by zod schemas and ad-hoc checks.
 *
 * These answer "is this shaped right", never "is this allowed" — the server
 * owns that, and duplicating its rules here only makes them drift.
 */

export function isEmail(value: string): boolean {
  return REGEX.email.test(value.trim());
}

export function isPhone(value: string): boolean {
  return REGEX.phone.test(value.replace(/[\s-]/g, ''));
}

export const PASSWORD_MIN_LENGTH = 8;

export function isStrongEnoughPassword(value: string): boolean {
  return value.length >= PASSWORD_MIN_LENGTH && REGEX.password.test(value);
}

export function isBlank(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

export function isUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
