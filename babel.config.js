module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // zod 4 ships `export * as core from …`, which React Native's preset does
    // not transform — Metro fails the bundle with "Export namespace should be
    // first transformed by @babel/plugin-transform-export-namespace-from".
    '@babel/plugin-transform-export-namespace-from',
    // Reanimated 4 moved its Babel plugin into react-native-worklets. It has to
    // stay last: it rewrites worklet functions and expects every other
    // transform to have run already.
    'react-native-worklets/plugin',
  ],
};
