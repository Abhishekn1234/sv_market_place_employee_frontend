import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ApiDocument } from "@/pages/Profile/domain/entities/documents";
import type { GeoPoint } from "@/pages/Profile/domain/entities/location";
import type { WorkerStatus } from "@/pages/Servicesettings/domain/entities/workerstatus";
import type { Worker } from "@/pages/Profile/domain/entities/workertype";
import { getOnboardingStatus, type OnboardingStatus } from "@/pages/Servicesettings/presentation/helpers/documentstatus";

/* ----------------------------- Helpers ----------------------------- */

export const mapStatus = (status: string | number): WorkerStatus => {
  switch (status) {
    case "ONLINE":
    case 1:
    case "1":
      return "ONLINE";
    case "OFFLINE":
    case 0:
    case "0":
      return "OFFLINE";
    case "BUSY":
      return "BUSY";
    default:
      return "OFFLINE";
  }
};

/* ----------------------------- Types ----------------------------- */

export interface EmployeeUser {
  _id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  location?: GeoPoint;

  preferredTheme?: "light" | "dark";
  preferredLanguage?: "EN" | "AR" | "HI";
   
  profileImage?: string;
  profilePictureUrl?: string;
  profilePicturePublicId?: string;

  documents?: ApiDocument[];
  isVerified?: boolean;
  kycStatus?: string;
  role?: {
    _id?: string;
    name?: string;
    modules?:string[];
  };
  worker?: Worker;
   isOnboarded?: boolean;
   onboardingStatus?: OnboardingStatus;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: EmployeeUser | null;
  isAuthenticated: boolean;
  hydrated: boolean; // ✅ ADD THIS
  setHydrated: () => void;


  /* Core */
  setAuth: (user: EmployeeUser) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;

  /* Updates */
  updateUserProfile: (payload: Partial<EmployeeUser>) => void;
  updateUserStatus: (status: WorkerStatus) => void;
  updateWorker: (payload: Partial<Worker>) => void;

  /* Preferences */
  setPreferredLanguage: (lang: "EN" | "AR" | "HI") => void;
  setPreferredTheme: (theme: "light" | "dark") => void;
  setUserLocation: (location: GeoPoint) => void;
  
}

/* ----------------------------- Store ----------------------------- */

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
       hydrated: false, // ✅

    setHydrated: () => set({ hydrated: true }),

      /* ------------------ SET USER ------------------ */
     setAuth: (incomingUser) => {
  const existingUser = get().user;

  const incomingLocation = incomingUser?.worker?.location;

  const finalUser: EmployeeUser = {
    ...incomingUser,

    worker: {
      ...(existingUser?.worker || {}),
      ...(incomingUser.worker || {}),

      // ✅ KEEP OLD LOCATION IF MISSING
      location:
        incomingLocation ??
        existingUser?.worker?.location,
    },
  };

  const status = getOnboardingStatus(finalUser);

  set({
    user: {
      ...finalUser,
      onboardingStatus: status,
      isOnboarded: status === "COMPLETED",
    },
    isAuthenticated: true,
  });
},

      /* ------------------ SET TOKENS ------------------ */
      setTokens: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      /* ------------------ LOGOUT ------------------ */
              logout: () => {
            set({
              accessToken: null,
              refreshToken: null,
              user: null,
              isAuthenticated: false,
            });

            localStorage.clear(); // or removeItem is fine if only one
          },

      /* ------------------ UPDATE PROFILE ------------------ */
      updateUserProfile: (payload) => {
        const { user } = get();
        if (!user) return;

        set({
          user: {
            ...user,
            ...payload,
          },
        });
      },

      /* ------------------ UPDATE STATUS ------------------ */
      updateUserStatus: (status) => {
  const { user } = get();
  if (!user) return;

  set({
    user: {
      ...user,
      worker: {
        ...(user.worker || {}), // ✅ FIX
        status: mapStatus(status),
      },
    },
  });},

      /* ------------------ UPDATE WORKER ------------------ */
     updateWorker: (payload) => {
  const { user } = get();
  if (!user) return;

  set({
    user: {
      ...user,
      worker: {
        ...(user.worker || {}), // ✅ FIX: create if missing
        ...payload,
      },
    },
  });
},

      /* ------------------ LANGUAGE ------------------ */
      setPreferredLanguage: (lang) => {
        const { user } = get();
        if (!user) return;

        set({
          user: {
            ...user,
            preferredLanguage: lang,
          },
        });
      },

      /* ------------------ THEME ------------------ */
      setPreferredTheme: (theme) => {
        const { user } = get();
        if (!user) return;

        set({
          user: {
            ...user,
            preferredTheme: theme,
          },
        });
      },

      /* ------------------ LOCATION ------------------ */
      setUserLocation: (location) => {
        const { user } = get();
        if (!user?.worker) return;

        set({
          user: {
            ...user,
            worker: {
              ...user.worker,
              location,
            },
          },
        });
      },
    }),
    {
  name: "employee-storage",

  onRehydrateStorage: () => (state) => {
    state?.setHydrated(); // ✅ VERY IMPORTANT
  },
}
  )
);



export const useEmployeeUser = () =>
  useAuthStore((s) => s.user);

export const useEmployeeWorker = () =>
  useAuthStore((s) => s.user?.worker);

export const useIsAuthenticated = () =>
  useAuthStore((s) => s.isAuthenticated);

export const usePreferredLanguage = () =>
  useAuthStore((s) => s.user?.preferredLanguage);

export const usePreferredTheme = () =>
  useAuthStore((s) => s.user?.preferredTheme);