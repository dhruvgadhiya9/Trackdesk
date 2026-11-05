import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

/**
 * Session storage: refresh tokens in the OS keychain/keystore (expo-secure-store); falls back to
 * AsyncStorage only for values larger than SecureStore's limit (the access token is short-lived).
 */
const secureStorage = {
  getItem: async (key: string) =>
    (await SecureStore.getItemAsync(key)) ?? AsyncStorage.getItem(key),
  setItem: async (key: string, value: string) => {
    if (value.length < 2000) await SecureStore.setItemAsync(key, value);
    else await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
    await AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321',
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'public-anon-key-placeholder',
  {
    auth: {
      storage: secureStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
