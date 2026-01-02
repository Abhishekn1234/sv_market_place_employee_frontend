import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export type TabType = "profile" | "password" | "location";

interface SWNavigationListenerProps {
  setActiveTab?: (tab: TabType) => void; // optional
}

export default function SWNavigationListener({ setActiveTab }: SWNavigationListenerProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const { type, payload } = event.data || {};
      if (type === "NAVIGATE" && payload?.url) {
        // Always set the tab if provided
        if (payload.tab && setActiveTab) {
          setActiveTab(payload.tab);
        }

        // Only navigate if different route
        if (location.pathname !== payload.url) {
          navigate(payload.url, { replace: true });
        } else {
          // Force update for same route (optional hack)
          window.history.replaceState({}, "", payload.url);
        }
      }
    };

    navigator.serviceWorker?.addEventListener("message", onMessage);
    return () => navigator.serviceWorker?.removeEventListener("message", onMessage);
  }, [navigate, setActiveTab, location.pathname]);

  return null;
}

