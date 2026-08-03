export interface CurrentBookings {
  title: string;
  subtitle: string;
  filterStatus: string;
  noBookings: string;

  status: {
    all: string;
    pending: string;
    ongoing: string;
    completed: string;
    cancelled?: string; 
    confirmed: string;
    inProgress:string;
    requested:string;
    WORK_COMPLETED_PENDING?:string;
    workCompletedPending:string;
    IN_PROGRESS?:string;
    WORK_COMPLETED?:string;
    WORKER_ACCEPTED?:string;
    WORK_ACCEPTED?:string;
  };

  table: {
    service: string;
    customer: string;
    time: string;
    status: string;
    actions?: string; // optional
  };

  pagination: {
    previous: string;
    next: string;
    page: string;
    of: string;
  };
}
