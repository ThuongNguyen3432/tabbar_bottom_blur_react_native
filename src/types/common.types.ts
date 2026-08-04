/** Shapes that are not specific to any one feature. */

export type Nullable<T> = T | null;

/** A value that has not loaded yet is `undefined`; one that loaded empty is `null`. */
export type Maybe<T> = T | null | undefined;

export type Id = string;

export type Timestamped = {
  createdAt: string;
  updatedAt: string;
};

/**
 * Where an async value is in its lifecycle.
 *
 * Separate from the data itself so a refresh can show stale content while
 * loading, rather than blanking the screen.
 */
export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};
