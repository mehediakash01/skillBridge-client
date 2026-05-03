"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getTutorBookings, completeBooking } from "@/src/services/tutor.service"
import { cancelBooking } from "@/src/services/booking.service"
import { differenceInDays, isPast } from "date-fns"
import { formatBookingDateUTC, formatBookingRangeUTC } from "@/src/lib/booking-time"
import { toast } from "sonner"
import { 
  CalendarDays, CheckCircle2, Clock, Link2, Loader2, User, DollarSign, TrendingUp, AlertCircle, 
  Video, Calendar, ChevronLeft, ChevronRight, Search, Filter, Star
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"

const BASE_URL = process.env.API_URL || "https://skill-bridge-server-tau.vercel.app/api"

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  confirmed: "default",
  completed: "secondary",
  cancelled: "destructive",
  pending: "outline",
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

// ── Meeting Link Dialog ───────────────────────────────────
function MeetingLinkDialog({ bookingId, currentLink }: { bookingId: string; currentLink?: string | null }) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [link, setLink] = useState(currentLink ?? "")

  const { mutate: saveLink, isPending } = useMutation({
    mutationFn: async (meetingLink: string) => {
      const res = await fetch(`${BASE_URL}/bookings/${bookingId}/meeting-link`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ meetingLink }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Failed to save link")
      }
      return res.json()
    },
    onSuccess: () => {
      toast.success("Meeting link saved! Student can now join.")
      queryClient.invalidateQueries({ queryKey: ["tutor-bookings"] })
      setOpen(false)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const handleSave = () => {
    if (!link.trim()) return toast.error("Please enter a meeting link")
    if (!link.startsWith("http")) return toast.error("Please enter a valid URL")
    saveLink(link.trim())
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className={`rounded-lg gap-1.5 ${currentLink
            ? "text-green-600 border-green-200 hover:bg-green-50"
            : "text-blue-600 border-blue-200 hover:bg-blue-50"
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          {currentLink ? "Edit" : "Add"} Link
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Meeting Link</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground">
            Paste your Google Meet, Zoom, or any video call link. The student will see a
            <span className="font-medium text-foreground"> "Join Meeting"</span> button in their dashboard.
          </p>
          <Input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://meet.google.com/xxx-xxxx-xxx"
            className="rounded-lg h-10"
          />
          <Button onClick={handleSave} disabled={isPending} className="w-full rounded-lg">
            {isPending
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
              : "Save Link"
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Session Card Component ─────────────────────────────────
function SessionCard({ booking, completing, cancelling, onComplete, onCancel }: any) {
  const nextSession = !isPast(new Date(booking.endTime))
  const daysUntil = differenceInDays(new Date(booking.startTime), new Date())

  return (
    <div className="rounded-2xl border bg-card overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className={`px-6 py-4 border-b ${nextSession ? 'bg-blue-50/50' : 'bg-muted/30'}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Avatar className="h-12 w-12 border-2 border-muted">
              <AvatarImage src={booking.Student.image ?? ""} />
              <AvatarFallback className="text-sm font-bold">{booking.Student.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{booking.Student.name}</p>
              <p className="text-sm text-muted-foreground">{booking.Student.email}</p>
            </div>
          </div>
          <Badge variant={statusVariant[booking.status]} className="rounded-full">
            {booking.status}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4 space-y-4">
        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">Date</p>
            <p className="text-sm font-medium">{formatBookingDateUTC(booking.startTime)}</p>
            {nextSession && daysUntil >= 0 && (
              <p className="text-xs text-blue-600 mt-1">{daysUntil === 0 ? "Today" : `In ${daysUntil} days`}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">Time</p>
            <p className="text-sm font-medium">{formatBookingRangeUTC(booking.startTime, booking.endTime)}</p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <span className="text-sm text-muted-foreground">Total Price</span>
          <span className="text-lg font-bold text-green-600">${booking.totalPrice}</span>
        </div>

        {/* Meeting Link Status */}
        {booking.status === "confirmed" && (
          <div className={`flex items-center gap-2 p-3 rounded-lg border ${booking.meetingLink ? 'bg-green-50/50 border-green-200' : 'bg-amber-50/50 border-amber-200'}`}>
            <AlertCircle className={`w-4 h-4 ${booking.meetingLink ? 'text-green-600' : 'text-amber-600'}`} />
            <span className={`text-sm ${booking.meetingLink ? 'text-green-700' : 'text-amber-700'}`}>
              {booking.meetingLink ? "Meeting link added" : "No meeting link yet"}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      {booking.status === "confirmed" && (
        <>
          <Separator />
          <div className="px-6 py-4 flex items-center gap-2 flex-wrap justify-end">
            <MeetingLinkDialog bookingId={booking.id} currentLink={booking.meetingLink} />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 rounded-lg gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Complete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Mark as completed?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will mark the session with {booking.Student.name} as completed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onComplete(booking.id)} disabled={completing}>
                    {completing ? "Completing..." : "Yes, complete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 rounded-lg gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this session?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will cancel the session with {booking.Student.name}. Cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep it</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => onCancel(booking.id)} disabled={cancelling}>
                    {cancelling ? "Cancelling..." : "Yes, cancel"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────
export default function TutorSessionsPage() {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const itemsPerPage = 5

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["tutor-bookings"],
    queryFn: getTutorBookings,
  })

  const { mutate: complete, isPending: completing } = useMutation({
    mutationFn: completeBooking,
    onSuccess: () => {
      toast.success("Session marked as completed")
      queryClient.invalidateQueries({ queryKey: ["tutor-bookings"] })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const { mutate: cancel, isPending: cancelling } = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      toast.success("Session cancelled")
      queryClient.invalidateQueries({ queryKey: ["tutor-bookings"] })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const confirmed = bookings.filter((b) => b.status === "confirmed")
  const completed = bookings.filter((b) => b.status === "completed")
  const cancelled = bookings.filter((b) => b.status === "cancelled")
  const totalEarnings = bookings.reduce((sum, b) => sum + (b.status === "completed" ? Number(b.totalPrice) : 0), 0)
  const pendingEarnings = confirmed.reduce((sum, b) => sum + Number(b.totalPrice), 0)
  const avgRating = completed.length > 0 ? 4.7 : 0
  const completionRate = bookings.length > 0 ? Math.round((completed.length / bookings.length) * 100) : 0

  const stats = [
    { label: "Total Earnings", value: `$${totalEarnings}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Upcoming Sessions", value: confirmed.length, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Avg Rating", value: avgRating.toFixed(1), icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Completion Rate", value: `${completionRate}%`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
  ]

  // ── Chart Data - Dynamic from Database ────────────────
  const earningsData = (() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const dailyEarnings: Record<string, number> = {}
    
    // Initialize with 0 for each day
    days.forEach(day => {
      dailyEarnings[day] = 0
    })
    
    // Add earnings from completed bookings
    completed.forEach(b => {
      const date = new Date(b.startTime)
      const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1] // Convert to Mon-Sun format
      dailyEarnings[dayName] += Number(b.totalPrice)
    })

    return days.map(day => ({
      day,
      earnings: dailyEarnings[day],
    }))
  })()

  const statusDistribution = [
    { name: "Confirmed", value: confirmed.length },
    { name: "Completed", value: completed.length },
    { name: "Cancelled", value: cancelled.length },
  ].filter(item => item.value > 0)

  // ── Filter & Paginate ────────────────────────────────
  const filtered = bookings.filter(b => {
    const matchesSearch = b.Student.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Sessions Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage and track all your tutoring sessions</p>
        </div>
        <Link href="/tutor/profile">
          <Button className="gap-2 rounded-lg">View Profile</Button>
        </Link>
      </div>

      {/* ════ Stats Grid ════ */}
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
        {/* Line Chart - Earnings Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ borderRadius: "8px" }} formatter={(value) => `$${value}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
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
            <CardTitle>All Bookings</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search student..."
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
              <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-4 bg-muted/30 rounded-t-lg font-semibold text-sm">
                <div>Student</div>
                <div>Date & Time</div>
                <div>Duration</div>
                <div>Price</div>
                <div>Status</div>
                <div>Action</div>
              </div>

              {/* Table Body */}
              <div className="divide-y">
                {paginatedBookings.map((booking: any) => (
                  <div key={booking.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-0 md:items-center px-6 py-4 hover:bg-muted/50 transition-colors">
                    <div className="md:col-span-1">
                      <p className="font-medium truncate">{booking.Student.name}</p>
                      <p className="text-xs text-muted-foreground">{booking.Student.email}</p>
                    </div>

                    <div className="md:col-span-1">
                      <p className="text-sm font-medium">{formatBookingDateUTC(booking.startTime)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatBookingRangeUTC(booking.startTime, booking.endTime)}
                      </p>
                    </div>

                    <div className="md:col-span-1">
                      <p className="text-sm">1 hour</p>
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
                      {booking.status === "confirmed" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="gap-1 rounded-lg h-8">
                              <Video className="w-3 h-3" />
                              Add Link
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Meeting Link</DialogTitle>
                            </DialogHeader>
                            <Input placeholder="https://meet.google.com/..." className="rounded-lg" />
                            <Button className="w-full rounded-lg">Save Link</Button>
                          </DialogContent>
                        </Dialog>
                      )}
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

      {/* Session Cards for Quick Actions */}
      {confirmed.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">Quick Actions</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage your upcoming sessions</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {confirmed.slice(0, 2).map((booking: any) => (
              <SessionCard
                key={booking.id}
                booking={booking}
                completing={completing}
                cancelling={cancelling}
                onComplete={complete}
                onCancel={cancel}
              />
            ))}
          </div>
        </div>
      )}

      {/* ════ Empty State ════ */}
      {isLoading === false && bookings.length === 0 && (
        <div className="rounded-lg border border-dashed bg-card p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <CalendarDays className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-semibold text-foreground mt-4">No sessions yet</p>
          <p className="text-muted-foreground mt-2">Start by telling students about your availability</p>
          <Button className="mt-6 rounded-lg gap-2">
            <Calendar className="w-4 h-4" />
            Update Availability
          </Button>
        </div>
      )}

      {/* ════ Loading State ════ */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      )}
    </div>
  )
}