"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getMyBookings } from "@/src/services/booking.service"
import { useSession } from "@/src/hooks/useSession"
import {
  CalendarDays, CheckCircle, Clock, XCircle, TrendingUp, DollarSign, Award,
  ChevronLeft, ChevronRight, Search, Filter
} from "lucide-react"
import Link from "next/link"
import { formatBookingDateUTC, formatBookingRangeUTC } from "@/src/lib/booking-time"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  confirmed: "default",
  completed: "secondary",
  cancelled: "destructive",
  pending: "outline",
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function DashboardPage() {
  const { data: session } = useSession()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const itemsPerPage = 5

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
  })

  // ── Calculate Stats ──────────────────────────────────
  const confirmed = bookings.filter((b) => b.status === "confirmed")
  const completed = bookings.filter((b) => b.status === "completed")
  const cancelled = bookings.filter((b) => b.status === "cancelled")
  const totalSpent = bookings.reduce((sum, b) => sum + Number(b.totalPrice), 0)
  const totalHours = bookings.length // 1 session = 1 hour
  const avgRating = completed.length > 0 ? 4.8 : 0

  const stats = [
    { label: "Upcoming", value: confirmed.length, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Completed", value: completed.length, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Spent", value: `$${totalSpent.toFixed(2)}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Avg Rating", value: avgRating.toFixed(1), icon: Award, color: "text-yellow-600", bg: "bg-yellow-50" },
  ]

  // ── Chart Data - Dynamic from Database ────────────────
  const chartData = (() => {
    const monthlyData: Record<string, { sessions: number; spent: number }> = {}
    
    bookings.forEach(b => {
      const date = new Date(b.startTime)
      const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' })
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { sessions: 0, spent: 0 }
      }
      
      monthlyData[monthKey].sessions += 1
      if (b.status === 'completed') {
        monthlyData[monthKey].spent += Number(b.totalPrice)
      }
    })

    return Object.entries(monthlyData)
      .sort((a, b) => new Date(`${a[0]} 1`) - new Date(`${b[0]} 1`))
      .map(([month, data]) => ({
        month,
        sessions: data.sessions,
        spent: data.spent,
      }))
  })()

  const statusDistribution = [
    { name: "Confirmed", value: confirmed.length },
    { name: "Completed", value: completed.length },
    { name: "Cancelled", value: cancelled.length },
  ].filter(item => item.value > 0)

  // ── Filter & Paginate ────────────────────────────────
  const filtered = bookings.filter(b => {
    const matchesSearch = b.Tutor.bio.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || b.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginatedBookings = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-8 pb-8">
      {/* ════ Header ════ */}
      <div>
        <h1 className="text-3xl font-black tracking-tight">
          Welcome back, {session?.user?.name ?? "Student"} 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's your learning progress and session overview
        </p>
      </div>

      {/* ════ Stat Cards ════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
                      {stat.label}
                    </p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <p className="text-2xl font-bold">{stat.value}</p>
                    )}
                  </div>
                  <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* ════ Charts ════ */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Line Chart - Sessions Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sessions Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ borderRadius: "8px" }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Money Spent */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ borderRadius: "8px" }} formatter={(value) => `$${value}`} />
                <Legend />
                <Bar dataKey="spent" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Status Distribution */}
        {statusDistribution.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Session Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
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
                  <Tooltip formatter={(value) => `${value} sessions`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ════ Data Table ════ */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>All Sessions</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tutor..."
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
          {isLoading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : paginatedBookings.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No sessions found</p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-4 bg-muted/30 rounded-t-lg font-semibold text-sm">
                <div>Tutor</div>
                <div>Date & Time</div>
                <div>Price</div>
                <div>Status</div>
                <div>Action</div>
              </div>

              {/* Table Body */}
              <div className="divide-y">
                {paginatedBookings.map((booking) => (
                  <div key={booking.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-0 md:items-center px-6 py-4 hover:bg-muted/50 transition-colors">
                    <div className="md:col-span-1">
                      <p className="font-medium truncate">{booking.Tutor.bio}</p>
                      <p className="text-xs text-muted-foreground">Tutor</p>
                    </div>

                    <div className="md:col-span-1">
                      <p className="text-sm font-medium">{formatBookingDateUTC(booking.startTime)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatBookingRangeUTC(booking.startTime, booking.endTime)}
                      </p>
                    </div>

                    <div className="md:col-span-1">
                      <p className="font-semibold">${booking.totalPrice}</p>
                    </div>

                    <div className="md:col-span-1">
                      <Badge variant={statusVariant[booking.status] || "outline"}>
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="md:col-span-1">
                      <Link href={`/tutors/${booking.Tutor.id}`}>
                        <Button variant="outline" size="sm" className="rounded-lg">
                          View Tutor
                        </Button>
                      </Link>
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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

      {/* ════ Profile Link ════ */}
      <div className="flex justify-center">
        <Link href="/dashboard/profile">
          <Button className="rounded-lg gap-2">
            View Your Profile & Settings
          </Button>
        </Link>
      </div>
    </div>
  )
}