import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressBar } from "../../components/ProgressBar";
import { Button } from "../../components/Button";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "ProfileContext">;

function SelectOption({ 
  label, 
  selected, 
  onPress 
}: { 
  label: string; 
  selected: boolean; 
  onPress: () => void; 
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`h-14 flex-row items-center justify-between rounded-2xl border px-4 ${
        selected ? "border-mint bg-mint/5" : "border-neutral-200 bg-white"
      }`}
    >
      <Text className={`text-base font-medium ${selected ? "text-mint" : "text-charcoal"} font-jakarta`}>
        {label}
      </Text>
      {selected && (
        <View className="h-4 w-4 rounded-full bg-mint" />
      )}
    </TouchableOpacity>
  );
}

export function ProfileContextScreen({ navigation }: Props) {
  const [shift, setShift] = useState<string | null>(null);
  
  const shifts = ["Night Shift (Graveyard)", "Day Shift", "Rotating Shift", "Split Shift"];

  return (
    <SafeAreaView className="flex-1 bg-snow">
      <View className="px-8 pt-4">
        <ProgressBar currentStep={2} totalSteps={4} />
      </View>
      
      <ScrollView className="flex-1" contentContainerClassName="px-8 py-12">
        <View className="gap-8">
          <View className="gap-2">
            <Text className="text-2xl font-bold text-charcoal font-jakarta-bold">
              Support Context
            </Text>
            <Text className="text-base text-neutral-500 font-jakarta">
              Tell us a bit more so we can support you better.
            </Text>
          </View>

          <View className="gap-4">
            <Text className="text-sm font-semibold text-charcoal font-jakarta px-1">
              What is your current work shift?
            </Text>
            {shifts.map((s) => (
              <SelectOption 
                key={s} 
                label={s} 
                selected={shift === s} 
                onPress={() => setShift(s)} 
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="px-8 pb-10">
        <Button 
          title="Continue" 
          disabled={!shift}
          onPress={() => navigation.navigate("HealthContext")} 
        />
      </View>
    </SafeAreaView>
  );
}
