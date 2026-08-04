import { useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import type { Language } from '../../constants/app';
import { useAppSelector } from '../hooks';

/**
 * Keeps i18next in step with the language held in Redux.
 *
 * i18next has its own mutable state, which Redux cannot see. Rather than let
 * two sources of truth drift, Redux owns the choice and this pushes it across.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useAppSelector(state => state.settings.language);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language as Language);
    }
  }, [language, i18n]);

  return <>{children}</>;
}
