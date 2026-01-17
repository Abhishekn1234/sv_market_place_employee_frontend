"use client";

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
import React from "react";

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

  /** pagination */
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;

  /** layout */
  dir?: "ltr" | "rtl";
  emptyMessage?: string;

  /** optional row expansion */
  renderExpandedRow?: (row: T) => React.ReactNode;
  expandedRowKey?: string | null;
}

export function CommonTable<T>({
  columns,
  data,
  keyExtractor,
  currentPage,
  totalPages,
  onPageChange,
  dir = "ltr",
  emptyMessage = "No data found",
  renderExpandedRow,
  expandedRowKey,
}: CommonTableProps<T>) {
  return (
    <>
      <Table dir={dir}>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-6">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}

          {data.map((row) => {
            const rowKey = keyExtractor(row);

            return (
              <React.Fragment key={rowKey}>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render
                        ? col.render(row)
                        : (row as any)[col.key]}
                    </TableCell>
                  ))}
                </TableRow>

                {renderExpandedRow && expandedRowKey === rowKey && (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="bg-gray-50">
                      {renderExpandedRow(row)}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages && totalPages > 1 && onPageChange && currentPage && (
        <Pagination
          className={cn(
            "mt-6",
            dir === "rtl" ? "justify-start" : "justify-end"
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
