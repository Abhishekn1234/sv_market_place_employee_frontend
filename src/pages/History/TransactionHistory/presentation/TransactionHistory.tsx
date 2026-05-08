"use client";

import { useState, useMemo } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useWalletTransactions } from "@/pages/Wallet/presentation/hooks/useWalletTransactions";
import TransactionFilters from "./components/TransactionFilters";
import TransactionSummary from "./components/TransactionSummary";
import TransactionTable from "./components/TransactionTable";

import type { Transaction } from "../domain/entities/transaction";
import CommonSpinner from "@/components/common/CommonSpinner";

export default function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { language, translations } = useLanguage();
  const { theme } = useTheme();
  const isRTL = language === "AR";

  const page = translations.transactionHistory;

  // Use real API with pagination
  const { data: transactionsResponse, isLoading, isError } = useWalletTransactions({
    page: currentPage,
    limit: 10,
    sort: "createdAt:desc",
    search: searchTerm || undefined,
  });

  // Transform API transactions to component format
  const transformedTransactions: Transaction[] = useMemo(() => {
    if (!transactionsResponse?.data) return [];

    return transactionsResponse.data.map((txn) => ({
      id: txn.id,
      date: new Date(txn.createdAt).toLocaleDateString(),
      amount: txn.amount,
      type: txn.source.replace(/_/g, ' ').toLowerCase(),
      status: 'completed' as const, // API doesn't provide status, assume completed
      paymentMethod: txn.type === 'CREDIT' ? 'Wallet Credit' : 'Wallet Debit',
      description: txn.note || txn.source.replace(/_/g, ' '),
    }));
  }, [transactionsResponse]);

  // Client-side filtering for additional filters
  const filteredTransactions = useMemo(() => {
    return transformedTransactions.filter((tx) => {
      const matchesSearch =
        !searchTerm ||
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || tx.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [transformedTransactions, searchTerm, statusFilter]);

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

          
        </div>

      
        {isLoading && (
        
           <CommonSpinner/>
        
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-8">
            <div className="text-sm text-rose-500">
              Failed to load transactions. Please try again.
            </div>
          </div>
        )}

        {/* SUMMARY */}
        {!isLoading && !isError && <TransactionSummary />}

        {/* FILTERS */}
        {!isLoading && !isError && (
          <TransactionFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
          />
        )}

        {/* TABLE */}
        {!isLoading && !isError && (
          <TransactionTable
            transactions={filteredTransactions}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalPages={transactionsResponse?.pagination?.totalPages || 1}
          />
        )}
      </div>
    </div>
  );
}
