/**
 * RTK Query cache tags.
 *
 * Every tag must be declared on `baseApi` before an endpoint can provide or
 * invalidate it, so they live here and the api spreads this list.
 */
export const API_TAGS = ['User', 'Profile', 'Session', 'Example'] as const;

export type ApiTag = (typeof API_TAGS)[number];
