"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

import {
  CheckCircle2,
  // Circle,
  ArrowRight,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type OnboardingStep = {
  id: string;
  title: string;
  description?: string;
  actionLabel: string;
  done: boolean;
  optional?: boolean;
  onAction: () => void;
};

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  steps: OnboardingStep[];
}

export default function OnboardingDialog({
  open,
  onOpenChange,
  steps,
}: Props) {
  const doneCount = steps.filter((s) => s.done).length;

  const progress =
    steps.length > 0
      ? (doneCount / steps.length) * 100
      : 0;

  const allDone = doneCount === steps.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        {/* Header */}
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold">
            {allDone
              ? "You're all set 🎉"
              : "Complete your onboarding"}
          </DialogTitle>

          <DialogDescription>
            Finish the steps below to activate your account.
          </DialogDescription>
        </DialogHeader>

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              Progress
            </span>

            <span className="text-muted-foreground">
              {doneCount}/{steps.length} completed
            </span>
          </div>

          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps */}
        <div className="mt-6 space-y-4">
          {steps.map((step, index) => {
            const isCurrent =
              !step.done &&
              steps.find((s) => !s.done)?.id === step.id;

            return (
              <div
                key={step.id}
                className={cn(
                  "relative rounded-xl border p-4 transition-all",
                  step.done &&
                    "border-green-200 bg-green-50",
                  isCurrent &&
                    "border-primary shadow-sm"
                )}
              >
                <div className="flex gap-4">
                  {/* Step Icon */}
                  <div className="mt-1">
                    {step.done ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">
                        {step.title}
                      </h3>

                      {step.optional && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                          Optional
                        </span>
                      )}
                    </div>

                    {step.description && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    )}

                    {/* Action */}
                    <div className="mt-3">
                      <Button
                        size="sm"
                        variant={
                          step.done
                            ? "secondary"
                            : "default"
                        }
                        disabled={step.done}
                        onClick={step.onAction}
                        className="gap-2"
                      >
                        {step.done ? (
                          "Completed"
                        ) : (
                          <>
                            {step.actionLabel}
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {allDone && (
          <Button
            className="mt-6 w-full"
            onClick={() => onOpenChange(false)}
          >
            Finish Setup
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}