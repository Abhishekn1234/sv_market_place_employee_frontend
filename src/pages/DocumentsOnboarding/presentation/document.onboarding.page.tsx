"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { 
  FileText, 
  Image as ImageIcon, 
  ArrowRight,
  // Loader2,
  X,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useDocumentsOnBoarding } from "./hooks/useDocumentsOnBoarding";
import type { ApiDocument } from "@/pages/Profile/domain/entities/documents";
import type { DocumentsOnboarding } from "../domain/entities/documentsonboarding";
import { useNavigate } from "react-router-dom";
import { CommonCard } from "@/components/common/CommonCard";
import CommonSpinner from "@/components/common/CommonSpinner";

type UploadDocument = ApiDocument & { file: File };

export default function DocumentOnboarding() {
  const [files, setFiles] = useState<Partial<Record<ApiDocument["documentType"], File>>>({});
  const mutation = useDocumentsOnBoarding();
  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: ApiDocument["documentType"]) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [type]: e.target.files![0] }));
    }
  };

  const removeFile = (type: ApiDocument["documentType"]) => {
    setFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[type];
      return newFiles;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (Object.keys(files).length === 0) return;

    const documentsData: DocumentsOnboarding = {
      documents: Object.entries(files)
        .filter(([_, file]) => file)
        .map(([type, file]) => ({
          _id: "",
          documentType: type as ApiDocument["documentType"],
          fileName: file!.name,
          filePath: "",
          filePublicId: "",
          fileType: file!.type,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          file: file!,
        })) as UploadDocument[],
    };

    mutation.mutate(documentsData);
  };

  const docTypes: { id: ApiDocument["documentType"]; label: string; icon: any; accept: string }[] = [
    { id: "idProof", label: "National ID Proof", icon: FileText, accept: ".pdf,image/*" },
    { id: "addressProof", label: "Address Proof", icon: FileText, accept: ".pdf,image/*" },
    { id: "photoProof", label: "Passport Size Photo", icon: ImageIcon, accept: "image/*" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col justify-start lg:justify-center items-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-6 lg:py-12">
      <CommonCard
        title="Document Onboarding"
        description="Upload the required documents to complete your profile verification."
        className="w-full max-w-2xl shadow-lg border-t-4 border-blue-600 p-4 sm:p-6 md:p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {docTypes.map((doc) => (
              <div
                key={doc.id}
                className={`relative group border-2 border-dashed rounded-xl p-4 transition-all duration-200 
                  ${files[doc.id]
                    ? "border-blue-500 bg-blue-50/30"
                    : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-lg ${files[doc.id] ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}
                  >
                    <doc.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-gray-900">{doc.label}</p>
                    {files[doc.id] ? (
                      <p className="text-xs sm:text-sm text-blue-600 truncate flex items-center gap-1 mt-1">
                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        {files[doc.id]?.name}
                      </p>
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">Supports PDF, PNG, JPG</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {files[doc.id] ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                        onClick={() => removeFile(doc.id)}
                      >
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    ) : (
                      <div className="relative">
                        <Button type="button" variant="outline" size="sm" className="pointer-events-none">
                          Select File
                        </Button>
                        <Input
                          type="file"
                          accept={doc.accept}
                          onChange={(e) => handleFileChange(e, doc.id)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-gray-700 order-2 sm:order-1"
            >
              Skip for now
            </Button>

            <Button
              type="submit"
              disabled={mutation.isPending || Object.keys(files).length === 0}
              className="w-full sm:w-auto px-8"
            >
              {mutation.isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <CommonSpinner/>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Complete Setup
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              )}
            </Button>
          </div>
        </form>
      </CommonCard>

      <p className="text-center text-xs sm:text-sm text-gray-400 mt-6">
        Your documents are encrypted and stored securely.
      </p>
    </div>
  );
}

