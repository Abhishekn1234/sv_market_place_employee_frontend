import type { Activity } from "../../domain/entities/activity";
import type { ActivityStatus } from "../../domain/entities/activitystatus";

// Mock data spanning 6 months
export const generateMockActivities = (): Activity[] => {
  const activities: Activity[] = [];
  const now = new Date(2025, 11, 22); // December 22, 2025
  
  const templates = [
    { type: "booking" as const, title: "Home Cleaning Service", service: "cleaning" },
    { type: "booking" as const, title: "Plumbing Repair", service: "plumbing" },
    { type: "booking" as const, title: "Electrical Maintenance", service: "electrical" },
    { type: "booking" as const, title: "HVAC Installation", service: "hvac" },
    { type: "booking" as const, title: "Lawn Maintenance", service: "lawn" },
    { type: "booking" as const, title: "Painting Service", service: "painting" },
    { type: "booking" as const, title: "Carpentry Work", service: "carpentry" },
    { type: "payment" as const, title: "Payment Received", service: "payment" },
    { type: "transaction" as const, title: "Service Commission", service: "commission" },
  ];
  
  const clients = ["Sarah Johnson", "Michael Chen", "Emma Wilson", "David Martinez", "Lisa Anderson", "Robert Taylor", "Jessica Brown", "Tom Harris", "Alice Cooper", "James White"];
  const locations = ["123 Oak Street", "456 Maple Ave", "789 Pine Road", "321 Birch Lane", "654 Cedar Court", "987 Elm Drive"];
  
  // Generate activities for the past 6 months
  for (let i = 0; i < 60; i++) {
    const daysAgo = Math.floor(i * 3.2); // Spread across ~180 days
    const template = templates[Math.floor(Math.random() * templates.length)];
    const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    timestamp.setHours(Math.floor(Math.random() * 16) + 8); // 8 AM to 11 PM
    timestamp.setMinutes(Math.floor(Math.random() * 60));
    
    const statuses: ActivityStatus[] = ["completed", "completed", "completed", "completed", "pending", "cancelled"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const activity: Activity = {
      id: `activity-${i}`,
      type: template.type,
      title: template.title,
      description: `${template.title} - Professional service provided`,
      timestamp,
      status,
      amount: status !== "cancelled" ? Math.floor(Math.random() * 500) + 50 : 0,
      client: template.type === "booking" || template.type === "payment" ? clients[Math.floor(Math.random() * clients.length)] : undefined,
      location: template.type === "booking" ? `${locations[Math.floor(Math.random() * locations.length)]}, City` : undefined
    };
    
    activities.push(activity);
  }
  
  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};