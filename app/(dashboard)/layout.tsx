"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, CalendarDays, UserCircle, LogOut } from "lucide-react"
import { authClient } from "@/src/lib/auth-client"
import { cn } from "@/src/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "@/src/hooks/useSession"

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Bookings", href: "/dashboard/bookings", icon: CalendarDays },
  { label: "Profile", href: "/dashboard/profile", icon: UserCircle },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  const handleLogout = async () => {
    await authClient.signOut()
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight">SkillBridge</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Student Dashboard</p>
        </div>

        <Separator />

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <Separator />

        {/* User + logout */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.image ?? ""} />
              <AvatarFallback>{user?.name?.charAt(0) ?? "S"}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name ?? "Student"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email ?? ""}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content offset by sidebar */}
      <main className="flex-1 ml-64 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}