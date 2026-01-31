
export type WorkStatus =
  | 'completed'
  | 'in-progress'
  | 'pending'
  | 'upcoming'
  | 'assigned'          // new
  | 'work-accepted'     // new (for WORKER_ACCEPTED)
  | 'work-cancelled'    // new (for WORK_CANCELLED)
  | 'in Progress'
  | 'In Progress'
  | 'in-Progress'
  | 'in progress';
