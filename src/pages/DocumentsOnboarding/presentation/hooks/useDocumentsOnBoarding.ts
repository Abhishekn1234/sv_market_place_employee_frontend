"use client";

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
    DocumentsOnboardingResponse,
    any,
    DocumentsOnboarding
  >({
    mutationFn: (payload) => usecase.execute(payload),

    onSuccess: (response) => {
      console.log(response);

      const documents = response.user?.documents ?? [];

      if (documents.length > 0) {
        useAuthStore.getState().updateUserProfile({
          documents,
          // isOnboarded: true, // ✅ ADD THIS
        });
      }

      queryClient.setQueryData(["profile"], (old: any) => ({
        ...old,
        documents,
      }));

      toast.success("Documents uploaded successfully");

      // ✅ FINAL NAVIGATION AFTER FULL ONBOARDING
      navigate("/");
    },

    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      toast.error(message);
    },
  });
}