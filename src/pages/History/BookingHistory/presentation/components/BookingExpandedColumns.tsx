import { useState, useEffect, useMemo } from "react";
import {
  User,
  Phone,
  Briefcase,
  Layers,
  Wrench,
  Fingerprint,
  Activity,
  Calendar,
  Hourglass,
  Clock,
  Mail,
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
  const [, setLocationName] = useState<string>("—");
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
    typeof booking.service === "string"
      ? booking.service
      : booking.service?.name ?? "—";

  const serviceTierName =
    typeof booking.serviceTier === "string"
      ? booking.serviceTier
      : booking.serviceTier?.displayName ?? "—";

  return (
    <div className="bg-slate-50/50 rounded-xl p-4 sm:p-6 border border-slate-100 shadow-inner my-2 w-full overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

        {/* Customer Details */}
        {/* Customer Details */}
        <div className="space-y-4 min-w-0">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {expandedLabels.customerDetails}
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-700 min-w-0">
              <User className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-sm font-medium break-words min-w-0">
                {booking.customer.fullName}
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 min-w-0">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-sm break-words min-w-0">{booking.customer.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 min-w-0">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-sm break-all min-w-0">
                {booking.customer.email}
              </span>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="space-y-4 min-w-0 sm:border-l sm:border-slate-200/60 sm:pl-8 lg:border-x lg:px-8">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {expandedLabels.serviceDetails}
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-slate-600 text-sm min-w-0">
              <Briefcase className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-slate-400 block sm:inline sm:mr-1">
                  {expandedLabels.serviceCategory}:
                </span>
                <span className="font-medium text-slate-800 break-words">
                  {category?.name ?? "—"}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3 text-slate-600 text-sm min-w-0">
              <Wrench className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-slate-400 block sm:inline sm:mr-1">
                  {expandedLabels.serviceItem}:
                </span>
                <span className="font-medium text-slate-800 break-words">
                  {serviceName}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3 text-slate-600 text-sm min-w-0">
              <Layers className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex flex-wrap items-center gap-x-1 gap-y-1">
                <span className="text-slate-400">
                  {expandedLabels.serviceTier}:
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 max-w-full truncate">
                  {serviceTierName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Work Details */}
        <div className="space-y-4 min-w-0 sm:col-span-2 lg:col-span-1 sm:border-t sm:border-slate-200/60 sm:pt-6 lg:border-t-0 lg:pt-0">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {expandedLabels.workDetails}
          </h4>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-start gap-3 min-w-0">
              <Fingerprint className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-slate-400 block sm:inline sm:mr-1">
                  {expandedLabels.bookingCode}:
                </span>
                <span className="font-mono font-medium text-slate-800 break-all">
                  {(booking.booking as any).bookingCode ?? "—"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 min-w-0">
              <Activity className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-slate-400 block sm:inline sm:mr-1">
                  {expandedLabels.bookingType}:
                </span>
                <span className="font-medium text-slate-800 break-words">
                  {booking.booking.bookingType ?? "—"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 min-w-0">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-slate-400 block sm:inline sm:mr-1">
                  {expandedLabels.workStartDate}:
                </span>
                <span className="font-medium text-slate-800 break-words">
                  {formatSmartDate(booking.booking.startDate ?? new Date())}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 min-w-0">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-slate-400 block sm:inline sm:mr-1">
                  {expandedLabels.startDate}:
                </span>
                <span className="font-medium text-slate-800 break-words">
                  {booking.booking.schedule?.startDateTime
                    ? formatSmartDate(
                        new Date(booking.booking.schedule.startDateTime)
                      )
                    : "—"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 min-w-0">
              <Hourglass className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-slate-400 block sm:inline sm:mr-1">
                  Duration:
                </span>
                <span className="font-medium text-slate-800 break-words">
                  {formatBookingDurationText(booking.booking)}
                </span>
              </div>
            </div>

            {/* Dynamic Milestone Timestamps */}
            <div className="pt-2 mt-2 border-t border-slate-200/60 space-y-2 text-xs text-slate-500">
              {booking.assignedAt && (
                <div className="flex items-start gap-2 min-w-0">
                  <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="break-words">
                    <span className="block sm:inline">
                      {expandedLabels.workAssignedOn}
                    </span>{" "}
                    <span className="text-slate-700 font-medium">
                      {formatSmartDate(new Date(booking.assignedAt), {
                        showTime: true,
                      })}
                    </span>
                  </span>
                </div>
              )}

              {booking.startedAt && (
                <div className="flex items-start gap-2 min-w-0">
                  <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span className="break-words">
                    <span className="block sm:inline">
                      {expandedLabels.workStartedOn}
                    </span>{" "}
                    <span className="text-slate-700 font-medium">
                      {formatSmartDate(new Date(booking.startedAt), {
                        showTime: true,
                      })}
                    </span>
                  </span>
                </div>
              )}

              {booking.completedAt && (
                <div className="flex items-start gap-2 min-w-0">
                  <Clock className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="break-words">
                    <span className="block sm:inline">
                      {expandedLabels.workCompletedOn}
                    </span>{" "}
                    <span className="text-slate-700 font-medium">
                      {formatSmartDate(new Date(booking.completedAt), {
                        showTime: true,
                      })}
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