/** Type-level helpers, no runtime code. */

/** Makes the named keys optional, leaving the rest as they are. */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Makes the named keys required. */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** Recursively optional — for patch payloads and deep-merged config. */
export type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

/** Recursively read-only, for frozen config objects. */
export type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

/** The element type of an array, or the value type of a promise. */
export type Unwrap<T> = T extends readonly (infer E)[]
  ? E
  : T extends Promise<infer V>
    ? V
    : T;

/**
 * A string union that still offers autocomplete for the known members while
 * accepting any other string — `'sm' | 'md' | (string & {})`.
 */
export type LooseUnion<T extends string> = T | (string & {});
