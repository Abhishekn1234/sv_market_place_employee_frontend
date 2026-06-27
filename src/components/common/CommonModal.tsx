"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

/* =========================
   ROOT
========================= */

type CommonModalProps = React.ComponentProps<typeof DialogPrimitive.Root> & {
  onOpenChange?: (open: boolean) => void;
};

function CommonModal({
  open,
  onOpenChange,
  children,
  ...props
}: CommonModalProps) {
  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(value) => onOpenChange?.(value)}
      {...props}
    >
      {children}
    </DialogPrimitive.Root>
  );
}

/* =========================
   TRIGGER
========================= */

function CommonModalTrigger(
  props: React.ComponentProps<typeof DialogPrimitive.Trigger>
) {
  return <DialogPrimitive.Trigger {...props} />;
}

/* =========================
   OVERLAY
========================= */

const CommonModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));

CommonModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

/* =========================
   CONTENT
========================= */

const CommonModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <CommonModalOverlay />

    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50",
        "-translate-x-1/2 -translate-y-1/2",
        "w-[calc(100vw-1.5rem)]",
        "max-w-[calc(100vw-1.5rem)]",
        "sm:max-w-lg md:max-w-xl lg:max-w-2xl",
        "max-h-[90dvh]",
        "flex flex-col overflow-hidden",
        "rounded-xl sm:rounded-2xl",
        "border bg-background shadow-2xl",
        "data-[state=open]:animate-in",
        "data-[state=closed]:animate-out",
        "data-[state=open]:zoom-in-95",
        "data-[state=closed]:zoom-out-95",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

CommonModalContent.displayName = DialogPrimitive.Content.displayName;

/* =========================
   TITLE
========================= */

const CommonModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
));

CommonModalTitle.displayName = DialogPrimitive.Title.displayName;

/* =========================
   DESCRIPTION
========================= */

const CommonModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

CommonModalDescription.displayName =
  DialogPrimitive.Description.displayName;

/* =========================
   HEADER
========================= */

function CommonModalHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative shrink-0 border-b",
        "px-4 sm:px-6 py-3 sm:py-4",
        className
      )}
      {...props}
    >
      {children}

      {/* Proper Radix close (NO manual onClose) */}
      <DialogPrimitive.Close asChild>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "absolute right-3 top-3",
            "sm:right-4 sm:top-4",
            "h-9 w-9 p-0",
            "flex items-center justify-center"
          )}
        >
          <X className="h-4 w-4" />
        </Button>
      </DialogPrimitive.Close>
    </div>
  );
}

/* =========================
   BODY
========================= */

function CommonModalBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex-1 min-h-0 overflow-y-auto",
        "px-4 sm:px-6 py-3 sm:py-4",
        className
      )}
      {...props}
    />
  );
}

/* =========================
   FOOTER
========================= */

function CommonModalFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "shrink-0 border-t",
        "px-4 sm:px-6 py-3 sm:py-4",
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:items-center gap-2 sm:gap-3 w-full",
        className
      )}
      {...props}
    />
  );
}

/* =========================
   EXPORTS
========================= */

CommonModal.Trigger = CommonModalTrigger;
CommonModal.Content = CommonModalContent;
CommonModal.Header = CommonModalHeader;
CommonModal.Body = CommonModalBody;
CommonModal.Footer = CommonModalFooter;
CommonModal.Title = CommonModalTitle;
CommonModal.Description = CommonModalDescription;

export { CommonModal };