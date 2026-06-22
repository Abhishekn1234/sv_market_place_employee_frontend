export const formatDate = (
  dateInput: string | Date
): string => {
  const date = new Date(dateInput);

  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
  .replace(",", "")
  .replace(",", "");
};