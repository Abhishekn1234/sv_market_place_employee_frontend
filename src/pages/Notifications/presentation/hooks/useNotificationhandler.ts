// useNotificationManager.ts
import { useEffect } from "react";
import { useNotificationStore } from "@/core/store/notificationStore";
import { useRegisterDeviceToken } from "./useRegisterToken";
import { useUnregisterDeviceToken } from "./useUnRegisterToken";
import { useAuthStore } from "@/core/store/auth";
import { requestAndGetToken } from "@/components/firebase/notifications";

export const useNotificationManager = () => {
  const {
    token,
    setToken,
    setPermission,
    setRegistered,
    reset,
  } = useNotificationStore();

  const { mutateAsync: registerToken } = useRegisterDeviceToken();
  const { mutateAsync: unregisterToken } = useUnregisterDeviceToken();

  const user = useAuthStore((s) => s.user);

  // 1️⃣ Permission + token
  useEffect(() => {
    const init = async () => {
      if (!("Notification" in window)) return;

      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission !== "granted") return;

      const fcmToken = await requestAndGetToken();
      if (!fcmToken) return;

      setToken(fcmToken);
    };

    init();
  }, []);

  // 2️⃣ Register token
  useEffect(() => {
    const register = async () => {
      if (!token || !user?.role?._id) return;

      await registerToken({
        token,
        platform: "WEB",
        roleId: user.role._id,
        deviceId: navigator.userAgent,
        appId: "your-app-id",
      });

      setRegistered(true);
    };

    register();
  }, [token, user]);

  // 3️⃣ Logout cleanup
  useEffect(() => {
    if (!user && token) {
      unregisterToken(token);
      reset();
    }
  }, [user]);

  // 4️⃣ Token refresh
  useEffect(() => {
    const interval = setInterval(async () => {
      const newToken = await requestAndGetToken();

      if (newToken && newToken !== token) {
        if (token) await unregisterToken(token);

        setToken(newToken);

        if (user?.role?._id) {
          await registerToken({
            token: newToken,
            platform: "WEB",
            roleId: user.role._id,
            deviceId: navigator.userAgent,
            appId: "your-app-id",
          });
        }
      }
    }, 1000 * 60 * 30);

    return () => clearInterval(interval);
  }, [token, user]);
};