import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { baseURL } from "./apiConfig";
import { useAuthStore } from "@/core/store/auth";


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
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve(token!);
  });
  failedQueue = [];
};



api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { employeeData } = useAuthStore.getState();

    if (employeeData?.accessToken) {
      config.headers.Authorization = `Bearer ${employeeData.accessToken}`;
    }

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

    const { employeeData, updateTokens, logout } =
      useAuthStore.getState();

    if (!employeeData?.refreshToken) {
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
        { refreshToken: employeeData.refreshToken },
        { headers: { "Content-Type": "application/json" } }
      );

      const { accessToken, refreshToken } = refreshResponse.data;

      updateTokens(accessToken, refreshToken);

      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
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

