"use client";

import { useState, useMemo } from "react";
import { mockWorks } from "./data/workhistory";
import { useLanguage } from "@/context/LanguageContext";
import { WorkStatsCards } from "./components/WorkStatsCards";
import { WorkFilters } from "./components/WorkFilters";
import { WorkHistoryTable } from "./components/WorkHistoryTable";
import { useWorkStatsCards } from "./hooks/useWorkStatus";

export default function WorkingHistoryPage() {
  const { language,translations} = useLanguage();
  const isRTL = language === "AR";

  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("month");
  const [statusFilter, setStatusFilter] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return mockWorks.filter((w) => {
      if (statusFilter !== "all" && w.status !== statusFilter) return false;
      if (searchTerm && !w.title.toLowerCase().includes(searchTerm.toLowerCase()))
        return false;
      return true;
    });
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const cards =useWorkStatsCards(filtered);

  return (
    <div className="p-6 max-w-7xl mx-auto">
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
