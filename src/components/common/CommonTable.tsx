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

export function CommonTable<T>({
  columns,
  data,
  keyExtractor,
  currentPage,
  totalPages = 0,
  onPageChange,
  emptyMessage = "No data found",
  renderExpandedRow,
  expandedRowKey,
  isRTL = false,
}: CommonTableProps<T>) {
  const renderedColumns = isRTL ? [...columns].reverse() : columns;

  return (
    <>
      {/* TABLE WRAPPER */}
      <div className="w-full overflow-x-auto">
        <Table className={cn("min-w-full", isRTL && "direction-rtl")}>
          {/* HEADER (hidden on mobile) */}
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
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length || 1}
                  className="text-center py-6"
                >
                  {emptyMessage}
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
                            {/* MOBILE LABEL */}
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
      {totalPages > 1 && onPageChange && currentPage && (
        <Pagination
          className={cn(
            "mt-6 flex flex-wrap gap-2",
            isRTL ? "justify-start" : "justify-end"
          )}
          dir="ltr"
        >
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          />

          <PaginationContent>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => onPageChange(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>

          <PaginationNext
            onClick={() =>
              onPageChange(Math.min(currentPage + 1, totalPages))
            }
          />
        </Pagination>
      )}
    </>
  );
}
