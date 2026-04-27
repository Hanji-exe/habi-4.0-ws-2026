import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressBar } from "../../components/ProgressBar";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Identity">;

export function IdentityScreen({ navigation }: Props) {
  const [nickname, setNickname] = useState("");
  const [bpoCompany, setBpoCompany] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-snow">
      <View className="px-8 pt-4">
        <ProgressBar currentStep={1} totalSteps={4} />
      </View>
      
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="px-8 py-12"
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-8">
          <View className="gap-2">
            <Text className="text-2xl font-bold text-charcoal font-jakarta-bold">
              Who are you?
            </Text>
            <Text className="text-base text-neutral-500 font-jakarta">
              Simpleng impormasyon lang, para sa iyong proteksyon.
            </Text>
          </View>

          <View className="gap-6">
            <Input 
              label="Nickname" 
              placeholder="How should we call you?"
              value={nickname}
              onChangeText={setNickname}
            />
            <Input 
              label="BPO Company" 
              placeholder="e.g. Concentrix, Accenture"
              value={bpoCompany}
              onChangeText={setBpoCompany}
            />
            <Input 
              label="Employee ID (Optional)" 
              placeholder="For verification"
              value={employeeId}
              onChangeText={setEmployeeId}
              helperText="Encrypted and strictly confidential."
            />
          </View>
        </View>
      </ScrollView>

      <View className="px-8 pb-10">
        <Button 
          title="Continue" 
          disabled={!nickname || !bpoCompany}
          onPress={() => navigation.navigate("ProfileContext")} 
        />
      </View>
    </SafeAreaView>
  );
}
