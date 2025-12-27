import type { DocumentsOnboarding } from "../entities/documentsonboarding";

export interface DocumentsRepo{
    updateDocuments(data:DocumentsOnboarding):Promise<DocumentsOnboarding>
}