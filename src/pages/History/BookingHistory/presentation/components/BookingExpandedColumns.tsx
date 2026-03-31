import { useState, useEffect, useMemo } from "react";
import {
  User,
  PhoneCall,
  MapPin,
  Layers,
  Layers2,
  Layers3Icon,
  TypeIcon,
  LucideDiameter,
  TimerIcon,
  Calendar,
  ClockIcon,
} from "lucide-react";
import { reverseGeocode } from "@/components/common/CommonMap";

import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";

import type { BookingHistory } from "../../domain/entities/bookinghistory";
import { useStringUtils } from "../hooks/useStringutils";

type Props = {
  booking: BookingHistory;
  bookingCategories: ServiceCategory[];
};

export function BookingExpandedRow({ booking, bookingCategories }: Props) {
  const { formatSmartDate } = useStringUtils();
  const [locationName, setLocationName] = useState<string>("—");
 const geoCache = new Map<string, string>();
 useEffect(() => {
  if (
    booking.booking.location &&
    typeof booking.booking.location !== "string" &&
    booking.booking.location.type === "Point" &&
    Array.isArray(booking.booking.location.coordinates)
  ) {
    const [lng, lat] = booking.booking.location.coordinates;

    const key = `${lat}-${lng}`;

    // return cached result
    if (geoCache.has(key)) {
      setLocationName(geoCache.get(key)!);
      return;
    }

    reverseGeocode(lat, lng)
      .then((name) => {
        geoCache.set(key, name);
        setLocationName(name);
      })
      .catch(() => setLocationName("—"));
  }
}, [booking.booking.location]);
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
          <span>{booking.customer.fullName}</span>
        </div>

        <div className="flex gap-2">
          <PhoneCall className="h-4 w-4" />
          <span>{booking.customer.phone}</span>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 flex-shrink-0 mt-1" />
          <span className="break-words whitespace-normal">{locationName}</span>
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
          <TypeIcon className="h-4 w-4" />
          <span>Booking Type:{booking.booking.bookingType ?? "—"}</span>
        </div>

        <div className="flex gap-2">
          <LucideDiameter className="h-4 w-4" />
          <span>Work Start Date :{formatSmartDate(booking.booking.startDate ?? new Date())}</span>
        </div>

        <div className="flex gap-2">
          <Calendar className="h-4 w-4" />
          <span>
            Start Date:{" "}
            {booking.booking.schedule?.startDateTime
              ? formatSmartDate(new Date(booking.booking.schedule.startDateTime))
              : "—"}
          </span>
        </div>

        <div className="flex gap-2">
          <TimerIcon className="h-4 w-4" />
          <span>
            {(() => {
              const mode = booking.booking?.pricingMode;
              const schedule = booking.booking?.schedule;

              if (!mode || !schedule) return "—";

              if (mode === "HOURLY" && schedule.estimatedHours != null) {
                if(schedule.estimatedHours < 1) {
                  const minutes = Math.round(schedule.estimatedHours * 60);
                  return `Duration: ${minutes} min${minutes > 1 ? "s" : ""}`;
                }if(schedule.estimatedHours > 1 && schedule.estimatedHours < 24) {
                  return `Duration: ${schedule.estimatedHours} hr${schedule.estimatedHours > 1 ? "s" : ""}`;
                }if(schedule.estimatedHours === 1){
                  return `Duration: ${schedule.estimatedHours} hr`;
                }
               
              } else if (mode === "PER_DAY" && schedule.estimatedDays != null) {
                return `Days:${schedule.estimatedDays} days`;
              }

              return "—";
            })()}
          </span>
        </div>

      
      <div className="flex flex-col gap-2">
        {booking.assignedAt && (
          <div className="flex gap-2 items-center">
            <ClockIcon className="h-4 w-4" />
            <span>
              Work Assigned On:{" "}
              {formatSmartDate(new Date(booking.assignedAt), { showTime: true })}
            </span>
          </div>
        )}

        {booking.startedAt && (
          <div className="flex gap-2 items-center">
            <ClockIcon className="h-4 w-4" />
            <span>
              Work Started On:{" "}
              {formatSmartDate(new Date(booking.startedAt), { showTime: true })}
            </span>
          </div>
        )}

        {booking.completedAt && (
          <div className="flex gap-2 items-center">
            <ClockIcon className="h-6 w-6" />
            <span>
              Work Completed On:{" "}
              {formatSmartDate(new Date(booking.completedAt), { showTime: true })}
            </span>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}