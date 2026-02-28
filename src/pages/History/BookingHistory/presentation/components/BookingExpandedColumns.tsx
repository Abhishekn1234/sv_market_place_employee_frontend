import { useState, useEffect, useMemo } from "react";
import {
  User,
  PhoneCall,
  MapPin,
  Layers,
  Layers2,
  Layers3Icon,
  Clock,
  TypeIcon,
  LucideDiameter,
  TimerIcon,
  Calendar,
} from "lucide-react";
import { reverseGeocode } from "@/components/common/CommonMap";
import type { Booking } from "../../domain/entities/booking";
import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";
import { useStringUtils } from "../hooks/useStringutils";

type Props = {
  booking: Booking;
  bookingCategories: ServiceCategory[];
};

export function BookingExpandedRow({ booking, bookingCategories }: Props) {
  const { formatTime, formatSmartDate, formatDuration } = useStringUtils();

  const [locationName, setLocationName] = useState<string>("—");

  // Reverse geocode coordinates to get human-readable address
  useEffect(() => {
    if (
      booking.location &&
      typeof booking.location !== "string" &&
      booking.location.type === "Point" &&
      Array.isArray(booking.location.coordinates)
    ) {
      const [lng, lat] = booking.location.coordinates;
      reverseGeocode(lat, lng)
        .then((name) => setLocationName(name))
        .catch(() => setLocationName("—"));
    }
  }, [booking.location]);

  const category = useMemo<ServiceCategory | undefined>(() => {
    if (typeof booking.service === "object" && booking.service?.category) {
      return bookingCategories.find(
        (c) =>
          c._id ===
          (booking.service as Exclude<typeof booking.service, string>)?.category
      );
    }
    return undefined;
  }, [booking.service, bookingCategories]);

  const serviceName =
    typeof booking.service === "string" ? booking.service : booking.service?.name ?? "—";

  const serviceTierName =
    typeof booking.serviceTier === "string"
      ? booking.serviceTier
      : booking.serviceTier?.displayName ?? "—";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {/* Customer Details */}
      <div className="space-y-3">
        <div className="font-medium">Customer Details</div>

        <div className="flex gap-2">
          <User className="h-4 w-4" />
          <span>{booking.clientName}</span>
        </div>

        <div className="flex gap-2">
          <PhoneCall className="h-4 w-4" />
          <span>{booking.clientEmail}</span>
        </div>

      <div className="flex items-start gap-2">
  <MapPin className="h-4 w-4 flex-shrink-0 mt-1" />
  <span className="break-words whitespace-normal">
    {locationName}
  </span>
</div>
      </div>

      {/* Service Details */}
      <div className="space-y-3">
        <div className="font-medium">Service Details</div>

        <div className="flex gap-2">
          <Layers2 className="h-4 w-4" />
          <span>Service Category : {category?.name ?? "—"}</span>
        </div>

        <div className="flex gap-2">
          <Layers3Icon className="h-4 w-4" />
          <span>Service Item : {serviceName}</span>
        </div>

        <div className="flex gap-2">
          <Layers className="h-4 w-4" />
          <span>Service Tier : {serviceTierName}</span>
        </div>
      </div>

      {/* Work Details */}
      <div className="space-y-3">
        <div className="font-medium">Work Details</div>

        <div className="flex gap-2">
          <Clock className="h-4 w-4" />
          <span>{formatTime(booking.time)}</span>
        </div>

        <div className="flex gap-2">
          <TypeIcon className="h-4 w-4" />
          <span>{booking.bookingType ?? "—"}</span>
        </div>

        <div className="flex gap-2">
          <LucideDiameter className="h-4 w-4" />
          <span>{formatSmartDate(booking.date)}</span>
        </div>

        <div className="flex gap-2">
          <Calendar className="h-4 w-4" />
          <span>
            Start Date:{" "}
            {booking.startDate ? formatSmartDate(new Date(booking.startDate)) : "—"}
          </span>
        </div>

        <div className="flex gap-2">
          <TimerIcon className="h-4 w-4" />
          <span>
            {booking.pricingMode ? formatDuration(booking.duration, booking.pricingMode) : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
