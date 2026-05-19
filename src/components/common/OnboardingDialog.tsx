"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export type OnboardingStep = {
  id: string;
  title?: string;
  description?: string;
  done: boolean;
  optional?: boolean;
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
 const {t}=useLanguage();
  const progress =
    steps.length > 0 ? (doneCount / steps.length) * 100 : 0;

  const allDone = doneCount === steps.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-0 overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {allDone ? t("onboarding.doneTitle") : t("onboarding.title")}
            </DialogTitle>

            <DialogDescription className="mt-2 text-blue-100">
              {t("onboarding.description")}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">

          {/* PROGRESS */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{t("onboarding.progress")}</span>
              <span className="text-muted-foreground">
                {doneCount}/{steps.length}
              </span>
            </div>

            <Progress value={progress} className="h-2" />
          </div>

          {/* STEPS */}
          <div className="mt-6 space-y-4">
            {steps.map((step, index) => {
              const isCurrent =
                !step.done &&
                steps.find((s) => !s.done)?.id === step.id;

              return (
                <div
                  key={step.id}
                  className={cn(
                    "rounded-2xl border p-4 transition-all",
                    step.done && "bg-green-50 border-green-200",
                    isCurrent && "border-blue-500 shadow-md"
                  )}
                >
                  <div className="flex gap-4">

                    {/* ICON */}
                    <div className="mt-1">
                      {step.done ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <div className="h-7 w-7 flex items-center justify-center rounded-full border text-xs font-bold">
                          {index + 1}
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold">
                        {step.title}
                      </h3>

                      {step.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {step.description}
                        </p>
                      )}

                      <div className="mt-3">
                        {step.done ? (
                          <span className="text-xs text-green-600 font-medium">
                            {t("onboarding.completed")}
                          </span>
                        ) : (
                          <span className="text-xs text-blue-600 animate-pulse">
                            {t("onboarding.waiting")}
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* FINISH */}
          {allDone && (
            <div className="mt-6 rounded-2xl bg-green-50 border border-green-200 p-4 text-center">
              <p className="text-sm font-semibold text-green-700">
                {t("onboarding.finished")}
              </p>
            </div>
          )}
        </div>

      </DialogContent>
    </Dialog>
  );
}