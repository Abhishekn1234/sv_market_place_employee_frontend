"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

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

function CommonModalTrigger(
  props: React.ComponentProps<typeof DialogPrimitive.Trigger>
) {
  return <DialogPrimitive.Trigger {...props} />;
}

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
          // Centering
          "fixed left-1/2 top-1/2 z-50",
          "-translate-x-1/2 -translate-y-1/2",

          // Width responsiveness
          "w-[95vw] sm:w-[90vw] md:w-full",
          "max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl",

          // Height safety
          "max-h-[90dvh] sm:max-h-[85vh]",

          // Layout
          "flex flex-col",

          // Styling
          "rounded-xl sm:rounded-2xl",
          "border bg-background shadow-2xl",
          "focus:outline-none",

          // Animations
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

function CommonModalHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        // Sticky header for long content
        "shrink-0",
        "px-4 py-3 sm:px-6 sm:py-4",
        "border-b",
        className
      )}
      {...props}
    />
  );
}

function CommonModalBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        // Scrollable content
        "flex-1 overflow-y-auto",
        "px-4 py-3 sm:px-6 sm:py-4",
        className
      )}
      {...props}
    />
  );
}

function CommonModalFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        // Sticky footer for actions
        "shrink-0",
        "px-4 py-3 sm:px-6 sm:py-4",
        "border-t",
        "flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

CommonModal.Trigger = CommonModalTrigger;
CommonModal.Content = CommonModalContent;
CommonModal.Header = CommonModalHeader;
CommonModal.Body = CommonModalBody;
CommonModal.Footer = CommonModalFooter;

export { CommonModal };
