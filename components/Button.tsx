import { Text, TouchableOpacity, ActivityIndicator } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
}: Props) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-mint";
      case "secondary":
        return "bg-sage";
      case "ghost":
        return "bg-transparent border border-neutral-200";
      default:
        return "bg-mint";
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "primary":
        return "text-white";
      case "secondary":
        return "text-charcoal";
      case "ghost":
        return "text-charcoal";
      default:
        return "text-white";
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      className={`h-[48px] items-center justify-center rounded-2xl px-6 ${getVariantStyles()} ${
        disabled ? "opacity-50" : ""
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "white" : "#2D3748"} />
      ) : (
        <Text className={`text-base font-bold font-jakarta-bold ${getTextStyle()}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
