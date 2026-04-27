import { View, Platform } from "react-native";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: Props) {
  return (
    <View 
      className={`rounded-3xl bg-white p-6 ${className ?? ""}`}
      style={Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
        },
        android: {
          elevation: 2,
        },
      })}
    >
      {children}
    </View>
  );
}
