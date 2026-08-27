import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'sb-auth-token';
const REFRESH_TOKEN_KEY = 'sb-refresh-token';
const USER_KEY = 'sb-user';

export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
};

export const getUser = async () => {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearAuth = async () => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
};