import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { baseURL } from "./apiConfig";
import { useAuthStore } from "@/core/store/auth";

const getPreferredLanguage = () => {
  const state = useAuthStore.getState();
  const preferredLanguage = (
    state.preferredLanguage ||
    state.user?.preferredLanguage ||
    "EN"
  ).toUpperCase();

  switch (preferredLanguage) {
    case "AR":
      return "ar";
    case "HI":
      return "hi";
    default:
      return "en";
  }
};

export const getAcceptLanguageHeader = () => ({
  "accept-language": getPreferredLanguage(),
});

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const languageHeader = getAcceptLanguageHeader();
    config.headers["accept-language"] = languageHeader["accept-language"];

    return config;
  },
  (error) => Promise.reject(error)
);

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
        {
          headers: {
            "Content-Type": "application/json",
            ...getAcceptLanguageHeader(),
          },
        }
      );

      const { accessToken, refreshToken } = refreshResponse.data;

      setTokens(accessToken, refreshToken);

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
