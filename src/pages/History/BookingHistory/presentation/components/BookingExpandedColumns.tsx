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
  CreditCard,
  Receipt,
  Percent,
  DollarSign,
  Users,
  Hash,
  Tag,
} from "lucide-react";
import { reverseGeocode } from "@/components/common/CommonMap";
import { useLanguage } from "@/context/presentation/components/LanguageContext";

import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";
import type { BookingHistory } from "../../domain/entities/bookinghistory";
import { useStringUtils } from "../hooks/useStringutils";
import { formatBookingDurationText } from "../utils/formatduration";
import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";

type Props = {
  booking: BookingHistory;
  bookingCategories: ServiceCategory[];
};

const geoCache = new Map<string, string>();

type DetailRowProps = {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
};

function DetailRow({ label, value, icon }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
      {icon && <div className="shrink-0 mt-0.5">{icon}</div>}
      <div className="flex-1 min-w-0">
        <span className="text-xs text-slate-400 block">{label}</span>
        <span className="text-sm font-medium text-slate-800 break-words block">
          {value ?? "—"}
        </span>
      </div>
    </div>
  );
}

export function BookingExpandedRow({ booking, bookingCategories }: Props) {
  const { formatSmartDate } = useStringUtils();
  const [, setLocationName] = useState<string>("—");
  const { translations } = useLanguage();
  const expandedLabels = translations.bookingHistory.expandedRow;
  
  console.log(booking);

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

  // Safely access booking properties with fallbacks
  const bookingData = booking.booking as Booking;
  const status = bookingData?.status || "—";
  const currency = bookingData?.currency || "—";
  const amount = bookingData?.amount ?? 0;
  const serviceFee = bookingData?.serviceFee ?? 0;
  const discountAmount = bookingData?.discountAmount ?? 0;
  const vatRate = bookingData?.vatRate ?? 0;
  const totalCost = bookingData?.totalCost ?? 0;
  const finalAmount = bookingData?.finalAmount ?? 0;
  const finalWorkerPoolAmount = bookingData?.finalWorkerPoolAmount ?? 0;
  const estimatedTaxableAmount = bookingData?.estimatedValues?.taxableAmount ?? 0;
  const actualTaxableAmount = bookingData?.actualValues?.taxableAmount ?? 0;
  const estimatedVatAmount = bookingData?.estimatedValues?.vatAmount ?? 0;
  const actualVatAmount = bookingData?.actualValues?.vatAmount ?? 0;

  // Determine status color
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'COMPLETED': 'bg-green-100 text-green-700',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-700',
      'WORKER_CANCELLED': 'bg-red-100 text-red-700',
      'CUSTOMER_CANCELLED': 'bg-red-100 text-red-700',
    };
    return statusMap[status] || 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-lg my-2 w-full overflow-hidden transition-all duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">

        {/* Customer Details */}
        <div className="space-y-4 min-w-0 bg-white/50 p-4 rounded-lg border border-slate-100">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <User className="h-4 w-4" />
            {expandedLabels.customerDetails}
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-700">
              <User className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-sm font-medium break-words">
                {booking.customer.fullName}
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-sm break-words">{booking.customer.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-sm break-all">{booking.customer.email}</span>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="space-y-4 min-w-0 bg-white/50 p-4 rounded-lg border border-slate-100">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            {expandedLabels.serviceDetails}
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-slate-600 text-sm">
              <Tag className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-slate-400 block text-xs">
                  {expandedLabels.serviceCategory}
                </span>
                <span className="font-medium text-slate-800 break-words">
                  {category?.name ?? "—"}
                </span>
              </div>
            </div>
            
            <div className="flex items-start gap-3 text-slate-600 text-sm">
              <Wrench className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-slate-400 block text-xs">
                  {expandedLabels.serviceItem}
                </span>
                <span className="font-medium text-slate-800 break-words">
                  {serviceName}
                </span>
              </div>
            </div>
            
            <div className="flex items-start gap-3 text-slate-600 text-sm">
              <Layers className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-slate-400 block text-xs">
                  {expandedLabels.serviceTier}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  {serviceTierName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Work Details */}
        <div className="space-y-4 min-w-0 bg-white/50 p-4 rounded-lg border border-slate-100 lg:col-span-1">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {expandedLabels.workDetails}
          </h4>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <Fingerprint className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-slate-400 block text-xs">
                  {expandedLabels.bookingCode}
                </span>
                <span className="font-mono font-medium text-slate-800 break-all">
                  {bookingData?.bookingCode ?? "—"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Activity className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-slate-400 block text-xs">
                  {expandedLabels.bookingType}
                </span>
                <span className="font-medium text-slate-800 break-words">
                  {bookingData?.bookingType ?? "—"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-slate-400 block text-xs">
                  {expandedLabels.workStartDate}
                </span>
                <span className="font-medium text-slate-800 break-words">
                  {formatSmartDate(bookingData?.startDate ?? new Date())}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-slate-400 block text-xs">
                  {expandedLabels.startDate}
                </span>
                <span className="font-medium text-slate-800 break-words">
                  {bookingData?.schedule?.startDateTime
                    ? formatSmartDate(
                        new Date(bookingData.schedule.startDateTime)
                      )
                    : "—"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Hourglass className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-slate-400 block text-xs">
                  {translations.workHistory.tableHeaders.duration}
                </span>
                <span className="font-medium text-slate-800 break-words">
                  {formatBookingDurationText(bookingData)}
                </span>
              </div>
            </div>

            {/* Dynamic Milestone Timestamps */}
            <div className="pt-3 mt-3 border-t border-slate-200 space-y-2 text-xs">
              {booking.assignedAt && (
                <div className="flex items-start gap-2">
                  <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block">
                      {expandedLabels.workAssignedOn}
                    </span>
                    <span className="text-slate-700 font-medium">
                      {formatSmartDate(new Date(booking.assignedAt), {
                        showTime: true,
                      })}
                    </span>
                  </div>
                </div>
              )}

              {booking.startedAt && (
                <div className="flex items-start gap-2">
                  <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block">
                      {expandedLabels.workStartedOn}
                    </span>
                    <span className="text-slate-700 font-medium">
                      {formatSmartDate(new Date(booking.startedAt), {
                        showTime: true,
                      })}
                    </span>
                  </div>
                </div>
              )}

              {booking.completedAt && (
                <div className="flex items-start gap-2">
                  <Clock className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block">
                      {expandedLabels.workCompletedOn}
                    </span>
                    <span className="text-slate-700 font-medium">
                      {formatSmartDate(new Date(booking.completedAt), {
                        showTime: true,
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Details - Full width on all screens */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-4 min-w-0 bg-white/50 p-4 rounded-lg border border-slate-100">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            {expandedLabels.paymentDetails}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <DetailRow
                label={expandedLabels.bookingStatus}
                value={
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    {status}
                  </span>
                }
                icon={<Hash className="h-4 w-4 text-slate-400" />}
              />
              <DetailRow
                label={expandedLabels.pricingMode}
                value={bookingData?.pricingMode ?? "—"}
                icon={<Tag className="h-4 w-4 text-slate-400" />}
              />
              <DetailRow
                label={expandedLabels.numberOfWorkers}
                value={bookingData?.numberOfWorkers ?? "—"}
                icon={<Users className="h-4 w-4 text-slate-400" />}
              />
            </div>

            <div className="space-y-1">
              <DetailRow
                label={expandedLabels.amount}
                value={
                  <span className="font-semibold text-slate-900">
                    {currency} {amount}
                  </span>
                }
                icon={<DollarSign className="h-4 w-4 text-slate-400" />}
              />
              <DetailRow
                label={expandedLabels.serviceFee}
                value={`${currency} ${serviceFee}`}
                icon={<Receipt className="h-4 w-4 text-slate-400" />}
              />
              <DetailRow
                label={expandedLabels.discount}
                value={`${currency} ${discountAmount}`}
                icon={<Percent className="h-4 w-4 text-slate-400" />}
              />
            </div>

            <div className="space-y-1">
              <DetailRow
                label={expandedLabels.taxableAmount}
                value={
                  <div className="space-y-0.5">
                    <div className="text-xs text-slate-500">Est: {currency} {estimatedTaxableAmount}</div>
                    <div className="text-xs text-slate-500">Actual: {currency} {actualTaxableAmount}</div>
                  </div>
                }
                icon={<Receipt className="h-4 w-4 text-slate-400" />}
              />
              <DetailRow
                label={expandedLabels.vatRate}
                value={`${vatRate}%`}
                icon={<Percent className="h-4 w-4 text-slate-400" />}
              />
              <DetailRow
                label={expandedLabels.vatAmount}
                value={
                  <div className="space-y-0.5">
                    <div className="text-xs text-slate-500">Est: {currency} {estimatedVatAmount}</div>
                    <div className="text-xs text-slate-500">Actual: {currency} {actualVatAmount}</div>
                  </div>
                }
                icon={<DollarSign className="h-4 w-4 text-slate-400" />}
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
              <DetailRow
                label={expandedLabels.estimatedTotal}
                value={
                  <span className="font-semibold text-slate-900">
                    {currency} {totalCost}
                  </span>
                }
                icon={<CreditCard className="h-4 w-4 text-slate-400" />}
              />
              <DetailRow
                label={expandedLabels.finalAmount}
                value={
                  <span className="font-bold text-emerald-600">
                    {currency} {finalAmount}
                  </span>
                }
                icon={<DollarSign className="h-4 w-4 text-emerald-500" />}
              />
              <DetailRow
                label={expandedLabels.workerPoolAmount}
                value={`${currency} ${finalWorkerPoolAmount}`}
                icon={<Users className="h-4 w-4 text-slate-400" />}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}