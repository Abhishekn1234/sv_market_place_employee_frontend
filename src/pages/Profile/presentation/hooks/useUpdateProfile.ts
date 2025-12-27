import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileRepoImplementation } from "../../data/repositories/ProfileImpl";
import { UpdateProfileUsecase } from "../../domain/usecase/UpdateProfileusecase";
import type {  ProfileUpdate } from "../../domain/entities/profile";

const repo = new ProfileRepoImplementation();
const usecase = new UpdateProfileUsecase(repo);

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => usecase.execute(data),

    onSuccess: (updatedProfile) => {
      // console.log("Updated profile:", updatedProfile);

    const { user, worker } = updatedProfile;

queryClient.setQueryData(["profile"], (old: ProfileUpdate | undefined) => {
  if (!old) return { ...user, worker };

  return {
    ...old,
    ...user,
    documents: user.documents || old.user.documents,
    worker: {
      ...old.worker,
      ...worker,
    },
  };
});

    },
  });
}
