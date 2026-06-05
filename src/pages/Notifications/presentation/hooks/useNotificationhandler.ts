// useNotificationManager.ts
import { useEffect } from "react";
import { useNotificationStore } from "@/core/store/notificationStore";
import { useRegisterDeviceToken } from "./useRegisterToken";
import { useUnregisterDeviceToken } from "./useUnRegisterToken";
import { useAuthStore } from "@/core/store/auth";
import { requestAndGetToken } from "@/components/firebase/notifications";
import { generateDeviceId } from "../utils/generationdeviceId";

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

  // 2️⃣ Register token (avoid re-register loops)
  useEffect(() => {
    const roleId = user?.role?._id;
    if (!token || !roleId) return;

    const register = async () => {
      await registerToken({
        token,
        platform: "WEB",
        roleId,
       deviceId: generateDeviceId(),
        appId: "your-app-id",
      });
      setRegistered(true);
    };

    register();
  }, [token, user?.role?._id]);

  // 3️⃣ Logout cleanup
  useEffect(() => {
    if (user) return;
    if (!token) return;

    unregisterToken(token);
    reset();
  }, [user, token]);

  // 4️⃣ Token refresh (register only when truly needed)
  useEffect(() => {
    const interval = setInterval(async () => {
      const newToken = await requestAndGetToken();
      if (!newToken || newToken === token) return;

      // Only do network calls if we have a logged-in user role
      const roleId = user?.role?._id;

      if (token) await unregisterToken(token);
      setToken(newToken);

      if (roleId) {
        await registerToken({
          token: newToken,
          platform: "WEB",
          roleId,
          deviceId: generateDeviceId(),
          appId: "your-app-id",
        });
        setRegistered(true);
      }
    }, 1000 * 60 * 30);

    return () => clearInterval(interval);
  }, [token, user?.role?._id]);
};