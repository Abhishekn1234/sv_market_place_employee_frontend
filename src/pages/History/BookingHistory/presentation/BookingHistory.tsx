"use client";

import { useState, useMemo, useEffect } from "react";
import { CommonTable } from "@/components/common/CommonTable";
import { CommonCard } from "@/components/common/CommonCard";
import { toast } from "react-toastify";

import { useLanguage } from "@/context/LanguageContext";
import { useStatusConfig } from "./hooks/statusconfig";
import { useBookingColumns } from "./hooks/useColumns";
import { useGetBookingHistory } from "./hooks/useGetBookingHistory"; 
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";

import { BookingFilters } from "./components/BookingFilters";
import { BookingExpandedRow } from "./components/BookingExpandedColumns";

import type { BookingStatus } from "@/pages/Booking/AvailableBooking/domain/entities/bookingstatus";
import type { BookingHistory } from "../domain/entities/bookinghistory";
import { useDebounce } from "@/utils/usedebouncer";
import DisputeModal from "./components/DisputesModal";

export default function BookingHistory() {
  const { language, translations } = useLanguage();
  const isRTL = language === "AR";
  const statusConfig = useStatusConfig();
  const { data: categories = [] } = useServiceCategory();


  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedStatusFilter = useDebounce(statusFilter, 300);
  const debouncedServiceFilter = useDebounce(serviceFilter, 300);
  const debouncedPage = useDebounce(page, 300);
  const debouncedLimit = useDebounce(limit, 300);


  const { data, isError } = useGetBookingHistory({
    page: debouncedPage,
    limit: debouncedLimit,
    search: debouncedSearchTerm,
  });

  const [bookings, setBookings] = useState<BookingHistory[]>([]);

  useEffect(() => {
    if (data?.data) setBookings(data.data);
  }, [data]);

  const pagination = data?.pagination;

  const normalize = (value?: string) => value?.toLowerCase().replace(/\s|-/g, "");

  const [openDisputeModal, setOpenDisputeModal] = useState(false);
const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

const handleOpenDisputes = (bookingId: string) => {
  setSelectedBookingId(bookingId);
  setOpenDisputeModal(true);
};
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const search = debouncedSearchTerm.toLowerCase();

      const matchesSearch =
        b.customer.fullName.toLowerCase().includes(search) ||
        b._id?.toLowerCase().includes(search) ||
        b.service.name?.toLowerCase().includes(search);

      const matchesStatus =
        debouncedStatusFilter === "all" ||
        normalize(b.status) === normalize(debouncedStatusFilter);

      const matchesService =
        debouncedServiceFilter === "all" ||
        (typeof b.service === "object" &&
          b.service?.category === debouncedServiceFilter);

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [bookings, debouncedSearchTerm, debouncedStatusFilter, debouncedServiceFilter]);

 
  const toggleExpanded = (id: string) => {
    setExpandedBooking((prev) => (prev === id ? null : id));
  };

  const handleIgnore = (bookingId: string) => {
    try {
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      toast.success("Booking ignored successfully");
    } catch {
      toast.error("Failed to ignore booking");
    }
  };

  const columns = useBookingColumns({
    expandedBooking,
    toggleExpanded,
    onIgnore: handleIgnore,
      onOpenDisputes: handleOpenDisputes,
  });


 
  if (isError) return <div className="p-6 text-center text-red-500">Failed to load booking history</div>;

 
  return (
    <div className="min-h-screen w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-14">
      {/* HEADER */}
      <div className={`mb-5 sm:mb-6 space-y-1 ${isRTL ? "text-right" : "text-left"}`}>
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
          <div className={`text-sm sm:text-base font-medium ${isRTL ? "text-right" : "text-left"}`}>
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
            limit={limit}
            onLimitChange={(val) => { setLimit(val); setPage(1); }}
            services={categories}
            statusConfig={statusConfig}
          />
        </div>
      </CommonCard>

      {/* TABLE */}
      <CommonTable<BookingHistory>
        columns={columns}
        data={filteredBookings}
        keyExtractor={(b) => b._id}
        currentPage={pagination?.currentPage}
        totalPages={pagination?.totalPages}
        onPageChange={setPage}
        isRTL={isRTL}
        expandedRowKey={expandedBooking}
        renderExpandedRow={(b) => <BookingExpandedRow booking={b} bookingCategories={categories} />}
      />
      <DisputeModal
          open={openDisputeModal}
          bookingId={selectedBookingId}
          onClose={() => setOpenDisputeModal(false)}
        />
    </div>
  );
}