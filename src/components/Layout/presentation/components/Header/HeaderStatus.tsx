import CommonSpinner from "@/components/common/CommonSpinner";
import { Switch } from "@/components/ui/switch";

interface Props {
  isRTL: boolean;
  isOnline: boolean;
  workerStatus: boolean;
  loading: boolean;
  homeTranslations: { online?: string; offline?: string }; // ✅ optional
  handleToggle: (val: boolean) => void;
}

export default function HeaderStatus({
  isRTL,
  isOnline,
  workerStatus,
  loading,
  homeTranslations,
  handleToggle,
}: Props) {
    isOnline ? (homeTranslations.online ?? "Online") : (homeTranslations.offline ?? "Offline")
  return (
    <div className={`flex items-center gap-3 ${isRTL ? "justify-end" : ""}`}>
      <span
        className={`text-sm font-medium whitespace-nowrap ${
          isOnline ? "text-green-600" : "text-gray-500"
        }`}
      >
        {workerStatus ? (
          isOnline ? homeTranslations.online : homeTranslations.offline
        ) : (
          <CommonSpinner />
        )}
      </span>
      <Switch
        checked={isOnline}
        onCheckedChange={handleToggle}
        disabled={loading || !workerStatus}
      />
    </div>
  );
}