import { Card } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { Calendar } from "lucide-react";

export function ActivityEmptyState() {
  const { language, translations } = useLanguage();
  const isRTL = language === "AR";

  return (
    <Card className="p-12">
      <div className={`text-center ${isRTL ? "rtl" : "ltr"}`}>
        <div className="inline-flex items-center justify-center size-16 bg-gray-100 rounded-full mb-4">
          <Calendar className="size-8 text-gray-400" />
        </div>

        <h3 className="text-gray-900 mb-2">
          {translations.recentActivities.emptyState.title}
        </h3>

        <p className="text-gray-600">
          {translations.recentActivities.emptyState.description}
        </p>
      </div>
    </Card>
  );
}

