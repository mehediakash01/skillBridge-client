import { NextRequest, NextResponse } from "next/server";
import { userService } from "./services/user.service";
import { Roles } from "./constatns/role";

export async function proxy(request:NextRequest){
    const pathName = request.nextUrl.pathname;
    let isAuthenticated = false;
    let isAdmin = false;
    
    const {data} = await userService.getSession();
    if (data){
        isAuthenticated=true;
        isAdmin = data.user.role===Roles.admin
    }

    if (!isAuthenticated){
        return NextResponse.redirect(new URL("/login",request.url));
    }

    if (isAdmin){
        return NextResponse.redirect(new URL("/admin-dashboard",request.url))
    }
    if (!isAdmin && pathName.startsWith("/admin-dashboard")){
        return NextResponse.redirect(new URL("/dashboard",request.url))
    }
    return NextResponse.next();

}
export const config ={
   matcher: [
  "/dashboard", "/dashboard/:path*",
  "/tutor", "/tutor/:path*",           
  "/admin-dashboard", "/admin-dashboard/:path*"
]
}