"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/components/ui/utils";

export type TableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
};

interface CommonTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;

  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;

  emptyMessage?: string;
  renderExpandedRow?: (row: T) => React.ReactNode;
  expandedRowKey?: string | null;

  isRTL?: boolean;
}

const getVisiblePages = (
  currentPage: number,
  totalPages: number,
  max = 3
) => {
  const half = Math.floor(max / 2);

  let start = Math.max(currentPage - half, 1);
  let end = start + max - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(end - max + 1, 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export function CommonTable<T>({
  columns,
  data,
  keyExtractor,
  currentPage,
  totalPages = 0,
  onPageChange,
  emptyMessage,
  renderExpandedRow,
  expandedRowKey,
  isRTL = false,
}: CommonTableProps<T>) {
  const { translations } = useLanguage(); // ✅ FIXED LOCATION

  const renderedColumns = isRTL ? [...columns].reverse() : columns;

  const visiblePages = getVisiblePages(currentPage??1, totalPages, 3);

  const hasData = data.length > 0;

  const showPagination =
    hasData && totalPages > 1 && !!onPageChange;

  const finalEmptyMessage =
    emptyMessage ?? translations.common.noData ?? "No data found";

  return (
    <>
      {/* TABLE WRAPPER */}
      <div className="w-full overflow-x-auto">
        <Table className={cn("min-w-full", isRTL && "direction-rtl")}>
          {/* HEADER */}
          <TableHeader className="hidden md:table-header-group">
            <TableRow>
              {renderedColumns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    col.className,
                    isRTL ? "text-right" : "text-left"
                  )}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {!hasData ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length || 1}
                  className="text-center py-6"
                >
                  {finalEmptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
                const rowKey = keyExtractor(row);

                return (
                  <React.Fragment key={rowKey}>
                    {/* ROW */}
                    <TableRow className="block md:table-row mb-4 md:mb-0 border-b md:border-0 last:border-b-0">
                      {renderedColumns.map((col) => {
                        const value =
                          col.render !== undefined
                            ? col.render(row)
                            : (row as any)[col.key];

                        return (
                          <TableCell
                            key={col.key}
                            className={cn(
                              col.className,
                              "block md:table-cell px-4 py-2 md:px-3 md:py-3",
                              isRTL ? "text-right" : "text-left"
                            )}
                          >
                            <span className="md:hidden font-medium text-gray-500">
                              {col.header}:{" "}
                            </span>
                            {value ?? ""}
                          </TableCell>
                        );
                      })}
                    </TableRow>

                    {/* EXPANDED ROW */}
                    {renderExpandedRow && expandedRowKey === rowKey && (
                      <TableRow className="block md:table-row">
                        <TableCell
                          colSpan={columns.length || 1}
                          className="block md:table-cell bg-gray-50 p-4"
                        >
                          {renderExpandedRow(row)}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      {showPagination && (
        <Pagination className="mt-6 flex w-full justify-end" dir="ltr">
          {/* Prev */}
          <PaginationPrevious
            onClick={() =>
              onPageChange?.(Math.max(currentPage??1 - 1, 1))
            }
          />

          {/* Pages */}
          <PaginationContent className="flex gap-2">
            {visiblePages.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => onPageChange?.(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>

          {/* Next */}
          <PaginationNext
            onClick={() =>
              onPageChange?.(
                Math.min(currentPage??1 + 1, totalPages)
              )
            }
          />
        </Pagination>
      )}
    </>
  );
}