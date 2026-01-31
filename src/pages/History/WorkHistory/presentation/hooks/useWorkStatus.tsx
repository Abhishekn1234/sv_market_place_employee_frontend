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
        value: works.filter((w) => w.status === "in-progress" || w.status === "in Progress").length,
        color: "text-blue-600",
      },
      {
        label: translations.workHistory.cards.upcoming,
        value: works.filter((w) => w.status === "upcoming").length,
        color: "text-purple-600",
      },
      {
        label: translations.workHistory.cards.assigned,
        value: works.filter((w) => w.status === "assigned").length,
        color: "text-yellow-600",
      },
      {
        label: translations.workHistory.cards.workAccepted,
        value: works.filter((w) => w.status === "work-accepted").length,
        color: "text-teal-600",
      },
      {
        label: translations.workHistory.cards.workCancelled,
        value: works.filter((w) => w.status === "work-cancelled").length,
        color: "text-red-600",
      },
    ];
  }, [works, translations]);
}
