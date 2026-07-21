import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

import * as AuthService from '@/services/AuthService';
import { useAppDispatch } from '@/store';
import { setSession } from '@/store/sessionSlice';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

type Step = 'phone' | 'otp';

export function LoginScreen(): React.JSX.Element {
  const dispatch = useAppDispatch();

  const [step, setStep] = useState<Step>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [confirmation, setConfirmation] = useState<FirebaseAuthTypes.ConfirmationResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async (): Promise<void> => {
    if (!phoneNumber.trim()) {
      setError('Enter your phone number to continue.');
      return;
    }
    setIsLoading(true);
    setError(null);
    const result = await AuthService.requestOtp(phoneNumber.trim());
    setIsLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setConfirmation(result.confirmation);
    setStep('otp');
  };

  const handleVerifyCode = async (): Promise<void> => {
    if (!confirmation) {
      setError('Something went wrong. Please request a new code.');
      setStep('phone');
      return;
    }
    if (!code.trim()) {
      setError('Enter the code we sent you.');
      return;
    }
    setIsLoading(true);
    setError(null);
    const result = await AuthService.confirmOtp(confirmation, code.trim());
    if (!result.success) {
      setIsLoading(false);
      setError(result.error);
      return;
    }
    const session = { driverId: result.driverId, authToken: result.authToken };
    await AuthService.saveSession(session);
    dispatch(setSession(session));
    setIsLoading(false);
  };

  const handleUseDifferentNumber = (): void => {
    setStep('phone');
    setCode('');
    setError(null);
    setConfirmation(null);
  };

  return (
    <View className="flex-1 justify-center bg-background px-6">
      <View className="gap-4 rounded-card border border-border bg-surface p-6">
        <Text className="text-2xl font-bold text-text-primary">
          {step === 'phone' ? 'Driver Login' : 'Enter Verification Code'}
        </Text>
        <Text className="text-sm text-text-secondary">
          {step === 'phone'
            ? 'Enter your phone number to sign in.'
            : `We sent a code to ${phoneNumber.trim()}.`}
        </Text>

        {step === 'phone' ? (
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="+250 788 000 000"
            keyboardType="phone-pad"
            autoFocus
            editable={!isLoading}
            className="rounded-card border border-border bg-surface-raised px-4 py-3 text-base text-text-primary placeholder:text-text-muted"
          />
        ) : (
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="123456"
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
            editable={!isLoading}
            className="rounded-card border border-border bg-surface-raised px-4 py-3 text-base tracking-widest text-text-primary placeholder:text-text-muted"
          />
        )}

        {error ? <Text className="text-sm text-error">{error}</Text> : null}

        <Pressable
          onPress={step === 'phone' ? handleSendCode : handleVerifyCode}
          disabled={isLoading}
          className="items-center rounded-pill bg-accent px-6 py-3 disabled:opacity-60">
          {isLoading ? (
            <ActivityIndicator color="#0B0E11" />
          ) : (
            <Text className="font-semibold text-accent-foreground">
              {step === 'phone' ? 'Send Code' : 'Verify & Continue'}
            </Text>
          )}
        </Pressable>

        {step === 'otp' ? (
          <Pressable onPress={handleUseDifferentNumber} disabled={isLoading}>
            <Text className="text-center text-sm text-text-secondary">Use a different number</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
