import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  User,
  MapPin
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export type ActivityType = "booking" | "transaction" | "payment";
export type ActivityStatus = "completed" | "pending" | "cancelled" | "confirmed";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  status: ActivityStatus;
  amount?: number;
  client?: string;
  location?: string;
}

interface RecentActivityProps {
  employeeName?: string;
  employeeId?: string;
}

// Mock data for demonstration
const mockActivities: Activity[] = [
  {
    id: "1",
    type: "booking",
    title: "Home Cleaning Service",
    description: "Completed 3-hour deep cleaning service at residential property",
    timestamp: new Date(2025, 11, 22, 14, 30),
    status: "completed",
    amount: 150,
    client: "Sarah Johnson",
    location: "123 Oak Street, Downtown"
  },
  {
    id: "2",
    type: "payment",
    title: "Payment Received",
    description: "Payment for plumbing repair service",
    timestamp: new Date(2025, 11, 22, 12, 15),
    status: "completed",
    amount: 280,
    client: "Michael Chen"
  },
  {
    id: "3",
    type: "booking",
    title: "Electrical Maintenance",
    description: "Scheduled inspection and wiring check",
    timestamp: new Date(2025, 11, 22, 10, 0),
    status: "confirmed",
    amount: 200,
    client: "Emma Wilson",
    location: "456 Maple Ave, Westside"
  },
  {
    id: "4",
    type: "transaction",
    title: "Service Commission",
    description: "Commission earned from last week's completed services",
    timestamp: new Date(2025, 11, 21, 16, 45),
    status: "completed",
    amount: 340
  },
  {
    id: "5",
    type: "booking",
    title: "HVAC Installation",
    description: "Air conditioning unit installation service",
    timestamp: new Date(2025, 11, 21, 9, 30),
    status: "completed",
    amount: 550,
    client: "David Martinez",
    location: "789 Pine Road, Eastside"
  },
  {
    id: "6",
    type: "payment",
    title: "Payment Pending",
    description: "Awaiting payment confirmation for carpentry work",
    timestamp: new Date(2025, 11, 20, 15, 20),
    status: "pending",
    amount: 420,
    client: "Lisa Anderson"
  },
  {
    id: "7",
    type: "booking",
    title: "Lawn Maintenance",
    description: "Regular lawn mowing and garden upkeep",
    timestamp: new Date(2025, 11, 20, 8, 0),
    status: "completed",
    amount: 90,
    client: "Robert Taylor",
    location: "321 Birch Lane, Northside"
  },
  {
    id: "8",
    type: "booking",
    title: "Painting Service - Cancelled",
    description: "Interior painting service - client rescheduled",
    timestamp: new Date(2025, 11, 19, 14, 0),
    status: "cancelled",
    amount: 0,
    client: "Jessica Brown"
  }
];

export default function RecentActivity({ 
  employeeName = "John Doe", 
  employeeId = "EMP-2024-001" 
}: RecentActivityProps) {
  
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "booking":
        return <Calendar className="size-5" />;
      case "transaction":
        return <TrendingUp className="size-5" />;
      case "payment":
        return <DollarSign className="size-5" />;
    }
  };

  const getStatusBadge = (status: ActivityStatus) => {
    const variants: Record<ActivityStatus, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      completed: { variant: "default", label: "Completed" },
      confirmed: { variant: "secondary", label: "Confirmed" },
      pending: { variant: "outline", label: "Pending" },
      cancelled: { variant: "destructive", label: "Cancelled" }
    };
    
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: ActivityStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="size-4 text-green-600" />;
      case "confirmed":
        return <CheckCircle2 className="size-4 text-blue-600" />;
      case "pending":
        return <Clock className="size-4 text-amber-600" />;
      case "cancelled":
        return <AlertCircle className="size-4 text-red-600" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const totalEarnings = mockActivities
    .filter(a => a.status === "completed" && a.amount)
    .reduce((sum, a) => sum + (a.amount || 0), 0);

  const completedBookings = mockActivities.filter(
    a => a.type === "booking" && a.status === "completed"
  ).length;
 const {language,t,translations}=useLanguage();
 const isRTL=language=="AR";
  return (
    <div className="min-h-screen bg-gray-50 p-1">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div  className={`flex items-start justify-between gap-6 ${
        isRTL ? "flex-row-reverse text-right" : "flex-row text-left"
      }`}>
          <div className="flex flex-col">
            <h1 className="text-gray-900 mb-2">{t('recentActivity')}</h1>
            <div   className={`flex items-center gap-3 ${
            isRTL ? "flex-row-reverse" : "flex-row"
          }`}>
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
          
          <div className={isRTL ? "text-left" : "text-right"}>
           <p className="text-sm text-gray-500 mb-1">
  {translations.recentActivities.emptyState.title}
</p>

            <p className="text-2xl text-gray-900">${totalEarnings.toFixed(2)}</p>
            <p className="text-sm text-gray-600">{completedBookings} services completed</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={`p-4 ${isRTL ? "md:order-3" : "md:order-1"}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="size-5 text-blue-600" />
              </div>
              <div>
               <p className="text-sm text-gray-600">
              {t("totalBookings")}
            </p>

                <p className="text-2xl text-gray-900">
                  {mockActivities.filter(a => a.type === "booking").length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className={`p-4 md:order-2`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('totalEarned')}</p>
                <p className="text-2xl text-gray-900">${totalEarnings}</p>
              </div>
            </div>
          </Card>
          
          <Card  className={`p-4 ${isRTL ? "md:order-1" : "md:order-3"}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('Pending')}</p>
                <p className="text-2xl text-gray-900">
                  {mockActivities.filter(a => a.status === "pending").length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Activity Timeline */}
        <Card className="p-6">
         <h2 className={`text-gray-900 mb-6 ${isRTL?"text-right":"text-left"}`}>
  {t("activityTimeline")}
</h2>

          
          <div className="space-y-4">
            {mockActivities.map((activity, index) => (
              <div key={activity.id} className="relative">
                {/* Timeline line */}
                {index !== mockActivities.length - 1 && (
                  <div className="absolute left-[21px] top-12 bottom-0 w-[2px] bg-gray-200" />
                )}
                
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={`
                    relative z-10 flex items-center justify-center size-11 rounded-full border-2 border-white
                    ${activity.type === "booking" ? "bg-blue-100 text-blue-600" : ""}
                    ${activity.type === "transaction" ? "bg-purple-100 text-purple-600" : ""}
                    ${activity.type === "payment" ? "bg-green-100 text-green-600" : ""}
                  `}>
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-gray-900">{activity.title}</h3>
                            {getStatusIcon(activity.status)}
                          </div>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(activity.status)}
                          {activity.amount !== undefined && activity.amount > 0 && (
                            <span className="text-green-600">${activity.amount}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5" />
                          {formatTimestamp(activity.timestamp)}
                        </span>
                        
                        {activity.client && (
                          <span className="flex items-center gap-1">
                            <User className="size-3.5" />
                            {activity.client}
                          </span>
                        )}
                        
                        {activity.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3.5" />
                            {activity.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
