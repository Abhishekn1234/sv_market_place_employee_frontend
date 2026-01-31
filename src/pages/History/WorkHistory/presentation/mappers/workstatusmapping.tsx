import type { Work } from "../../domain/entities/workhistory";
import type { WorkStatus } from "../../domain/entities/workstatus";
import type { Booking } from "@/pages/History/BookingHistory/domain/entities/booking";

export function mapApiToWork(apiData: any[]): Work[] {
  const statusMap: Record<string, WorkStatus> = {
    ASSIGNED: "assigned",
    WORKER_ACCEPTED: "work-accepted",
    WORK_CANCELLED: "work-cancelled",
    COMPLETED: "completed",
    IN_PROGRESS: "in-progress",
  };

  return apiData.map((w) => {
    const bookingData = w.booking;

    const booking: Booking = {
      id: bookingData._id, // map API _id → Booking.id
      clientName: w.customer?.fullName || "Unknown",
      clientEmail: w.customer?.phone || "", // fallback if email not provided
      serviceType: w.service?.name || "Unknown",
      date: bookingData.date || "", 
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
      id: w._id,
      status: statusMap[w.status] || "assigned",
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
