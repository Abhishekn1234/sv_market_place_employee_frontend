import { useMutation } from '@tanstack/react-query';
import { RegisterImpl } from '../../data/repositories/RegitserImpl';
import { RegisterUsecase } from '../../domain/usecase/Registerusecase/registerusecase';
import type { Register } from '../../domain/entities/register';

export function useRegister() {
  const repo = new RegisterImpl();
  const usecase = new RegisterUsecase(repo);

  // useMutation returns mutate function and mutation state
  const mutation = useMutation({
    mutationFn: (registerData: Register) => usecase.execute(registerData),
  });

  return mutation;
}
