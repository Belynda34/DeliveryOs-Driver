// import { useEffect, useState } from "react";
// import { Alert, ScrollView, Text, View } from "react-native";
// import Constants from "expo-constants";

// import DeliveryCard from "../../components/DeliveryCard";
// import DriverStatusToggle from "../../components/DriverStatusToggle";
// import EmptyState from "../../components/EmptyState";
// import Header from "../../components/Header";
// import PrimaryButton from "../../components/PrimaryButton";
// import StatsCard from "../../components/StatsCard";
// import {
//   activeDelivery,
//   driver as demoDriver,
// } from "../../constants/mock-data";
// import { APP_ROUTES } from "../../constants/routes";
// import { registerForDeliveryNotifications } from "../../services/NotificationService";
// import {
//   syncDriverLocation,
//   syncFcmToken,
//   updateDriverOnlineStatus,
// } from "../../services/DriverService";
// import useAuthStore from "../../store/useAuthStore";
// import useDeliveryStore from "../../store/useDeliveryStore";
// import { isFirebaseConfigured } from "../../services/firebase";

// export default function HomeScreen({ navigation }) {
//   const user = useAuthStore((state) => state.user);
//   const backendDriver = useDeliveryStore((state) => state.driver);
//   const activeOrder = useDeliveryStore((state) => state.activeOrder);
//   const setDriver = useDeliveryStore((state) => state.setDriver);
//   const setIncomingOrder = useDeliveryStore((state) => state.setIncomingOrder);
//   const [isOnline, setIsOnline] = useState(Boolean(backendDriver?.isOnline));
//   const [updating, setUpdating] = useState(false);
//   useEffect(() => {
//     if (backendDriver) setIsOnline(Boolean(backendDriver.isOnline));
//   }, [backendDriver]);
//   useEffect(() => {
//     if (Constants.appOwnership === "expo") return undefined;
//     require("../../services/NotificationService")
//       .registerForDeliveryNotifications((token) =>
//         syncFcmToken(user.id, token).catch(() => {}),
//       )
//       .catch(() => {});
//     return undefined;
//   }, [user.id]);
//   const toggleOnline = async (nextValue) => {
//     const previous = isOnline;
//     setIsOnline(nextValue);
//     setUpdating(true);
//     try {
//       if (!isFirebaseConfigured) {
//         // Silently update locally when Firebase isn't configured
//         setDriver({ ...(backendDriver || {}), isOnline: nextValue });
//         setUpdating(false);
//         return;
//       }
//       await updateDriverOnlineStatus(user.id, nextValue);
//       if (nextValue) await syncDriverLocation(user.id);
//     } catch (error) {
//       setIsOnline(previous);
//       Alert.alert("Status not updated", error.message);
//     } finally {
//       setUpdating(false);
//     }
//   };
//   const todayDeliveries =
//     backendDriver?.todayDeliveries || (activeOrder ? 1 : 0);
//   const earnings = backendDriver?.totalEarnings || 0;
//   const delivery =
//     activeOrder || (backendDriver?.currentOrderId ? null : activeDelivery);

//   return (
//     <ScrollView
//       className="flex-1 bg-slate-50"
//       contentContainerStyle={{ paddingBottom: 32 }}
//       contentInsetAdjustmentBehavior="automatic"
//     >
//       <View className="mx-auto w-full max-w-3xl">
//         <Header
//           title={`Hello, ${(backendDriver?.name || user?.name || demoDriver.name).split(" ")[0]}.`}
//           subtitle="Stay online to receive nearby offers."
//           initials={demoDriver.initials}
//         />
//         <View className="px-5">
//           <DriverStatusToggle
//             isOnline={isOnline}
//             onChange={toggleOnline}
//             busy={updating}
//           />
//           <Text className="mb-3 mt-8 text-lg font-extrabold text-slate-900">
//             Today at a glance
//           </Text>
//           <View className="flex-row gap-3">
//             <StatsCard
//               label="Deliveries"
//               value={String(todayDeliveries)}
//               detail="Completed today"
//               tone="blue"
//               icon="🚚"
//             />
//             <StatsCard
//               label="Earnings"
//               value={`RWF ${earnings.toLocaleString()}`}
//               detail="Total earned"
//               tone="green"
//               icon="💸"
//             />
//           </View>
//           <View className="mb-3 mt-8 flex-row justify-between">
//             <Text className="text-lg font-extrabold text-slate-900">
//               Active delivery
//             </Text>
//             <Text className="text-sm font-bold text-emerald-700">Live</Text>
//           </View>
//           {delivery ? (
//             <DeliveryCard
//               delivery={{
//                 ...activeDelivery,
//                 ...delivery,
//                 merchant:
//                   delivery.pickup?.name ||
//                   delivery.merchant ||
//                   activeDelivery.merchant,
//                 customer:
//                   delivery.dropoff?.name ||
//                   delivery.customer ||
//                   activeDelivery.customer,
//               }}
//               onPress={() => navigation.navigate(APP_ROUTES.ACTIVE_DELIVERY)}
//             />
//           ) : (
//             <EmptyState
//               title="No active delivery"
//               message="Go online to start receiving delivery requests."
//             />
//           )}
//         </View>
//       </View>
//     </ScrollView>
//   );
// }



