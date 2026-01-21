export interface Worker {
    categoryIds: string[];
    serviceTierIds: string[];
    status: "active" | "inactive" | "online" | "offline" | string;
}