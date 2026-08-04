import type { NormalisedApiError } from '../types/api.types';

/**
 * Pulls something displayable out of an unknown throw.
 *
 * `catch` gives `unknown`, and what lands there varies: a normalised API error,
 * an `Error`, a bare string, or something with no message at all. This is the
 * one place that has to know about all of them.
 */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (typeof error === 'string') {
    return error || fallback;
  }
  if (isNormalisedApiError(error)) {
    return error.message || fallback;
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    const { message } = error as { message: unknown };
    if (typeof message === 'string' && message) {
      return message;
    }
  }
  return fallback;
}

export function isNormalisedApiError(error: unknown): error is NormalisedApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'kind' in error &&
    'code' in error &&
    'message' in error
  );
}

/** Field errors from a failed submit, for feeding straight back into a form. */
export function getFieldErrors(error: unknown): Record<string, string> {
  return isNormalisedApiError(error) ? (error.fields ?? {}) : {};
}
