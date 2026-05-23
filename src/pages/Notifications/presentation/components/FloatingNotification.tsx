import { Bell, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInAppNotification } from "../hooks/useinAppNotification";
import { Button } from "@/components/ui/button";

export const FloatingNotification = () => {
  const data = useInAppNotification();
  const navigate = useNavigate();

  if (!data) return null;

  const handleOpen = () => {
    if (!data?.url) return;

    // 🔥 FIX: ensure internal routing works correctly
    if (data.url.startsWith("http")) {
      window.open(data.url, "_blank");
    } else {
      navigate(data.url.startsWith("/") ? data.url : `/${data.url}`);
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50 w-80 animate-slide-in">
      <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-4 flex gap-3">

        <div className="bg-blue-100 p-2 rounded-full">
          <Bell className="w-5 h-5 text-blue-600" />
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900">
            {data.title}
          </h4>

          <p className="text-xs text-gray-500 mt-1">
            {data.body}
          </p>

          <div className="mt-3 flex items-center justify-between gap-2">
            <Button
            variant="ghost"
              onClick={handleOpen}
              className="flex-1 flex items-center justify-center gap-1 text-xs text-blue-600 font-medium hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              Open
            </Button>

            <Button
            variant="ghost"
              onClick={() => window.dispatchEvent(new CustomEvent("in-app-notification-close"))}
              className="flex-1 flex items-center justify-center text-xs text-gray-600 font-medium hover:underline"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};