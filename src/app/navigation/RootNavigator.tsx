import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppSelector } from '../hooks';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import type { RootStackParamList } from './navigation.types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Swaps the whole tree on sign-in rather than navigating between the two.
 *
 * Only one branch is ever mounted, so there is no signed-in screen sitting in
 * the back stack after a logout, and the hardware back button cannot reach it.
 */
export function RootNavigator() {
  const user = useAppSelector(state => state.auth.user);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
