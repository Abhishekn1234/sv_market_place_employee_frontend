import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { baseURL } from "./apiConfig";
import { useAuthStore } from "@/core/store/auth";

// Axios instance
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { employeeData } = useAuthStore.getState();

  if (employeeData?.accessToken && config.headers) {
    config.headers.set(
      "Authorization",
      `Bearer ${employeeData.accessToken}`
    );
  }
  // console.log("Request Config:", config);

  return config;
});

/* ================= RESPONSE INTERCEPTOR ================= */
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

    // 🔁 Handle access token expiry
    if (error.response?.status === 401 && !originalRequest._retry && employeeData?.refreshToken) {
  originalRequest._retry = true;

  try {
    const response = await axios.post(`${baseURL}/auth/refresh-token`, { refreshToken: employeeData.refreshToken }, { headers: { "Content-Type": "application/json" } });
    const { accessToken, refreshToken } = response.data;

    // Update tokens in Zustand
    updateTokens(accessToken, refreshToken);

    // Update Axios defaults
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    // Retry original request with new token
    if (originalRequest.headers) {
      originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return api(originalRequest);
  } catch (refreshError) {
    logout();
    return Promise.reject(refreshError);
  }
}


    return Promise.reject(error);
  }
);

export default api;
