import { useMemo, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
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

      navigation.replace('Loading');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  async function onSignUp() {
    if (!canSubmit) {
      Alert.alert('Missing info', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        Alert.alert('Sign up failed', error.message);
        return;
      }

      Alert.alert('Success', 'Account created! Please log in or check your email if confirmation is required.');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-white px-6 pt-16">
      <View className="gap-2">
        <Text className="text-3xl font-bold text-neutral-900">Habi 4.0</Text>
        <Text className="text-base text-neutral-500">Sign in or create an account</Text>
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

        <View className="mt-4 gap-3">
          <Button label="Login" onPress={onLogin} disabled={!canSubmit} loading={loading} />
          <TouchableOpacity 
            onPress={onSignUp} 
            disabled={!canSubmit || loading}
            className="h-12 items-center justify-center rounded-xl border border-violet-600"
          >
            <Text className="text-base font-semibold text-violet-600">Create Account</Text>
          </TouchableOpacity>
        </View>

        <Text className="mt-6 text-center text-xs text-neutral-500">
          Sign up to trigger the first-time setup flow.
        </Text>
      </View>
    </View>
  );
}

