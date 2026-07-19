// import { useState } from "react";
// import { Alert, Linking, ScrollView, Text, View } from "react-native";
// import MapView, { Marker } from "react-native-maps";

// import Header from "../../components/Header";
// import PrimaryButton from "../../components/PrimaryButton";
// import SecondaryButton from "../../components/SecondaryButton";
// import StatusBadge from "../../components/StatusBadge";
// import { activeDelivery } from "../../constants/mock-data";
// import { updateOrderStatus } from "../../services/OrderService";
// import useAuthStore from "../../store/useAuthStore";
// import useDeliveryStore from "../../store/useDeliveryStore";

// const coordinate = (location, fallback) =>
//   location?.latitude ? location : fallback;
// const pickupFallback = { latitude: -1.9441, longitude: 30.0619 };
// const dropoffFallback = { latitude: -1.9536, longitude: 30.0606 };

// export default function ActiveDeliveryScreen({ navigation }) {
//   const user = useAuthStore((state) => state.user);
//   const order =
//     useDeliveryStore((state) => state.activeOrder) || activeDelivery;
//   const setActiveOrder = useDeliveryStore((state) => state.setActiveOrder);
//   const [deliveryStage, setDeliveryStage] = useState(
//     order.status === "picked_up" ? "picked_up" : "assigned",
//   );
//   const [updating, setUpdating] = useState(false);
//   const pickup = coordinate(order.pickup?.location, pickupFallback);
//   const dropoff = coordinate(order.dropoff?.location, dropoffFallback);
//   const openDirections = () =>
//     Linking.openURL(
//       `https://www.google.com/maps/dir/?api=1&destination=${pickup.latitude},${pickup.longitude}`,
//     );

//   const statusAction = async () => {
//     if (updating) return;
//     const nextStage = deliveryStage === "assigned" ? "picked_up" : "delivered";
//     const nextStatus = nextStage === "picked_up" ? "picked_up" : "delivered";
//     setUpdating(true);

//     try {
//       const response = await updateOrderStatus(
//         order.id || order.orderId,
//         nextStatus,
//         user?.id,
//       );
//       if (response?.success !== false) {
//         setDeliveryStage(nextStage);
//         setActiveOrder({ ...order, status: nextStatus });
//         if (nextStage === "picked_up") {
//           Alert.alert(
//             "Pickup confirmed",
//             "The delivery is now ready for drop-off.",
//           );
//         } else {
//           Alert.alert(
//             "Delivery complete",
//             response?.message || "The delivery was marked complete locally.",
//           );
//         }
//       } else {
//         Alert.alert(
//           "Status not updated",
//           response?.message || "Please try again.",
//         );
//       }
//     } catch (error) {
//       Alert.alert("Status not updated", error.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   return (
//     <ScrollView
//       className="flex-1 bg-slate-50"
//       contentContainerStyle={{ paddingBottom: 32 }}
//       contentInsetAdjustmentBehavior="automatic"
//     >
//       <View className="mx-auto w-full max-w-3xl">
//         <Header
//           title="Active delivery"
//           backLabel="Dashboard"
//           onBackPress={navigation.goBack}
//         />
//         <View className="px-5">
//           <View className="h-60 overflow-hidden rounded-3xl">
//             <MapView
//               className="h-full w-full"
//               initialRegion={{
//                 latitude: (pickup.latitude + dropoff.latitude) / 2,
//                 longitude: (pickup.longitude + dropoff.longitude) / 2,
//                 latitudeDelta: 0.03,
//                 longitudeDelta: 0.03,
//               }}
//             >
//               <Marker coordinate={pickup} title="Pickup" />
//               <Marker
//                 coordinate={dropoff}
//                 title="Drop-off"
//                 pinColor="#059669"
//               />
//             </MapView>
//           </View>
//           <View className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
//             <View className="flex-row justify-between gap-3">
//               <View className="flex-1">
//                 <Text className="text-xs font-bold tracking-widest text-slate-400">
//                   {order.id || order.orderId}
//                 </Text>
//                 <Text className="mt-2 text-xl font-extrabold text-slate-900">
//                   {order.pickup?.name || order.merchant}
//                 </Text>
//               </View>
//               <StatusBadge label={order.status || "ASSIGNED"} tone="active" />
//             </View>
//             <View className="my-5 h-px bg-slate-100" />
//             <Text className="text-xs font-bold uppercase tracking-widest text-emerald-700">
//               Pick up
//             </Text>
//             <Text className="mt-1 text-base font-bold text-slate-900">
//               {order.pickup?.address || order.pickupAddress}
//             </Text>
//             <Text className="mt-5 text-xs font-bold uppercase tracking-widest text-slate-500">
//               Drop off
//             </Text>
//             <Text className="mt-1 text-base font-bold text-slate-900">
//               {order.dropoff?.address || order.dropoffAddress}
//             </Text>
//           </View>
//           <PrimaryButton
//             title="Open directions"
//             onPress={openDirections}
//             className="mt-5"
//           />
//           <SecondaryButton
//             title={
//               deliveryStage === "assigned"
//                 ? "I have arrived"
//                 : deliveryStage === "picked_up"
//                   ? "Mark delivered"
//                   : "Delivery completed"
//             }
//             onPress={statusAction}
//             className="mt-3"
//             disabled={updating}
//           />
//         </View>
//       </View>
//     </ScrollView>
//   );
// }


