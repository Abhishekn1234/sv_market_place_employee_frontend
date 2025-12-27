import api from "@/api/api";
import type { DocumentsOnboarding } from "../../domain/entities/documentsonboarding";
import type { DocumentsRepo } from "../../domain/repositories/documentsonboardingrepo";
import { baseURL } from "@/api/apiConfig";

export class DocumentsOnboardingImpl implements DocumentsRepo {
  async updateDocuments(
    data: DocumentsOnboarding
  ): Promise<DocumentsOnboarding> {
    const formData = new FormData();

    // ✅ append ONLY selected document types
    data.documents?.forEach((doc: any) => {
      if (
        doc.documentType === "idProof" ||
        doc.documentType === "addressProof" ||
        doc.documentType === "photoProof"
      ) {
        // doc.file should be a File or Blob from input
        formData.append(doc.documentType, doc.file);
      }
    });

    const response = await api.put(
      `${baseURL}user/update-profile`,
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
