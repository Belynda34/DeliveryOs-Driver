// import { useEffect, useState } from 'react';
// import { BackHandler, Text, View } from 'react-native';

// import PrimaryButton from '../../components/PrimaryButton';
// import SecondaryButton from '../../components/SecondaryButton';
// import StatusBadge from '../../components/StatusBadge';
// import { acceptOrder } from '../../services/OrderService';
// import useAuthStore from '../../store/useAuthStore';
// import useDeliveryStore from '../../store/useDeliveryStore';
// import { APP_ROUTES } from '../../constants/routes';

// const toMillis = (timestamp) => timestamp?.toDate ? timestamp.toDate().getTime() : new Date(timestamp).getTime();
// const remainingSeconds = (createdAt) => Math.max(0, 30 - Math.floor((Date.now() - toMillis(createdAt)) / 1000));

// export default function NewDeliveryScreen({ navigation }) {
//   const user = useAuthStore((state) => state.user);
//   const order = useDeliveryStore((state) => state.incomingOrder);
//   const setActiveOrder = useDeliveryStore((state) => state.setActiveOrder);
//   const clearIncomingOrder = useDeliveryStore((state) => state.clearIncomingOrder);
//   const [seconds, setSeconds] = useState(() => remainingSeconds(order?.createdAt));
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const back = BackHandler.addEventListener('hardwareBackPress', () => true);
//     const timer = setInterval(() => setSeconds(remainingSeconds(order?.createdAt)), 500);
//     return () => { back.remove(); clearInterval(timer); };
//   }, [order]);
//   useEffect(() => { if (seconds <= 0) reject(); }, [seconds]);

//   const reject = () => {
//     clearIncomingOrder();
//     if (navigation) navigation.reset({ index: 0, routes: [{ name: APP_ROUTES.MAIN_TABS }] });
//   };
//   const accept = async () => {
//     setLoading(true); setError('');
//     try {
//       await acceptOrder(order.id, user.id);
//       setActiveOrder({ ...order, status: 'assigned' });
//       if (navigation) navigation.replace(APP_ROUTES.ACTIVE_DELIVERY);
//     }
//     catch (exception) { setError(exception.message); }
//     finally { setLoading(false); }
//   };
//   if (!order) return null;
//   return (
//     <View className="flex-1 justify-between bg-slate-950 px-6 pb-10 pt-20">
//       <View>
//         <StatusBadge label="NEW DELIVERY REQUEST" tone="ready" />
//         <Text className="mt-6 text-4xl font-extrabold text-white">Ready to deliver?</Text>
//         <Text className="mt-3 text-base leading-6 text-slate-300">This request is offered to nearby drivers. Respond before it expires.</Text>
//         <View className="mt-8 items-center rounded-3xl bg-white/10 p-6">
//           <Text className="text-xs font-bold uppercase tracking-widest text-slate-400">Time remaining</Text>
//           <Text className="mt-2 text-6xl font-extrabold text-amber-300">0:{String(seconds).padStart(2, '0')}</Text>
//         </View>
//         <View className="mt-5 gap-4">
//           <View className="rounded-3xl bg-white p-5"><Text className="text-xs font-bold uppercase tracking-widest text-emerald-700">Pick up</Text><Text className="mt-2 text-lg font-extrabold text-slate-900">{order.pickup?.name}</Text><Text className="mt-1 text-sm text-slate-500">{order.pickup?.address}</Text></View>
//           <View className="rounded-3xl bg-white p-5"><Text className="text-xs font-bold uppercase tracking-widest text-slate-500">Drop off</Text><Text className="mt-2 text-lg font-extrabold text-slate-900">{order.dropoff?.name || 'Customer'}</Text><Text className="mt-1 text-sm text-slate-500">{order.dropoff?.address}</Text></View>
//         </View>
//       </View>
//       <View><View className="mb-3 items-center rounded-2xl bg-amber-300 py-3"><Text className="text-lg font-extrabold text-amber-950">RWF {order.earnings || order.payout || '—'}</Text></View>{error ? <Text className="mb-3 text-center text-sm text-rose-300">{error}</Text> : null}<PrimaryButton title="ACCEPT DELIVERY" loading={loading} onPress={accept} className="bg-amber-400" /><SecondaryButton title="Reject" onPress={reject} className="mt-3 border-slate-600 bg-transparent" /></View>
//     </View>
//   );
// }


