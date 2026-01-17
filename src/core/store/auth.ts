import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ApiDocument } from "@/pages/Profile/domain/entities/documents";
import type { GeoPoint, Worker } from "@/pages/Profile/domain/entities/profile";
import type { WorkerStatus } from "@/pages/Servicesettings/domain/entities/servicesettings";

/* ===================== TYPES ===================== */

export interface EmployeeUser {
  _id?:string
  fullName?: string;
  email?: string;
  address?: string;
  phone?: string;
preferredTheme?: "light" | "dark";
  profileImage?: string;
  profilePictureUrl?: string;
  profilePicturePublicId?: string;

  idProof?: string;
  addressProof?: string;
  photoProof?: string;

  isVerified?: boolean;
  kycStatus?: string;
  documents?: ApiDocument[];
  serviceRadius?:number
  worker?: Worker;
  location?: GeoPoint;
   serviceTierIds?:string[];
   serviceIds?:string[];
   categoryIds?:string[];
  status?: WorkerStatus |string;

  /** ✅ user preference */
  preferredLanguage?: "EN" | "AR" | "HI";

  [key: string]: unknown;
}

export interface EmployeeData {
  accessToken: string;
  refreshToken: string;
  user?: EmployeeUser;
}

interface AuthState {
  employeeData: EmployeeData | null;
  isAuthenticated: boolean;

  /* ---------- AUTH ---------- */
  login: (data: EmployeeData) => void;
  logout: () => void;

  /* ---------- TOKENS ---------- */
  updateTokens: (accessToken: string, refreshToken: string) => void;

  /* ---------- USER ---------- */
  updateUserStatus: (status: WorkerStatus) => void;
  updateUserProfile: (payload: Partial<EmployeeUser>) => void;
  setPreferredLanguage: (lang: "EN" | "AR" | "HI") => void;
    setPreferredTheme: (theme: "light" | "dark") => void;
     setUserLocation: (location: GeoPoint) => void;
}

/* ===================== STORE ===================== */

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      employeeData: null,
      isAuthenticated: false,

      /* ---------- LOGIN ---------- */
      login: (data) =>
        set({
          employeeData: data,
          isAuthenticated: true,
        }),

      /* ---------- LOGOUT ---------- */
      logout: () => {
        useAuthStore.persist.clearStorage();
        set({
          employeeData: null,
          isAuthenticated: false,
        });
      },

      /* ---------- TOKENS ---------- */
      updateTokens: (accessToken, refreshToken) => {
        const state = get();
        if (!state.employeeData) return;

        set({
          employeeData: {
            ...state.employeeData,
            accessToken,
            refreshToken,
          },
        });
      },

      /* ---------- STATUS ---------- */
      updateUserStatus: (status) => {
        const state = get();
        if (!state.employeeData?.user) return;

        set({
          employeeData: {
            ...state.employeeData,
            user: {
              ...state.employeeData.user,
              status,
            },
          },
        });
      },

      /* ---------- PROFILE / SETTINGS ---------- */
      updateUserProfile: (payload) => {
        const state = get();
        if (!state.employeeData?.user) return;

        set({
          employeeData: {
            ...state.employeeData,
            user: {
              ...state.employeeData.user,
              ...payload,
            },
          },
        });
      },
      setPreferredLanguage: (lang) => {
  const state = get();
  if (!state.employeeData?.user) return;

  set({
    employeeData: {
      ...state.employeeData,
      user: {
        ...state.employeeData.user,
        preferredLanguage: lang,
      },
    },
  });
},
setPreferredTheme: (theme: "light" | "dark") => {
  const state = get();
  if (!state.employeeData?.user) return;

  set({
    employeeData: {
      ...state.employeeData,
      user: {
        ...state.employeeData.user,
        preferredTheme: theme,
      },
    },
  });
},
setUserLocation: (location) => {
  const state = get();
  if (!state.employeeData?.user) return;

  set({
    employeeData: {
      ...state.employeeData,
      user: {
        ...state.employeeData.user,
        location,
      },
    },
  });
},


    }),
    
    {
      name: "auth-store",
    }
  )
);

/* ===================== SELECTORS ===================== */

export const useEmployeeUser = () =>
  useAuthStore((s) => s.employeeData?.user);

export const useEmployeeStatus = () =>
  useAuthStore((s) => s.employeeData?.user?.status);

export const useIsAuthenticated = () =>
  useAuthStore((s) => s.isAuthenticated);

export const usePreferredLanguage = () =>
  useAuthStore((s) => s.employeeData?.user?.preferredLanguage);
