// import { useEffect, useMemo, useState } from "react";
// import { Pressable, ScrollView, Text, View } from "react-native";

// import EmptyState from "../../components/EmptyState";
// import Header from "../../components/Header";
// import { driver } from "../../constants/mock-data";
// import { listenToEarnings } from "../../services/OrderService";
// import useAuthStore from "../../store/useAuthStore";
// import useDeliveryStore from "../../store/useDeliveryStore";

// const periods = ["Today", "Week", "Month"];
// const samePeriod = (date, period) => {
//   if (!date) return true;
//   const value = date.toDate ? date.toDate() : new Date(date);
//   const now = new Date();
//   if (period === "Today") return value.toDateString() === now.toDateString();
//   if (period === "Week") return now - value < 7 * 86400000;
//   return now - value < 31 * 86400000;
// };

// export default function EarningsScreen() {
//   const user = useAuthStore((state) => state.user);
//   const backendDriver = useDeliveryStore((state) => state.driver);
//   const [period, setPeriod] = useState("Week");
//   const [orders, setOrders] = useState([]);
//   useEffect(() => listenToEarnings(user.id, setOrders, () => {}), [user.id]);
//   const filtered = useMemo(
//     () => orders.filter((order) => samePeriod(order.assignedAt, period)),
//     [orders, period],
//   );
//   return (
//     <ScrollView
//       className="flex-1 bg-slate-50"
//       contentContainerStyle={{ paddingBottom: 32 }}
//       contentInsetAdjustmentBehavior="automatic"
//     >
//       <View className="mx-auto w-full max-w-3xl">
//         <Header
//           title="Earnings"
//           subtitle="Your delivery payouts."
//           initials={driver.initials}
//         />
//         <View className="px-5">
//           <View className="rounded-3xl bg-emerald-600 p-6">
//             <View className="mb-4 flex-row items-start justify-between">
//               <View>
//                 <Text className="text-sm font-medium text-emerald-100">
//                   Pending payout
//                 </Text>
//                 <Text className="mt-2 text-3xl font-extrabold text-white">
//                   RWF {(backendDriver?.pendingPayout || 0).toLocaleString()}
//                 </Text>
//               </View>
//               <Text className="text-4xl">💸</Text>
//             </View>
//             <Text className="text-sm text-emerald-100">
//               Total earnings: RWF{" "}
//               {(backendDriver?.totalEarnings || 0).toLocaleString()}
//             </Text>
//           </View>
//           <View className="mt-7 flex-row rounded-2xl bg-slate-200 p-1">
//             {periods.map((item) => (
//               <Pressable
//                 key={item}
//                 onPress={() => setPeriod(item)}
//                 className={`flex-1 rounded-xl py-3 ${period === item ? "bg-white shadow-sm" : ""}`}
//               >
//                 <Text
//                   className={`text-center text-sm font-bold ${period === item ? "text-emerald-700" : "text-slate-500"}`}
//                 >
//                   {item}
//                 </Text>
//               </Pressable>
//             ))}
//           </View>
//           <Text className="mb-3 mt-7 text-lg font-extrabold text-slate-900">
//             Delivery history
//           </Text>
//           {filtered.length ? (
//             <View className="overflow-hidden rounded-3xl bg-white shadow-sm">
//               {filtered.map((order, index) => (
//                 <View
//                   key={order.id}
//                   className={`flex-row justify-between px-5 py-4 ${index < filtered.length - 1 ? "border-b border-slate-100" : ""}`}
//                 >
//                   <View>
//                     <Text className="font-bold text-slate-900">
//                       {order.zone || "Delivery zone"}
//                     </Text>
//                     <Text className="mt-1 text-xs text-slate-400">
//                       {order.id} ·{" "}
//                       {(order.status || "assigned").replace("_", " ")}
//                     </Text>
//                   </View>
//                   <Text className="font-extrabold text-emerald-700">
//                     RWF {(order.earnings || 0).toLocaleString()}
//                   </Text>
//                 </View>
//               ))}
//             </View>
//           ) : (
//             <EmptyState
//               title="No earnings yet"
//               message={`Completed deliveries for this ${period.toLowerCase()} will appear here in real time.`}
//             />
//           )}
//         </View>
//       </View>
//     </ScrollView>
//   );
// }


