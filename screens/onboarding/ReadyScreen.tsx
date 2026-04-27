import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/Button";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Ready">;

export function ReadyScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-snow">
      <View className="flex-1 px-8 py-12 items-center justify-between">
        <View />

        <View className="items-center gap-8 w-full">
          <View className="h-48 w-48 items-center justify-center rounded-full bg-mint/10">
            <Ionicons name="boat-outline" size={96} color="#4FB99F" />
            {/* Using boat as a placeholder for lighthouse feel if icon is missing, or just a custom view */}
            <View className="absolute bottom-12 h-20 w-8 bg-mint rounded-t-full" />
            <View className="absolute bottom-32 h-6 w-12 bg-amber rounded-full opacity-50" />
          </View>

          <View className="items-center gap-3">
            <Text className="text-3xl font-bold text-charcoal text-center font-jakarta-bold leading-tight">
              Handa na kaming{"\n"}makinig.
            </Text>
            <Text className="text-base text-neutral-500 text-center font-jakarta">
              We are ready to listen. Your journey to peace starts here.
            </Text>
          </View>
        </View>

        <View className="w-full">
          <Button 
            title="Enter Dashboard" 
            onPress={() => navigation.replace("MainTabs")} 
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
