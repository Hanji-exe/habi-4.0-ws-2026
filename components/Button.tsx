import { Pressable, Text, ActivityIndicator } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

export function Button({ label, onPress, disabled, loading, className }: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      className={[
        'h-12 flex-row items-center justify-center rounded-xl bg-black px-4',
        isDisabled ? 'opacity-50' : 'opacity-100',
        className ?? '',
      ].join(' ')}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-base font-semibold text-white">{label}</Text>
      )}
    </Pressable>
  );
}

