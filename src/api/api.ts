import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { baseURL } from "./apiConfig";
import { useAuthStore } from "@/core/store/auth";

/* ---------------- Initial Token Cache ---------------- */

let accessTokenCache: string | null =
  useAuthStore.getState().accessToken ?? null;

let refreshTokenCache: string | null =
  useAuthStore.getState().refreshToken ?? null;

/* ---------------- Axios Instance ---------------- */

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---------------- Refresh Handling ---------------- */

let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  while (failedQueue.length) {
    const { resolve, reject } = failedQueue.shift()!;
    if (error) reject(error);
    else resolve(token!);
  }
};

/* ---------------- Request Interceptor ---------------- */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------------- Response Interceptor ---------------- */

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const { setTokens, logout } = useAuthStore.getState();
    const currentRefreshToken = useAuthStore.getState().refreshToken;

    if (!currentRefreshToken) {
      logout();
      return Promise.reject(error);
    }

    /* ---------------- If Already Refreshing ---------------- */

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshResponse = await axios.post(
        `${baseURL}/auth/refresh-token`,
        { refreshToken: currentRefreshToken },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(refreshResponse);

      const { accessToken, refreshToken } = refreshResponse.data;

      /* ✅ Update Zustand */
      setTokens(accessToken, refreshToken);

      accessTokenCache = accessToken;
      refreshTokenCache = refreshToken;

      processQueue(null, accessToken);

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;