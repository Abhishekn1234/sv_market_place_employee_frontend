import type { Work } from "../../domain/entities/workhistory";
import type { WorkStatus } from "../../domain/entities/workstatus";
import type { Booking } from "@/pages/History/BookingHistory/domain/entities/booking";

export function mapApiToWork(apiData: any[]): Work[] {
const statusMap: Record<string, WorkStatus> = {
  ASSIGNED: "assigned",
  WORKER_ACCEPTED: "workAccepted",
  WORK_CANCELLED: "workCancelled",
  COMPLETED: "completed",
  IN_PROGRESS: "inProgress",
  STARTED: "inProgress",
  WORK_COMPLETED_PENDING: "workCompletedPending",
};

  return apiData.map((w) => {
    const bookingData = w.booking;
     console.log(bookingData);
    const booking: Booking = {
      id: bookingData._id,
      clientName: w.customer?.fullName || "Unknown",
      clientEmail: w.customer?.phone || "",
      serviceType: w.service?.name || "Unknown",
      date: bookingData.date || "",
      startedAt:bookingData.startedAt,
      time: bookingData.time || "",
      duration: bookingData.duration || 1,
      status: bookingData.status,
      pricingMode: bookingData.pricingMode,
      payment: bookingData.amount || 0,
      location: bookingData.location
        ? `${bookingData.location.coordinates[1]},${bookingData.location.coordinates[0]}`
        : "",
    };
    console.log(booking);

    return {
      _id: w._id,
      status: statusMap[w.status] || "assigned", // 🔥 FIXED
      assignedAt: w.assignedAt,
      
      booking,
      service: w.service
        ? {
            _id: w.service._id,
            name: w.service.name,
          }
        : undefined,
      serviceTier: w.serviceTier
        ? {
            _id: w.serviceTier._id,
            displayName: w.serviceTier.displayName,
          }
        : undefined,
      customer: w.customer
        ? {
            _id: w.customer._id,
            fullName: w.customer.fullName,
            phone: w.customer.phone,
          }
        : undefined,
    };
  });
}
