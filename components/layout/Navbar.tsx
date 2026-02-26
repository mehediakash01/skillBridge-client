"use client";

import Link from "next/link";
import { Moon, Sun, Menu, LogOut, LayoutDashboard, Users, BookOpen } from "lucide-react";
import { useTheme } from "next-themes";
import { useSession } from "@/src/hooks/useSession";

import { cn } from "@/src/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Assuming your auth client has signOut
import { authClient } from "@/src/lib/auth-client";

export default function Navbar() {
  const { setTheme, theme } = useTheme();
  const { data: session, isLoading } = useSession();

  interface User {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
    avatar?: string | null | undefined; // Added avatar property
    imageUrl?: string | null | undefined; // Added imageUrl property
    role?: string; 
  }

  const user = session?.user as User; 
  const isAuthenticated = !!user && !isLoading;

  const getDashboardPath = () => {
    if (!user?.role) return "/dashboard";
    const role = user.role.toLowerCase();
    if (role.includes("tutor")) return "/tutor/dashboard";
    if (role.includes("admin")) return "/admin-dashboard";
    return "/dashboard"; 
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut?.(); 
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="font-extrabold text-2xl bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              SkillBridge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/tutors"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              All Tutors
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Subjects
            </Link>
          </nav>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Sun
                    className={cn(
                      "h-5 w-5 rotate-0 scale-100 transition-transform duration-300",
                      theme === "dark" && "rotate-90 scale-0"
                    )}
                  />
                  <Moon
                    className={cn(
                      "absolute h-5 w-5 rotate-90 scale-0 transition-transform duration-300",
                      theme === "dark" && "rotate-0 scale-100"
                    )}
                  />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isLoading ? (
              <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm hover:scale-105 transition-transform">
                      <AvatarImage src={user?.imageUrl || user?.avatar || ''} alt={user?.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-2 py-3">
                    <p className="font-medium leading-none">{user?.name || "Account"}</p>
                    <p className="text-sm text-muted-foreground mt-1 truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardPath()} className="flex items-center gap-2 py-2.5">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive flex items-center gap-2 py-2.5"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] sm:w-100 pr-0">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-left text-2xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    SkillBridge
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-2">
                  {/* Common Links */}
                  <Link
                    href="/tutors"
                    className="flex items-center gap-3 px-3 py-3 text-base font-medium rounded-md hover:bg-accent transition-colors"
                  >
                    <Users className="h-5 w-5" />
                    All Tutors
                  </Link>
                  <Link
                    href="/categories"
                    className="flex items-center gap-3 px-3 py-3 text-base font-medium rounded-md hover:bg-accent transition-colors"
                  >
                    <BookOpen className="h-5 w-5" />
                    Subjects
                  </Link>

                  <div className="h-px bg-border my-4" />

                  {/* Auth section in mobile */}
                  {isLoading ? (
                    <div className="px-3 py-4">
                      <div className="h-10 w-10 rounded-full bg-muted animate-pulse mx-auto" />
                    </div>
                  ) : isAuthenticated ? (
                    <>
                      <div className="px-3 py-4 flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-background">
                          <AvatarImage src={user?.imageUrl || user?.avatar || ''} alt={user?.name} />
                          <AvatarFallback className="text-xl bg-primary/10 text-primary">
                            {user?.name?.charAt(0)?.toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user?.name || "User"}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-45">
                            {user?.email}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={getDashboardPath()}
                        className="flex items-center gap-3 px-3 py-3 text-base font-medium rounded-md hover:bg-accent transition-colors"
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 text-base font-medium rounded-md hover:bg-destructive/10 text-destructive transition-colors text-left"
                      >
                        <LogOut className="h-5 w-5" />
                        Log out
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3 px-3 mt-4">
                      <Button asChild variant="outline" className="w-full justify-center py-6 text-base">
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild className="w-full justify-center py-6 text-base">
                        <Link href="/register">Sign Up</Link>
                      </Button>
                    </div>
                  )}

                  {/* Theme in mobile */}
                  <div className="mt-6 px-3">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Theme</p>
                    <div className="flex gap-2">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("light")}
                        className="flex-1"
                      >
                        Light
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("dark")}
                        className="flex-1"
                      >
                        Dark
                      </Button>
                      <Button
                        variant={theme === "system" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("system")}
                        className="flex-1"
                      >
                        System
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}