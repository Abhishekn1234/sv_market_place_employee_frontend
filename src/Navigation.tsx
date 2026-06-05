import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export type TabType = "profile" | "password" | "location";

interface SWNavigationListenerProps {
  setActiveTab?: (tab: TabType) => void;
}

export default function SWNavigationListener({
  setActiveTab,
}: SWNavigationListenerProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const data = event.data || {};

      // ✅ support both formats
      const type = data.type || data?.payload?.type;
      const url = data.url || data?.payload?.url;
      const tab = data.tab || data?.payload?.tab;

      if (type !== "NAVIGATE" || !url) return;

      // Set tab if available
      if (tab && setActiveTab) {
        setActiveTab(tab);
      }

      // Normalize path (important for mobile)
      const path = new URL(url, window.location.origin).pathname;

      // Navigate always (no stale location check)
      navigate(path, { replace: true });
    };

    // ✅ IMPORTANT: BOTH CHANNELS
    navigator.serviceWorker?.addEventListener("message", handler);
    window.addEventListener("message", handler);

    return () => {
      navigator.serviceWorker?.removeEventListener("message", handler);
      window.removeEventListener("message", handler);
    };
  }, [navigate, setActiveTab]);

  return null;
}