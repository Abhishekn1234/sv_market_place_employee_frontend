import type { Work } from "@/pages/Booking/AvailableWorks/domain/entities/work";

import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import type { BookingStatus } from "@/pages/Booking/AvailableBooking/domain/entities/bookingstatus";

export function mapApiToWork(apiData: any[]): Work[] {
const statusMap: Record<string, BookingStatus> = {
  ASSIGNED: "ACCEPTED",                  // or "pending"? choose logically
  WORKER_ACCEPTED: "WORKER_ACCEPTED",
  WORK_CANCELLED: "WORKER_CANCELLED",
  COMPLETED: "COMPLETED",
  IN_PROGRESS: "IN_PROGRESS",
  STARTED: "IN_PROGRESS",
  WORK_COMPLETED_PENDING: "WORK_COMPLETED_PENDING",
};


  return apiData.map((w) => {
    const bookingData = w.booking;
    //  console.log(bookingData);
    const booking: Booking = {
      _id: bookingData._id,
      id: bookingData._id,
      clientName: w.customer?.fullName || "Unknown",
      clientEmail: w.customer?.phone || "",
      serviceType: w.service?.name || "Unknown",
      date: bookingData.date || "",
      startedAt: bookingData.startedAt,
      time: bookingData.time || "",
      duration:
        bookingData.pricingMode === "HOURLY"
          ? bookingData.schedule?.estimatedHours ?? 1
          : bookingData.schedule?.estimatedDays ?? 1,
      workerPoolAmount: bookingData.workerPoolAmount,
      numberOfWorkers: bookingData.numberOfWorkers,
      status: bookingData.status,
      pricingMode: bookingData.pricingMode,
      payment: bookingData.amount || 0,
      location: bookingData.location
        ? `${bookingData.location.coordinates[1]},${bookingData.location.coordinates[0]}`
        : "",
    };
    // console.log(booking);

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