import { useEffect, useState } from 'react';
import { BackHandler, Text, View } from 'react-native';

import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import StatusBadge from '../../components/StatusBadge';
import useAuthStore from '../../store/useAuthStore';
import useDeliveryStore from '../../store/useDeliveryStore';
import { APP_ROUTES } from '../../constants/routes';

const toMillis = (timestamp) => timestamp?.toDate ? timestamp.toDate().getTime() : new Date(timestamp).getTime();
const remainingSeconds = (createdAt) => Math.max(0, 30 - Math.floor((Date.now() - toMillis(createdAt)) / 1000));

export default function NewDeliveryScreen({ navigation }) {
  const user = useAuthStore((state) => state.user);
  const order = useDeliveryStore((state) => state.incomingOrder);
  const setActiveOrder = useDeliveryStore((state) => state.setActiveOrder);
  const clearIncomingOrder = useDeliveryStore((state) => state.clearIncomingOrder);
  const [seconds, setSeconds] = useState(30);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!order) return;
    setSeconds(remainingSeconds(order.createdAt));
  }, [order]);

  useEffect(() => {
    const back = BackHandler.addEventListener('hardwareBackPress', () => true);
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { back.remove(); clearInterval(timer); };
  }, []);

  useEffect(() => { 
    if (seconds <= 0 && order) reject(); 
  }, [seconds]);

  const reject = () => {
    clearIncomingOrder();
    navigation?.reset({ index: 0, routes: [{ name: APP_ROUTES.MAIN_TABS }] });
  };
  
  const accept = async () => {
    setLoading(true); 
    setError('');
    try {
      // Local demo accept - no Firebase needed
      setActiveOrder({ ...order, status: 'assigned' });
      navigation?.replace(APP_ROUTES.ACTIVE_DELIVERY);
    } catch (exception) { 
      setError(exception.message); 
    } finally { 
      setLoading(false); 
    }
  };
  
  if (!order) return null;
  
  return (
    <View className="flex-1 justify-between bg-slate-950 px-6 pb-10 pt-20">
      <View>
        <StatusBadge label="NEW DELIVERY REQUEST" tone="ready" />
        <Text className="mt-6 text-4xl font-extrabold text-white">Ready to deliver?</Text>
        <Text className="mt-3 text-base leading-6 text-slate-300">This request is offered to nearby drivers. Respond before it expires.</Text>
        <View className="mt-8 items-center rounded-3xl bg-white/10 p-6">
          <Text className="text-xs font-bold uppercase tracking-widest text-slate-400">Time remaining</Text>
          <Text className="mt-2 text-6xl font-extrabold text-amber-300">0:{String(seconds).padStart(2, '0')}</Text>
        </View>
        <View className="mt-5 gap-4">
          <View className="rounded-3xl bg-white p-5"><Text className="text-xs font-bold uppercase tracking-widest text-emerald-700">Pick up</Text><Text className="mt-2 text-lg font-extrabold text-slate-900">{order.pickup?.name}</Text><Text className="mt-1 text-sm text-slate-500">{order.pickup?.address}</Text></View>
          <View className="rounded-3xl bg-white p-5"><Text className="text-xs font-bold uppercase tracking-widest text-slate-500">Drop off</Text><Text className="mt-2 text-lg font-extrabold text-slate-900">{order.dropoff?.name || 'Customer'}</Text><Text className="mt-1 text-sm text-slate-500">{order.dropoff?.address}</Text></View>
        </View>
      </View>
      <View>
        <View className="mb-3 items-center rounded-2xl bg-amber-300 py-3">
          <Text className="text-lg font-extrabold text-amber-950">RWF {order.earnings || order.payout || '1500'}</Text>
        </View>
        {error ? <Text className="mb-3 text-center text-sm text-rose-300">{error}</Text> : null}
        <PrimaryButton title="ACCEPT DELIVERY" loading={loading} onPress={accept} className="bg-amber-400" />
        <SecondaryButton title="Reject" onPress={reject} className="mt-3 border-slate-600 bg-transparent" />
      </View>
    </View>
  );
}