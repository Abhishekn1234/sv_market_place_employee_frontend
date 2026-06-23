"use client";

import * as React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { cn } from "./utils";

interface InputProps
  extends Omit<React.ComponentProps<"input">, "onChange"> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      onChange,
      value,
      name,
      disabled,
      required,
      id,
      ...props
    },
    ref
  ) => {
    // Phone Input
  if (type === "tel") {
  return (
    <PhoneInput
      country="in"
      value={typeof value === "string" ? value : ""}
              onChange={(phone, country: any) => {
          const dialCode = country?.dialCode || "";

          const nationalNumber = phone.startsWith(dialCode)
            ? phone.slice(dialCode.length)
            : phone;

          const formattedPhone = `+${dialCode}-${nationalNumber}`;

          onChange?.({
            target: {
              name: name || "",
              value: formattedPhone,
            },
          } as React.ChangeEvent<HTMLInputElement>);
        }}
      inputProps={{
        id,
        name,
        required,
        disabled,
      }}
      containerClass="!w-full"
      inputClass="
        !w-full
        !h-10
        !rounded-lg
        !border
        !border-slate-300
        !pl-12
      "
    />
  );
}
    return (
      <input
        ref={ref}
        type={type}
        value={value}
        name={name}
        onChange={onChange}
        disabled={disabled}
        required={required}
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
  }
);

Input.displayName = "Input";

export { Input };