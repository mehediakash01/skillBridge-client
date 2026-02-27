"use client"

import { useQuery } from "@tanstack/react-query"
import { getAdminStats, getAdminBookings } from "@/src/services/admin.service"
import { format, subDays, eachDayOfInterval, parseISO, startOfDay } from "date-fns"
import {
  Users, BookOpen, CheckCircle2, Tag,
  DollarSign, GraduationCap, TrendingUp, Activity,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

// ── Build last-30-days chart data from bookings ───────────
function buildChartData(bookings: any[]) {
  const today = new Date()
  const days = eachDayOfInterval({ start: subDays(today, 29), end: today })

  return days.map((day) => {
    const label = format(day, "MMM d")
    const dayStart = startOfDay(day).getTime()
    const dayEnd = dayStart + 86400000

    const dayBookings = bookings.filter((b) => {
      const t = new Date(b.startTime).getTime()
      return t >= dayStart && t < dayEnd
    })

    return {
      date: label,
      Bookings: dayBookings.length,
      Completed: dayBookings.filter((b) => b.status === "completed").length,
      Revenue: dayBookings
        .filter((b) => b.status === "completed")
        .reduce((sum, b) => sum + Number(b.totalPrice), 0),
    }
  })
}

// ── Custom tooltip ────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium">
            {p.name === "Revenue" ? `$${p.value.toFixed(2)}` : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────
function StatCard({
  label, value, icon: Icon, color, bg, isLoading,
}: {
  label: string
  value: string | number | null | undefined
  icon: any
  color: string
  bg: string
  isLoading: boolean
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {label}
            </p>
            {isLoading ? (
              <Skeleton className="h-9 w-20 mt-2" />
            ) : (
              <p className="text-3xl font-bold mt-1 tracking-tight">
                {value ?? 0}
              </p>
            )}
          </div>
          <div className={`p-2.5 rounded-xl ${bg}`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
        </div>
      </CardContent>
      {/* subtle bottom accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${bg.replace("bg-", "bg-").replace("/10", "/40")}`} />
    </Card>
  )
}

// ── Main Page ─────────────────────────────────────────────
export default function AdminOverviewPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
  })

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: getAdminBookings,
  })

  const chartData = buildChartData(bookings)
  const chartLoading = bookingsLoading

  // Recent 5 bookings
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 5)

  const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    confirmed: "default",
    completed: "secondary",
    cancelled: "destructive",
    pending: "outline",
  }

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-500/10" },
    { label: "Tutors", value: stats?.totalTutors, icon: GraduationCap, color: "text-violet-600", bg: "bg-violet-500/10" },
    { label: "Students", value: stats?.totalStudents, icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-500/10" },
    { label: "Total Bookings", value: stats?.totalBookings, icon: Activity, color: "text-green-600", bg: "bg-green-500/10" },
    { label: "Completed", value: stats?.completedBookings, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { label: "Categories", value: stats?.totalCategories, icon: Tag, color: "text-orange-600", bg: "bg-orange-500/10" },
    { label: "Total Revenue", value: stats ? `$${Number(stats.totalRevenue).toFixed(2)}` : null, icon: DollarSign, color: "text-yellow-600", bg: "bg-yellow-500/10" },
    {
      label: "Completion Rate",
      value: stats && stats.totalBookings > 0
        ? `${Math.round((stats.completedBookings / stats.totalBookings) * 100)}%`
        : "0%",
      icon: TrendingUp,
      color: "text-rose-600",
      bg: "bg-rose-500/10",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Platform-wide statistics · Updated live
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} isLoading={statsLoading} />
        ))}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Booking Activity</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Last 30 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-blue-500 rounded" />
                Bookings
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-emerald-500 rounded" />
                Completed
              </div>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {chartLoading ? (
            <Skeleton className="h-64 w-full rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                  // Show every 5th label to avoid crowding
                  interval={4}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="Bookings"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="Completed"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
                  strokeDasharray="5 3"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Bottom row: recent bookings + breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent bookings */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Recent Bookings</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            {bookingsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : recentBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No bookings yet</p>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between py-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{b.Student.name}</p>
                      <p className="text-xs text-muted-foreground">
                        with {b.Tutor.Student.name} · {format(new Date(b.startTime), "MMM d, p")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-medium">${b.totalPrice}</span>
                      <Badge variant={statusVariant[b.status]} className="text-xs">
                        {b.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Booking Breakdown</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4 space-y-4">
            {bookingsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-8 w-full" />)}
              </div>
            ) : (() => {
              const total = bookings.length || 1
              const statuses = [
                { label: "Confirmed", key: "confirmed", color: "bg-blue-500" },
                { label: "Completed", key: "completed", color: "bg-emerald-500" },
                { label: "Cancelled", key: "cancelled", color: "bg-red-400" },
                { label: "Pending", key: "pending", color: "bg-yellow-400" },
              ]
              return statuses.map(({ label, key, color }) => {
                const count = bookings.filter((b) => b.status === key).length
                const pct = Math.round((count / total) * 100)
                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{count} <span className="text-muted-foreground font-normal">({pct}%)</span></span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}