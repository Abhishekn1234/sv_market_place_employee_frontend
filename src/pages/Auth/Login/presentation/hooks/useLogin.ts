import { useMutation } from "@tanstack/react-query";
import { LoginImplementation } from "../../data/repositories/LoginImpl";
import { LoginUserusecase } from "../../domain/usecase/LoginUserusecase";
import type { Login } from "../../domain/entities/login";


export function useLogin(){
    const repo=new LoginImplementation();
    const usecase= new LoginUserusecase(repo);

    return useMutation<Login,Error,{email:string,password:string}>({
        mutationKey:['login'],
        mutationFn:({email,password})=>usecase.execute(email,password)
        

    })
}