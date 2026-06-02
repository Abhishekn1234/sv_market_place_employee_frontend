"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { CommonTable } from "@/components/common/CommonTable";
import { CommonCard } from "@/components/common/CommonCard";
import CommonSpinner from "@/components/common/CommonSpinner";
import { toast } from "react-toastify";

import { useLanguage } from "@/context/LanguageContext";
import { useStatusConfig } from "./hooks/statusconfig";
import { useBookingColumns } from "./hooks/useColumns";
import { useGetBookingHistory } from "./hooks/useGetBookingHistory";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";

import { BookingFilters } from "./components/BookingFilters";
import { BookingExpandedRow } from "./components/BookingExpandedColumns";
import { BookingCard } from "./components/BookingCard"; // Import the new component

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

  const [isMobile, setIsMobile] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedStatusFilter = useDebounce(statusFilter, 300);
  const debouncedServiceFilter = useDebounce(serviceFilter, 300);
  const debouncedPage = useDebounce(page, 300);
  const debouncedLimit = useDebounce(limit, 300);

  const { data, isError, isLoading } = useGetBookingHistory({
    page: debouncedPage,
    limit: isMobile ? 10 : debouncedLimit,
    search: debouncedSearchTerm,
  });

  const pagination = data?.pagination;

  const [bookings, setBookings] = useState<BookingHistory[]>([]);

  useEffect(() => {
    if (data?.data) {
      if (isMobile && debouncedPage > 1) {
        setBookings((prev) => {
          const existingIds = new Set(prev.map((b) => b._id));
          const newItems = data.data.filter((b: BookingHistory) => !existingIds.has(b._id));
          return [...prev, ...newItems];
        });
      } else {
        setBookings(data.data);
      }
    }
  }, [data, isMobile, debouncedPage]);

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
        b.customer?.fullName?.toLowerCase().includes(search) ||
        b._id?.toLowerCase().includes(search) ||
        b.booking.bookingCode?.toLowerCase().includes(search) ||
        b.bookingId?.toLowerCase().includes(search) ||
        (typeof b.service === "object" && b.service?.name?.toLowerCase().includes(search)) ||
        (typeof b.service === "string" && String(b.service).toLowerCase().includes(search));

      const matchesStatus =
        debouncedStatusFilter === "all" || normalize(b.status) === normalize(String(debouncedStatusFilter));

      const matchesService =
        debouncedServiceFilter === "all" ||
        (typeof b.service === "object" && b.service?.category === debouncedServiceFilter);

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [bookings, debouncedSearchTerm, debouncedStatusFilter, debouncedServiceFilter]);

  const toggleExpanded = (id: string) => {
    setExpandedBooking((prev) => (prev === id ? null : id));
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setServiceFilter("all");
    setPage(1);
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

  useEffect(() => {
    if (!observerTarget.current || !isMobile) return;
    const el = observerTarget.current;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && pagination?.currentPage && pagination.currentPage < (pagination.totalPages ?? 0)) {
          setPage((p) => p + 1);
        }
      });
    });
    io.observe(el);
    return () => io.disconnect();
  }, [observerTarget, isMobile, pagination]);

  if (isError) return <div className="p-6 text-center text-red-500">Failed to load booking history</div>;

  return (
    <div className="min-h-screen w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-14 py-3 sm:py-6">
      {/* Premium container */}
      <div className="rounded-2xl sm:rounded-3xl">
        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
          {/* HEADER */}
          <div className={`space-y-0.5 sm:space-y-1 ${isRTL ? "text-right" : "text-left"}`}>
            <h1 className="text-base sm:text-xl md:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {translations.bookingHistory.title}
            </h1>
            <p className="text-xs sm:text-base text-slate-600">{translations.bookingHistory.subtitle}</p>
          </div>

          {/* FILTER CARD */}
          <CommonCard
            className="border-slate-50/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
            title={
              <div className={`text-sm sm:text-base font-semibold ${isRTL ? "text-right" : "text-left"}`}>
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
                onClear={handleClearFilters}
                onLimitChange={(val: number) => {
                  setLimit(val);
                  setPage(1);
                }}
                services={categories}
                statusConfig={statusConfig}
                isMobile={isMobile}
              />
            </div>
          </CommonCard>

          {/* TABLE CARD (filters above, table below — no desktop stats cards) */}
          <CommonCard className="overflow-hidden  shadow-sm">
            <div className="border-b dark:border-slate-800 px-3 sm:px-4 md:px-6 py-3 sm:py-4 ">
              <div className={isRTL ? "text-right" : "text-left"}>
                <h2 className="text-sm sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {translations.bookingHistory.title ?? "Booking history"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {translations.bookingHistory.subtitle ?? "Review all bookings and view details."}
                </p>
              </div>
            </div>

            <div className="p-2 sm:p-3 md:p-6"> {/* Adjusted padding for consistency */}
              {isMobile ? (
                <div className="space-y-3"> {/* Added space-y-3 for gaps between cards */}
                  {filteredBookings.map((booking) => (
                    <BookingCard
                      key={booking._id}
                      booking={booking}
                      expandedBookingId={expandedBooking}
                      toggleExpanded={toggleExpanded}
                      onIgnore={handleIgnore}
                      onOpenDisputes={handleOpenDisputes}
                      bookingCategories={categories}
                    />
                  ))}
                </div>
              ) : (
                <CommonTable<BookingHistory>
                  columns={columns}
                  data={filteredBookings}
                  keyExtractor={(b) => b._id}
                  currentPage={pagination?.currentPage ?? 1}
                  totalPages={filteredBookings.length <= 1 ? 1 : (pagination?.totalPages ?? 1)}
                  onPageChange={setPage}
                  isRTL={isRTL}
                  expandedRowKey={expandedBooking}
                  renderExpandedRow={(b) => <BookingExpandedRow booking={b} bookingCategories={categories} />}
                />
              )}
            </div>
          </CommonCard>

          {/* MOBILE INFINITE SCROLL UI */}
          {isMobile && (
            <div ref={observerTarget} className="py-6 flex flex-col items-center gap-2">
              {isLoading && (
                <>
                  <CommonSpinner />
                  <p className="text-xs text-muted-foreground">{translations.common.loading}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <DisputeModal
        open={openDisputeModal}
        bookingId={selectedBookingId}
        onClose={() => setOpenDisputeModal(false)}
      />
    </div>
  );
}
