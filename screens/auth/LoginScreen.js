// import { Controller, useForm } from 'react-hook-form';
// import { KeyboardAvoidingView, ScrollView, Text, TextInput, View } from 'react-native';

// import PrimaryButton from '../../components/PrimaryButton';
// import SecondaryButton from '../../components/SecondaryButton';
// import useAuthStore from '../../store/useAuthStore';
// import { saveDriverSession } from '../../services/SessionService';

// export default function LoginScreen() {
//   const setUser = useAuthStore((state) => state.setUser);
//   const { control, handleSubmit, formState: { errors } } = useForm({
//     defaultValues: { email: 'alex@deliveryos.app', password: 'driver123' },
//   });

//   const enterDemo = async () => {
//     const driver = { id: process.env.EXPO_PUBLIC_DRIVER_ID || 'mock-driver-1', name: 'Alex Morgan', zones: ['kigali-central'] };
//     await saveDriverSession(driver);
//     setUser(driver);
//   };

//   return (
//     <KeyboardAvoidingView className="flex-1 bg-slate-50" behavior="padding">
//       <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
//         <View className="mx-auto w-full max-w-xl flex-1 justify-between px-6 pb-8 pt-20">
//           <View>
//             <View className="h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 shadow-sm">
//               <Text className="text-2xl font-extrabold text-white">D</Text>
//             </View>
//             <Text className="mt-8 text-4xl font-extrabold tracking-tight text-slate-900">Drive your day.</Text>
//             <Text className="mt-3 text-base leading-6 text-slate-500">Sign in to manage deliveries, earnings, and your driver profile.</Text>
//           </View>

//           <View className="mt-12 gap-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
//             <View>
//               <Text className="mb-2 text-sm font-bold text-slate-700">Email address</Text>
//               <Controller
//                 control={control}
//                 name="email"
//                 rules={{ required: 'Enter your email address' }}
//                 render={({ field: { onChange, value } }) => (
//                   <TextInput
//                     value={value}
//                     onChangeText={onChange}
//                     autoCapitalize="none"
//                     keyboardType="email-address"
//                     placeholder="driver@example.com"
//                     placeholderTextColor="#94a3b8"
//                     className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900"
//                   />
//                 )}
//               />
//               {errors.email ? <Text className="mt-2 text-xs text-rose-600">{errors.email.message}</Text> : null}
//             </View>
//             <View>
//               <Text className="mb-2 text-sm font-bold text-slate-700">Password</Text>
//               <Controller
//                 control={control}
//                 name="password"
//                 rules={{ required: 'Enter your password' }}
//                 render={({ field: { onChange, value } }) => (
//                   <TextInput
//                     value={value}
//                     onChangeText={onChange}
//                     secureTextEntry
//                     placeholder="••••••••"
//                     placeholderTextColor="#94a3b8"
//                     className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900"
//                   />
//                 )}
//               />
//               {errors.password ? <Text className="mt-2 text-xs text-rose-600">{errors.password.message}</Text> : null}
//             </View>
//             <PrimaryButton title="Verify code & sign in" onPress={handleSubmit(enterDemo)} />
//             <SecondaryButton title="Explore demo dashboard" onPress={enterDemo} />
//           </View>

//           <Text className="mt-8 text-center text-xs leading-5 text-slate-400">Sprint OTP: enter any phone number and use code 123456. Firebase test-phone auth can replace this later.</Text>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, ScrollView, Text, TextInput, View } from 'react-native';

import PrimaryButton from '../../components/PrimaryButton';
import useAuthStore from '../../store/useAuthStore';
import { saveDriverSession } from '../../services/SessionService';

export default function LoginScreen() {
  const setUser = useAuthStore((state) => state.setUser);
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: 'alex@deliveryos.app', password: 'driver123' },
  });

  const enterDemo = async () => {
    const driver = { 
      id: 'mock-driver-1', 
      name: 'Alex Morgan', 
      zones: ['kigali-central'],
    };
    await saveDriverSession(driver);
    setUser(driver);
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-slate-50" behavior="padding">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="mx-auto w-full max-w-xl flex-1 justify-between px-6 pb-8 pt-20">
          <View>
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 shadow-sm">
              <Text className="text-2xl font-extrabold text-white">D</Text>
            </View>
            <Text className="mt-8 text-4xl font-extrabold tracking-tight text-slate-900">Drive your day.</Text>
            <Text className="mt-3 text-base leading-6 text-slate-500">Sign in to manage deliveries, earnings, and your driver profile.</Text>
          </View>

          <View className="mt-12 gap-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <View>
              <Text className="mb-2 text-sm font-bold text-slate-700">Email address</Text>
              <Controller
                control={control}
                name="email"
                rules={{ required: 'Enter your email address' }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="driver@example.com"
                    placeholderTextColor="#94a3b8"
                    className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900"
                  />
                )}
              />
              {errors.email ? <Text className="mt-2 text-xs text-rose-600">{errors.email.message}</Text> : null}
            </View>
            <View>
              <Text className="mb-2 text-sm font-bold text-slate-700">Password</Text>
              <Controller
                control={control}
                name="password"
                rules={{ required: 'Enter your password' }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900"
                  />
                )}
              />
              {errors.password ? <Text className="mt-2 text-xs text-rose-600">{errors.password.message}</Text> : null}
            </View>
            <PrimaryButton title="Sign in" onPress={handleSubmit(enterDemo)} />
          </View>

          <Text className="mt-8 text-center text-xs leading-5 text-slate-400">DeliveryOS Driver App</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}