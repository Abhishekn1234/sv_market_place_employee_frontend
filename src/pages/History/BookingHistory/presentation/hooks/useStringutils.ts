export function useStringUtils() {
  const asString = (value: unknown): string => {
    return typeof value === "string" ? value : "";
  };

  const getNestedString = (value: unknown, key: string): string => {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      key in value
    ) {
      const record = value as Record<string, unknown>;
      return typeof record[key] === "string" ? record[key] : "";
    }
    return "";
  };

  const formatTime = (time: string): string => {
  if (!time) return "";

  // Normalize spacing
  const value = time.trim().toUpperCase();

  // Case: "4:58 PM" or "4:58:20 PM"
  const normalMatch = value.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)/);
  if (normalMatch) {
    const hour = normalMatch[1];
    const minute = normalMatch[2];
    const period = normalMatch[3];
    return `${hour}:${minute} ${period}`;
  }

  // Case: "PM 4:58" or "PM 4:58:20"
  const reverseMatch = value.match(/(AM|PM)\s*(\d{1,2}):(\d{2})/);
  if (reverseMatch) {
    const period = reverseMatch[1];
    const hour = reverseMatch[2];
    const minute = reverseMatch[3];
    return `${hour}:${minute} ${period}`;
  }


  return time;
};
const formatSmartDate = (dateInput: string | Date): string => {
  if (!dateInput) return "";

  // Ensure we have a Date object
  const inputDate = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  // Reset hours to midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const compareDate = new Date(inputDate);
  compareDate.setHours(0, 0, 0, 0);

  const diffDays =
    (compareDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  const formattedDate = inputDate.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  if (diffDays === 0) return `Today (${formattedDate})`;
  if (diffDays === 1) return `Tomorrow (${formattedDate})`;
  if (diffDays === -1) return `Yesterday (${formattedDate})`;

  return formattedDate;
};


 const formatDuration = (
    duration: number,
    pricingMode?: "HOURLY" | "PER_DAY"
  ) => {
    if (!duration) return "-";

    if (pricingMode === "PER_DAY") {
      return `${duration} / day`;
    }

   
    return `${duration} hr${duration > 1 ? "s" : ""}`;
  };

  return {
    asString,
    getNestedString,
    formatTime,
    formatSmartDate,
    formatDuration
  };
}
