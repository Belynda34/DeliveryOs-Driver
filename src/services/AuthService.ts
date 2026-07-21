import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { auth } from '@/services/firebase';

const SESSION_STORAGE_KEY = 'deliveryos:session';

export type StoredSession = {
  driverId: string;
  authToken: string;
};

export type RequestOtpResult =
  | { success: true; confirmation: FirebaseAuthTypes.ConfirmationResult }
  | { success: false; error: string };

export type ConfirmOtpResult =
  { success: true; driverId: string; authToken: string } | { success: false; error: string };

export async function requestOtp(phoneNumber: string): Promise<RequestOtpResult> {
  try {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    return { success: true, confirmation };
  } catch (error) {
    console.error('[AuthService/requestOtp]', error);
    return {
      success: false,
      error: 'Could not send a verification code to that number. Please try again.',
    };
  }
}

export async function confirmOtp(
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  code: string
): Promise<ConfirmOtpResult> {
  try {
    const userCredential = await confirmation.confirm(code);
    const user = userCredential?.user ?? auth().currentUser;
    if (!user) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
    const authToken = await user.getIdToken();
    return { success: true, driverId: user.uid, authToken };
  } catch (error) {
    console.error('[AuthService/confirmOtp]', error);
    return { success: false, error: 'That code is incorrect. Please check and try again.' };
  }
}

export async function saveSession(session: StoredSession): Promise<void> {
  try {
    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('[AuthService/saveSession]', error);
  }
}

export async function getSession(): Promise<StoredSession | null> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as StoredSession;
  } catch (error) {
    console.error('[AuthService/getSession]', error);
    return null;
  }
}

export async function clearSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error('[AuthService/clearSession]', error);
  }
  try {
    await auth().signOut();
  } catch (error) {
    console.error('[AuthService/clearSession]', error);
  }
}
