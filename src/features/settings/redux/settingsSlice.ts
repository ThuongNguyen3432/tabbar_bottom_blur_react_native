import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { DEFAULT_LANGUAGE, DEFAULT_THEME_MODE, type Language, type ThemeMode } from '../../../constants/app';

type SettingsState = {
  language: Language;
  themeMode: ThemeMode;
  /** Suppresses the onboarding flow once it has been completed. */
  onboardingSeen: boolean;
};

const initialState: SettingsState = {
  language: DEFAULT_LANGUAGE,
  themeMode: DEFAULT_THEME_MODE,
  onboardingSeen: false,
};

/**
 * The slice that redux-persist keeps. It holds preferences only — nothing
 * fetched, nothing derived — so rehydrating it can never show stale data.
 */
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
    markOnboardingSeen: state => {
      state.onboardingSeen = true;
    },
  },
});

export const { setLanguage, setThemeMode, markOnboardingSeen } = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
export type { SettingsState };
