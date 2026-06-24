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
  variant?: "default" | "ghost" | "outline" | "elevated";
  noPadding?: boolean;
  hoverable?: boolean;
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
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
  variant = "default",
  noPadding = false,
  hoverable = false,
  shadow,
}: CommonCardProps) {
  // ✅ single source of truth for alignment
  const alignClass =
    headerAlign === "right" || isRTL ? "text-right" : "text-left";

  const variantClasses = {
    default: "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800",
    elevated: "bg-white dark:bg-slate-900 border-none shadow-md",
    ghost: "bg-transparent shadow-none border-none",
    outline: "bg-transparent shadow-none border border-slate-200 dark:border-slate-800",
  };

  const shadowClasses = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  return (
    <Card className={cn(
      "mb-4 sm:mb-6 overflow-hidden gap-0 transition-all duration-300", 
      variantClasses[variant],
      shadow ? shadowClasses[shadow] : (variant === "default" ? "shadow-sm" : ""),
      hoverable && "hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-0.5",
      className
    )}>
      {/* 🔹 Header */}
      {(title || description) && (
        <CardHeader
          className={cn("border-b border-slate-100/50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-800/50 px-5 py-4", alignClass)}
        >
          {title && (
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}

      {/* 🔹 Unified Content Area (Label, Value & Children) */}
    {(label || value || children) && (
  <CardContent
    className={cn(
      noPadding ? "p-0" : "p-5 sm:p-6",
      // Only add space-y-4 when there's actual label/value to stack
      (label || value) ? "space-y-4" : "",
      alignClass,
      contentClassName
    )}
  >
    {(label || value) && (
      <div className="space-y-1">
        {label && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {label}
          </p>
        )}
        {value && (
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {value}
          </div>
        )}
      </div>
    )}
    {children}
  </CardContent>
)}

      {/* 🔹 Footer */}
      {footer && (
        <CardFooter className={cn("border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/50 px-5 py-4", alignClass)}>
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
