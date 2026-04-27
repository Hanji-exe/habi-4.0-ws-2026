import { useMemo, useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '../components/Button';
import type { RootStackParamList } from '../navigation/types.ts';

import { supabase } from '../lib/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => email.trim().length > 0 && password.length > 0, [email, password]);

  async function onLogin() {
    if (!canSubmit) {
      Alert.alert('Missing info', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        Alert.alert('Login failed', error.message);
        return;
      }

      // Navigate to Loading to trigger the onboarding/profile check
      navigation.replace('Loading');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-white px-6 pt-16">
      <View className="gap-2">
        <Text className="text-3xl font-bold text-neutral-900">Welcome</Text>
        <Text className="text-base text-neutral-500">Sign in to continue</Text>
      </View>

      <View className="mt-10 gap-4">
        <View className="gap-2">
          <Text className="text-sm font-medium text-neutral-700">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            className="h-12 rounded-xl border border-neutral-200 bg-white px-4 text-base text-neutral-900"
          />
        </View>

        <View className="gap-2">
          <Text className="text-sm font-medium text-neutral-700">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            className="h-12 rounded-xl border border-neutral-200 bg-white px-4 text-base text-neutral-900"
          />
        </View>

        <Button label="Login" onPress={onLogin} disabled={!canSubmit} loading={loading} className="mt-2" />

        <Text className="mt-6 text-center text-xs text-neutral-500">
          This template uses mock auth.
        </Text>
      </View>
    </View>
  );
}

