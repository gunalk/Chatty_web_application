import { create } from "zustand";
import { axiosInstance } from "../lib/axios";


export const useAuthStore =create((set)=>({
    authUser:null,
    isCheckingAuth:true,
    isSigningUp:false,
    isLogging:false,
    isUpdatingProfile:false,
    checkAuth:async()=>{
        try{
            const response=await axiosInstance.get("/auth/check")
            set({authUser:response.data})
            console.log(response)
        }
        catch(err){
            console.log(err)
            set({authUser:null})

           
        }
        finally{
            set({
                isCheckingAuth:false
            })
        }
    },
    signUp:async(data)=>{

    }
}))