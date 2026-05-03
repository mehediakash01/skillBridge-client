import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/src/lib/utils";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner"; 
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LearnForge - Connect with Expert Tutors, Learn Anything",
  description:
    "Browse expert tutors, book sessions instantly, and grow your skills with personalized learning.",
  keywords:
    "tutors, online tutoring, learn anything, learnforge, education platform",
  icons: {
    icon: "/ForgeLogo.png",
    apple: "/ForgeLogo.png",
  },
};

import { Chatbot } from "@/components/Chatbot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
<link href="https://api.fontshare.com/v2/css?f[]=clash-display@700,600&f[]=cabinet-grotesk@400,500&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <TooltipProvider><main className="min-h-[calc(100vh-8rem)]">{children}</main></TooltipProvider>
            <Toaster richColors position="top-right" closeButton />
            <Chatbot />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
