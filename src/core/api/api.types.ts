import type { NormalisedApiError } from '../../types/api.types';

/** What a base query hands back on failure, in RTK Query's error slot. */
export type BaseQueryError = NormalisedApiError;

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};
