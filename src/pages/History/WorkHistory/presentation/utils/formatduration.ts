 export const formatDuration = (
  hours: number,
  pricingMode?: "hourly" | "per_day"
) => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);

  if (pricingMode === "hourly") {
    return `${h > 0 ? h + " hr" : ""}${h > 0 && m > 0 ? " " : ""}${m > 0 ? m + " min" : ""}` || "0 hr";
  }

  if (pricingMode === "per_day") {
    return `${h || 1} hr/day`;
  }

  return "";
};

export const pricingModeMap: Record<string, "hourly" | "per_day"> = {
  HOURLY: "hourly",
  PER_DAY: "per_day",
};