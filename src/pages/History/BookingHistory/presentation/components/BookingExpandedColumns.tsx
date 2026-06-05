import { useState, useEffect, useMemo } from "react";
import {
  User,
  Phone,
  MapPin,
  Briefcase,
  Layers,
  Wrench,
  Fingerprint,
  Activity,
  Calendar,
  Hourglass,
  Clock,
} from "lucide-react";
import { reverseGeocode } from "@/components/common/CommonMap";
import { useLanguage } from "@/context/LanguageContext";

import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";
import type { BookingHistory } from "../../domain/entities/bookinghistory";
import { useStringUtils } from "../hooks/useStringutils";
import { formatBookingDurationText } from "../utils/formatduration";

type Props = {
  booking: BookingHistory;
  bookingCategories: ServiceCategory[];
};

const geoCache = new Map<string, string>();

export function BookingExpandedRow({ booking, bookingCategories }: Props) {
  const { formatSmartDate } = useStringUtils();
  const [locationName, setLocationName] = useState<string>("—");
  const { translations } = useLanguage();
  const expandedLabels = translations.bookingHistory.expandedRow;

  useEffect(() => {
    if (
      booking.booking.location &&
      typeof booking.booking.location !== "string" &&
      booking.booking.location.type === "Point" &&
      Array.isArray(booking.booking.location.coordinates)
    ) {
      const [lng, lat] = booking.booking.location.coordinates;
      const key = `${lat}-${lng}`;

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
    <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100 shadow-inner my-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Customer Details */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {expandedLabels.customerDetails}
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-700">
              <User className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-sm font-medium">{booking.customer.fullName}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-sm">{booking.customer.phone}</span>
            </div>
            <div className="flex items-start gap-3 text-slate-600">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <span className="text-sm break-words leading-relaxed">{locationName}</span>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="space-y-4 md:border-x md:border-slate-200/60 md:px-8">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {expandedLabels.serviceDetails}
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-600 text-sm">
              <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-400 mr-1">{expandedLabels.serviceCategory}:</span>
                <span className="font-medium text-slate-800">{category?.name ?? "—"}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-600 text-sm">
              <Wrench className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-400 mr-1">{expandedLabels.serviceItem}:</span>
                <span className="font-medium text-slate-800">{serviceName}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-600 text-sm">
              <Layers className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-400 mr-1">{expandedLabels.serviceTier}:</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  {serviceTierName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Work Details */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {expandedLabels.workDetails}
          </h4>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-3">
              <Fingerprint className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-400 mr-1">{expandedLabels.bookingCode}:</span>
                <span className="font-mono font-medium text-slate-800">
                  {(booking.booking as any).bookingCode ?? "—"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-400 mr-1">{expandedLabels.bookingType}:</span>
                <span className="font-medium text-slate-800">{booking.booking.bookingType ?? "—"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-400 mr-1">{expandedLabels.workStartDate}:</span>
                <span className="font-medium text-slate-800">
                  {formatSmartDate(booking.booking.startDate ?? new Date())}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-400 mr-1">{expandedLabels.startDate}:</span>
                <span className="font-medium text-slate-800">
                  {booking.booking.schedule?.startDateTime
                    ? formatSmartDate(new Date(booking.booking.schedule.startDateTime))
                    : "—"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Hourglass className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-400 mr-1">Duration:</span>
                <span className="font-medium text-slate-800">{formatBookingDurationText(booking.booking)}</span>
              </div>
            </div>

            {/* Dynamic Milestone Timestamps */}
            <div className="pt-2 mt-2 border-t border-slate-200/60 space-y-2 text-xs text-slate-500">
              {booking.assignedAt && (
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    {expandedLabels.workAssignedOn}{" "}
                    <span className="text-slate-700 font-medium">
                      {formatSmartDate(new Date(booking.assignedAt), { showTime: true })}
                    </span>
                  </span>
                </div>
              )}

              {booking.startedAt && (
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                  <span>
                    {expandedLabels.workStartedOn}{" "}
                    <span className="text-slate-700 font-medium">
                      {formatSmartDate(new Date(booking.startedAt), { showTime: true })}
                    </span>
                  </span>
                </div>
              )}

              {booking.completedAt && (
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-emerald-500" />
                  <span>
                    {expandedLabels.workCompletedOn}{" "}
                    <span className="text-slate-700 font-medium">
                      {formatSmartDate(new Date(booking.completedAt), { showTime: true })}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}