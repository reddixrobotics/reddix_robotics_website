import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types';

// ─── Environment ──────────────────────────────────────────────────────────────

let _baseUrl = import.meta.env.DEV ? (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000') : '';
const BASE_URL = _baseUrl;
const TIMEOUT = Number(import.meta.env['VITE_API_TIMEOUT'] ?? 15_000);

// ─── Token storage key ────────────────────────────────────────────────────────

const TOKEN_KEY = 'reddix_access_token';

/** Read the access token from localStorage (set by auth service after login). */
export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Persist the access token to localStorage. */
export function setAccessToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/** Remove the access token (logout). */
export function clearAccessToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Axios instance ───────────────────────────────────────────────────────────

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request interceptor ─────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// ─── Response interceptor: normalise errors ───────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status;

    // 401 → clear credentials and redirect to login
    if (status === 401) {
      clearAccessToken();
    }

    // Re-throw with a normalised message so consuming code can use error.message
    const serverMessage = error.response?.data?.message;
    const message = Array.isArray(serverMessage)
      ? serverMessage.join(', ')
      : (serverMessage ?? error.message ?? 'Network error');

    return Promise.reject(new Error(message));
  },
);

export default apiClient;

