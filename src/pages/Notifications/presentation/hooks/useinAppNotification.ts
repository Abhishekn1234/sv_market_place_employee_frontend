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

    window.addEventListener("in-app-notification", handler);

    return () => {
      window.removeEventListener("in-app-notification", handler);
    };
  }, []);

  return notification;
};