import { useState } from "react";
import { Alert, Linking, ScrollView, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import Header from "../../components/Header";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import StatusBadge from "../../components/StatusBadge";
import { activeDelivery } from "../../constants/mock-data";
import useAuthStore from "../../store/useAuthStore";
import useDeliveryStore from "../../store/useDeliveryStore";

const coordinate = (location, fallback) =>
  location?.latitude ? location : fallback;
const pickupFallback = { latitude: -1.9441, longitude: 30.0619 };
const dropoffFallback = { latitude: -1.9536, longitude: 30.0606 };

export default function ActiveDeliveryScreen({ navigation }) {
  const user = useAuthStore((state) => state.user);
  const order = useDeliveryStore((state) => state.activeOrder) || activeDelivery;
  const setActiveOrder = useDeliveryStore((state) => state.setActiveOrder);
  const setIncomingOrder = useDeliveryStore((state) => state.setIncomingOrder);
  const [deliveryStage, setDeliveryStage] = useState(
    order.status === "picked_up" ? "picked_up" : "assigned"
  );
  const [updating, setUpdating] = useState(false);
  const pickup = coordinate(order.pickup?.location, pickupFallback);
  const dropoff = coordinate(order.dropoff?.location, dropoffFallback);

  const openDirections = () =>
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${pickup.latitude},${pickup.longitude}`
    );

  const statusAction = async () => {
    if (updating) return;
    const nextStage = deliveryStage === "assigned" ? "picked_up" : "delivered";
    const nextStatus = nextStage === "picked_up" ? "picked_up" : "delivered";
    setUpdating(true);

    setTimeout(() => {
      setDeliveryStage(nextStage);
      setActiveOrder({ ...order, status: nextStatus });
      setUpdating(false);

      if (nextStage === "picked_up") {
        Alert.alert("Pickup confirmed", "The delivery is now ready for drop-off.");
      } else {
        Alert.alert("Delivery complete", "Earnings have been updated!");

        // Automatically trigger a new incoming order after 3 seconds
        setTimeout(() => {
          const newOrder = {
            id: "ORD-" + Math.floor(Math.random() * 1000),
            pickup: {
              name: "Simba Supermarket",
              address: "KN 4 Ave, Kigali",
              location: { latitude: -1.9480, longitude: 30.0590 },
            },
            dropoff: {
              name: "Customer",
              address: "KG 11 Ave, Kigali",
              location: { latitude: -1.9550, longitude: 30.0620 },
            },
            status: "pending",
            earnings: 2000,
            createdAt: new Date().toISOString(),
            zone: "kigali-central",
          };
          setIncomingOrder(newOrder);
        }, 3000);
      }
    }, 500);
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ paddingBottom: 32 }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="mx-auto w-full max-w-3xl">
        <Header
          title="Active delivery"
          backLabel="Dashboard"
          onBackPress={navigation.goBack}
        />
        <View className="px-5">
          <View className="h-60 overflow-hidden rounded-3xl">
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: (pickup.latitude + dropoff.latitude) / 2,
                longitude: (pickup.longitude + dropoff.longitude) / 2,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03,
              }}
            >
              <Marker coordinate={pickup} title="Pickup" pinColor="red" />
              <Marker coordinate={dropoff} title="Drop-off" pinColor="green" />
            </MapView>
          </View>
          <View className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
            <View className="flex-row justify-between gap-3">
              <View className="flex-1">
                <Text className="text-xs font-bold tracking-widest text-slate-400">
                  {order.id || order.orderId}
                </Text>
                <Text className="mt-2 text-xl font-extrabold text-slate-900">
                  {order.pickup?.name || order.merchant}
                </Text>
              </View>
              <StatusBadge label={order.status || "ASSIGNED"} tone="active" />
            </View>
            <View className="my-5 h-px bg-slate-100" />
            <Text className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Pick up
            </Text>
            <Text className="mt-1 text-base font-bold text-slate-900">
              {order.pickup?.address || order.pickupAddress}
            </Text>
            <Text className="mt-5 text-xs font-bold uppercase tracking-widest text-slate-500">
              Drop off
            </Text>
            <Text className="mt-1 text-base font-bold text-slate-900">
              {order.dropoff?.address || order.dropoffAddress}
            </Text>
          </View>
          <PrimaryButton
            title="Open directions"
            onPress={openDirections}
            className="mt-5"
          />
          <SecondaryButton
            title={
              deliveryStage === "assigned"
                ? "I have arrived"
                : deliveryStage === "picked_up"
                  ? "Mark delivered"
                  : "Delivery completed"
            }
            onPress={statusAction}
            className="mt-3"
            disabled={updating}
          />
        </View>
      </View>
    </ScrollView>
  );
}