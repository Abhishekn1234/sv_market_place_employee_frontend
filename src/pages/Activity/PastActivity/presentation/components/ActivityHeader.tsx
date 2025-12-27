import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BarChart3, Download } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ActivityHeaderProps {
  employeeName: string;
  employeeId: string;
  showAnalytics: boolean;
  setShowAnalytics: (v: boolean) => void;
}

export default function ActivityHeader({
  employeeName,
  employeeId,
  showAnalytics,
  setShowAnalytics,
}: ActivityHeaderProps) {
  const{language,t}=useLanguage();
  const isRTL=language==="AR"
  return (
    <div className={` ${isRTL?"md:flex-row-reverse flex   md:items-start md:justify-between gap-4":"flex  md:flex-row md:items-start md:justify-between gap-4"}`}>
      {/* Left */}
      <div>
            <h1 className={`text-gray-900 mb-2`}>{t('pastActivity')}</h1>
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarFallback className="bg-blue-600 text-white">
                  {employeeName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-gray-900">{employeeName}</p>
                <p className="text-sm text-gray-500">{employeeId}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="size-4" />
            {t('export')}
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              <BarChart3 className="size-4" />
              {t('Analytics')}
            </Button>
          </div>
        </div>
      
    
  );
}
