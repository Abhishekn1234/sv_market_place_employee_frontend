import { useMutation } from "@tanstack/react-query";
import { ForgotPasswordRepo } from "../../data/repositories/forgotRepoImpl";
import { ForgotPasswordUsecase } from "../../domain/usecase/ForgotPasswordusecase";
import type { ForgotPassword } from "../../domain/entities/forgot";

export function useForgot() {
  const repo = new ForgotPasswordRepo();
  const usecase = new ForgotPasswordUsecase(repo);

  return useMutation<ForgotPassword, Error, string>({
    mutationFn: (email: string) => usecase.execute(email),
  });
}
