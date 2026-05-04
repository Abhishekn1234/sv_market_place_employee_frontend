import { Bell, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInAppNotification } from "../hooks/useinAppNotification";

export const FloatingNotification = () => {
  const data = useInAppNotification();
  const navigate = useNavigate();

  if (!data) return null;

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

          <button
            onClick={() => navigate(data.url)}
            className="mt-2 flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            Open
          </button>
        </div>
      </div>
    </div>
  );
};