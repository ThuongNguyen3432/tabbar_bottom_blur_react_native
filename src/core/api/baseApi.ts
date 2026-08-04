import { createApi } from '@reduxjs/toolkit/query/react';

import { API_TAGS } from '../../constants/apiTags';
import { baseQueryWithReauth } from './baseQueryWithReauth';

/**
 * The single RTK Query api. Features attach endpoints with `injectEndpoints`
 * rather than creating their own, so one cache and one middleware serve
 * everything and tags invalidate across feature boundaries.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: API_TAGS,
  // Endpoints live in the features; this is only the shell.
  endpoints: () => ({}),
});
