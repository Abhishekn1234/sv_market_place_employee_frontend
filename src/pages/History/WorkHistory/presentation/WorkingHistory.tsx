import { useState,useMemo } from 'react';
import { Calendar,  CheckCircle2, AlertCircle,Search, PlayCircle, ChevronLeft } from 'lucide-react';
import type { WorkStatus } from '../domain/entities/workstatus';
import { mockWorks } from './data/workhistory';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';


export default function WorkingHistory() {
  const [timeFilter, setTimeFilter] = useState<'week' | 'month'>('month');
  const [statusFilter, setStatusFilter] = useState<WorkStatus | 'all'>('all');
  const [selectedEmployee] = useState('John Smith');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const { language, translations, t } = useLanguage();
  const isRTL = language === "AR";
  const { theme } = useTheme();

  const getStatusColor = (status: WorkStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'upcoming':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: WorkStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'in-progress':
        return <PlayCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'upcoming':
        return <Calendar className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const filterWorks = () => {
    const currentDate = new Date(2024, 11, 20);
    
    return mockWorks.filter(work => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!work.title.toLowerCase().includes(searchLower) &&
            !work.description.toLowerCase().includes(searchLower) &&
            !work.location?.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && work.status !== statusFilter) {
        return false;
      }

      // Time filter
      const assignedDate = new Date(work.assignedDate);
      if (timeFilter === 'week') {
        const weekAgo = new Date(currentDate);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekAhead = new Date(currentDate);
        weekAhead.setDate(weekAhead.getDate() + 7);
        return assignedDate >= weekAgo && assignedDate <= weekAhead;
      } else {
        // month filter
        return assignedDate.getMonth() === currentDate.getMonth();
      }
    });
  };

  const filteredWorks = filterWorks();

  // Pagination calculations
  const totalPages = Math.ceil(filteredWorks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedWorks = filteredWorks.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (filterType: 'time' | 'status', value: any) => {
    setCurrentPage(1);
    if (filterType === 'time') {
      setTimeFilter(value);
    } else {
      setStatusFilter(value);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const tableHeaders = [
    { key: "title", label: translations.workHistory.tableHeaders.title },
    { key: "description", label: translations.workHistory.tableHeaders.description },
    { key: "location", label: translations.workHistory.tableHeaders.location },
    { key: "assignedDate", label: translations.workHistory.tableHeaders.assignedDate },
    { key: "dueDate", label: translations.workHistory.tableHeaders.dueDate },
    { key: "status", label: translations.workHistory.tableHeaders.status },
    { key: "duration", label: translations.workHistory.tableHeaders.duration },
    { key: "extraInfo", label: translations.workHistory.tableHeaders.extraInfo },
  ];

  const stats = {
    total: filteredWorks.length,
    completed: filteredWorks.filter(w => w.status === 'completed').length,
    inProgress: filteredWorks.filter(w => w.status === 'in-progress').length,
    upcoming: filteredWorks.filter(w => w.status === 'upcoming').length,
    totalHours: filteredWorks.reduce((sum, w) => sum + w.duration, 0)
  };

  const cards = [
    { label: translations.workHistory.cards.totalWorks, value: stats.total },
    { label: translations.workHistory.cards.completed, value: stats.completed, color: "text-green-600" },
    { label: translations.workHistory.cards.inProgress, value: stats.inProgress, color: "text-blue-600" },
    { label: translations.workHistory.cards.upcoming, value: stats.upcoming, color: "text-purple-600" },
  ];

  // Memoize reversed arrays to prevent unnecessary re-renders
  const displayCards = useMemo(() => 
    isRTL ? [...cards].reverse() : cards, 
    [cards, isRTL]
  );

  const displayHeaders = useMemo(() => 
    isRTL ? [...tableHeaders].reverse() : tableHeaders, 
    [tableHeaders, isRTL]
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`mb-8 ${isRTL ? "text-right" : ""}`}>
          <h1 className={`${theme === "dark" ? "text-gray-100" : "text-gray-900"} mb-2`}>{t('WorkHistory')}</h1>
          <p className={`${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>Employee: {selectedEmployee}</p>
        </div>

        {/* Stats Cards */}
        <div className={`grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-6`}>
          {displayCards.map((card, index) => (
            <div
              key={`card-${index}`}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <div className={`text-gray-600 mb-1 ${isRTL ? "text-right" : "text-left"}`}>
                {card.label}
              </div>
              <div className={`text-gray-900 ${card.color ?? ""}`}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="sr-only">Search</label>
            <div className="relative">
              {isRTL ? (
                <>
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search works..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 placeholder-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                  />
                </>
              ) : (
                <>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search works..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 placeholder-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                  />
                </>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 flex-wrap">
            {/* Time Period Dropdown */}
            <div className="w-36">
              <label className="sr-only">Time Period</label>
              <select
                value={timeFilter}
                onChange={(e) => handleFilterChange('time', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="currentWeek">Current Week</option>
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="w-36">
              <label className="sr-only">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>

            {/* Items Per Page Dropdown */}
            <div className="w-36">
              <label className="sr-only">Items Per Page</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
              >
                {[5, 10, 15, 20].map((num) => (
                  <option key={`items-${num}`} value={num}>
                    {num} per page
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Work List */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <table className={`min-w-full divide-y divide-gray-200 ${isRTL ? "direction-rtl" : ""}`}>
            <thead className="bg-gray-50">
              <tr>
                {displayHeaders.map((header) => (
                  <th
                    key={`header-${header.key}`}
                    className={`px-4 py-2 ${isRTL ? "text-right" : "text-left"} text-gray-600`}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedWorks.length > 0 ? (
                paginatedWorks.map((work) => {
                  const assignedDate = work.assignedDate ? new Date(work.assignedDate) : null;
                  const dueDate = work.dueDate ? new Date(work.dueDate) : null;
                  const currentDate = new Date(2024, 11, 20);

                  // Extra Info logic
                  let extraInfo;
                  if (work.status === 'upcoming' && assignedDate) {
                    extraInfo = `${Math.ceil((assignedDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))} days to start`;
                  } else if (work.status === 'in-progress') {
                    extraInfo = dueDate
                      ? `${Math.ceil((dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))} days until due`
                      : 'No due date';
                  } else if (work.status === 'completed') {
                    extraInfo = dueDate
                      ? `Completed on ${dueDate.toLocaleDateString()}`
                      : `Completed in ${work.duration} hrs`;
                  } else {
                    extraInfo = '-';
                  }

                  const cells = [
                    work.title,
                    work.description,
                    work.location || '-',
                    assignedDate ? assignedDate.toLocaleDateString() : '-',
                    dueDate ? dueDate.toLocaleDateString() : '-',
                    <div
                      key="status"
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border ${getStatusColor(work.status)}`}
                    >
                      {getStatusIcon(work.status)}
                      <span className="capitalize text-xs whitespace-nowrap">
                        {work.status.replace('-', ' ')}
                      </span>
                    </div>,
                    `${work.duration} hrs`,
                    extraInfo,
                  ];

                  const displayCells = isRTL ? [...cells].reverse() : cells;

                  return (
                    <tr key={`work-${work.id}`} className="hover:bg-gray-50 transition-colors">
                      {displayCells.map((cell, idx) => (
                        <td
                          key={`cell-${work.id}-${idx}`}
                          className={`px-4 py-2 ${isRTL ? "text-right" : "text-left"} ${typeof cell === "string" ? "text-gray-600" : ""}`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredWorks.length > 0 && totalPages > 1 && (
          <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              
              {/* Page info text */}
              <div className={`${isRTL ? 'text-right' : 'text-left'} text-gray-600`}>
                Page {currentPage} of {totalPages}
              </div>

              {/* Pagination buttons */}
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  First
                </button>

                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  {isRTL ? 'Previous' : <ChevronLeft className="w-4 h-4" />}
                  {isRTL ? <ChevronLeft className="w-4 h-4 rotate-180" /> : 'Previous'}
                </button>

                {/* Page Numbers */}
                <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ))
                    .map((page, index, array) => {
                      const prevPage = array[index - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;

                      return (
                        <div key={`page-${page}`} className="flex items-center gap-1">
                          {showEllipsis && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                          <button
                            onClick={() => goToPage(page)}
                            className={`w-10 h-10 rounded-lg border transition-colors ${
                              currentPage === page
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      );
                    })}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  {isRTL ? <ChevronLeft className="w-4 h-4" /> : 'Next'}
                  {isRTL ? 'Next' : <ChevronLeft className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}