import { useEffect } from "react";
import { useAssign } from "@/pages/Booking/AvaliableWorks/presentation/hooks/useAssign";
import { useBookingSocketStore } from "@/core/store/useBookingSocketStore";
import { normalizeBooking } from "./normalizeBooking";

export function useHydrateBookings() {
  const { assignedWorks: data } = useAssign(true);

  const upsertAssigned = useBookingSocketStore(
    (s) => s.upsertAssigned
  );

  useEffect(() => {
    if (!data) return;

    const normalized = data
      .map(normalizeBooking)
      .filter(Boolean);

    normalized.forEach((booking) => {
      if (!booking?._id) return;

      upsertAssigned({
        ...booking,
        source: "api",
      });
    });
  }, [data?.length, upsertAssigned]);
}