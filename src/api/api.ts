import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { baseURL } from "./apiConfig";

interface EmployeeData {
  accessToken: string;
  refreshToken: string;
  user?: any; // keep user intact
}

// Helpers
const getEmployeeData = (): EmployeeData | null => {
  const data = localStorage.getItem("employeeData");
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

const setEmployeeData = (data: EmployeeData) => {
  localStorage.setItem("employeeData", JSON.stringify(data));
};

// Axios instance
const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const employeeData = getEmployeeData();
  if (employeeData?.accessToken && config.headers) {
    config.headers.set("Authorization", `Bearer ${employeeData.accessToken}`);
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const employeeData = getEmployeeData();
      if (employeeData?.refreshToken) {
        try {
          // Call refresh token API
          const { data } = await axios.post(
            `${baseURL}auth/refresh-token`,
            { refreshToken: employeeData.refreshToken },
            { headers: { "Content-Type": "application/json" } }
          );

          // Update only accessToken and refreshToken, keep user intact
          const newEmployeeData: EmployeeData = {
            ...employeeData,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
          setEmployeeData(newEmployeeData);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.set("Authorization", `Bearer ${data.accessToken}`);
          }
          return api(originalRequest); // retry automatically
        } catch (refreshError) {
          console.error("Refresh token failed", refreshError);
          // Do NOT redirect to login automatically here if you want silent failure
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

