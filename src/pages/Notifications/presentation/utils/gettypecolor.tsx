import type { Notification } from "../../domain/entities/notification";

export const getTypeColor = (
  type: Notification["type"],
  theme: string = ""
) => {
  if (theme === "dark") {
    switch (type) {
      case "BOOKING_REQUEST":
        return "bg-indigo-900/40 text-indigo-300 border-indigo-800";

      case "BOOKING_UPDATE":
        return "bg-emerald-900/40 text-emerald-400 border-emerald-800";

      default:
        return "bg-blue-900/40 text-blue-400 border-blue-800";
    }
  }

  switch (type) {
    case "BOOKING_REQUEST":
      return "bg-indigo-100 text-indigo-600 border-indigo-200";

    case "BOOKING_UPDATE":
      return "bg-emerald-100 text-emerald-600 border-emerald-200";

    default:
      return "bg-blue-100 text-blue-600 border-blue-200";
  }
};