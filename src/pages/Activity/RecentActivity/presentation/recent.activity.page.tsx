import { mockActivities } from "./data/mock";
import { ActivityHeader } from "./components/ActivityHeader";
import { ActivityStats

 } from "./components/ActivityStats";
 import { ActivityTimeline } from "./components/ActivityTimeline";
export default function RecentActivity() {
  const totalEarnings = mockActivities
    .filter(a => a.status === "completed" && a.amount)
    .reduce((s, a) => s + (a.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto space-y-6">
        <ActivityHeader
          employeeName="John Doe"
          employeeId="EMP-2024-001"
          totalEarnings={totalEarnings}
          completedBookings={mockActivities.filter(
            a => a.type === "booking" && a.status === "completed"
          ).length}
        />

        <ActivityStats activities={mockActivities} />
        <ActivityTimeline activities={mockActivities} />
      </div>
    </div>
  );
}
