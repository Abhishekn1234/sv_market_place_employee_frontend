import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { Work } from "../../domain/entities/workhistory";
import type { WorkStatsCard } from "../../domain/entities/workstats";
import { getNormalizedStatus } from "../utils/workhistory";

export function useWorkStatsCards(works: Work[]): WorkStatsCard[] {
  const { translations } = useLanguage();

  return useMemo(() => {
    const counts = works.reduce((acc, w) => {
      const status = getNormalizedStatus(w);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      {
        label: translations.workHistory.cards.totalWorks,
        value: works.length,
      },
      {
        label: translations.workHistory.cards.completed,
        value: counts.completed || 0,
        color: "text-green-600",
      },
      {
        label: translations.workHistory.cards.inProgress,
        value: counts.inProgress || 0,
        color: "text-blue-600",
      },
      {
        label: translations.workHistory.cards.assigned,
        value: counts.assigned || 0,
        color: "text-yellow-600",
      },
      {
        label: translations.workHistory.cards.workAccepted,
        value: counts.workAccepted || 0,
        color: "text-teal-600",
      },
      {
        label: translations.workHistory.cards.workCancelled,
        value: counts.workCancelled || 0,
        color: "text-red-600",
      },
      {
        label: translations.workHistory.cards.workCompletedPending,
        value: counts.workCompletedPending || 0,
        color: "text-orange-600",
      },
    ];
  }, [works, translations]);
}