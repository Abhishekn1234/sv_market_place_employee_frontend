"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PageSizeSelect({
  value,
  onChange,
  t,
}: {
  value: number;
  onChange: (v: number) => void;
  t: any;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {t.rowsPerPage}
      </span>
      <Select
        value={String(value)}
        onValueChange={(v) => onChange(Number(v))}
      >
        <SelectTrigger className="w-[90px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[5, 10, 20, 100].map((n) => (
            <SelectItem key={n} value={String(n)}>
              {n}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
