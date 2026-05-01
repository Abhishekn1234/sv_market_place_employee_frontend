import { create } from "zustand";

type NotificationState = {
  token: string | null;
  permission: NotificationPermission;
  isRegistered: boolean;

  setToken: (token: string | null) => void;
  setPermission: (permission: NotificationPermission) => void;
  setRegistered: (status: boolean) => void;

  reset: () => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  token: null,
  permission: "default",
  isRegistered: false,

  setToken: (token) => set({ token }),
  setPermission: (permission) => set({ permission }),
  setRegistered: (status) => set({ isRegistered: status }),

  reset: () =>
    set({
      token: null,
      permission: "default",
      isRegistered: false,
    }),
}));