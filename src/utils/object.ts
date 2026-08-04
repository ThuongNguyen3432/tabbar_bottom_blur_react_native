/** Small object helpers, typed more tightly than their stdlib equivalents. */

/** `Object.keys` that keeps the key union instead of widening to `string[]`. */
export function keysOf<T extends object>(value: T): (keyof T)[] {
  return Object.keys(value) as (keyof T)[];
}

export function entriesOf<T extends object>(value: T): [keyof T, T[keyof T]][] {
  return Object.entries(value) as [keyof T, T[keyof T]][];
}

/** Drops keys whose value is `undefined` — useful before sending a payload. */
export function compact<T extends object>(value: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key of keysOf(value)) {
    if (value[key] !== undefined) {
      result[key] = value[key];
    }
  }
  return result;
}

export function pick<T extends object, K extends keyof T>(value: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in value) {
      result[key] = value[key];
    }
  }
  return result;
}

export function omit<T extends object, K extends keyof T>(value: T, keys: K[]): Omit<T, K> {
  const result = { ...value };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

/** Shallow equality, enough to decide whether a re-render is worth it. */
export function shallowEqual(a: object, b: object): boolean {
  if (a === b) {
    return true;
  }
  const aKeys = Object.keys(a);
  if (aKeys.length !== Object.keys(b).length) {
    return false;
  }
  return aKeys.every(
    key => (a as Record<string, unknown>)[key] === (b as Record<string, unknown>)[key],
  );
}
