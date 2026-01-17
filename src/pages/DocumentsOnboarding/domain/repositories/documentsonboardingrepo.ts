
import type { DocumentsOnboarding, DocumentsOnboardingResponse } from "../entities/documentsonboarding";

export interface DocumentsRepo{
    updateDocuments(data:DocumentsOnboarding):Promise<DocumentsOnboardingResponse>
}