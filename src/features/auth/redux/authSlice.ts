import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { SESSION_EXPIRED } from '../../../core/api';
import type { User } from '../auth.types';

type AuthState = {
  user: User | null;
  /** True once the stored session has been checked, whatever the outcome. */
  isRestored: boolean;
};

const initialState: AuthState = {
  user: null,
  isRestored: false,
};

/**
 * Who is signed in — not the tokens, which live in the keychain.
 *
 * Keeping tokens out of Redux keeps them out of the persisted state, out of
 * dev-tools, and out of any crash report that serialises the store.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signedIn: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isRestored = true;
    },
    signedOut: state => {
      state.user = null;
      state.isRestored = true;
    },
    restoreFinished: state => {
      state.isRestored = true;
    },
  },
  extraReducers: builder => {
    // Dispatched by the API layer when a refresh fails, so the session clears
    // itself without the API importing this slice.
    builder.addMatcher(
      action => action.type === SESSION_EXPIRED,
      state => {
        state.user = null;
        state.isRestored = true;
      },
    );
  },
});

export const { signedIn, signedOut, restoreFinished } = authSlice.actions;
export const authReducer = authSlice.reducer;
export type { AuthState };
