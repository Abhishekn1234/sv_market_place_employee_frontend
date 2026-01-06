"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Calendar, Filter, Download, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { type Transaction } from "../domain/entities/transaction";

// Mock Data
export const mockTransactions: Transaction[] = [
  {
    id: "TXN-001",
    date: "2024-12-15",
    amount: 3500.0,
    type: "Monthly Salary",
    status: "completed",
    paymentMethod: "Bank Transfer",
    description: "November 2024 Salary Payment",
  },
  {
    id: "TXN-002",
    date: "2024-12-10",
    amount: 500.0,
    type: "Bonus",
    status: "completed",
    paymentMethod: "Bank Transfer",
    description: "Performance Bonus Q4",
  },
  {
    id: "TXN-003",
    date: "2024-11-15",
    amount: 3500.0,
    type: "Monthly Salary",
    status: "completed",
    paymentMethod: "Bank Transfer",
    description: "October 2024 Salary Payment",
  },
  {
    id: "TXN-004",
    date: "2024-11-05",
    amount: 250.0,
    type: "Overtime",
    status: "completed",
    paymentMethod: "Bank Transfer",
    description: "Overtime Payment - Week 44",
  },
  {
    id: "TXN-005",
    date: "2024-10-15",
    amount: 3500.0,
    type: "Monthly Salary",
    status: "completed",
    paymentMethod: "Bank Transfer",
    description: "September 2024 Salary Payment",
  },
  {
    id: "TXN-006",
    date: "2024-10-01",
    amount: 1200.0,
    type: "Reimbursement",
    status: "pending",
    paymentMethod: "Bank Transfer",
    description: "Travel Reimbursement",
  },
  {
    id: "TXN-007",
    date: "2024-09-15",
    amount: 3500.0,
    type: "Monthly Salary",
    status: "completed",
    paymentMethod: "Bank Transfer",
    description: "August 2024 Salary Payment",
  },
  {
    id: "TXN-008",
    date: "2024-09-01",
    amount: 800.0,
    type: "Bonus",
    status: "completed",
    paymentMethod: "Bank Transfer",
    description: "Mid-Year Performance Bonus",
  },
];

export default function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { language, t, translations } = useLanguage();
  const { theme } = useTheme();

  const isRTL = language === "AR";

  // Safe translations access
  interface TransactionTableTranslations {
  transactionId: string;
  date: string;
  type: string;
  description: string;
  paymentMethod: string;
  status: string;
  amount: string;
}

// cast translations safely
const ts: TransactionTableTranslations =
  (translations.transactionTable as unknown as TransactionTableTranslations) ?? {
    transactionId: "Transaction ID",
    date: "Date",
    type: "Type",
    description: "Description",
    paymentMethod: "Payment Method",
    status: "Status",
    amount: "Amount",
  };

  // Filtered transactions
  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Summary
  const totalPaid = mockTransactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = mockTransactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Failed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div
          className={`${
            isRTL
              ? "text-right flex flex-col md:flex-row-reverse md:items-center md:justify-between gap-4"
              : "text-left flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          }`}
        >
          <div>
            <h1 className={theme === "dark" ? "text-gray-100" : "text-gray-900"}>
              {t("transactions")}
            </h1>
            <p className="text-gray-600 mt-1">{t("transactionHistory")}</p>
          </div>
          <Button className="w-fit">
            <Download className="w-4 h-4 mr-2" />
            {t('export')}
          </Button>
        </div>

        {/* Summary Cards */}
        <div
          className={`flex gap-14 ${
            isRTL ? "flex-row-reverse" : "flex-row"
          } flex-wrap`}
        >
          <Card className="flex-1 min-w-[250px] md:min-w-[300px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={theme === "dark" ? "text-gray-100" : "text-gray-900"}
              >
                {t("totalTransactions")}
              </CardTitle>
              <DollarSign className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className={theme === "dark" ? "text-gray-100" : "text-gray-900"}>
                {formatCurrency(totalPaid)}
              </div>
              <p
                className={`text-xs mt-1 ${
                  theme === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {mockTransactions.filter((t) => t.status === "completed").length}{" "}
                {t("completedTransactions")}
              </p>
            </CardContent>
          </Card>

          <Card className="flex-1 min-w-[250px] md:min-w-[300px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={theme === "dark" ? "text-gray-100" : "text-gray-900"}
              >
                {t("pendingPayments")}
              </CardTitle>
              <Calendar className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className={theme === "dark" ? "text-gray-100" : "text-gray-900"}>
                {formatCurrency(pendingAmount)}
              </div>
              <p
                className={`text-xs mt-1 ${
                  theme === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {mockTransactions.filter((t) => t.status === "pending").length}{" "}
                {t("pendingTransactions")}
              </p>
            </CardContent>
          </Card>

          <Card className="flex-1 min-w-[250px] md:min-w-[300px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={theme === "dark" ? "text-gray-100" : "text-gray-900"}
              >
                {t("allTime")}
              </CardTitle>
              <Filter className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={theme === "dark" ? "text-gray-100" : "text-gray-900"}>
                {mockTransactions.length}
              </div>
              <p
                className={`text-xs mt-1 ${
                  theme === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {t("allTime")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className={isRTL ? "text-right" : "text-left"}>
            <CardTitle>{t("transactionHistory")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`${
                isRTL
                  ? "flex md:flex-row-reverse gap-4 mb-6"
                  : "flex md:flex-row gap-4 mb-6"
              }`}
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t("searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allStatus")}</SelectItem>
                  <SelectItem value="completed">{t("completed")}</SelectItem>
                  <SelectItem value="pending">{t("pending")}</SelectItem>
                  <SelectItem value="failed">{t("failed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transaction Table */}
            <div
              className={`flex border rounded-lg overflow-hidden ${
                isRTL ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Table dir={isRTL ? "rtl" : "ltr"}>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isRTL ? "text-left" : "text-right"}>
                      {ts.transactionId ?? "Transaction ID"}
                    </TableHead>
                    <TableHead>{ts.date ?? "Date"}</TableHead>
                    <TableHead>{ts.type ?? "Type"}</TableHead>
                    <TableHead>{ts.description ?? "Description"}</TableHead>
                    <TableHead>{ts.paymentMethod ?? "Payment Method"}</TableHead>
                    <TableHead>{ts.status ?? "Status"}</TableHead>
                    <TableHead className={isRTL ? "text-right" : "text-left"}>
                      {ts.amount ?? "Amount"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className={isRTL ? "text-left" : "text-right"}>
                        {transaction.id}
                      </TableCell>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {transaction.description}
                      </TableCell>
                      <TableCell>{transaction.paymentMethod}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell className={isRTL ? "text-right" : "text-left"}>
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Info */}
            {currentTransactions.length > 0 && (
              <div className="mt-4 text-sm text-gray-600 text-right">
                Showing {currentTransactions.length} of {mockTransactions.length}{" "}
                transactions
              </div>
            )}

            {totalPages > 1 && (
              <Pagination className={isRTL ? "justify-start" : "justify-end"}>
                <PaginationContent>
                  <PaginationPrevious
                    className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  />
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={currentPage === i + 1}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationNext
                    className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  />
                </PaginationContent>
              </Pagination>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
