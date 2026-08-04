/** Fixed facts about the app itself. */
export const APP = {
  name: 'TabbarBlurLab',
  supportEmail: 'support@example.com',
  privacyUrl: 'https://example.com/privacy',
  termsUrl: 'https://example.com/terms',
} as const;

export const LANGUAGES = ['en', 'vi'] as const;
export type Language = (typeof LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = 'en';

export const THEME_MODES = ['light', 'dark', 'system'] as const;
export type ThemeMode = (typeof THEME_MODES)[number];
export const DEFAULT_THEME_MODE: ThemeMode = 'system';
