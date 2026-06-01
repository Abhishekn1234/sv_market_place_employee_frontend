import type { TableHeaders } from "./tableheadertypes";


export type BookingHistoryTranslations = {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  statusPlaceholder: string;
  servicePlaceholder: string;
  noBookings: string;
  clientInfo: string;
  bookingDetails: string;
  notes: string;
  filteredBookings: string;
  filters:string;
  statusOptions: Record<string, string>;
  serviceOptions: Record<string, string>;
  stats: Record<string, string>;
  tableHeaders: TableHeaders;
  actions: {
  "View Details": string;
  Accept: string;
  Ignore: string;
};
  detailsLabels: Record<string, string>;
  expandedRow:Record<string, string>;
};