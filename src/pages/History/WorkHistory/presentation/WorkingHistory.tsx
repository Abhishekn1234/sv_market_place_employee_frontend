"use client";

import { useState, useMemo, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { WorkStatsCards } from "./components/WorkStatsCards";
import { WorkFilters } from "./components/WorkFilters";
import { WorkHistoryTable } from "./components/WorkHistoryTable";
import { useWorkStatsCards } from "./hooks/useWorkStatus";
import { useWorkHistory } from "./hooks/useWorkHistory";
import WorkHeader from "./components/WorkHeader";
import { getNormalizedStatus } from "./utils/workhistory";

export default function WorkingHistoryPage() {
  const { language, translations } = useLanguage();
  const isRTL = language === "AR";

  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("month");
  const [statusFilter, setStatusFilter] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: works} = useWorkHistory();
  // isError, error 
  // ✅ FILTER LOGIC
  const filteredForTable = useMemo(() => {
    if (!works || !Array.isArray(works)) return [];

    return works.filter((w) => {
      const status = getNormalizedStatus(w);

      // ✅ Status filter
      if (statusFilter !== "all" && status !== statusFilter) {
        return false;
      }

      // ✅ Search filter
      if (
        searchTerm &&
        !w.service?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // ✅ Time filter
      if (timeFilter === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        if (new Date(w.assignedAt) < oneWeekAgo) {
          return false;
        }
      }

      if (timeFilter === "month") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        if (new Date(w.assignedAt) < oneMonthAgo) {
          return false;
        }
      }

      return true;
    });
  }, [works, statusFilter, searchTerm, timeFilter]);

  // ✅ Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, timeFilter, itemsPerPage]);

  // ✅ Pagination
  const totalPages =
    filteredForTable.length > 0
      ? Math.ceil(filteredForTable.length / itemsPerPage)
      : 1;

  const paginated = filteredForTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ✅ Stats Cards
  const cards = useWorkStatsCards(works || []);

  // // Error state
  // if (isError) {
  //   return (
  //     <div className="p-6 text-center text-red-500">
  //       Error: {error?.message}
  //     </div>
  //   );
  // }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <WorkHeader />

      <WorkStatsCards cards={cards} isRTL={isRTL} />

      <WorkFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        timeFilter={timeFilter}
        statusFilter={statusFilter}
        itemsPerPage={itemsPerPage}
        onTimeChange={setTimeFilter}
        onStatusChange={setStatusFilter}
        onItemsChange={setItemsPerPage}
        isRTL={isRTL}
        translations={translations}
      />

      <WorkHistoryTable
        data={paginated}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isRTL={isRTL}
      />
    </div>
  );
}