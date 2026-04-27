import { Text, View } from "react-native";

export function FirstTimeSetUp() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <View className="items-center gap-3">
        <Text className="text-2xl font-bold text-neutral-900">
          First Time Set Up
        </Text>
      </View>
    </View>
  );
}
