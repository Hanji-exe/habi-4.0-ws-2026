import { useState } from "react";
import { TextInput, View, Text } from "react-native";

type Props = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  className?: string;
  helperText?: string;
};

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  className = "",
  helperText,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`gap-2 ${className}`}>
      {label && (
        <Text className="text-sm font-medium text-charcoal font-jakarta">
          {label}
        </Text>
      )}
      <View
        className={`h-12 flex-row items-center rounded-2xl border bg-white px-4 ${
          isFocused ? "border-mint" : "border-neutral-200"
        }`}
      >
        <TextInput
          className="flex-1 text-base text-charcoal font-jakarta"
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
      {helperText && (
        <Text className="text-xs text-neutral-500 font-jakarta">
          {helperText}
        </Text>
      )}
    </View>
  );
}
