"use client";

import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
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
  const progress =
    steps.length > 0 ? (doneCount / steps.length) * 100 : 0;

  const allDone = doneCount === steps.length;
  const currentStep = steps.find((s) => !s.done);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-[calc(100vw-16px)]
          sm:w-[95vw]
          max-w-xl
          max-h-[95vh]
          overflow-hidden
          rounded-xl
          sm:rounded-2xl
          md:rounded-3xl
          p-0
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
        "
      >
        <div className="flex flex-col max-h-[95vh]">
          {/* HEADER */}
          <div
            className="
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              px-4
              sm:px-6
              py-4
              sm:py-6
              text-white
              shrink-0
            "
          >
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold leading-tight">
                {allDone
                  ? t("onboarding.doneTitle")
                  : t("onboarding.title")}
              </DialogTitle>

              <DialogDescription className="mt-2 text-xs sm:text-sm text-blue-100">
                {t("onboarding.description")}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* PROGRESS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="font-medium text-gray-900 dark:text-white">
                  {t("onboarding.progress")}
                </span>

                <span className="text-gray-500 dark:text-gray-400 shrink-0">
                  {doneCount}/{steps.length}
                </span>
              </div>

              <Progress value={progress} className="h-2" />
            </div>

            {/* STEPS */}
            <div className="mt-6 space-y-4">
              {steps.map((step, index) => {
                const isCurrent =
                  !step.done && currentStep?.id === step.id;

                return (
                  <div
                    key={step.id}
                    className={cn(
                      "rounded-xl sm:rounded-2xl border p-3 sm:p-4 transition-all bg-white dark:bg-gray-900",
                      "border-gray-200 dark:border-gray-700",
                      step.done &&
                        "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
                      isCurrent &&
                        "border-blue-500 dark:border-blue-400 shadow-md"
                    )}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* ICON */}
                      <div className="mt-1 shrink-0">
                        {step.done ? (
                          <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                        ) : (
                          <div
                            className="
                              h-6
                              w-6
                              sm:h-7
                              sm:w-7
                              flex
                              items-center
                              justify-center
                              rounded-full
                              border
                              border-gray-300
                              dark:border-gray-600
                              text-[10px]
                              sm:text-xs
                              font-bold
                              text-gray-700
                              dark:text-gray-200
                            "
                          >
                            {index + 1}
                          </div>
                        )}
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white break-words">
                          {step.title}
                        </h3>

                        {step.description && (
                          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-words">
                            {step.description}
                          </p>
                        )}

                        <div className="mt-3">
                          {step.done ? (
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">
                              {t("onboarding.completed")}
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="
                                w-full
                                sm:w-auto
                                min-h-[40px]
                                text-xs
                                sm:text-sm
                              "
                              onClick={() => {
                                if (!step.route) return;

                                onOpenChange(false);
                                navigate(step.route);
                              }}
                            >
                              {t("onboarding.completenow")}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FINISHED STATE */}
            {allDone && (
              <div className="mt-6 rounded-xl sm:rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4 text-center">
                <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                  {t("onboarding.finished")}
                </p>

                <Button
                  className="mt-4 w-full sm:w-auto min-h-[42px]"
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