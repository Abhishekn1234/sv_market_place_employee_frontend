// BookingExpandedRow.tsx
import { useState, useEffect, useMemo } from "react";
import { reverseGeocode } from "@/components/common/CommonMap";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { useStringUtils } from "../../hooks/useStringutils";
import type { ServiceCategory } from "@/pages/Servicesettings/domain/entities/servicecategory";
import type { BookingHistory } from "../../../domain/entities/bookinghistory";
import type { Booking } from "@/pages/Booking/AvailableBooking/domain/entities/booking";
import { BookingExpandedColumnsCustomerDetails } from "./BookingExpandedColumnsCustomerDetails";
import { BookingExpandedColumnsServiceDetails } from "./BookingExpandingColumnsServiceDetails";
import { BookingExpandedColumnsWorkDetails } from "./BookingExpandedColumnsWorkerDetails";
import { BookingExpandedColumnsPaymentDetails } from "./BookingExpandedColumnsPaymentDetails";


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

  const bookingData = booking.booking as Booking;
  
  // Extract payment data
  const paymentData = {
    status: bookingData?.status || "—",
    currency: bookingData?.currency || "—",
    amount: bookingData?.amount ?? 0,
    serviceFee: bookingData?.serviceFee ?? 0,
    discountAmount: bookingData?.discountAmount ?? 0,
    vatRate: bookingData?.vatRate ?? 0,
    totalCost: bookingData?.totalCost ?? 0,
    finalAmount: bookingData?.finalAmount ?? 0,
    finalWorkerPoolAmount: bookingData?.finalWorkerPoolAmount ?? 0,
    estimatedTaxableAmount: bookingData?.estimatedValues?.taxableAmount ?? 0,
    actualTaxableAmount: bookingData?.actualValues?.taxableAmount ?? 0,
    estimatedVatAmount: bookingData?.estimatedValues?.vatAmount ?? 0,
    actualVatAmount: bookingData?.actualValues?.vatAmount ?? 0,
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-lg my-2 w-full overflow-hidden transition-all duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        <BookingExpandedColumnsCustomerDetails
          customer={booking.customer}
          title={expandedLabels.customerDetails}
        />

        <BookingExpandedColumnsServiceDetails
          service={booking.service}
          serviceTier={booking.serviceTier}
          category={category}
          title={expandedLabels.serviceDetails}
          labels={{
            serviceCategory: expandedLabels.serviceCategory,
            serviceItem: expandedLabels.serviceItem,
            serviceTier: expandedLabels.serviceTier,
          }}
        />

        <BookingExpandedColumnsWorkDetails 
          bookingData={bookingData}
          booking={booking}
          formatSmartDate={formatSmartDate}
          title={expandedLabels.workDetails}
          durationLabel={translations.workHistory.tableHeaders.duration}
          labels={{
            bookingCode: expandedLabels.bookingCode,
            bookingType: expandedLabels.bookingType,
            workStartDate: expandedLabels.workStartDate,
            startDate: expandedLabels.startDate,
            workAssignedOn: expandedLabels.workAssignedOn,
            workStartedOn: expandedLabels.workStartedOn,
            workCompletedOn: expandedLabels.workCompletedOn,
          }}
        />

        <BookingExpandedColumnsPaymentDetails 
          bookingData={bookingData}
          {...paymentData}
          title={expandedLabels.paymentDetails}
          labels={{
            bookingStatus: expandedLabels.bookingStatus,
            pricingMode: expandedLabels.pricingMode,
            numberOfWorkers: expandedLabels.numberOfWorkers,
            amount: expandedLabels.amount,
            serviceFee: expandedLabels.serviceFee,
            discount: expandedLabels.discount,
            taxableAmount: expandedLabels.taxableAmount,
            vatRate: expandedLabels.vatRate,
            vatAmount: expandedLabels.vatAmount,
            estimatedTotal: expandedLabels.estimatedTotal,
            finalAmount: expandedLabels.finalAmount,
            workerPoolAmount: expandedLabels.workerPoolAmount,
          }}
        />
      </div>
    </div>
  );
}