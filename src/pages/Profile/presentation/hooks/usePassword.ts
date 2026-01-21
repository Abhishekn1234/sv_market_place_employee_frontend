import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileRepoImplementation } from "../../data/repositories/ProfileImpl";
import { UpdatePasswordUsecase } from "../../domain/usecase/UpdatePasswordusecase";
import type { Profile } from "../../domain/entities/profile";

import type { UpdatePassword } from "../../domain/entities/updatepassword";

export function usePassword() {
  const queryClient = useQueryClient();

  const repo = new ProfileRepoImplementation();
  const usecase = new UpdatePasswordUsecase(repo);

  return useMutation<
    Profile,
    Error,
    UpdatePassword
  >({
    mutationFn: (data:UpdatePassword ) =>
      usecase.execute(data),

    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
    },
  });
}
