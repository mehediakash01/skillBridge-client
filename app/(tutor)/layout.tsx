"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard, Clock, UserCircle, LogOut,
  GraduationCap, Menu, X, ChevronRight, Home,
} from "lucide-react"
import { authClient } from "@/src/lib/auth-client"
import { cn } from "@/src/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSession } from "@/src/hooks/useSession"

const NAV_ITEMS = [
  { label: "Sessions", href: "/tutor/dashboard", icon: LayoutDashboard },
  { label: "Availability", href: "/tutor/availability", icon: Clock },
  { label: "Profile", href: "/tutor/profile", icon: UserCircle },
]

function SidebarContent({
  pathname,
  user,
  onLogout,
  onClose,
}: {
  pathname: string
  user: any
  onLogout: () => void
  onClose?: () => void
}) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* ── Logo ─────────────────────────────────── */}
      <div className="px-5 py-5 flex items-center justify-between shrink-0">
        <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
          <div className="p-1 bg-white rounded-lg">
            <Image src="/ForgeLogo.png" alt="LearnForge" width={40} height={40} className="w-10 h-10" />
          </div>
          <div>
            <p className="font-black text-sm leading-none" style={{ fontFamily: "'Fraunces', serif" }}>
              LearnForge
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Tutor Portal</p>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground md:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <Separator />

      {/* ── Nav ──────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold px-3 mb-2">
          Menu
        </p>

        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", isActive && "scale-110")} />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
            </Link>
          )
        })}

        {/* Quick links */}
        <div className="pt-4 mt-3 border-t space-y-0.5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold px-3 mb-2">
            Quick Links
          </p>
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <Home className="w-4 h-4 shrink-0" />
            Back to Home
          </Link>
        </div>
      </nav>

      <Separator />

      {/* ── User + Logout ─────────────────────────── */}
      <div className="p-3 space-y-1 shrink-0">
        <Link
          href="/tutor/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted transition-colors w-full"
        >
          <Avatar className="h-9 w-9 border-2 border-muted shrink-0">
            <AvatarImage src={user?.image ?? ""} alt={user?.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() ?? "T"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate leading-none">{user?.name ?? "Tutor"}</p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.email ?? ""}</p>
          </div>
          <Badge variant="secondary" className="text-[10px] rounded-full shrink-0 px-2">
            Tutor
          </Badge>
        </Link>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 transition-colors w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await authClient.signOut()
    router.push("/")             // ← redirects to home, not login
  }

  const activeItem = NAV_ITEMS.find((i) => i.href === pathname)
    ?? NAV_ITEMS.slice().reverse().find((i) => pathname.startsWith(i.href))
  const pageTitle = activeItem?.label ?? "Dashboard"
  const PageIcon = activeItem?.icon ?? LayoutDashboard

  return (
    <div className="flex min-h-screen bg-muted/30">

      {/* ── Desktop sidebar (fixed) ───────────────────── */}
      <aside className="hidden md:flex w-60 lg:w-64 flex-col fixed inset-y-0 z-30 border-r shadow-sm">
        <SidebarContent pathname={pathname} user={user} onLogout={handleLogout} />
      </aside>

      {/* ── Mobile top bar ────────────────────────────── */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 h-14 bg-background/95 backdrop-blur border-b flex items-center gap-3 px-4">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl shrink-0">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px] sm:w-72">
            <SidebarContent
              pathname={pathname}
              user={user}
              onLogout={handleLogout}
              onClose={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>

        {/* Page title */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <PageIcon className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm truncate">{pageTitle}</span>
        </div>

        {/* Avatar shortcut */}
        <Link href="/tutor/profile" className="shrink-0">
          <Avatar className="h-8 w-8 border-2 border-muted">
            <AvatarImage src={user?.image ?? ""} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
              {user?.name?.charAt(0)?.toUpperCase() ?? "T"}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>

      {/* ── Main area ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:ml-60 lg:ml-64">

        {/* Desktop top bar */}
        <div className="hidden md:flex items-center justify-between px-8 h-14 border-b bg-background/80 backdrop-blur sticky top-0 z-20 shrink-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/tutor/dashboard" className="hover:text-foreground transition-colors">
              Tutor Dashboard
            </Link>
            {pathname !== "/tutor/dashboard" && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="font-medium text-foreground">{pageTitle}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/tutor/profile">
              <Avatar className="h-8 w-8 border-2 border-muted hover:border-primary/40 transition-colors cursor-pointer">
                <AvatarImage src={user?.image ?? ""} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() ?? "T"}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 pt-[72px] md:pt-0 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}