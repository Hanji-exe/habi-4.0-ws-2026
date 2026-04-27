import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from './types';
import { LoadingScreen } from '../screens/LoadingScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { FirstTimeSetUp } from '../screens/FirstTimeSetUp';
import { MainTabs } from './MainTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="FirstTimeSetUp" component={FirstTimeSetUp} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}

