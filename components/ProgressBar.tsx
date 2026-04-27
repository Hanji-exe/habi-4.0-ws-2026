import { View } from "react-native";

type Props = {
  currentStep: number;
  totalSteps: number;
  className?: string;
};

export function ProgressBar({ currentStep, totalSteps, className = "" }: Props) {
  return (
    <View className={`flex-row gap-2 h-1.5 ${className}`}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          className={`flex-1 rounded-full ${
            index < currentStep ? "bg-mint" : "bg-sage"
          }`}
        />
      ))}
    </View>
  );
}
