import { Text, View } from 'react-native';

type Props = {
  label: string;
  name: string;
  address: string;
};

export function AddressCard({ label, name, address }: Props): React.JSX.Element {
  return (
    <View className="w-full gap-1 rounded-card bg-surface-raised p-4">
      <Text className="text-xs font-semibold uppercase text-text-secondary">{label}</Text>
      <Text className="text-base font-bold text-text-primary">{name}</Text>
      <Text className="text-sm text-text-secondary">{address}</Text>
    </View>
  );
}
