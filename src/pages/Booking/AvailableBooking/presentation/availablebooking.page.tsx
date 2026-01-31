"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { BookingFilters } from "./components/BookingFilters";
import { BookingTable } from "./components/BookingTable";
import { useLanguage } from "@/context/LanguageContext";
import { mockData } from "./data/mock";


export default function AvailableBookingPage() {
  const { translations,language } = useLanguage();
  const t = translations?.availableBookings ?? {
    title: "Available Bookings",
  };
  const isRTL=language==="AR";

  const [filters, setFilters] = useState<{
    service: string;
    tier: string;
    status: string;
    search:string;
  }>({
    service: "all",
    tier: "all",
    status: "all",
    search: "", 
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  /**
   * ✅ FILTER BOOKINGS (CORRECT & SAFE)
   */
 const filteredData = useMemo(() => {
  return mockData.filter((b) => {
    // 🔍 Search (customer name OR service type)
    if (
      filters.search &&
      !(
        b.clientName
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        b.serviceType
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      )
    ) {
      return false;
    }

    // 🎯 Service dropdown (exact match)
    if (
      filters.service !== "all" &&
      b.serviceType !== filters.service
    ) {
      return false;
    }

    // 🧩 Tier filter
    if (
      filters.tier !== "all" &&
      b.serviceTier !== filters.tier
    ) {
      return false;
    }

    // 🚦 Status filter
    if (
      filters.status !== "all" &&
      b.status !== filters.status
    ) {
      return false;
    }

    return true;
  });
}, [filters]);


  /**
   * ✅ PAGINATION
   */
  const totalPages = Math.max(1, Math.ceil(filteredData.length / limit));

  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredData.slice(start, start + limit);
  }, [filteredData, page, limit]);

  return (
    <Card className="p-6 space-y-6">
    
      <h1 className={`text-xl font-semibold ${isRTL?"text-right":"text-left"}`}>{t.title}</h1>

   
    <BookingFilters
  service={filters.service}
  tier={filters.tier}
  status={filters.status}
  search={filters.search}
  limit={limit}
  onChange={(key, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  }}
  onLimitChange={(val) => {
    setPage(1);
    setLimit(val);
  }}
  t={t}
/>


      {/* Table */}
      <BookingTable
        data={paginatedData}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        t={t}
        isRTL={isRTL}
      />
    </Card>
  );
}
