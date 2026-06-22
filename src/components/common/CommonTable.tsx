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
import CommonSpinner from "@/components/common/CommonSpinner";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
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
  isLoading?: boolean;

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
  isLoading = false,
  isRTL = false,
}: CommonTableProps<T>) {
  const { translations } = useLanguage();

  const renderedColumns = columns;

  const visiblePages = getVisiblePages(
    currentPage ?? 1,
    totalPages,
    3
  );

  const hasData = data.length > 0;

  const showPagination =
    hasData && totalPages > 1 && !!onPageChange;

  const finalEmptyMessage =
    emptyMessage ?? translations.common.noData ?? "No data found";

  return (
    <>
      <div
        className="w-full overflow-x-auto"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Table className="min-w-full">
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

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length || 1}
                  className="text-center py-10"
                >
                  <CommonSpinner />
                </TableCell>
              </TableRow>
            ) : !hasData ? (
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
                    <TableRow
                      className={cn(
                        "block md:table-row mb-4 md:mb-0 border-b md:border-0 last:border-b-0"
                      )}
                    >
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
                              isRTL
                                ? "text-right"
                                : "text-left"
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

                    {renderExpandedRow &&
                      expandedRowKey === rowKey && (
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

      {showPagination && (
        <Pagination
          className={cn(
            "mt-6 flex w-full",
            isRTL ? "justify-start" : "justify-end"
          )}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <PaginationPrevious
            onClick={() => {
              if ((currentPage ?? 1) > 1) {
                onPageChange?.((currentPage ?? 1) - 1);
              }
            }}
            className={cn(
              (currentPage ?? 1) <= 1 &&
                "pointer-events-none opacity-50"
            )}
          />

          <PaginationContent className="flex gap-2">
            {visiblePages.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={(currentPage ?? 1) === page}
                  onClick={() => onPageChange?.(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>

          <PaginationNext
            onClick={() => {
              if ((currentPage ?? 1) < totalPages) {
                onPageChange?.((currentPage ?? 1) + 1);
              }
            }}
            className={cn(
              (currentPage ?? 1) >= totalPages &&
                "pointer-events-none opacity-50"
            )}
          />
        </Pagination>
      )}
    </>
  );
}