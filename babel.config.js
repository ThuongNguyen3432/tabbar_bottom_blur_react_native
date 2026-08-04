module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Reanimated 4 moved its Babel plugin into react-native-worklets. It has to
    // stay last: it rewrites worklet functions and expects every other
    // transform to have run already.
    'react-native-worklets/plugin',
  ],
};
