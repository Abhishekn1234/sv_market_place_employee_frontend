import type { EmployeeUser } from "@/core/store/auth";
import type { ApiDocument } from "@/pages/Profile/domain/entities/documents";

export interface DocumentsOnboarding{
    documents?:ApiDocument[]
}
export interface DocumentsOnboardingResponse {
  user?: EmployeeUser & {
    documents: ApiDocument[];
  };
}