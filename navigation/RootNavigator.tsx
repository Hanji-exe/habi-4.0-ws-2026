import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { RootStackParamList } from "./types";
import { LoadingScreen } from "../screens/LoadingScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { FirstTimeSetUp } from "../screens/FirstTimeSetUp";
import { MainTabs } from "./MainTabs";
import { ArrivalScreen } from "../screens/onboarding/ArrivalScreen";
import { IdentityScreen } from "../screens/onboarding/IdentityScreen";
import { ProfileContextScreen } from "../screens/onboarding/ProfileContextScreen";
import { HealthContextScreen } from "../screens/onboarding/HealthContextScreen";
import { ReadyScreen } from "../screens/onboarding/ReadyScreen";
import { DashboardScreen } from "../screens/DashboardScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Loading"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="FirstTimeSetUp" component={FirstTimeSetUp} />
      <Stack.Screen name="MainTabs" component={MainTabs} />

      {/* Onboarding Flow */}
      <Stack.Screen name="Arrival" component={ArrivalScreen} />
      <Stack.Screen name="Identity" component={IdentityScreen} />
      <Stack.Screen name="ProfileContext" component={ProfileContextScreen} />
      <Stack.Screen name="HealthContext" component={HealthContextScreen} />
      <Stack.Screen name="Ready" component={ReadyScreen} />
    </Stack.Navigator>
  );
}
