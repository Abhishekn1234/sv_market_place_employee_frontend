import { useLanguage } from "@/context/LanguageContext";
import { Users, Briefcase, CreditCard, Bell } from "lucide-react";

export const useHomeCards = () => {
  const { translations } = useLanguage();
  const homeTranslations = translations.HomePage;

  return [
    {
      title: homeTranslations.totalEmployees,
      value: "128",
      icon: Users,
      bg: "bg-indigo-100",
      text: "text-indigo-100",
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
      text: "text-yellow-100",
    },
    {
      title: homeTranslations.notifications,
      value: "9",
      icon: Bell,
      bg: "bg-red-100",
      text: "text-red-600",
    },
  ];
};
