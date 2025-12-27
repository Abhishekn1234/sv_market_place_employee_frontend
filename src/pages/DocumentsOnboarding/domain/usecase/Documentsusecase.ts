import type { DocumentsOnboarding } from "../entities/documentsonboarding";
import type { DocumentsRepo } from "../repositories/documentsonboardingrepo";
export class DocumentsOnboardingusecase{
 private documentsrepo:DocumentsRepo;
 constructor(documentsrepos:DocumentsRepo){
    this.documentsrepo=documentsrepos
 }
 async execute(data:DocumentsOnboarding){
     await this.documentsrepo.updateDocuments(data);
 }
}