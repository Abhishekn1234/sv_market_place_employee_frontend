import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { Work } from "../../domain/entities/workhistory";
import type { WorkStatsCard } from "../../domain/entities/workstats";

export function useWorkStatsCards(works: Work[]): WorkStatsCard[] {
  const { translations } = useLanguage();

  return useMemo(() => {
    return [
      {
        label: translations.workHistory.cards.totalWorks,
        value: works.length,
      },
      {
        label: translations.workHistory.cards.completed,
        value: works.filter((w) => w.status === "completed").length,
        color: "text-green-600",
      },
      {
        label: translations.workHistory.cards.inProgress,
        value: works.filter((w) => w.status === "in Progress").length,
        color: "text-blue-600",
      },
      {
        label: translations.workHistory.cards.upcoming,
        value: works.filter((w) => w.status === "upcoming").length,
        color: "text-purple-600",
      },
    ];
  }, [works, translations]);
}
