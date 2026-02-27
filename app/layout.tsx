import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/src/lib/utils";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner"; 
import { ThemeProvider } from "next-themes";

import { AuthProvider } from "@/components/providers/AuthProviders";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillBridge - Connect with Expert Tutors, Learn Anything",
  description:
    "Browse expert tutors, book sessions instantly, and grow your skills with personalized learning.",
  keywords:
    "tutors, online tutoring, learn anything, skillbridge, education platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className,
        )}
      >
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <QueryProvider>
              <TooltipProvider><main className="min-h-[calc(100vh-8rem)]">{children}</main></TooltipProvider>
              

              
              

              <Toaster richColors position="top-right" closeButton />
            </QueryProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
