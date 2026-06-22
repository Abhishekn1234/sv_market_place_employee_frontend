"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { CommonTable } from "@/components/common/CommonTable";
import { CommonCard } from "@/components/common/CommonCard";
import CommonSpinner from "@/components/common/CommonSpinner";
import { toast } from "react-toastify";

import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { useStatusConfig } from "./hooks/statusconfig";
import { useBookingColumns } from "./hooks/useColumns";
import { useGetBookingHistory, useGetBookingHistoryInfinite } from "./hooks/useGetBookingHistory";
import { useServiceCategory } from "@/pages/Servicesettings/presentation/hooks/useServiceCategory";

import { BookingFilters } from "./components/BookingFilters";
import { BookingExpandedRow } from "./components/BookingExpandedColumns";
import { BookingCard } from "./components/BookingCard"; // Import the new component

import type { BookingStatus } from "@/pages/Booking/AvailableBooking/domain/entities/bookingstatus";
import type { BookingHistory } from "../domain/entities/bookinghistory";
import { useDebounce } from "@/utils/usedebouncer";

import { useNavigate } from "react-router-dom";

export default function BookingHistory() {
  const { language, translations } = useLanguage();
  const isRTL = language === "AR";
  const statusConfig = useStatusConfig();
  const { data: categories = [] } = useServiceCategory();
  const [ignoredIds, setIgnoredIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const DEFAULT_SORT = "createdAt:desc"; // Already defined
  const DEFAULT_LIMIT = 5; // Define DEFAULT_LIMIT for BookingHistory
  const [sort, setSort] = useState(DEFAULT_SORT);

  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  const [isMobile, setIsMobile] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const debouncedLimit = useDebounce(limit, 300);

const desktopQuery = useGetBookingHistory({
  page,
  limit: debouncedLimit,
  search: debouncedSearchTerm,
  sort,
});

const mobileQuery = useGetBookingHistoryInfinite({
  limit: 10,
  search: debouncedSearchTerm,
  sort,
});

const isLoading = isMobile
  ? mobileQuery.isLoading
  : desktopQuery.isLoading;

const isError = isMobile
  ? mobileQuery.isError
  : desktopQuery.isError;

const pagination = desktopQuery.data?.pagination;

const bookings = useMemo<BookingHistory[]>(() => {
  if (!isMobile) {
    return desktopQuery.data?.data ?? [];
  }

  return (
    mobileQuery.data?.pages.flatMap(
      (page) => page.data ?? []
    ) ?? []
  );
}, [isMobile, desktopQuery.data, mobileQuery.data]);

  const normalize = (value?: string) => value?.toLowerCase().replace(/\s|-/g, "");

 
   const navigate = useNavigate();
  const handleOpenDisputes = (bookingId: string) => {
  navigate(`/disputes/${bookingId}`);
};
 const filteredBookings = useMemo(() => {
  return bookings.filter((b) => {
    if (ignoredIds.includes(b._id)) {
      return false;
    }

    const search = searchTerm.toLowerCase();

    const matchesSearch =
      !search ||
      b.customer?.fullName?.toLowerCase().includes(search) ||
      b._id?.toLowerCase().includes(search) ||
      b.booking.bookingCode?.toLowerCase().includes(search) ||
      b.bookingId?.toLowerCase().includes(search) ||
      (typeof b.service === "object" &&
        b.service?.name?.toLowerCase().includes(search)) ||
      (typeof b.service === "string" &&
        String(b.service).toLowerCase().includes(search));

    const matchesStatus =
      statusFilter === "all" ||
      normalize(b.status) === normalize(String(statusFilter));

    const matchesService =
      serviceFilter === "all" ||
      (typeof b.service === "object" &&
        b.service?.category === serviceFilter);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesService
    );
  });
}, [
  bookings,
  ignoredIds,
  searchTerm,
  statusFilter,
  serviceFilter,
]);

  const toggleExpanded = (id: string) => {
    setExpandedBooking((prev) => (prev === id ? null : id));
  };

  const isFilterActive = useMemo(() => {
  return (
    searchTerm !== "" ||
    statusFilter !== "all" ||
    serviceFilter !== "all" ||
    sort !== DEFAULT_SORT ||
    limit !== DEFAULT_LIMIT // Add limit to isFilterActive check
  );
}, [searchTerm, statusFilter, serviceFilter, sort, limit]);



  const handleClearFilters = () => {
  setSearchTerm("");
  setStatusFilter("all");
  setServiceFilter("all");
  setSort(DEFAULT_SORT);
  setPage(1);
  setLimit(DEFAULT_LIMIT); // Reset limit to DEFAULT_LIMIT
};

 const handleIgnore = (bookingId: string) => {
  setIgnoredIds((prev) => [...prev, bookingId]);
  toast.success("Booking ignored successfully");
};

  const columns = useBookingColumns({
    expandedBooking,
    toggleExpanded,
    onIgnore: handleIgnore,
    onOpenDisputes: handleOpenDisputes,
  });

useEffect(() => {
  if (!isMobile) return;
  if (!observerTarget.current) return;

const observer = new IntersectionObserver(
  (entries) => {
    const first = entries[0];

    if (
      first.isIntersecting &&
      mobileQuery.hasNextPage &&
      !mobileQuery.isFetchingNextPage
    ) {
      mobileQuery.fetchNextPage();
    }
  },
  {
    threshold: 0,
    rootMargin: "300px",
  }
);
  observer.observe(observerTarget.current);

  return () => observer.disconnect();
}, [
  isMobile,
  mobileQuery.hasNextPage,
  mobileQuery.isFetchingNextPage,
]);
  if (isError) return <div className="p-6 text-center text-red-500">Failed to load booking history</div>;

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-14 py-3 sm:py-6">
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
                sort={sort}
                onSortChange={setSort}
                isFilterActive={isFilterActive}
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
                  {isLoading && bookings.length === 0 && (
                    <div className="flex justify-center py-12">
                      <CommonSpinner />
                    </div>
                  )}
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
                  isLoading={isLoading}
                  renderExpandedRow={(b) => <BookingExpandedRow booking={b} bookingCategories={categories} />}
                />
              )}
            </div>
          </CommonCard>

          {/* MOBILE INFINITE SCROLL UI */}
         {isMobile && (
  <div
    ref={observerTarget}
    className="py-6 flex justify-center"
  >
    {mobileQuery.isFetchingNextPage && (
      <CommonSpinner />
    )}
  </div>
)}
        </div>
      </div>

      
    </div>
  );
}
