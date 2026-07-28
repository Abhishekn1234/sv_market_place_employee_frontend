import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/presentation/components/LanguageContext";
import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-12">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 group flex items-center gap-2 rounded-xl border-slate-300 bg-white hover:bg-slate-100"
      >
        <ArrowLeft
          size={18}
          className="transition-transform duration-300 group-hover:-translate-x-1"
        />
        {t("notFound.back") || "Go Back"}
      </Button>

      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="flex justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 rounded-full bg-red-100/30 blur-2xl animate-pulse" />
          </div>

          <div className="relative rounded-full bg-gradient-to-br from-red-50 to-red-100 p-8 shadow-lg shadow-red-200/50">
            <SearchX
              className="h-20 w-20 text-red-500"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* 404 */}
        <div className="relative mt-6">
          <h1 className="bg-gradient-to-r from-red-400 via-orange-400 to-red-500 bg-clip-text text-8xl font-extrabold tracking-tight text-transparent md:text-9xl">
            404
          </h1>

          <div className="absolute inset-0 -z-10 bg-red-400/10 blur-3xl" />
        </div>

        {/* Title */}
        <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">
          {t("notFound.title") || "Page Not Found"}
        </h2>

        {/* Description */}
        <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-gray-600 dark:text-gray-300">
          {t("notFound.description") ||
            "The page you're looking for doesn't exist or has been moved."}
        </p>

        {/* Decorative Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-gradient-to-r from-red-400 to-orange-400"
              style={{
                opacity: 0.6 + i * 0.2,
                animation: `pulse ${2 + i * 0.5}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        {/* Home Button */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-6 py-3.5 font-medium text-white shadow-lg shadow-sky-600/20 transition-all duration-300 hover:scale-105 hover:shadow-sky-600/40 active:scale-95"
          >
            <Home
              size={18}
              className="transition-transform duration-300 group-hover:rotate-[-10deg]"
            />
            {t("notFound.home") || "Go Home"}
          </Link>
        </div>
      </div>
    </div>
  );
}