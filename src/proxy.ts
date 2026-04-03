import { NextRequest, NextResponse } from "next/server";
import { userService } from "./services/user.service";
import { getDashboardPathFromRole, isPathAllowedForRole } from "./lib/auth-routing";

export async function proxy(request:NextRequest){
    const pathName = request.nextUrl.pathname;
    
    const {data} = await userService.getSession();
    if (!data){
        return NextResponse.redirect(new URL("/login",request.url));
    }

    const dashboardPath = getDashboardPathFromRole(data.user.role);

    if (!isPathAllowedForRole(pathName, data.user.role)){
        return NextResponse.redirect(new URL(dashboardPath,request.url))
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
