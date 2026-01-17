import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Filter, TrendingUp } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { CommonCard } from "@/components/common/CommonCard";
import CommonTabs from "@/components/common/CommonTabs";
import type { CommonTab } from "@/components/common/CommonTabs";

type ActivityType = "all" | "booking" | "payment" | "transaction";
type TimePeriod = "7days" | "15days" | "1month" | "3months" | "6months";

interface ActivityFiltersProps {
  period: TimePeriod;
  setPeriod: (p: TimePeriod) => void;
  type: ActivityType;
  setType: (t: ActivityType) => void;
  stats: {
    bookingsCount: number;
    paymentsCount: number;
    transactionsCount: number;
  };
}

export function ActivityFilters({
  period,
  setPeriod,
  type,
  setType,
  stats,
}: ActivityFiltersProps) {
  const { language, translations } = useLanguage();
  const isRTL = language === "AR";

  const counts: Record<ActivityType, number> = {
    all: stats.bookingsCount + stats.paymentsCount + stats.transactionsCount,
    booking: stats.bookingsCount,
    payment: stats.paymentsCount,
    transaction: stats.transactionsCount,
  };

  // Prepare tabs data for CommonTabs
  const timePeriodTabs: CommonTab[] = (Object.keys(
    translations.recentActivities.periods
  ) as TimePeriod[]).map((p) => ({
    value: p,
    label: translations.recentActivities.periods[p],
    content: null, // content is not needed here; only for selection
  }));

  return (
    <CommonCard
      title={
        <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Filter className="size-5 text-gray-600" />
          <span>{translations.workHistory.filters.timePeriod}</span>
        </div>
      }
      headerAlign={isRTL ? "right" : "left"}
      contentClassName="space-y-4"
    >
      {/* Time Period Tabs */}
      <CommonTabs<TimePeriod>
        tabs={timePeriodTabs}
        activeTab={period}
        setActiveTab={setPeriod}
        isRTL={isRTL}
      />

      {/* Activity Type Buttons */}
      <div className={`flex flex-wrap gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
        <Button
          variant={type === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setType("all")}
        >
          {translations.recentActivities.types.all} ({counts.all})
        </Button>

        <Button
          variant={type === "booking" ? "default" : "outline"}
          size="sm"
          onClick={() => setType("booking")}
          className="gap-2"
        >
          <Calendar className="size-4" />
          {translations.recentActivities.types.booking} ({counts.booking})
        </Button>

        <Button
          variant={type === "payment" ? "default" : "outline"}
          size="sm"
          onClick={() => setType("payment")}
          className="gap-2"
        >
          <DollarSign className="size-4" />
          {translations.recentActivities.types.payment} ({counts.payment})
        </Button>

        <Button
          variant={type === "transaction" ? "default" : "outline"}
          size="sm"
          onClick={() => setType("transaction")}
          className="gap-2"
        >
          <TrendingUp className="size-4" />
          {translations.recentActivities.types.transaction} ({counts.transaction})
        </Button>
      </div>
    </CommonCard>
  );
}


