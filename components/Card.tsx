import { View } from 'react-native';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: Props) {
  return (
    <View className={`rounded-2xl bg-white p-4 shadow-sm ${className ?? ''}`}>
      {children}
    </View>
  );
}

