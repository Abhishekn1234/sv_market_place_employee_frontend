import { useMutation } from "@tanstack/react-query";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { RegisterDeviceTokenUseCase } from "../../domain/usecase/RegisterDeviceTokenUsecase";


const repo = new NotificationRepositoryImpl();
const useCase = new RegisterDeviceTokenUseCase(repo);

export const useRegisterDeviceToken = () => {
  return useMutation({
    mutationFn: useCase.execute.bind(useCase),
  });
};