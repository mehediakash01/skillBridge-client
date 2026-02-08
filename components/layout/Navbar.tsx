"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl text-primary">SkillBridge</span>
        </Link>

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

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">Sign Up</Link>
          </Button>
        </div>

        {/* Mobile menu - placeholder, we'll use sheet later if needed */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            {/* You can add lucide Menu icon later */}
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}