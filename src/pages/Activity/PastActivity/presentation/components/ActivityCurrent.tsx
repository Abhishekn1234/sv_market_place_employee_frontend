import { useLanguage } from "@/context/LanguageContext";
import type { Activity } from "../../domain/entities/activity";
import type { TimePeriod } from "../../domain/entities/timeperiod";

type Props = {
  getPeriodLabel: (period: TimePeriod) => string;
  selectedPeriod: TimePeriod;
  filteredActivities: Activity[];
};

export default function ActivityCurrent({
  getPeriodLabel,
  selectedPeriod,
  filteredActivities,
}: Props) {
  const { language, t } = useLanguage();
  const isRTL = language === "AR";

  return (
    <div
      className={`flex items-center justify-between ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      <div>
        <h2 className="text-gray-900">
          {getPeriodLabel(selectedPeriod)}
        </h2>

        <p className="text-sm text-gray-600">
          {t("showing")} {filteredActivities.length}{" "}
          {filteredActivities.length === 1
            ? t("activity")
            : `${t("activity")}s`}
        </p>
      </div>
    </div>
  );
}
