import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressBar } from "../../components/ProgressBar";
import { Button } from "../../components/Button";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "HealthContext">;

function TileOption({ 
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
      className={`flex-1 h-32 items-center justify-center rounded-3xl border ${
        selected ? "border-mint bg-mint/5" : "border-neutral-200 bg-white"
      }`}
    >
      <Text className={`text-lg font-bold ${selected ? "text-mint" : "text-charcoal"} font-jakarta-bold`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function HealthContextScreen({ navigation }: Props) {
  const [consent, setConsent] = useState(false);
  const [agreed, setAgreed] = useState<boolean | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-snow">
      <View className="px-8 pt-4">
        <ProgressBar currentStep={3} totalSteps={4} />
      </View>
      
      <ScrollView className="flex-1" contentContainerClassName="px-8 py-12">
        <View className="gap-10">
          <View className="gap-2">
            <Text className="text-2xl font-bold text-charcoal font-jakarta-bold">
              Health Consent
            </Text>
            <Text className="text-base text-neutral-500 font-jakarta">
              Your data is protected under the PH Data Privacy Act of 2012.
            </Text>
          </View>

          <View className="flex-row items-center justify-between rounded-3xl bg-mint/5 p-6 border border-mint/10">
            <View className="flex-1 pr-4">
              <Text className="text-base font-bold text-charcoal font-jakarta-bold">
                Consent to document
              </Text>
              <Text className="text-xs text-neutral-500 font-jakarta mt-1">
                Allow us to document your mental health status to provide better care.
              </Text>
            </View>
            <Switch
              value={consent}
              onValueChange={setConsent}
              trackColor={{ false: "#B2D8D0", true: "#4FB99F" }}
              thumbColor="white"
            />
          </View>

          <View className="gap-4">
            <Text className="text-sm font-semibold text-charcoal font-jakarta px-1">
              Do you agree to proceed with this context?
            </Text>
            <View className="flex-row gap-4">
              <TileOption 
                label="Yes" 
                selected={agreed === true} 
                onPress={() => setAgreed(true)} 
              />
              <TileOption 
                label="No" 
                selected={agreed === false} 
                onPress={() => setAgreed(false)} 
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-8 pb-10">
        <Button 
          title="Continue" 
          disabled={!consent || agreed !== true}
          onPress={() => navigation.navigate("Ready")} 
        />
      </View>
    </SafeAreaView>
  );
}
