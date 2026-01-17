"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

/* ================= ROOT ================= */
function CommonModal({
  open,
  onOpenChange,
  children,
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
}

/* ================= TRIGGER ================= */
function CommonModalTrigger(
  props: React.ComponentProps<typeof DialogPrimitive.Trigger>
) {
  return <DialogPrimitive.Trigger {...props} />;
}

/* ================= OVERLAY ================= */
function CommonModalOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

/* ================= CONTENT ================= */
function CommonModalContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <CommonModalOverlay />
      <DialogPrimitive.Content
        className={cn(
          /* Position */
          "fixed left-1/2 top-1/2 z-50",
          "-translate-x-1/2 -translate-y-1/2",

          /* Responsive size */
          "w-[95vw] sm:w-full",
          "max-w-lg",
          "max-h-[90dvh]",

          /* Layout */
          "flex flex-col",

          /* Style */
          "rounded-2xl border bg-background shadow-2xl",
          "focus:outline-none",

          /* Animations */
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",

          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/* ================= HEADER ================= */
function CommonModalHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "shrink-0",
        className
      )}
      {...props}
    />
  );
}

/* ================= BODY ================= */
function CommonModalBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto",
        className
      )}
      {...props}
    />
  );
}

/* ================= FOOTER ================= */
function CommonModalFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "shrink-0",
        className
      )}
      {...props}
    />
  );
}

/* ================= EXPORT WITH NAMESPACE ================= */
CommonModal.Trigger = CommonModalTrigger;
CommonModal.Content = CommonModalContent;
CommonModal.Header = CommonModalHeader;
CommonModal.Body = CommonModalBody;
CommonModal.Footer = CommonModalFooter;

export { CommonModal };
