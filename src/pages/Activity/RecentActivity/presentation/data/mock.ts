import type { Activity } from "../../domain/entities/activity";

export const mockActivities: Activity[] = [
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