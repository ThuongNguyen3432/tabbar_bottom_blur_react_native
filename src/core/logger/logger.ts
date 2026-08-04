import { env } from '../../config';

type Level = 'debug' | 'info' | 'warn' | 'error';

const ORDER: Record<Level, number> = { debug: 0, info: 1, warn: 2, error: 3 };

/** Debug noise is dropped in release; warnings and errors always go through. */
const MIN_LEVEL: Level = env.isDev ? 'debug' : 'warn';

function log(level: Level, scope: string, message: string, extra?: unknown) {
  if (ORDER[level] < ORDER[MIN_LEVEL]) {
    return;
  }
  const line = `[${scope}] ${message}`;
  if (level === 'error') {
    console.error(line, extra ?? '');
  } else if (level === 'warn') {
    console.warn(line, extra ?? '');
  } else {
    console.log(line, extra ?? '');
  }
}

/**
 * Scoped logger.
 *
 * `logger('api')` rather than a bare `console.log` so output says where it came
 * from, and so the level gate lives in one place.
 */
export function logger(scope: string) {
  return {
    debug: (message: string, extra?: unknown) => log('debug', scope, message, extra),
    info: (message: string, extra?: unknown) => log('info', scope, message, extra),
    warn: (message: string, extra?: unknown) => log('warn', scope, message, extra),
    error: (message: string, extra?: unknown) => log('error', scope, message, extra),
  };
}

export type Logger = ReturnType<typeof logger>;
