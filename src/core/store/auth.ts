import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ApiDocument } from "@/pages/Profile/domain/entities/documents";
import type { GeoPoint } from "@/pages/Profile/domain/entities/location";
import type { WorkerStatus } from "@/pages/Servicesettings/domain/entities/workerstatus";
import type { Worker } from "@/pages/Profile/domain/entities/workertype";
import { getOnboardingStatus, type OnboardingStatus } from "@/pages/Servicesettings/presentation/helpers/documentstatus";
import type { Language } from "@/context/domain/entities/types/language.types";

/* =========================
   NOTIFICATION TYPE
========================= */

export interface AppNotification {
  _id: string;
  title?: string;
  message?: string;
  type?: string;
  bookingId?: string;
  url?: string;
  createdAt?: string;
  isRead?: boolean;
}

/* =========================
   HELPERS
========================= */

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

/* =========================
   USER TYPE
========================= */

export interface EmployeeUser {
  _id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  location?: GeoPoint;

  preferredTheme?: "light" | "dark";
  preferredLanguage?: Language;

  profileImage?: string;
  profilePictureUrl?: string;
  profilePicturePublicId?: string;

  documents?: ApiDocument[];
  isVerified?: boolean;
  kycStatus?: string;

  role?: {
    _id?: string;
    name?: string;
    modules?: string[];
  };

  worker?: Worker;
  isOnboarded?: boolean;
  onboardingStatus?: OnboardingStatus;
}

/* =========================
   AUTH STATE
========================= */

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: EmployeeUser | null;
  isAuthenticated: boolean;
  preferredLanguage: Language;

  hydrated: boolean;
  setHydrated: () => void;

  /* =========================
     NOTIFICATIONS (NEW)
  ========================= */
  notifications: AppNotification[];
  unreadCount: number;

  setNotifications: (n: AppNotification[]) => void;
  addNotification: (n: AppNotification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;

  /* =========================
     AUTH
  ========================= */
  setAuth: (user: EmployeeUser) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;

  /* =========================
     UPDATES
  ========================= */
  updateUserProfile: (payload: Partial<EmployeeUser>) => void;
  updateUserStatus: (status: WorkerStatus) => void;
  updateWorker: (payload: Partial<Worker>) => void;

  /* =========================
     PREFERENCES
  ========================= */
  setPreferredLanguage: (lang: Language) => void;
  setPreferredTheme: (theme: "light" | "dark") => void;
  setUserLocation: (location: GeoPoint) => void;
}

/* =========================
   STORE
========================= */

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      preferredLanguage: "EN",

      hydrated: false,
      setHydrated: () => set({ hydrated: true }),

      /* =========================
         NOTIFICATIONS STATE
      ========================= */
      notifications: [],
      unreadCount: 0,

      setNotifications: (n) =>
        set(() => ({
          notifications: n,
          unreadCount: n.filter((x) => !x.isRead).length,
        })),

      addNotification: (n) =>
        set((state) => {
          const exists = state.notifications.some(
            (x) => x._id === n._id
          );

          if (exists) return state;

          const updated = [n, ...state.notifications];

          return {
            notifications: updated,
            unreadCount: updated.filter((x) => !x.isRead).length,
          };
        }),
        markAllAsRead: () =>
  set((state) => ({
    notifications: state.notifications.map((n) => ({
      ...n,
      isRead: true,
    })),
    unreadCount: 0,
  })),

      markAsRead: (id) =>
        set((state) => {
          const updated = state.notifications.map((n) =>
            n._id === id ? { ...n, isRead: true } : n
          );

          return {
            notifications: updated,
            unreadCount: updated.filter((x) => !x.isRead).length,
          };
        }),

      clearNotifications: () =>
        set({
          notifications: [],
          unreadCount: 0,
        }),

      /* =========================
         AUTH
      ========================= */

      setAuth: (incomingUser) => {
        const existingUser = get().user;
        const preferredLanguage = normalizeLanguage(
          incomingUser.preferredLanguage ??
            existingUser?.preferredLanguage ??
            get().preferredLanguage
        );

        const incomingLocation = incomingUser?.worker?.location;

        const finalUser: EmployeeUser = {
          ...incomingUser,

          worker: {
            ...(existingUser?.worker || {}),
            ...(incomingUser.worker || {}),

            location:
              incomingLocation ??
              existingUser?.worker?.location,
          },
        };

        const status = getOnboardingStatus(finalUser);

        set({
          user: {
            ...finalUser,
            preferredLanguage,
            onboardingStatus: status,
            isOnboarded: status === "COMPLETED",
          },
          preferredLanguage,
          isAuthenticated: true,
        });
      },

      setTokens: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          notifications: [],
          unreadCount: 0,
        });

        localStorage.clear();
      },

      /* =========================
         PROFILE UPDATE
      ========================= */

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

      updateUserStatus: (status: any) =>
        set((state) => {
          if (!state.user) return state;

          const normalized =
            status === "ONLINE" ||
            status === 1 ||
            status === "1"
              ? "ONLINE"
              : status === "BUSY"
              ? "BUSY"
              : "OFFLINE";

          return {
            user: {
              ...state.user,
              worker: {
                ...state.user.worker,
                status: normalized,
              },
            },
          };
        }),

      updateWorker: (payload) => {
        const { user } = get();
        if (!user) return;

        set({
          user: {
            ...user,
            worker: {
              ...(user.worker || {}),
              ...payload,
            },
          },
        });
      },

      /* =========================
         PREFERENCES
      ========================= */

      setPreferredLanguage: (lang) => {
        const preferredLanguage = normalizeLanguage(lang);
        const { user } = get();

        set({
          preferredLanguage,
          user: user
            ? {
                ...user,
                preferredLanguage,
              }
            : user,
        });
      },

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
        state?.setHydrated();
      },
    }
  )
);

/* =========================
   SELECTORS
========================= */

export const useEmployeeUser = () =>
  useAuthStore((s) => s.user);

export const useEmployeeWorker = () =>
  useAuthStore((s) => s.user?.worker);

export const useIsAuthenticated = () =>
  useAuthStore((s) => s.isAuthenticated);

export const usePreferredLanguage = () =>
  useAuthStore((s) => s.preferredLanguage);

const normalizeLanguage = (value?: string | null): Language => {
  switch (value?.toUpperCase()) {
    case "AR":
      return "AR";
    case "HI":
      return "HI";
    default:
      return "EN";
  }
};

export const usePreferredTheme = () =>
  useAuthStore((s) => s.user?.preferredTheme);

export const useNotifications = () =>
  useAuthStore((s) => s.notifications);

export const useUnreadCount = () =>
  useAuthStore((s) => s.unreadCount);
