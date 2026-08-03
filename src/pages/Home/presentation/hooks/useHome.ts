import type { RevenueFilter } from "../../domain/entities/revenuetype";

    
export const getRevenueFilters = (translations: any) => [
  {
    label: translations.HomePage.stats.filters.today,
    value: "today",
  },
  {
    label: translations.HomePage.stats.filters["7_days"],
    value: "7_days",
  },
  {
    label: translations.HomePage.stats.filters["30_days"],
    value: "30_days",
  },
  {
    label: translations.HomePage.stats.filters["3_months"],
    value: "3_months",
  },
  {
    label: translations.HomePage.stats.filters.all,
    value: "all",
  },
] satisfies { label: string; value: RevenueFilter }[];