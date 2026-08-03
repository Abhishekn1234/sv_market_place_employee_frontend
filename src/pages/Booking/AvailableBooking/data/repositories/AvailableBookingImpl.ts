import api from "@/api/api";
import type { AvailableBookingRepo } from "../../domain/repositories/AvailableBookingRepo";
import type { Booking, BookingResponse } from "../../domain/entities/booking";
import { mapBookingStatus } from "../../presentation/utils/mapstatus";

export class AvailableBookingImpl implements AvailableBookingRepo {
  async getBookingAvailable(page: number): Promise<BookingResponse> {
    const res = await api.get("/booking/available", {
      params: {
        page,
        limit: 10, 
      },
    });
  //  console.log(res.data);
    return {
      data: res.data.data.map((item: any): Booking => {
        const createdAt = new Date(item.createdAt);

       return {
        id: item._id,
  _id: item._id,
  clientName: item.customer?.fullName ?? "-",
  clientEmail: item.customer?.phone ?? "-",
  clientPhone: item.customer?.phone,
  clientPhoto: item.customer?.profilePictureUrl,
  serviceType: item.service?.name ?? "-",
  serviceTier: item.serviceTier?.displayName,
  startDate: item.schedule?.startDateTime,
 
  service: item.service
    ? {
        _id: item.service._id,
        name: item.service.name,
        category: item.service.category,
      }
    : undefined,

  date: createdAt.toLocaleDateString("en-US"),
  time: createdAt.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }),

  bookingType: item.bookingType,
  pricingMode: item.pricingMode,

  duration:
    item.pricingMode === "HOURLY"
      ? item.schedule?.estimatedHours ?? 0
      : item.schedule?.estimatedDays ?? 0,

  payment: item.amount ?? 0,
  currency: item.currency,
  status: mapBookingStatus(item.status),
  location: item.location,
};
      }),
      pagination: res.data.pagination,
    };
  }
 
}

