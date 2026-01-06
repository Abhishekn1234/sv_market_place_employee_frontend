
import { Users, Briefcase, CreditCard, Bell } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";



export default function HomePage() {
  const { translations, language } = useLanguage();
  const homeTranslations = translations.HomePage;
  const isRTL = language === "AR";

  // Hook for updating worker status
 
  const cards = [
    {
      title: homeTranslations.totalEmployees,
      value: "128",
      icon: Users,
      bg: "bg-indigo-100",
      text: "text-indigo-600",
    },
    {
      title: homeTranslations.activeProjects,
      value: "24",
      icon: Briefcase,
      bg: "bg-green-100",
      text: "text-green-600",
    },
    {
      title: homeTranslations.monthlyRevenue,
      value: "₹4.8L",
      icon: CreditCard,
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },
    {
      title: homeTranslations.notifications,
      value: "9",
      icon: Bell,
      bg: "bg-red-100",
      text: "text-red-600",
    },
  ];

  return (
    <div className="p-4">
    

      {/* Page Title + Online Switch */}
      <div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
        <h1 className="text-2xl font-bold">{homeTranslations.dashboard}</h1>

   


      </div>

      {/* Cards Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${isRTL ? "rtl" : ""}`}>
        {(isRTL ? [...cards].reverse() : cards).map((card) => (
          <div key={card.title} className="rounded-5xl border bg-white p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>

              <div className={`h-12 w-12 flex items-center justify-center rounded-xl ${card.bg}`}>
                <card.icon className={`h-6 w-6 ${card.text}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
