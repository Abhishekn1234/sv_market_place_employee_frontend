import { CommonCard } from "@/components/common/CommonCard";
import { useMemo } from "react";

interface Card {
  label: string;
  value: number;
  color?: string;
}

interface Card {
  label: string;
  value: number;
  color?: string;
}

export function WorkStatsCards({
  cards,
  isRTL,
}: {
  cards: Card[];
  isRTL: boolean;
}) {
  const displayCards = useMemo(
    () => (isRTL ? [...cards].reverse() : cards),
    [cards, isRTL]
  );

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-6">
      {displayCards.map((card, idx) => (
        <CommonCard
          key={idx}
          className="mb-0"
          contentClassName="pt-4"
        >
          <div className="text-sm text-gray-500 mb-1">
            {card.label}
          </div>

          <div
            className={`text-2xl font-semibold text-gray-900 ${
              card.color ?? ""
            }`}
          >
            {card.value}
          </div>
        </CommonCard>
      ))}
    </div>
  );
}

