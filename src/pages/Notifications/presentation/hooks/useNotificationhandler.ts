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

  const isLoggedIn = Boolean(user);
  const roleId = user?.role?._id;

  // 1️⃣ Request notification permission and FCM token
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
  }, [setPermission, setToken]);

  // 2️⃣ Register token only when user is logged in
  useEffect(() => {
    if (!isLoggedIn) return;
    if (!token || !roleId) return;

    const register = async () => {
      try {
        await registerToken({
          token,
          platform: "WEB",
          roleId,
          deviceId: generateDeviceId(),
          appId: "your-app-id",
        });

        setRegistered(true);
      } catch (error) {
        console.error("Device token registration failed:", error);
      }
    };

    register();
  }, [
    isLoggedIn,
    token,
    roleId,
    registerToken,
    setRegistered,
  ]);

  // 3️⃣ Cleanup local notification state on logout
  // ❌ No API call here, so no 401 on login page
  useEffect(() => {
    if (isLoggedIn) return;

    reset();
  }, [isLoggedIn, reset]);

  // 4️⃣ Periodic token refresh
  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(async () => {
      try {
        const newToken = await requestAndGetToken();

        if (!newToken || newToken === token) return;

        // Optional: unregister old token BEFORE registering new one
        if (token) {
          try {
            await unregisterToken(token);
          } catch (error) {
            console.warn("Failed to unregister old token:", error);
          }
        }

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
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
    }, 1000 * 60 * 10); // 30 minutes

    return () => clearInterval(interval);
  }, [
    isLoggedIn,
    token,
    roleId,
    registerToken,
    unregisterToken,
    setToken,
    setRegistered,
  ]);
};