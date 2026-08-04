import { useState } from 'react';
import { ActivityIndicator, Image, View, type ImageProps } from 'react-native';

import { useAppTheme } from '../theme';

/**
 * Image with its own loading and failure states.
 *
 * RN's Image renders nothing while loading and nothing on failure, which reads
 * as a layout bug rather than a slow network.
 */
export function AppImage({ style, onLoadEnd, onError, ...rest }: ImageProps) {
  const { colors, radius } = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  return (
    <View style={[{ backgroundColor: colors.surface, borderRadius: radius.sm }, style]}>
      {!failed ? (
        <Image
          style={[{ width: '100%', height: '100%', borderRadius: radius.sm }]}
          onLoadEnd={() => {
            setLoading(false);
            onLoadEnd?.();
          }}
          onError={event => {
            setLoading(false);
            setFailed(true);
            onError?.(event);
          }}
          {...rest}
        />
      ) : null}

      {loading && !failed ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator color={colors.textMuted} />
        </View>
      ) : null}
    </View>
  );
}
