import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = __DEV__
  ? 'http://192.168.1.5:3000'
  : 'https://your-vercel-app.vercel.app';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Auto-attach token to every request
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('sb-auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});