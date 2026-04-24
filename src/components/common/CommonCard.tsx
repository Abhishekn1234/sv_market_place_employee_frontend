"use client";

import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CommonCardProps {
  title?: string | ReactNode;
  headerAlign?: "left" | "right";
  children?: ReactNode;
  value?: string | number;
  label?: string;
  description?: string | ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
  isRTL?: boolean;
}

export function CommonCard({
  title,
  headerAlign = "left",
  children,
  description,
  label,
  value,
  footer,
  className,
  contentClassName,
  isRTL = false,
}: CommonCardProps) {
  // ✅ single source of truth for alignment
  const alignClass =
    headerAlign === "right" || isRTL ? "text-right" : "text-left";

  return (
    <Card className={cn("mb-4 sm:mb-6", className)}>
      
      {/* 🔹 Header */}
      {(title || description) && (
        <CardHeader
          className={cn(
            "px-4 py-3 sm:px-6 sm:py-4",
            alignClass
          )}
        >
          {title && (
            <CardTitle className="text-base sm:text-lg font-semibold">
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className="text-xs sm:text-sm">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}

      {/* 🔹 Label + Value */}
      {(label || value) && (
        <CardContent
          className={cn(
            "px-4 pt-2 sm:px-6 sm:pt-4",
            alignClass,
            contentClassName
          )}
        >
          {label && (
            <p className="text-xs sm:text-sm text-gray-500 mb-1">
              {label}
            </p>
          )}
          {value && (
            <p className="text-sm sm:text-base font-medium text-blue-600">
              {value}
            </p>
          )}
        </CardContent>
      )}

      {/* 🔹 Children */}
      {children && (
        <CardContent
          className={cn(
            "px-4 pb-4 sm:px-6 sm:pb-6",
            alignClass,
            contentClassName
          )}
        >
          {children}
        </CardContent>
      )}

      {/* 🔹 Footer */}
      {footer && (
        <CardFooter
          className={cn(
            "px-4 pb-4 sm:px-6 sm:pb-6",
            alignClass
          )}
        >
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
