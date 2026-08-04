/**
 * Asset registry.
 *
 * `require` rather than import: Metro resolves image paths at build time and
 * needs a literal, so a computed path silently yields nothing.
 *
 * Example:
 *   export const images = { logo: require('./images/logo.png') } as const;
 */
export const images = {} as const;
export const icons = {} as const;
export const animations = {} as const;
