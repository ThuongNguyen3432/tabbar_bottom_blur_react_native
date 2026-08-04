import type { defaultNS, resources } from './resources';

/**
 * Teaches react-i18next the shape of the catalogue, so `t('settings.title')` is
 * checked and autocompleted rather than accepting any string.
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)['en'];
  }
}

export {};
