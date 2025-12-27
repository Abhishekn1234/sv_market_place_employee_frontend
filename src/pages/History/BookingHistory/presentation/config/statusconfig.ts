import type { BookingStatus } from "../../domain/entities/bookingstatus";

export const statusConfig: Record<BookingStatus, { color: string; label: string }> = {
  completed: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Completed' },
  confirmed: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Confirmed' },
  cancelled: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Cancelled' },
  pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending' },
  'in-progress': { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'In Progress' },
};