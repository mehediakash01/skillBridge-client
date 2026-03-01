import { error } from "console";
import { cookies } from "next/headers"

export const userService ={
    getSession: async function(){
        try{
            const cookieStore = await cookies();
            console.log(cookieStore.toString());
            const res = await fetch("https://skill-bridge-server-tau.vercel.app/api/auth/get-session",{
                headers:{
                    Cookie:cookieStore.toString(),
                },
                cache:"no-store",

            });
            const session = await res.json();
            if (session==null){
                return {data:null,error:{message:"session is missing."}}
            }
            return {data:session,error:null}
           
        }
        catch (err){
            console.error(err);
            return {data:null,error:{message:"something went wrong"}}

        }
    }
    }
