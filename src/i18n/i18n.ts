import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';

import { DEFAULT_LANGUAGE, LANGUAGES, type Language } from '../constants/app';
import { defaultNS, resources } from './resources';

/**
 * The device language, read from the platform rather than a library.
 *
 * react-native-localize would be the usual answer, but it is another native
 * dependency for one string that both platforms already expose.
 */
function deviceLanguage(): Language {
  const raw =
    Platform.OS === 'ios'
      ? (NativeModules.SettingsManager?.settings?.AppleLocale ??
        NativeModules.SettingsManager?.settings?.AppleLanguages?.[0])
      : NativeModules.I18nManager?.localeIdentifier;

  const tag = typeof raw === 'string' ? raw.slice(0, 2).toLowerCase() : '';
  return (LANGUAGES as readonly string[]).includes(tag)
    ? (tag as Language)
    : DEFAULT_LANGUAGE;
}

void i18next.use(initReactI18next).init({
  resources,
  defaultNS,
  lng: deviceLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  // React already escapes anything it renders; escaping again would show
  // entities like &amp; to the user.
  interpolation: { escapeValue: false },
});

export { i18next };
