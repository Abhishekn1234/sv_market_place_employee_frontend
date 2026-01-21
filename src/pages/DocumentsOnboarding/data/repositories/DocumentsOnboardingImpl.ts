import api from "@/api/api";
import type { DocumentsOnboarding, DocumentsOnboardingResponse } from "../../domain/entities/documentsonboarding";
import type { DocumentsRepo } from "../../domain/repositories/documentsonboardingrepo";
import { baseURL } from "@/api/apiConfig";


export class DocumentsOnboardingImpl implements DocumentsRepo {
  async updateDocuments(
    data: DocumentsOnboarding
  ): Promise<DocumentsOnboardingResponse> {
    const formData = new FormData();

    
    data.documents?.forEach((doc: any) => {
      if (
        doc.documentType === "idProof" ||
        doc.documentType === "addressProof" ||
        doc.documentType === "photoProof"
      ) {
        
        formData.append(doc.documentType, doc.file);
      }
    });

    const response = await api.put(
      `${baseURL}/user/update-profile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  }
}
