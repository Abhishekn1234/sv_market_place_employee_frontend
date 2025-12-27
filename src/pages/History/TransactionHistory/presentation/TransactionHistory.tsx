import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DollarSign, Calendar, Filter, Download, Search } from 'lucide-react';

import { mockTransactions } from './data/transactiondata';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationPrevious, 
  PaginationNext, 
  // PaginationEllipsis 
} from '@/components/ui/pagination'; 
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
export default function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
    const { language, t, translations } = useLanguage();
    const isRTL = language === "AR";
    // Cast transactionTable to a string record
const ts = translations.transactionTable as Record<string, string>;

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const {theme}=useTheme();

  const totalPaid = mockTransactions
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = mockTransactions
    .filter((t) => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  const itemsPerPage = 5; // rows per page
const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

// current page state
const [currentPage, setCurrentPage] = useState(1);

// slice filtered transactions for current page
const startIndex = (currentPage - 1) * itemsPerPage;
const currentTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

// handler
const handlePageChange = (page: number) => {
  setCurrentPage(page);
};

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={` ${isRTL?"text-right flex flex-col md:flex-row-reverse md:items-center md:justify-between gap-4":"text-left flex flex-row md:flex-row md:items-center md:justify-between gap-4 "}`}>
          <div>
         <h1 className={`${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
  {t('transactions')}</h1>

            <p className="text-gray-600 mt-1">
             {t('transactionHistory')}
            </p>
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
              <CardTitle className={`${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>{t('totalTransactions')}</CardTitle>
              <DollarSign className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className={`${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>{formatCurrency(totalPaid)}</div>
              <p className={`text-xs mt-1${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                {mockTransactions.filter((t) => t.status === 'completed').length}{' '}
               {t('completedTransactions')}
              </p>
            </CardContent>
          </Card>

         <Card className="flex-1 min-w-[250px] md:min-w-[300px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
               {t('pendingPayments')}
              </CardTitle>
              <Calendar className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className={`${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>{formatCurrency(pendingAmount)}</div>
              <p  className={`${theme === "dark" ? "text-gray-100" : "text-gray-900"}text-xs  mt-1`}>
                {mockTransactions.filter((t) => t.status === 'pending').length}{' '}
                {t('pendingTransactions')}
              </p>
            </CardContent>
          </Card>

        <Card className="flex-1 min-w-[250px] md:min-w-[300px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
               {t('allTime')}
              </CardTitle>
              <Filter className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`${theme==="dark"?"text-gray-100" : "text-gray-900"}`}>{mockTransactions.length}</div>
              <p className={`${theme==="dark"?"text-gray-100" : "text-gray-900"}text-xs mt-1`}>
                {t('allTime')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className={`${isRTL?"text-right":"text-left"}`}>
            <CardTitle>{t('transactionHistory')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isRTL?" flex  md:flex-row-reverse gap-4 mb-6":"flex  md:flex-row gap-4 mb-6"}`}>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t('searchPlaceholder')}
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
                  <SelectItem value="all">{t('allStatus')}</SelectItem>
                  <SelectItem value="completed">{t('completed')}</SelectItem>
                  <SelectItem value="pending">{t('pending')}</SelectItem>
                  <SelectItem value="failed">{t('failed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transaction Table */}
            <div className={`${isRTL?"flex-row-reverse":"flex-row"} border rounded-lg overflow-hidden`}>
          <Table dir={isRTL ? "" : ""}>
  <TableHeader>
    <TableRow>
      <TableHead className={isRTL ? "text-left" : "text-right"}>{ts.transactionId}</TableHead>
      <TableHead>{ts.date}</TableHead>
      <TableHead>{ts.type}</TableHead>
      <TableHead>{ts.description}</TableHead>
      <TableHead>{ts.paymentMethod}</TableHead>
      <TableHead>{ts.status}</TableHead>
      <TableHead className={isRTL ? "text-right" : "text-left"}>{ts.amount}</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {currentTransactions.map((transaction) => (
      <TableRow key={transaction.id}>
        <TableCell className={isRTL ? "text-left" : "text-right"}>{transaction.id}</TableCell>
        <TableCell>{formatDate(transaction.date)}</TableCell>
        <TableCell>{transaction.type}</TableCell>
        <TableCell className="max-w-xs truncate">{transaction.description}</TableCell>
        <TableCell>{transaction.paymentMethod}</TableCell>
        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
        <TableCell className={isRTL ? "text-right" : "text-left"}>{formatCurrency(transaction.amount)}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>


            </div>

            {/* Pagination Info */}
            {currentTransactions.length > 0 && (
              <div className="mt-4 text-sm text-gray-600 text-right">
                Showing {currentTransactions.length} of {mockTransactions.length}{' '}
                transactions
              </div>
            )}
            {totalPages > 1 && (
  <Pagination className={`${isRTL?"justify-start":"justify-end"}`}>
    <PaginationContent>
      {/* Previous Button */}
      <PaginationPrevious
        className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
        onClick={() => {
          if (currentPage > 1) handlePageChange(currentPage - 1);
        }}
      />

      {/* Page Numbers */}
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

      {/* Next Button */}
      <PaginationNext
        className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
        onClick={() => {
          if (currentPage < totalPages) handlePageChange(currentPage + 1);
        }}
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
