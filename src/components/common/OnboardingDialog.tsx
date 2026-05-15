"use client";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export type OnboardingStep = {
  id: string;
  label: string;
  description?: string;
  actionLabel: string;
  done: boolean;
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
    steps.length > 0 ? (doneCount / steps.length) * 100 : 0;

  const allDone = doneCount === steps.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {allDone ? "You're all set 🎉" : "Complete your setup"}
          </DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={progress} />

          <p className="text-xs text-gray-500">
            {doneCount} of {steps.length} completed
          </p>
        </div>

        {/* Steps */}
        <div className="mt-4 space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex items-center justify-between border rounded-lg p-3"
            >
              <div>
                <p className="text-sm font-medium flex items-center gap-2">
                  {step.done && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                  {step.label}
                </p>

                {step.description && (
                  <p className="text-xs text-gray-500">
                    {step.description}
                  </p>
                )}
              </div>

              <Button
                size="sm"
                variant={step.done ? "secondary" : "default"}
                disabled={step.done}
                onClick={step.onAction}
              >
                {step.done ? "Done" : step.actionLabel}
              </Button>
            </div>
          ))}
        </div>

        {allDone && (
          <Button
            className="w-full mt-4"
            onClick={() => onOpenChange(false)}
          >
            Finish
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}