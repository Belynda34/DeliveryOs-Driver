import { Switch, Text, View } from 'react-native';

export default function DriverStatusToggle({ isOnline, onChange, busy }) {
  return (
    <View className={`items-center rounded-3xl p-7 ${isOnline ? 'bg-emerald-600' : 'bg-slate-800'}`}>
      <Text className="text-sm font-bold uppercase tracking-widest text-white/70">Driver status</Text>
      <Text className="mt-2 text-3xl font-extrabold text-white">{isOnline ? 'Online' : 'Offline'}</Text>
      <Text className="mt-2 text-center text-sm text-white/75">{isOnline ? 'You are receiving delivery requests.' : 'Go online when you are ready to deliver.'}</Text>
      <View className="mt-6 rounded-full bg-white/15 px-4 py-2">
        <Switch value={isOnline} onValueChange={onChange} disabled={busy} trackColor={{ false: '#64748b', true: '#a7f3d0' }} thumbColor="#ffffff" />
      </View>
    </View>
  );
}
