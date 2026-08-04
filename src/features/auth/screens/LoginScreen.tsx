import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { AuthStackParamList } from '../../../app/navigation/navigation.types';
import { useAppDispatch } from '../../../app/hooks';
import { toast } from '../../../components/AppToast';
import { useAppTheme } from '../../../theme';
import { signedIn } from '../redux/authSlice';
import { loginSchema } from '../validation';

/** Fields and submit only — the network call belongs to useLoginMutation. */
export function LoginScreen() {
  const { colors, spacing, radius, typography } = useAppTheme();
  const insets = useSafeAreaInsets();
  // Typed to this stack: the global RootParamList makes the untyped hook
  // resolve to the root navigator, which has no Register screen.
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string') {
          next[field] = issue.message;
        }
      }
      setErrors(next);
      return;
    }
    setErrors({});

    // No backend is configured yet. Signing in locally keeps the template
    // runnable; swap this for useLoginMutation once an API exists.
    dispatch(signedIn({ id: 'local', email: parsed.data.email, name: 'Local user' }));
    toast.success('Đã đăng nhập', parsed.data.email);
  };

  const field = {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.md, paddingTop: insets.top + spacing.xxl }}
    >
      <Text style={[typography.title, { color: colors.text }]}>Đăng nhập</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        keyboardType="email-address"
        style={field}
      />
      {errors.email ? (
        <Text style={[typography.caption, { color: colors.danger }]}>{errors.email}</Text>
      ) : null}

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Mật khẩu"
        placeholderTextColor={colors.textMuted}
        secureTextEntry
        style={field}
      />
      {errors.password ? (
        <Text style={[typography.caption, { color: colors.danger }]}>{errors.password}</Text>
      ) : null}

      <Pressable
        onPress={submit}
        style={{
          backgroundColor: colors.primary,
          borderRadius: radius.md,
          padding: spacing.md,
          alignItems: 'center',
          marginTop: spacing.lg,
        }}
      >
        <Text style={[typography.bodyStrong, { color: colors.textOnPrimary }]}>
          Đăng nhập
        </Text>
      </Pressable>

      <View style={{ alignItems: 'center', marginTop: spacing.md }}>
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={[typography.body, { color: colors.primary }]}>Tạo tài khoản</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
