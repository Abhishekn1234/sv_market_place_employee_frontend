
import { useLanguage } from "@/context/LanguageContext";

export default function BookingHeader() {
  const { translations, language } = useLanguage();
  const isRTL = language === "AR";

  return (
    <div className={isRTL ? "text-right" : "text-left"}>
      <h1 className="text-2xl font-semibold">
        {translations.currentBookings?.title}
      </h1>
      <p className="text-sm text-muted-foreground">
        {translations?.currentBookings?.subtitle}
      </p>
    </div>
  );
}
