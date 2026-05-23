import { useEffect, useState } from "react";

export const useInAppNotification = () => {
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      setNotification(e.detail);

      setTimeout(() => {
        setNotification(null);
      }, 5000);
    };

    const closeHandler = () => setNotification(null);

    window.addEventListener("in-app-notification", handler);
    window.addEventListener("in-app-notification-close", closeHandler);

    return () => {
      window.removeEventListener("in-app-notification", handler);
      window.removeEventListener("in-app-notification-close", closeHandler);
    };
  }, []);


  return notification;
};