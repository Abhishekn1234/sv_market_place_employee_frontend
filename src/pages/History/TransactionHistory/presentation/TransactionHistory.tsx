"use client";

import { useState, useMemo } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { mockTransactions } from "./data/transactiondata";
import TransactionFilters from "./components/TransactionFilters";
import TransactionSummary from "./components/TransactionSummary";
import TransactionTable from "./components/TransactionTable";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { language, translations } = useLanguage();
  const { theme } = useTheme();
  const isRTL = language === "AR";

  const page = translations.transactionHistory;

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((tx) => {
      const matchesSearch =
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || tx.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div className="min-h-screen px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div
          className={`
            flex flex-col gap-4
            md:flex-row md:items-center md:justify-between
            ${isRTL ? "md:flex-row-reverse text-right" : "text-left"}
          `}
        >
          <div>
            <h1
              className={`text-xl md:text-2xl font-semibold ${
                theme === "dark" ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {page.pageTitle}
            </h1>
            <p className="text-sm text-gray-600">
              {page.pageSubtitle}
            </p>
          </div>

          <Button className="w-full md:w-auto">
            <Download className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {page.export}
          </Button>
        </div>

        {/* SUMMARY */}
        <TransactionSummary />

        {/* FILTERS */}
        <TransactionFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
        />

        {/* TABLE */}
        <TransactionTable
          transactions={filteredTransactions}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
