import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentsOnboardingImpl } from "../../data/repositories/DocumentsOnboardingImpl";
import { DocumentsOnboardingusecase } from "../../domain/usecase/Documentsusecase";
import type {
  DocumentsOnboarding,
  DocumentsOnboardingResponse,
} from "../../domain/entities/documentsonboarding";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/core/store/auth";

export function useDocumentsOnBoarding() {
  const repo = new DocumentsOnboardingImpl();
  const usecase = new DocumentsOnboardingusecase(repo);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<
    DocumentsOnboardingResponse, // ✅ CORRECT RESPONSE TYPE
    Error,
    DocumentsOnboarding           // ✅ REQUEST TYPE
  >({
    mutationFn: (payload) => usecase.execute(payload),

    onSuccess: (response) => {
      console.log(response);

      const documents = response.user?.documents ?? [];

      if (documents.length > 0) {
        useAuthStore
          .getState()
          .updateUserProfile({ documents });
      }

      // Update profile cache safely
      queryClient.setQueryData(["profile"], (old: any) => ({
        ...old,
        documents,
      }));

      navigate("/");
    },

    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });
}
