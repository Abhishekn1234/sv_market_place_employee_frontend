import type { TableHeaders } from "./tableheadertypes";

export type WorkHistoryTranslations = {
  pageTitle: string;
  employeeLabel: string;
  cards: Record<string, string>;
  filters: {
    timePeriod: string;
    status: string;
    itemsPerPage: string;
    searchPlaceholder: string;
  };
  timeOptions: Record<string, string>;
  statusOptions: Record<string, string>;
  tableHeaders: TableHeaders;
  pagination: Record<string, string>;
  extraInfo: Record<string, string>;
  actions?:{
    cancel:string;
  };
};