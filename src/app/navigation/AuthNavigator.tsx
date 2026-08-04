import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../../features/auth/screens/LoginScreen';
import { RegisterScreen } from '../../features/auth/screens/RegisterScreen';
import type { AuthStackParamList } from './navigation.types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/** Signed-out screens. Headers are drawn by the screens themselves. */
export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
