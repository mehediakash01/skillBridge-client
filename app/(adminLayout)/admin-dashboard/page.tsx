"use client"

import { useQuery } from "@tanstack/react-query"
import { getAdminStats, getAdminBookings } from "@/src/services/admin.service"
import { format, subDays, eachDayOfInterval, parseISO, startOfDay } from "date-fns"
import {
  Users, BookOpen, CheckCircle2, Tag,
  DollarSign, GraduationCap, TrendingUp, Activity,
  ChevronLeft, ChevronRight, Search,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
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
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const itemsPerPage = 8

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

  // Chart data for bar chart - top tutors
  const topTutors = bookings
    .reduce((acc: any, b: any) => {
      const found = acc.find((item: any) => item.name === b.Tutor.bio)
      if (found) {
        found.bookings += 1
        found.earnings += Number(b.totalPrice)
      } else {
        acc.push({ name: b.Tutor.bio, bookings: 1, earnings: Number(b.totalPrice) })
      }
      return acc
    }, [])
    .sort((a: any, b: any) => b.earnings - a.earnings)
    .slice(0, 5)

  // Pie chart data - platform distribution
  const platformDistribution = [
    { name: "Students", value: stats?.totalStudents || 0 },
    { name: "Tutors", value: stats?.totalTutors || 0 },
  ]

  // Status distribution
  const statusDistribution = [
    { name: "Confirmed", value: bookings.filter((b) => b.status === "confirmed").length },
    { name: "Completed", value: bookings.filter((b) => b.status === "completed").length },
    { name: "Cancelled", value: bookings.filter((b) => b.status === "cancelled").length },
  ]

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  // Filter & Paginate bookings
  const filtered = bookings.filter(b => {
    const matchesSearch =
      b.Student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.Tutor.bio.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || b.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginatedBookings = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    confirmed: "default",
    completed: "secondary",
    cancelled: "destructive",
    pending: "outline",
  }

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-500/10" },
    { label: "Students", value: stats?.totalStudents, icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-500/10" },
    { label: "Tutors", value: stats?.totalTutors, icon: GraduationCap, color: "text-violet-600", bg: "bg-violet-500/10" },
    { label: "Total Bookings", value: stats?.totalBookings, icon: Activity, color: "text-green-600", bg: "bg-green-500/10" },
    { label: "Completed", value: stats?.completedBookings, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { label: "Categories", value: stats?.totalCategories, icon: Tag, color: "text-orange-600", bg: "bg-orange-500/10" },
    { label: "Total Revenue", value: stats ? `$${Number(stats.totalRevenue).toFixed(0)}` : null, icon: DollarSign, color: "text-yellow-600", bg: "bg-yellow-500/10" },
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
    <div className="space-y-8 pb-8">
      {/* ════ Header ════ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform overview and management</p>
        </div>
        <Link href="/admin/profile">
          <Button className="gap-2 rounded-lg">Admin Profile</Button>
        </Link>
      </div>

      {/* ════ Stat Cards ════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} isLoading={statsLoading} />
        ))}
      </div>

      {/* ════ Charts ════ */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Line Chart - 30 Day Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Booking Activity (30 days)</CardTitle>
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
                    activeDot={{ r: 4, fill: "#3b82f6" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Completed"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={false}
                    strokeDasharray="5 3"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart - Top Tutors */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Top Tutors by Earnings</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            {chartLoading || topTutors.length === 0 ? (
              <Skeleton className="h-64 w-full rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topTutors} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip formatter={(value) => value ? `$${(value as number).toFixed(2)}` : "$0"} />
                  <Bar dataKey="earnings" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart - User Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">User Distribution</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            {statsLoading ? (
              <Skeleton className="h-64 w-full rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={platformDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {platformDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Booking Status Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Booking Status</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            {bookingsLoading ? (
              <Skeleton className="h-64 w-full rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ════ Bookings Data Table ════ */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>All Bookings</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search student or tutor..."
                  className="pl-8 h-9 rounded-lg"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value)
                  setCurrentPage(1)
                }}
                className="h-9 px-3 rounded-lg border border-input text-sm"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-0">
          {bookingsLoading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : paginatedBookings.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              <Activity className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No bookings found</p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-4 bg-muted/30 rounded-t-lg font-semibold text-sm">
                <div>Student</div>
                <div>Tutor</div>
                <div>Date & Time</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Action</div>
              </div>

              {/* Table Body */}
              <div className="divide-y">
                {paginatedBookings.map((b: any) => (
                  <div key={b.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-0 md:items-center px-6 py-4 hover:bg-muted/50 transition-colors">
                    <div className="md:col-span-1">
                      <p className="font-medium truncate">{b.Student.name}</p>
                      <p className="text-xs text-muted-foreground">{b.Student.email}</p>
                    </div>

                    <div className="md:col-span-1">
                      <p className="font-medium truncate">{b.Tutor.bio}</p>
                      <p className="text-xs text-muted-foreground">Tutor</p>
                    </div>

                    <div className="md:col-span-1">
                      <p className="text-sm font-medium">{format(new Date(b.startTime), "MMM d, yyyy")}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(b.startTime), "h:mm a")}</p>
                    </div>

                    <div className="md:col-span-1">
                      <p className="font-semibold">${b.totalPrice}</p>
                    </div>

                    <div className="md:col-span-1">
                      <Badge variant={statusVariant[b.status] || "outline"}>
                        {b.status}
                      </Badge>
                    </div>

                    <div className="md:col-span-1">
                      <Button size="sm" variant="outline" className="rounded-lg h-8">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {paginatedBookings.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
                  {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="rounded-lg h-8 w-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-lg"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}