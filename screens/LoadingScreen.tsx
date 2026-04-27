import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../navigation/types.ts";

type Props = NativeStackScreenProps<RootStackParamList, "Loading">;

export function LoadingScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace("Login"), 1400);
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
