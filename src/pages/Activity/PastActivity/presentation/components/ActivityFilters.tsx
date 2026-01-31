import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Filter, TrendingUp } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { CommonCard } from "@/components/common/CommonCard";
import CommonTabs from "@/components/common/CommonTabs";
import type { CommonTab } from "@/components/common/CommonTabs";
import { useTheme } from "@/context/ThemeContext";

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
  const { theme } = useTheme();

  const pa = translations.pastActivities;

  const counts: Record<ActivityType, number> = {
    all: stats.bookingsCount + stats.paymentsCount + stats.transactionsCount,
    booking: stats.bookingsCount,
    payment: stats.paymentsCount,
    transaction: stats.transactionsCount,
  };

  const timePeriodTabs: CommonTab[] = (
    Object.keys(pa.periods) as TimePeriod[]
  ).map((p) => ({
    value: p,
    label: pa.periods[p],
    content: null,
  }));

  return (
    <CommonCard
      title={
        <div
          className={`flex items-center gap-2 text-sm md:text-base ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <Filter
            className={`size-4 md:size-5 ${
              theme === "dark" ? "text-gray-100" : "text-gray-600"
            }`}
          />
          <span>{pa.filters.timePeriod}</span>
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

      {/* Type Filters */}
      <div
        className={`
          flex flex-wrap gap-2
          ${isRTL ? "flex-row-reverse" : ""}
        `}
      >
        <Button
          variant={type === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setType("all")}
          className="text-xs md:text-sm"
        >
          {pa.types.all} ({counts.all})
        </Button>

        <Button
          variant={type === "booking" ? "default" : "outline"}
          size="sm"
          onClick={() => setType("booking")}
          className="gap-1 md:gap-2 text-xs md:text-sm"
        >
          <Calendar className="size-3 md:size-4 hidden sm:inline" />
          {pa.types.booking} ({counts.booking})
        </Button>

        <Button
          variant={type === "payment" ? "default" : "outline"}
          size="sm"
          onClick={() => setType("payment")}
          className="gap-1 md:gap-2 text-xs md:text-sm"
        >
          <DollarSign className="size-3 md:size-4 hidden sm:inline" />
          {pa.types.payment} ({counts.payment})
        </Button>

        <Button
          variant={type === "transaction" ? "default" : "outline"}
          size="sm"
          onClick={() => setType("transaction")}
          className="gap-1 md:gap-2 text-xs md:text-sm"
        >
          <TrendingUp className="size-3 md:size-4 hidden sm:inline" />
          {pa.types.transaction} ({counts.transaction})
        </Button>
      </div>
    </CommonCard>
  );
}
