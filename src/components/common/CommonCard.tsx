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
    <Card className={cn("mb-6", className)}>
      {(title || description) && (
        <CardHeader className={cn(headerAlign === "right" ? "text-right" : "text-left")}>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}

      {(label || value) && (
        <CardContent className={cn("pt-4", contentClassName)}>
          {label && <p className="text-sm text-gray-500 mb-1">{label}</p>}
          {value && <p className="font-medium text-blue-600">{value}</p>}
        </CardContent>
      )}

      {children && (
        <CardContent className={cn(contentClassName)}>
          {children}
        </CardContent>
      )}
    </Card>
  );
}
