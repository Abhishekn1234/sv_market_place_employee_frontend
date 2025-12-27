import type { Work } from "../../domain/entities/workhistory";

export const mockWorks: Work[] = [
  {
    id: '1',
    title: 'HVAC System Installation',
    description: 'Install new HVAC system in Building A, 3rd floor',
    assignedDate: '2024-12-15',
    dueDate: '2024-12-20',
    status: 'in-progress',
    duration: 16,
    priority: 'high',
    location: 'Building A - Floor 3'
  },
  {
    id: '2',
    title: 'Electrical Wiring Inspection',
    description: 'Routine inspection of electrical wiring in office wing',
    assignedDate: '2024-12-10',
    dueDate: '2024-12-14',
    status: 'completed',
    duration: 8,
    priority: 'medium',
    location: 'Office Wing'
  },
  {
    id: '3',
    title: 'Plumbing Repair',
    description: 'Fix water leakage in restroom facilities',
    assignedDate: '2024-12-18',
    dueDate: '2024-12-19',
    status: 'pending',
    duration: 4,
    priority: 'high',
    location: 'Building B - Restrooms'
  },
  {
    id: '4',
    title: 'Maintenance Check',
    description: 'Monthly maintenance check for all equipment',
    assignedDate: '2024-12-08',
    dueDate: '2024-12-12',
    status: 'completed',
    duration: 12,
    priority: 'low',
    location: 'All Buildings'
  },
  {
    id: '5',
    title: 'Fire Safety System Upgrade',
    description: 'Upgrade fire alarm and sprinkler system',
    assignedDate: '2024-12-22',
    dueDate: '2024-12-28',
    status: 'upcoming',
    duration: 20,
    priority: 'high',
    location: 'Building C'
  },
  {
    id: '6',
    title: 'Flooring Installation',
    description: 'Install new flooring in conference room',
    assignedDate: '2024-12-25',
    dueDate: '2024-12-30',
    status: 'upcoming',
    duration: 16,
    priority: 'medium',
    location: 'Conference Room 2A'
  },
  {
    id: '7',
    title: 'Window Replacement',
    description: 'Replace broken windows in storage area',
    assignedDate: '2024-12-05',
    dueDate: '2024-12-08',
    status: 'completed',
    duration: 6,
    priority: 'medium',
    location: 'Storage Area'
  },
  {
    id: '8',
    title: 'Paint Touch-up',
    description: 'Touch-up paint work in lobby area',
    assignedDate: '2024-12-16',
    dueDate: '2024-12-21',
    status: 'in-progress',
    duration: 10,
    priority: 'low',
    location: 'Main Lobby'
  }
];