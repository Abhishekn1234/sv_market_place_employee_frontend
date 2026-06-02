import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
  data-slot="textarea"
  className={cn(
    "w-full min-h-24 rounded-lg border border-slate-300 bg-white dark:bg-slate-950/50 px-3 py-3 text-base md:text-sm placeholder:text-slate-400 outline-none transition-all shadow-sm",
    "resize-none flex hover:border-slate-400",
    "focus-visible:border-blue-500 focus-visible:ring-[4px] focus-visible:ring-blue-500/10 focus-visible:shadow-md",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
    "disabled:cursor-not-allowed disabled:opacity-50",
    className
  )}
  {...props}
/>
  );
}

export { Textarea };
