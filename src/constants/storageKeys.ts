/**
 * Every key written to device storage.
 *
 * Listed in one place so a key is never invented twice with different spellings,
 * and so clearing storage on logout has something authoritative to iterate.
 */
export const STORAGE_KEYS = {
  /** redux-persist root. */
  persistRoot: 'persist:root',
  language: '@app/language',
  themeMode: '@app/theme-mode',
  onboardingSeen: '@app/onboarding-seen',
} as const;

/** Keys held in the secure keychain rather than plain storage. */
export const SECURE_KEYS = {
  accessToken: 'auth.accessToken',
  refreshToken: 'auth.refreshToken',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
export type SecureKey = (typeof SECURE_KEYS)[keyof typeof SECURE_KEYS];
