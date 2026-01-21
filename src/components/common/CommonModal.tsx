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
        
          "fixed left-1/2 top-1/2 z-50",
          "-translate-x-1/2 -translate-y-1/2",

         
          "w-[95vw] sm:w-full",
          "max-w-lg",
          "max-h-[90dvh]",

          
          "flex flex-col",

       
          "rounded-2xl border bg-background shadow-2xl",
          "focus:outline-none",

        
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
        "shrink-0",
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
        "flex-1 overflow-y-auto",
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
        "shrink-0",
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
