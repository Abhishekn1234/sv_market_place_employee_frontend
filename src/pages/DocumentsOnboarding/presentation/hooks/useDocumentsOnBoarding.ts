import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentsOnboardingImpl } from "../../data/repositories/DocumentsOnboardingImpl";
import { DocumentsOnboardingusecase } from "../../domain/usecase/Documentsusecase";
import type { DocumentsOnboarding } from "../../domain/entities/documentsonboarding";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function useDocumentsOnBoarding(){
    const repo= new DocumentsOnboardingImpl();
    const usecase= new DocumentsOnboardingusecase(repo);
   const queryClient=useQueryClient();
   const navigate=useNavigate();
    return useMutation({
        mutationFn:(data:DocumentsOnboarding)=>usecase.execute(data),
        onSuccess(data){
        toast.success("Documents updated successfully");
        queryClient.setQueryData(["profile"],data);
        navigate('/');
        },
        onError(err:any){
            toast.error(err.message);
            console.log(err);
        }
    })
}