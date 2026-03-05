"use client";

import { useState, useMemo, useEffect } from "react";
import { CommonTable } from "@/components/common/CommonTable";
import { CommonCard } from "@/components/common/CommonCard";
import { toast } from "react-toastify";

import { useLanguage } from "@/context/LanguageContext";
import { useStatusConfig } from "./hooks/statusconfig";
import { useBookingColumns } from "./hooks/useColumns";
import { useGetBookingAvailable } from "./hooks/useGetAvailbaleBooking";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";

import { BookingFilters } from "./components/BookingFilters";
import { BookingExpandedRow } from "./components/BookingExpandedColumns";

import type { Booking } from "../domain/entities/booking";
import type { BookingStatus } from "../domain/entities/bookingstatus";

export default function BookingHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<BookingStatus | "all">("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { language, translations } = useLanguage();
  const isRTL = language === "AR";

  const statusConfig = useStatusConfig();
  const { data } = useGetBookingAvailable(page);
  const { data: categories = [] } = useServiceCategory();

  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (data?.data) {
      setBookings(data.data);
    }
  }, [data]);

  const pagination = data?.pagination;

  const normalize = (value?: string) =>
    value?.toLowerCase().replace(/\s|-/g, "");

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        b.clientName?.toLowerCase().includes(search) ||
        b.id?.toLowerCase().includes(search) ||
        b.serviceType?.toLowerCase().includes(search) ||
        (typeof b.service === "object" &&
          b.service?.name?.toLowerCase().includes(search));

      const matchesStatus =
        statusFilter === "all" ||
        normalize(b.status) === normalize(statusFilter);

      const matchesService =
        serviceFilter === "all" ||
        (typeof b.service === "object" &&
          b.service?.category === serviceFilter);

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [bookings, searchTerm, statusFilter, serviceFilter]);

  const toggleExpanded = (id: string) => {
    setExpandedBooking((prev) => (prev === id ? null : id));
  };

  const handleIgnore = (bookingId: string) => {
    try {
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      toast.success("Booking ignored successfully");
    } catch {
      toast.error("Failed to ignore booking");
    }
  };

  const columns = useBookingColumns({
    expandedBooking,
    toggleExpanded,
    onIgnore: handleIgnore,
  });

  // if (isLoading) {
  //   return (
  //     <div className="p-6 text-center text-sm sm:text-base">
  //       Loading booking history…
  //     </div>
  //   );
  // }

  // if (isError) {
  //   return (
  //     <div className="p-6 text-center text-sm sm:text-base text-red-500">
  //       Failed to load booking history
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-14">
      {/* HEADER */}
      <div
        className={`
          mb-5 sm:mb-6 space-y-1
          ${isRTL ? "text-right" : "text-left"}
        `}
      >
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">
          {translations.bookingHistory.title}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {translations.bookingHistory.subtitle}
        </p>
      </div>

      {/* FILTER CARD */}
      <CommonCard
        className="mb-4 sm:mb-6"
        title={
          <div
            className={`
              text-sm sm:text-base font-medium
              ${isRTL ? "text-right" : "text-left"}
            `}
          >
            {translations.bookingHistory.filters}
          </div>
        }
      >
        <div className={isRTL ? "text-right" : "text-left"}>
          <BookingFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            serviceFilter={serviceFilter}
            onServiceChange={setServiceFilter}
            services={categories}
            statusConfig={statusConfig}
          />
        </div>
      </CommonCard>

      {/* TABLE (no extra overflow wrapper needed) */}
      <CommonTable<Booking>
        columns={columns}
        data={filteredBookings}
        keyExtractor={(b) => b.id}
        currentPage={pagination?.currentPage}
        totalPages={pagination?.totalPages}
        onPageChange={setPage}
        isRTL={isRTL}
        expandedRowKey={expandedBooking}
        renderExpandedRow={(b) => (
          <BookingExpandedRow
            booking={b}
            bookingCategories={categories}
          />
        )}
      />
    </div>
  );
}
