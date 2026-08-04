import { StyleSheet, View } from 'react-native';

export type IconName = 'home' | 'heart' | 'plus' | 'search' | 'people';

/**
 * Icons drawn from plain Views rather than a font or SVG package. The spike
 * needs something recognisable above the blur, not an icon set — and every extra
 * native dependency is another thing that can fail to build on RN 0.86.
 */
export function TabBarIcon({ name, color }: { name: IconName; color: string }) {
  switch (name) {
    case 'heart':
      // Built from Views rather than the ♥ glyph: Android renders U+2665 with
      // its emoji font, which ignores the text colour and always comes out red.
      return (
        <View style={styles.frame}>
          <View style={[styles.heartLobe, styles.heartLobeLeft, { backgroundColor: color }]} />
          <View style={[styles.heartLobe, styles.heartLobeRight, { backgroundColor: color }]} />
          <View style={[styles.heartPoint, { backgroundColor: color }]} />
        </View>
      );

    case 'home':
      return (
        <View style={styles.frame}>
          <View style={[styles.roof, { borderBottomColor: color }]} />
          <View style={[styles.houseBody, { borderColor: color }]} />
        </View>
      );

    case 'plus':
      return (
        <View style={[styles.plusFrame, { borderColor: color }]}>
          <View style={[styles.barHorizontal, { backgroundColor: color }]} />
          <View style={[styles.barVertical, { backgroundColor: color }]} />
        </View>
      );

    case 'search':
      return (
        <View style={styles.frame}>
          <View style={[styles.lens, { borderColor: color }]} />
          <View style={[styles.handle, { backgroundColor: color }]} />
        </View>
      );

    case 'people':
      return (
        <View style={styles.frame}>
          <View style={[styles.head, { borderColor: color }]} />
          <View style={[styles.shoulders, { borderColor: color }]} />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  frame: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // A 12pt square rotated 45deg forms the lower point; the two lobes are circles
  // of the same diameter centred on its upper-left and upper-right edges, so the
  // three shapes join without leaving a spike below.
  heartLobe: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    top: 2,
  },
  heartLobeLeft: {
    left: 2,
  },
  heartLobeRight: {
    left: 10,
  },
  heartPoint: {
    position: 'absolute',
    width: 12,
    height: 12,
    top: 6,
    left: 6,
    transform: [{ rotate: '45deg' }],
  },
  roof: {
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  houseBody: {
    width: 14,
    height: 9,
    borderWidth: 2,
    borderTopWidth: 0,
  },
  plusFrame: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barHorizontal: {
    position: 'absolute',
    width: 9,
    height: 2,
  },
  barVertical: {
    position: 'absolute',
    width: 2,
    height: 9,
  },
  lens: {
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 2,
    marginTop: -2,
    marginLeft: -2,
  },
  handle: {
    position: 'absolute',
    width: 2,
    height: 7,
    right: 4,
    bottom: 3,
    transform: [{ rotate: '-45deg' }],
  },
  head: {
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 2,
  },
  shoulders: {
    width: 17,
    height: 8,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    marginTop: 2,
  },
});
