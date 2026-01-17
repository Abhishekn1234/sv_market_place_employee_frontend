import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  employeeName: string;
  employeeId: string;
  totalEarnings: number;
  completedBookings: number;
}

export function ActivityHeader({
  employeeName,
  employeeId,
  totalEarnings,
  completedBookings,
}: Props) {
  const { language, t, translations } = useLanguage();
  const isRTL = language === "AR";

  return (
    <div
      className={`flex items-start justify-between gap-6 ${
        isRTL ? "flex-row-reverse text-right" : "flex-row text-left"
      }`}
    >
      <div>
        <h1 className="text-gray-900 mb-2">{t("recentActivity")}</h1>

        <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Avatar className="size-10">
            <AvatarFallback className="bg-blue-600 text-white">
              {employeeName.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-gray-900">{employeeName}</p>
            <p className="text-sm text-gray-500">{employeeId}</p>
          </div>
        </div>
      </div>

      <div className={isRTL ? "text-left" : "text-right"}>
        <p className="text-sm text-gray-500 mb-1">
          {translations.recentActivities.emptyState.title}
        </p>
        <p className="text-2xl text-gray-900">${totalEarnings.toFixed(2)}</p>
        <p className="text-sm text-gray-600">
          {completedBookings} services completed
        </p>
      </div>
    </div>
  );
}
