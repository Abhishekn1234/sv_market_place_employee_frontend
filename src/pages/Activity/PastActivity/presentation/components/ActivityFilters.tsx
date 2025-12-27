import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Filter, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

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
    all:
      stats.bookingsCount +
      stats.paymentsCount +
      stats.transactionsCount,
    booking: stats.bookingsCount,
    payment: stats.paymentsCount,
    transaction: stats.transactionsCount,
  };

  return (
    <Card className="p-6 space-y-4">
      {/* Header */}
      <div
        className={`flex items-center gap-2 ${
          isRTL ? "flex-row-reverse text-right" : "text-left"
        }`}
      >
        <Filter className="size-5 text-gray-600" />
        <h2 className="text-gray-900">
          {translations.workHistory.filters.timePeriod}
        </h2>
      </div>

      {/* Time Period Tabs */}
      <Tabs value={period} onValueChange={(v) => setPeriod(v as TimePeriod)}>
        <TabsList
          className={`grid grid-cols-3 md:grid-cols-5 w-full ${
            isRTL ? "[direction:rtl]" : "[direction:ltr]"
          }`}
        >
          {(Object.keys(translations.recentActivities.periods) as TimePeriod[])
            .map((p) => (
              <TabsTrigger key={p} value={p}>
                {translations.recentActivities.periods[p]}
              </TabsTrigger>
            ))}
        </TabsList>
      </Tabs>

      {/* Activity Type Buttons */}
      <div
        className={`flex flex-wrap gap-2 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
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
    </Card>
  );
}
