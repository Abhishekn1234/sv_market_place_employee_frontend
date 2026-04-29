import { useMutation } from "@tanstack/react-query";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { UnregisterDeviceTokenUseCase } from "../../domain/usecase/UnRegisterDeviceTokenUsecase";

const repo = new NotificationRepositoryImpl();
const useCase = new UnregisterDeviceTokenUseCase(repo);

export const useUnregisterDeviceToken = () => {
  return useMutation({
    mutationFn: useCase.execute.bind(useCase),
  });
};