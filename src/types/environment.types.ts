/**
 * Build-time shapes.
 *
 * `__DEV__` is not declared here — React Native's own types already do, and a
 * second declaration is a redeclaration error rather than a merge.
 */

export type BuildEnvironment = 'development' | 'staging' | 'production';

export type PlatformName = 'ios' | 'android';
