export interface OngoingServiceLang {
  // Page and table
  title: string;        // Page title
  serviceId: string;    // Column: Service ID
  customer: string;     // Column: Customer
  location: string;     // Column: Location
  startDate: string;    // Column: Start Date
  status: string;       // Column: Status
  action: string;       // Column: Action
  view: string;         // Button: View
  noData: string;       // Empty table message

  // Filters translations
  filters: {
    all: string;         // "All"
    status: string;      // Status filter label
    location: string;    // Location filter label
    inProgress: string;  // Status option
    assigned: string;    // Status option
    paused: string;      // Status option
    completed: string;   // Status option
    rowsPerPage: string; // Label for rows per page selector
  };
}

