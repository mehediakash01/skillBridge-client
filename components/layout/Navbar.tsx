"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/src/lib/utils"; 

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

export default function Navbar() {
  const { setTheme, theme } = useTheme();

  return (
    <header className="max-w-7xl mx-auto sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl text-primary">SkillBridge</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/tutors"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Browse Tutors
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Subjects
          </Link>
        </nav>

        {/* Right side: Theme toggle + Auth buttons */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Theme Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Sun
                  className={cn(
                    "h-5 w-5 rotate-0 scale-100 transition-all",
                    theme === "dark" && "rotate-90 scale-0"
                  )}
                />
                <Moon
                  className={cn(
                    "absolute h-5 w-5 rotate-90 scale-0 transition-all",
                    theme === "dark" && "rotate-0 scale-100"
                  )}
                />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth buttons */}
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">Sign Up</Link>
          </Button>

          {/* Mobile menu placeholder */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              {/* Later: add <Menu className="h-5 w-5" /> from lucide-react */}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}