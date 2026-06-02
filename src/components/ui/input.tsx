import * as React from "react";
import { cn } from "./utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <input
      ref={ref}                       // ✅ forward ref
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-slate-400 selection:bg-primary selection:text-primary-foreground dark:bg-slate-950/50 border-slate-300 flex h-10 w-full min-w-0 rounded-lg border px-3 py-2 text-base bg-white transition-all outline-none",
        "shadow-sm hover:border-slate-400 hover:shadow-md",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-blue-500 focus-visible:ring-[4px] focus-visible:ring-blue-500/10 focus-visible:shadow-md",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
)}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
