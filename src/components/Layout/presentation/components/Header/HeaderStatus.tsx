import CommonSpinner from "@/components/common/CommonSpinner";
import { Switch } from "@/components/ui/switch";
import type { TranslationSchema } from "@/context/domain/entities/types/translationschema.types";

interface Props {
  isRTL: boolean;
  isOnline: boolean;
  workerStatus: boolean;
  loading: boolean;
  homeTranslations: TranslationSchema;
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
  return (
    <div className={`flex items-center gap-3 ${isRTL ? "justify-end" : ""}`}>
      <span
        className={`text-sm font-medium whitespace-nowrap ${
          isOnline ? "text-green-600" : "text-gray-500"
        }`}
      >
        {workerStatus ? (
          isOnline
            ? homeTranslations?.HomePage?.online ?? "Online"
            : homeTranslations?.HomePage?.offline ?? "Offline"
        ) : (
          <CommonSpinner />
        )}
      </span>

      <Switch
        dir={isRTL ? "rtl" : "ltr"}
        checked={isOnline}
        onCheckedChange={handleToggle}
        disabled={loading || !workerStatus}
      />
    </div>
  );
}