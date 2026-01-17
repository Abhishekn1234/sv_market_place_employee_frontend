import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { baseURL } from "./apiConfig";
import { useAuthStore } from "@/core/store/auth";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { employeeData } = useAuthStore.getState();

  if (employeeData?.accessToken) {
    config.headers.Authorization = `Bearer ${employeeData.accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const { employeeData, updateTokens, logout } =
      useAuthStore.getState();

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      employeeData?.refreshToken
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${baseURL}/auth/refresh-token`,
          { refreshToken: employeeData.refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const { accessToken, refreshToken } = refreshResponse.data;

        updateTokens(accessToken, refreshToken);

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (err) {
        logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

