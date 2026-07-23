// components/DetailRow.tsx
import React from "react";

type DetailRowProps = {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
};

export function DetailRow({ label, value, icon }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
      {icon && <div className="shrink-0 mt-0.5">{icon}</div>}
      <div className="flex-1 min-w-0">
        <span className="text-xs text-slate-400 block">{label}</span>
        <span className="text-sm font-medium text-slate-800 break-words block">
          {value ?? "—"}
        </span>
      </div>
    </div>
  );
}