import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import Constants from "expo-constants";

import DeliveryCard from "../../components/DeliveryCard";
import DriverStatusToggle from "../../components/DriverStatusToggle";
import EmptyState from "../../components/EmptyState";
import Header from "../../components/Header";
import StatsCard from "../../components/StatsCard";
import {
  activeDelivery,
  driver as demoDriver,
} from "../../constants/mock-data";
import { APP_ROUTES } from "../../constants/routes";
import { registerForDeliveryNotifications } from "../../services/NotificationService";
import {
  syncDriverLocation,
  syncFcmToken,
  updateDriverOnlineStatus,
} from "../../services/DriverService";
import { clearDriverSession } from "../../services/SessionService";
import useAuthStore from "../../store/useAuthStore";
import useDeliveryStore from "../../store/useDeliveryStore";
import { isFirebaseConfigured } from "../../services/firebase";

export default function HomeScreen({ navigation }) {
  const user = useAuthStore((state) => state.user);
  const backendDriver = useDeliveryStore((state) => state.driver);
  const activeOrder = useDeliveryStore((state) => state.activeOrder);
  const setDriver = useDeliveryStore((state) => state.setDriver);
  const [isOnline, setIsOnline] = useState(Boolean(backendDriver?.isOnline));
  const [updating, setUpdating] = useState(false);
  
  useEffect(() => {
    if (backendDriver) setIsOnline(Boolean(backendDriver.isOnline));
  }, [backendDriver]);
  
  useEffect(() => {
    if (Constants.appOwnership === "expo") return undefined;
    require("../../services/NotificationService")
      .registerForDeliveryNotifications((token) =>
        syncFcmToken(user.id, token).catch(() => {}),
      )
      .catch(() => {});
    return undefined;
  }, [user.id]);
  
  const logout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            if (isOnline && isFirebaseConfigured) {
              await updateDriverOnlineStatus(user.id, false).catch(() => {});
            }
            await clearDriverSession();
            useAuthStore.getState().reset();
          },
        },
      ]
    );
  };
  
  const toggleOnline = async (nextValue) => {
    const previous = isOnline;
    setIsOnline(nextValue);
    setUpdating(true);
    try {
      if (!isFirebaseConfigured) {
        setDriver({ ...(backendDriver || demoDriver), isOnline: nextValue });
        setUpdating(false);
        return;
      }
      
      await updateDriverOnlineStatus(user.id, nextValue);
      if (nextValue) await syncDriverLocation(user.id);
    } catch (error) {
      setIsOnline(previous);
      Alert.alert("Status not updated", error.message);
    } finally {
      setUpdating(false);
    }
  };
  
  const todayDeliveries = backendDriver?.todayDeliveries || (activeOrder ? 1 : 0);
  const earnings = backendDriver?.totalEarnings || 0;
  const delivery = activeOrder || (backendDriver?.currentOrderId ? null : activeDelivery);

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ paddingBottom: 32 }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="mx-auto w-full max-w-3xl">
        <Header
          title={`Hello, ${(backendDriver?.name || user?.name || demoDriver.name).split(" ")[0]}.`}
          subtitle="Stay online to receive nearby offers."
          initials={demoDriver.initials}
        />
        <View className="px-5">
          <DriverStatusToggle
            isOnline={isOnline}
            onChange={toggleOnline}
            busy={updating}
          />
          
          <Text className="mb-3 mt-8 text-lg font-extrabold text-slate-900">
            Today at a glance
          </Text>
          <View className="flex-row gap-3">
            <StatsCard
              label="Deliveries"
              value={String(todayDeliveries)}
              detail="Completed today"
              tone="blue"
              icon="🚚"
            />
            <StatsCard
              label="Earnings"
              value={`RWF ${earnings.toLocaleString()}`}
              detail="Total earned"
              tone="green"
              icon="💸"
            />
          </View>
          <View className="mb-3 mt-8 flex-row justify-between">
            <Text className="text-lg font-extrabold text-slate-900">
              Active delivery
            </Text>
            <Text className="text-sm font-bold text-emerald-700">Live</Text>
          </View>
          {delivery ? (
            <DeliveryCard
              delivery={{
                ...activeDelivery,
                ...delivery,
                merchant:
                  delivery.pickup?.name ||
                  delivery.merchant ||
                  activeDelivery.merchant,
                customer:
                  delivery.dropoff?.name ||
                  delivery.customer ||
                  activeDelivery.customer,
              }}
              onPress={() => navigation.navigate(APP_ROUTES.ACTIVE_DELIVERY)}
            />
          ) : (
            <EmptyState
              title="No active delivery"
              message="Go online to start receiving delivery requests."
            />
          )}
          
          
          <Pressable
            onPress={logout}
            className="mt-8 items-center rounded-2xl border border-slate-200 bg-white py-4 active:bg-slate-50"
          >
            <Text className="text-sm font-semibold text-slate-600">Logout</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}