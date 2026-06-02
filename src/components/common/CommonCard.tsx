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
  value?: string | number | ReactNode;
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
    <Card className={cn("mb-4 sm:mb-6 overflow-hidden gap-0", className)}>
      {/* 🔹 Header */}
      {(title || description) && (
        <CardHeader
          className={cn("border-b border-slate-100 bg-slate-50/30 px-5 py-4", alignClass)}
        >
          {title && (
            <CardTitle className="text-base font-bold text-slate-900 leading-tight">
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className="text-xs text-slate-500 mt-1">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}

      {/* 🔹 Unified Content Area (Label, Value & Children) */}
      {(label || value || children) && (
        <CardContent className={cn("p-5", alignClass, contentClassName)}>
          <div className="space-y-4">
            {(label || value) && (
              <div className="space-y-1">
                {label && (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {label}
                  </p>
                )}
                {value && (
                  <div className="text-lg font-semibold text-blue-600">
                    {value}
                  </div>
                )}
              </div>
            )}
            {children}
          </div>
        </CardContent>
      )}

      {/* 🔹 Footer */}
      {footer && (
        <CardFooter className={cn("border-t border-slate-100 bg-slate-50/30 px-5 py-4", alignClass)}>
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