import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import EmptyState from "../../components/EmptyState";
import Header from "../../components/Header";
import { driver } from "../../constants/mock-data";
import useDeliveryStore from "../../store/useDeliveryStore";

const periods = ["Today", "Week", "Month"];

const samePeriod = (date, period) => {
  if (!date) return true;
  const d = date instanceof Date ? date : new Date(date);
  const now = new Date();
  if (period === "Today") return d.toDateString() === now.toDateString();
  if (period === "Week") return now - d < 7 * 86400000;
  return now - d < 31 * 86400000;
};

export default function EarningsScreen() {
  const backendDriver = useDeliveryStore((state) => state.driver);
  const activeOrder = useDeliveryStore((state) => state.activeOrder);
  const [period, setPeriod] = useState("Week");
  const [completedOrders, setCompletedOrders] = useState([]);

  // When activeOrder is completed, add to earnings
  useMemo(() => {
    if (activeOrder?.status === "delivered" && !completedOrders.find(o => o.id === activeOrder.id)) {
      setCompletedOrders(prev => [...prev, {
        id: activeOrder.id || activeOrder.orderId || 'ORD-' + Math.floor(Math.random() * 1000),
        zone: activeOrder.zone || 'kigali-central',
        earnings: activeOrder.earnings || 1500,
        status: 'delivered',
        assignedAt: new Date(),
      }]);
    }
  }, [activeOrder?.status]);

  const filtered = useMemo(
    () => completedOrders.filter(o => samePeriod(o.assignedAt, period)),
    [completedOrders, period]
  );

  const totalEarnings = completedOrders.reduce((sum, o) => sum + (o.earnings || 0), 0);

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ paddingBottom: 32 }}>
      <View className="mx-auto w-full max-w-3xl">
        <Header title="Earnings" subtitle="Your delivery payouts." initials={driver.initials} />
        <View className="px-5">
          <View className="rounded-3xl bg-emerald-600 p-6">
            <Text className="text-sm font-medium text-emerald-100">Pending payout</Text>
            <Text className="mt-2 text-3xl font-extrabold text-white">
              RWF {totalEarnings.toLocaleString()}
            </Text>
            <Text className="text-sm text-emerald-100 mt-2">
              Total earnings: RWF {totalEarnings.toLocaleString()}
            </Text>
          </View>
          <View className="mt-7 flex-row rounded-2xl bg-slate-200 p-1">
            {periods.map((item) => (
              <Pressable key={item} onPress={() => setPeriod(item)} className={`flex-1 rounded-xl py-3 ${period === item ? "bg-white shadow-sm" : ""}`}>
                <Text className={`text-center text-sm font-bold ${period === item ? "text-emerald-700" : "text-slate-500"}`}>{item}</Text>
              </Pressable>
            ))}
          </View>
          <Text className="mb-3 mt-7 text-lg font-extrabold text-slate-900">Delivery history</Text>
          {filtered.length ? (
            <View className="overflow-hidden rounded-3xl bg-white shadow-sm">
              {filtered.map((order, index) => (
                <View key={order.id} className={`flex-row justify-between px-5 py-4 ${index < filtered.length - 1 ? "border-b border-slate-100" : ""}`}>
                  <View>
                    <Text className="font-bold text-slate-900">{order.zone}</Text>
                    <Text className="mt-1 text-xs text-slate-400">{order.id} · {order.status}</Text>
                  </View>
                  <Text className="font-extrabold text-emerald-700">RWF {order.earnings.toLocaleString()}</Text>
                </View>
              ))}
            </View>
          ) : (
            <EmptyState title="No earnings yet" message="Complete deliveries to see your earnings here." />
          )}
        </View>
      </View>
    </ScrollView>
  );
}