import { en, vi } from './locales';

/**
 * Namespaced so a screen loads only the strings it uses, and so `common` does
 * not grow into a dumping ground.
 */
export const resources = { en, vi } as const;

export const defaultNS = 'common';
export const namespaces = ['common', 'auth', 'validation'] as const;
