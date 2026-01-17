
import type { DocumentsOnboarding, DocumentsOnboardingResponse } from "../entities/documentsonboarding";
import type { DocumentsRepo } from "../repositories/documentsonboardingrepo";
export class DocumentsOnboardingusecase{
 private documentsrepo:DocumentsRepo;
 constructor(documentsrepos:DocumentsRepo){
    this.documentsrepo=documentsrepos
 }
 async execute(data:DocumentsOnboarding):Promise<DocumentsOnboardingResponse> {
    return  await this.documentsrepo.updateDocuments(data);
 }

}