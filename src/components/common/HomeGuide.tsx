"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Sparkles, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "../ui/button";
interface Props {
  open: boolean;
  onClose: () => void;
}

export default function HeaderGuide({ open, onClose }: Props) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="fixed top-20 right-6 z-[9999]"
        >

          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md rounded-3xl border bg-white p-5 shadow-2xl">

            {/* ARROW pointing to header */}
            <div className="absolute -top-8 right-10">
              <ArrowUpRight className="h-10 w-10 text-blue-600 animate-bounce" />
            </div>

            {/* CLOSE */}
            <Button
              onClick={onClose}
              className="absolute right-3 top-3 text-gray-400 hover:text-black"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* CONTENT */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold">
                  {t("onboarding.title")}
                </h3>
              </div>

              <p className="text-xs text-gray-500">
                {t("onboarding.description")}
              </p>

              <div className="mt-4 space-y-2 text-xs">
                <p>• {t("onboarding.progress")}</p>
                <p>• {t("onboarding.completed")}</p>
                <p>• {t("onboarding.waiting")}</p>
              </div>

              <Button
                onClick={onClose}
                className="mt-4 w-full rounded-xl bg-blue-600 text-white py-2 text-sm"
              >
                {t("onboarding.doneTitle")}
              </Button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}