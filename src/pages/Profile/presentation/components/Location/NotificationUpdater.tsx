import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function NotificationNavigator() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.serviceWorker) return;

    const handler = (event: MessageEvent) => {
      if (event.data?.type === "NAVIGATE_LOCATION_TAB") {
        navigate("/settings/profile", {
          state: {
            fromNotification: true,
            tab: "location",
          },
        });
      }
    };

    navigator.serviceWorker.addEventListener("message", handler);
    return () =>
      navigator.serviceWorker.removeEventListener("message", handler);
  }, [navigate]);

  return null;
}
