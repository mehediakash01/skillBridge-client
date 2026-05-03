"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Moon, Sun, Menu, LogOut, LayoutDashboard, GraduationCap, BookOpen, Lightbulb, ChevronDown, Info, Sparkles } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useSession } from "@/src/hooks/useSession";
import { cn } from "@/src/lib/utils";
import { authClient } from "@/src/lib/auth-client";
import { getDashboardPathFromRole } from "@/src/lib/auth-routing";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const NAV_LINKS = [
  { href: "/tutors", label: "Find Tutors", icon: GraduationCap },
  { href: "/how-it-works", label: "How It Works", icon: Lightbulb },
  { href: "/ai", label: "LearnForge AI", icon: Sparkles, badge: "New" },
  { href: "/become-a-tutor", label: "Become a Tutor", icon: BookOpen, badge: "Earn" },
  { href: "/about", label: "About Us", icon: Info },
];

interface User {
  id: string; createdAt: Date; updatedAt: Date;
  email: string; emailVerified: boolean; name: string;
  image?: string | null; avatar?: string | null;
  imageUrl?: string | null; role?: string;
}

export default function Navbar() {
  const { setTheme, theme } = useTheme();
  const { data: session, isLoading } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Only blend (transparent) on the homepage
  const isHero = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const user = session?.user as User;
  const isAuthenticated = !!user && !isLoading;
  const dashboardPath = getDashboardPathFromRole(user?.role);

  const handleLogout = async () => {
    try {
      await authClient.signOut?.();
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Determine navbar appearance
  const isTransparent = isHero && !scrolled && !mobileOpen;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isTransparent
          ? "bg-transparent border-transparent"
          : "bg-background/90 backdrop-blur-xl border-b border-border/60 shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* ── Logo ─────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="p-1 bg-white rounded-lg">
              <Image src="/ForgeLogo.png" alt="LearnForge" width={40} height={40} className="w-10 h-10" />
            </div>
            <span className={cn(
              "font-black text-lg tracking-tight transition-colors",
              isTransparent ? "" : "text-foreground"
            )} style={{ fontFamily: "'Fraunces', serif" }}>
              LearnForge
            </span>
          </Link>

          {/* ── Desktop nav ───────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, badge }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all",
                    isTransparent
                      ? isActive
                        ? "bg-white/20 "
                        : "/80 hover: hover:bg-white/10"
                      : isActive
                        ? "bg-primary/8 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {label}
                  {badge && (
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                      isTransparent ? "bg-accent/30 " : "bg-accent/20 text-accent-foreground"
                    )}>
                      {badge}
                    </span>
                  )}
                  {isActive && (
                    <span className={cn(
                      "absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                      isTransparent ? "bg-black" : "bg-primary"
                    )} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Right side ────────────────────────────── */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9 rounded-xl transition-colors",
                    isTransparent ? "/80 hover: hover:bg-white/10" : ""
                  )}
                >
                  <Sun className={cn("h-4 w-4 transition-all", theme === "dark" && "scale-0 rotate-90 absolute")} />
                  <Moon className={cn("h-4 w-4 transition-all absolute", theme !== "dark" && "scale-0 -rotate-90")} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isLoading ? (
              <div className="h-9 w-9 rounded-full bg-white/20 animate-pulse" />
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-white/10 transition-colors">
                    <Avatar className="h-8 w-8 border-2 border-white/20">
                      <AvatarImage src={user?.image || user?.imageUrl || user?.avatar || ""} alt={user?.name} />
                      <AvatarFallback className={cn(
                        "text-sm font-bold",
                        isTransparent ? "bg-white/20 " : "bg-primary/10 text-primary"
                      )}>
                        {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className={cn("w-3 h-3", isTransparent ? "/70" : "text-muted-foreground")} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-xl">
                  <div className="px-3 py-3">
                    <p className="font-semibold text-sm">{user?.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{user?.email}</p>
                    {user?.role && (
                      <Badge variant="secondary" className="mt-2 text-xs rounded-full capitalize">
                        {user.role.toLowerCase()}
                      </Badge>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={dashboardPath} className="flex items-center gap-2.5 py-2.5 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive flex items-center gap-2.5 py-2.5 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost" size="sm" asChild
                  className={cn(
                    "rounded-xl",
                    isTransparent ? "/80 hover: hover:bg-white/10" : ""
                  )}
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  size="sm" asChild
                  className={cn(
                    "rounded-xl",
                    isTransparent
                      ? "bg-black text-white hover:bg-black/90 shadow-lg"
                      : "shadow-sm shadow-primary/20"
                  )}
                >
                  <Link href="/register">Sign Up Free</Link>
                </Button>
              </div>
            )}
          </div>

          {/* ── Mobile hamburger ──────────────────────── */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-10 w-10 rounded-xl", isTransparent ? " hover:bg-white/10" : "")}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] sm:w-96 p-0">
                <SheetHeader className="p-6 pb-4 border-b">
                  <SheetTitle className="flex items-center gap-2 text-left">
                    <div className="p-1 bg-white rounded-lg">
                      <Image src="/ForgeLogo.png" alt="LearnForge" width={40} height={40} className="w-10 h-10" />
                    </div>
                    <span className="font-black text-lg" style={{ fontFamily: "'Fraunces', serif" }}>
                      LearnForge
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <div className="p-4 space-y-1">
                  {NAV_LINKS.map(({ href, label, icon: Icon, badge }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                        pathname === href
                          ? "bg-primary/8 text-primary"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        {label}
                      </div>
                      {badge && <Badge variant="secondary" className="text-xs rounded-full">{badge}</Badge>}
                    </Link>
                  ))}
                </div>

                <div className="mx-4 h-px bg-border" />

                <div className="p-4">
                  {isLoading ? (
                    <div className="h-16 bg-muted rounded-xl animate-pulse" />
                  ) : isAuthenticated ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl mb-2">
                        <Avatar className="h-10 w-10 border-2 border-background">
                          <AvatarImage src={user?.image || user?.imageUrl || user?.avatar || ""} alt={user?.name} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{user?.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                      </div>
                      <Link
                        href={dashboardPath}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/8 text-destructive text-sm font-medium transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button asChild variant="outline" className="w-full rounded-xl h-11">
                        <Link href="/login" onClick={() => setMobileOpen(false)}>Login</Link>
                      </Button>
                      <Button asChild className="w-full rounded-xl h-11">
                        <Link href="/register" onClick={() => setMobileOpen(false)}>Sign Up Free</Link>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Theme toggle mobile */}
                <div className="mx-4 h-px bg-border" />
                <div className="p-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 px-1">Theme</p>
                  <div className="grid grid-cols-3 gap-2">
                    {["light", "dark", "system"].map((t) => (
                      <Button
                        key={t}
                        variant={theme === t ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme(t)}
                        className="rounded-xl capitalize text-xs"
                      >
                        {t}
                      </Button>
                    ))}
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
