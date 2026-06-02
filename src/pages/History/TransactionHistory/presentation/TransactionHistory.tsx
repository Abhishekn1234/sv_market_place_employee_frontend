"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useWalletTransactions } from "@/pages/Wallet/presentation/hooks/useWalletTransactions";
import TransactionFilters from "./components/TransactionFilters";
import TransactionSummary from "./components/TransactionSummary";
import TransactionTable from "./components/TransactionTable";

import type { Transaction } from "../domain/entities/transaction";
import CommonSpinner from "@/components/common/CommonSpinner";
import { useDebounce } from "@/utils/usedebouncer";

type TransactionStatus = "all" | "completed" | "pending" | "failed";

export default function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("createdAt:desc");
  const [limit, setLimit] = useState(10);
  const [isMobile, setIsMobile] = useState(false);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const { language, translations } = useLanguage();
  const { theme } = useTheme();
  const isRTL = language === "AR";

  const page = translations.transactionHistory;

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedStatusFilter = useDebounce(statusFilter, 300);

  // Use real API with pagination
  const { data: transactionsResponse, isLoading, isError } = useWalletTransactions({
    page: currentPage,
    limit: isMobile ? 20 : limit,
    sort: sort,
    search: debouncedSearchTerm || undefined,
    status: debouncedStatusFilter === "all" ? undefined : debouncedStatusFilter,
  });

  // Transform API transactions to component format
  const transformedTransactions: Transaction[] = useMemo(() => {
    if (!transactionsResponse?.data) return [];

    return transactionsResponse.data.map((txn) => ({
      id: txn.id,
      date: new Date(txn.createdAt).toLocaleDateString(),
      amount: txn.amount,
      type: txn.source.replace(/_/g, ' ').toLowerCase(), // Assuming txn.source can be used for type
      status: (txn as any).status || 'completed', // Cast to any to access status if type is missing
      paymentMethod: txn.type === 'CREDIT' ? 'Wallet Credit' : 'Wallet Debit',
      description: txn.note || txn.source.replace(/_/g, ' '),
    }));
  }, [transactionsResponse]);

  // Accumulate transactions on mobile, replace on desktop/search changes
  useEffect(() => {
    if (transactionsResponse?.data) {
      if (isMobile && currentPage > 1) {
        setIsLoadingMore(false);
        setAllTransactions((prev) => {
          const existingIds = new Set(prev.map((t) => t.id));
          const newTransactions = transformedTransactions.filter((t) => !existingIds.has(t.id));
          return [...prev, ...newTransactions];
        });
      } else {
        setAllTransactions(transformedTransactions);
      }
    }
  }, [transformedTransactions, currentPage, isMobile, transactionsResponse?.data]);

  // Client-side filtering for additional filters
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((tx) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        tx.id.toLowerCase().includes(search) ||
        tx.description.toLowerCase().includes(search) ||
        tx.type.toLowerCase().includes(search) ||
        tx.status.toLowerCase().includes(search) ||
        tx.paymentMethod.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" || tx.status === statusFilter; // This will now work correctly with actual API status

      return matchesSearch && matchesStatus;
    });
  }, [allTransactions, searchTerm, statusFilter]);

  // Handle load more on mobile
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setCurrentPage((prev) => prev + 1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSort("createdAt:desc");
    setCurrentPage(1);
  };

  // Reset pagination when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, limit, sort]);

  const isFilterActive = useMemo(() => {
    return searchTerm !== "" || statusFilter !== "all" || sort !== "createdAt:desc";
  }, [searchTerm, statusFilter, sort]);

  // Infinite scroll observer for mobile
  useEffect(() => {
    if (!isMobile || !observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const hasMore = (transactionsResponse?.pagination?.currentPage || 1) < (transactionsResponse?.pagination?.totalPages || 1);

        if (entry.isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [isMobile, isLoadingMore, isLoading, transactionsResponse]);

  return (
    <div className="min-h-screen w-full px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* HEADER */}
        <div
          className={`
            flex flex-col gap-2 sm:gap-4
            md:flex-row md:items-center md:justify-between
            ${isRTL ? "md:flex-row-reverse text-right" : "text-left"}
          `}
        >
          <div>
            <h1
              className={`text-base sm:text-xl md:text-2xl font-semibold ${
                theme === "dark" ? "text-slate-100" : "text-slate-900"
              }`}
            >
              {page.pageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {page.pageSubtitle}
            </p>
          </div>

          
        </div>

      
        {isLoading && allTransactions.length === 0 && (
          <div className="flex justify-center py-6 sm:py-8">
            <CommonSpinner/>
          </div>
        )}

        {/* Error State */}
        {isError && allTransactions.length === 0 && (
          <div className="text-center py-6 sm:py-8">
            <div className="text-xs sm:text-sm text-rose-500">
              Failed to load transactions. Please try again.
            </div>
          </div>
        )}

        {/* SUMMARY */}
        <TransactionSummary />

        {/* FILTERS */}
        <TransactionFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
            isFilterActive={isFilterActive}
            sort={sort}
            onSortChange={setSort}
          limit={limit}
          onClear={handleClearFilters}
          onLimitChange={(val) => {
            setLimit(val);
            setCurrentPage(1);
          }}
          isMobile={isMobile}
        />

        {/* TABLE */}
        <TransactionTable
          transactions={filteredTransactions}
          currentPage={isMobile ? 1 : currentPage}
          onPageChange={isMobile ? () => {} : setCurrentPage}
          totalPages={isMobile || filteredTransactions.length <= 1 ? 1 : (transactionsResponse?.pagination?.totalPages ?? 1)}
          isMobile={isMobile}
        />

        {/* MOBILE INFINITE SCROLL TARGET */}
        {isMobile && (
          <div ref={observerTarget} className="flex flex-col items-center justify-center gap-3 py-8 min-h-[100px]">
            {((transactionsResponse?.pagination?.currentPage || 1) < (transactionsResponse?.pagination?.totalPages || 1) || isLoadingMore) && (
              <CommonSpinner />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
