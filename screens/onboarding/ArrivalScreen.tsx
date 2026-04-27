import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/Button";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Arrival">;

export function ArrivalScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-snow">
      <View className="flex-1 px-8 py-12 items-center justify-between">
        {/* White space / breathing room top */}
        <View />

        <View className="items-center gap-8 w-full">
          <View className="h-32 w-32 items-center justify-center rounded-full bg-mint/10">
            <Ionicons name="shield-checkmark" size={64} color="#4FB99F" />
          </View>

          <View className="items-center gap-3">
            <Text className="text-3xl font-bold text-charcoal text-center font-jakarta-bold leading-tight">
              Your space.{"\n"}Your peace.
            </Text>
            <Text className="text-base text-neutral-500 text-center font-jakarta">
              Simpleng impormasyon lang, para sa iyong proteksyon.
            </Text>
          </View>
        </View>

        <View className="w-full gap-6">
          <Button 
            title="Begin securely" 
            onPress={() => navigation.navigate("Identity")} 
          />
          
          <Text className="text-xs text-neutral-400 text-center font-jakarta">
            Ligtas itong space. Your data is encrypted.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
