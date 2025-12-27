import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileRepoImplementation } from "../../data/repositories/ProfileImpl";
import { UpdatePasswordUsecase } from "../../domain/usecase/UpdatePasswordusecase";
import type { Profile } from "../../domain/entities/profile";

export function usePassword() {
  const queryClient = useQueryClient();

  const repo = new ProfileRepoImplementation();
  const usecase = new UpdatePasswordUsecase(repo);

  return useMutation<
    Profile,
    Error,
    { oldPassword: string; newPassword: string }
  >({
    mutationFn: ({ oldPassword, newPassword }) =>
      usecase.execute(oldPassword, newPassword),

    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
    },
  });
}
