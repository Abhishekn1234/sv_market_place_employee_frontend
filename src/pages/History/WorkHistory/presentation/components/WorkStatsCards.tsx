import { CommonCard } from "@/components/common/CommonCard";
import { useMemo } from "react";
import type { Card } from "../../domain/entities/card";
import { useTheme } from "@/context/presentation/components/ThemeContext";

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

  const { theme } = useTheme();

  return (
    <div
      className="
        grid gap-4
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        xl:grid-cols-7
      "
    >
      {displayCards.map((card, idx) => (
        <CommonCard key={idx} contentClassName="pt-4">
          <div
            className={`text-sm ${
              theme === "dark" ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {card.label}
          </div>

          <div
            className={`text-2xl font-semibold ${
              theme === "dark" ? "text-gray-100" : "text-gray-900"
            } ${card.color ?? ""}`}
          >
            {card.value}
          </div>
        </CommonCard>
      ))}
    </div>
  );
}

