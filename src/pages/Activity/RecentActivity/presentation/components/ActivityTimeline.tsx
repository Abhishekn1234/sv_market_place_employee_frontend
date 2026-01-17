import type { Activity } from "../../domain/entities/activity";
import { ActivityItem } from "./ActivityItem";

export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  return (
    <div className="space-y-4">
      {activities.map(a => (
        <ActivityItem key={a.id} activity={a} />
      ))}
    </div>
  );
}
