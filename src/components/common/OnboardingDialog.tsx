"use client";

import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
// import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/presentation/components/LanguageContext";

export type OnboardingStep = {
  id: string;
  title?: string;
  description?: string;
  done: boolean;
  optional?: boolean;
  route?: string;
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
  const navigate = useNavigate();
  const { t } = useLanguage();

  const doneCount = steps.filter((s) => s.done).length;
  const progress = steps.length > 0 ? (doneCount / steps.length) * 100 : 0;
  const allDone = doneCount === steps.length;
  const currentStep = steps.find((s) => !s.done);

  // FIX: navigate first, then close dialog — avoids the dialog unmount
  // swallowing the navigation call.
  const handleStepClick = (route: string | undefined) => {
    if (!route) return;
    navigate(route);
    // Small defer so navigation registers before the dialog unmounts
    setTimeout(() => onOpenChange(false), 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          // Size & position
          "w-[calc(100vw-16px)] sm:w-[92vw] max-w-lg",
          "max-h-[92vh] overflow-hidden",
          // Shape
          "rounded-2xl sm:rounded-3xl",
          // Reset default padding so we control it section-by-section
          "p-0",
          // Surface
          "bg-white dark:bg-gray-950",
          "border border-gray-100 dark:border-gray-800",
          "shadow-2xl shadow-black/10 dark:shadow-black/50"
        )}
      >
        <div className="flex flex-col max-h-[92vh]">

          {/* ── HEADER ── */}
          <div className="relative overflow-hidden shrink-0 px-5 sm:px-7 py-5 sm:py-7">
            {/* Background gradient blobs */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-violet-600 via-blue-600 to-indigo-700"
            />
            <div
              aria-hidden
              className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl"
            />
            <div
              aria-hidden
              className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-indigo-400/20 blur-2xl"
            />

            <DialogHeader className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-yellow-300 shrink-0" />
                <span className="text-xs font-semibold text-white/70 uppercase tracking-widest">
                  {t("onboarding.label") ?? "Getting started"}
                </span>
              </div>

              <DialogTitle className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                {allDone ? t("onboarding.doneTitle") : t("onboarding.title")}
              </DialogTitle>

              <DialogDescription className="mt-1.5 text-sm text-blue-100/80">
                {t("onboarding.description")}
              </DialogDescription>
            </DialogHeader>

            {/* Progress bar in header */}
            <div className="relative z-10 mt-5">
              <div className="flex items-center justify-between text-xs text-white/70 mb-2">
                <span className="font-medium">{t("onboarding.progress")}</span>
                <span>
                  {doneCount}
                  <span className="opacity-50">/{steps.length}</span>
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── BODY ── */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 sm:py-6 space-y-3">
            {steps.map((step, index) => {
              const isCurrent = !step.done && currentStep?.id === step.id;

              return (
                <div
                  key={step.id}
                  className={cn(
                    "group relative rounded-xl sm:rounded-2xl border transition-all duration-200",
                    "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700/60",
                    step.done &&
                      "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50",
                    isCurrent &&
                      "bg-white dark:bg-gray-900 border-violet-300 dark:border-violet-700 shadow-sm shadow-violet-100 dark:shadow-violet-900/30",
                    !step.done &&
                      !isCurrent &&
                      "hover:border-gray-300 dark:hover:border-gray-600"
                  )}
                >
                  <div className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4">

                    {/* Step icon */}
                    <div className="mt-0.5 shrink-0">
                      {step.done ? (
                        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 flex items-center justify-center",
                            "text-[11px] sm:text-xs font-bold transition-colors",
                            isCurrent
                              ? "border-violet-500 dark:border-violet-400 text-violet-600 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/30"
                              : "border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                          )}
                        >
                          {index + 1}
                        </div>
                      )}
                    </div>

                    {/* Text content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={cn(
                            "text-sm sm:text-base font-semibold leading-snug break-words",
                            step.done
                              ? "text-emerald-700 dark:text-emerald-400"
                              : isCurrent
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-700 dark:text-gray-300"
                          )}
                        >
                          {step.title}
                        </h3>
                        {step.optional && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 shrink-0">
                            {t("onboarding.optional") ?? "Optional"}
                          </span>
                        )}
                      </div>

                      {step.description && (
                        <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-words leading-relaxed">
                          {step.description}
                        </p>
                      )}

                      <div className="mt-3">
                        {step.done ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {t("onboarding.completed")}
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant={isCurrent ? "default" : "outline"}
                            className={cn(
                              "h-9 px-4 text-xs sm:text-sm font-medium rounded-lg w-full sm:w-auto",
                              "transition-all duration-150",
                              isCurrent &&
                                "bg-violet-600 hover:bg-violet-700 text-white border-0 shadow-sm shadow-violet-200 dark:shadow-violet-900/40"
                            )}
                            onClick={() => handleStepClick(step.route)}
                          >
                            {t("onboarding.completenow")}
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ── ALL DONE STATE ── */}
            {allDone && (
              <div className="mt-2 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/50 p-5 text-center">
                <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm sm:text-base font-semibold text-emerald-700 dark:text-emerald-400">
                  {t("onboarding.finished")}
                </p>
                <p className="mt-1 text-xs text-emerald-600/70 dark:text-emerald-500">
                  {t("onboarding.finishedSubtext") ?? "You're all set and ready to go."}
                </p>
                <Button
                  className="mt-4 h-10 px-6 w-full sm:w-auto rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                  onClick={() => onOpenChange(false)}
                >
                  {t("common.close")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}