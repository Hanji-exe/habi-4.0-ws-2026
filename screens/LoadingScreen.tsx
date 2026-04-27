import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../navigation/types.ts";

import { supabase } from "../lib/supabase";

type Props = NativeStackScreenProps<RootStackParamList, "Loading">;

export function LoadingScreen({ navigation }: Props) {
  useEffect(() => {
    async function checkState() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          navigation.replace("Login");
          return;
        }

        // Check if user has completed onboarding
        // Note: We use .maybeSingle() to handle cases where the profile doesn't exist yet
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", session.user.id)
          .maybeSingle();

        if (error || !profile?.onboarding_completed) {
          navigation.replace("FirstTimeSetUp");
        } else {
          navigation.replace("MainTabs");
        }
      } catch (err) {
        console.error("Auth check error:", err);
        navigation.replace("Login");
      }
    }

    const timer = setTimeout(checkState, 1400);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <View className="items-center gap-3">
        <View className="h-20 w-20 items-center justify-center rounded-3xl bg-black">
          <Text className="text-2xl font-bold text-white">H</Text>
        </View>
        <Text className="text-xl font-semibold text-neutral-900">Habi</Text>
        <Text className="text-sm text-neutral-500">Getting things ready…</Text>
        <ActivityIndicator />
      </View>
    </View>
  );
}
