/**
 * Route names, as values rather than string literals scattered through the app.
 *
 * The navigator param lists in `app/navigation/navigation.types.ts` are keyed
 * off these, so a rename here is a type error at every call site instead of a
 * runtime "screen not found".
 */
export const ROUTES = {
  auth: {
    login: 'Login',
    register: 'Register',
    forgotPassword: 'ForgotPassword',
  },
  main: {
    home: 'Home',
    saved: 'Saved',
    add: 'Add',
    search: 'Search',
    profile: 'Profile',
  },
  root: {
    auth: 'Auth',
    main: 'Main',
  },
} as const;

export type AuthRoute = (typeof ROUTES.auth)[keyof typeof ROUTES.auth];
export type MainRoute = (typeof ROUTES.main)[keyof typeof ROUTES.main];
export type RootRoute = (typeof ROUTES.root)[keyof typeof ROUTES.root];
