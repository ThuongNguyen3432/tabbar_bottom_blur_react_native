import { baseApi } from '../../../core/api';
import { tokenStorage } from '../../../core/storage';
import type { AuthSession, LoginRequest, RegisterRequest, User } from '../auth.types';

/**
 * Injected into the shared api rather than creating a second one, so there is
 * one cache and tags invalidate across features.
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<AuthSession, LoginRequest>({
      query: body => ({ url: '/auth/login', method: 'POST', body }),
      // Tokens are written here rather than in a reducer: reducers must stay
      // pure, and the keychain write is I/O.
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        const { data } = await queryFulfilled;
        await tokenStorage.save({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: Date.now() + data.expiresIn * 1000,
        });
      },
      invalidatesTags: ['Session', 'User'],
    }),

    register: builder.mutation<AuthSession, RegisterRequest>({
      query: body => ({ url: '/auth/register', method: 'POST', body }),
      invalidatesTags: ['Session', 'User'],
    }),

    me: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        // Cleared whatever the server says: a failed logout call must not leave
        // the user signed in on the device.
        try {
          await queryFulfilled;
        } finally {
          await tokenStorage.clear();
        }
      },
      invalidatesTags: ['Session', 'User', 'Profile'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
  useLogoutMutation,
} = authApi;
