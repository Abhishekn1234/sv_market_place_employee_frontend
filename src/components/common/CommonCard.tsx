import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CommonCardProps {
  title?: string | ReactNode;
  headerAlign?: "left" | "right";
  children?: ReactNode;
  value?: string | number;
  label?: string;
  description?: string;
  className?: string;
  contentClassName?: string;
}

export function CommonCard({
  title,
  headerAlign = "left",
  children,
  description,
  label,
  value,
  className,
  contentClassName,
}: CommonCardProps) {
  return (
    <Card className={cn("mb-4 sm:mb-6", className)}>
      {(title || description) && (
        <CardHeader
          className={cn(
            "px-4 py-3 sm:px-6 sm:py-4",
            headerAlign === "right" ? "text-right" : "text-left"
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

      {(label || value) && (
        <CardContent
          className={cn(
            "px-4 pt-2 sm:px-6 sm:pt-4",
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

      {children && (
        <CardContent
          className={cn(
            "px-4 pb-4 sm:px-6 sm:pb-6",
            contentClassName
          )}
        >
          {children}
        </CardContent>
      )}
    </Card>
  );
}
