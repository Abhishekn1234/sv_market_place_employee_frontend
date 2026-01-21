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

  const { language, t } = useLanguage();
  const { theme } = useTheme();

  const isRTL = language === "AR";

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
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
     
        <div
          className={`flex gap-4 ${
            isRTL
              ? "flex-col md:flex-row-reverse text-right"
              : "flex-col md:flex-row text-left"
          } md:items-center md:justify-between`}
        >
          <div>
            <h1 className={theme === "dark" ? "text-gray-100" : "text-gray-900"}>
              {t("transactions")}
            </h1>
            <p className="text-gray-600">{t("transactionHistory")}</p>
          </div>

          <Button>
            <Download className="w-4 h-4 mr-2" />
            {t("export")}
          </Button>
        </div>

        <TransactionSummary />

        <TransactionFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
        />

        <TransactionTable
          transactions={filteredTransactions}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
