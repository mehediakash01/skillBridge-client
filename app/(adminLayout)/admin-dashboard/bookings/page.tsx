"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getAdminBookings } from "@/src/services/admin.service"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { CalendarDays, Search, CheckCircle2, Clock, XCircle, AlertCircle, Filter } from "lucide-react"

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  confirmed: "default",
  completed: "secondary",
  cancelled: "destructive",
  pending: "outline",
}

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  confirmed: { icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
  completed: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
  pending: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
}

export default function AdminBookingsPage() {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: getAdminBookings,
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  // Calculate stats
  const stats = [
    { label: "Total Bookings", value: bookings.length, icon: CalendarDays, color: "from-blue-50 to-blue-100/50", accent: "text-blue-600" },
    { label: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length, icon: Clock, color: "from-blue-50 to-blue-100/50", accent: "text-blue-600" },
    { label: "Completed", value: bookings.filter(b => b.status === "completed").length, icon: CheckCircle2, color: "from-green-50 to-green-100/50", accent: "text-green-600" },
    { label: "Cancelled", value: bookings.filter(b => b.status === "cancelled").length, icon: XCircle, color: "from-red-50 to-red-100/50", accent: "text-red-600" },
  ]

  // Filter bookings
  const filtered = bookings.filter(booking => {
    const matchesSearch = searchQuery === "" || 
      booking.Student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.Student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.Tutor.Student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.Tutor.Student.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === null || booking.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings Management</h1>
        <p className="text-muted-foreground mt-2">View and manage all bookings across the platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={`rounded-2xl border bg-gradient-to-br ${stat.color} p-6`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16 mt-2" />
                  ) : (
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-lg bg-white/50 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.accent}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by student or tutor name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl h-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={statusFilter === null ? "default" : "outline"}
            onClick={() => setStatusFilter(null)}
            className="rounded-xl gap-1.5"
          >
            <Filter className="w-4 h-4" />
            All
          </Button>
          {Object.keys(statusVariant).map((status) => (
            <Button
              key={status}
              size="sm"
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
              className="rounded-xl capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Bookings Table/Cards */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32 flex-1" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">
            <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-semibold text-foreground">No bookings found</p>
            <p className="mt-1 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Tutor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{booking.Student.name}</p>
                          <p className="text-xs text-muted-foreground">{booking.Student.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{booking.Tutor.Student.name}</p>
                          <p className="text-xs text-muted-foreground">{booking.Tutor.Student.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(booking.startTime), "PP")}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(booking.startTime), "p")} –{" "}
                        {format(new Date(booking.endTime), "p")}
                      </TableCell>
                      <TableCell className="font-bold text-green-600">${booking.totalPrice}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[booking.status]} className="rounded-full capitalize">
                          {booking.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden p-4 space-y-4">
              {filtered.map((booking) => {
                const StatusIcon = statusConfig[booking.status]?.icon || AlertCircle
                return (
                  <div key={booking.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{booking.Student.name}</p>
                        <p className="text-xs text-muted-foreground">{booking.Student.email}</p>
                      </div>
                      <Badge variant={statusVariant[booking.status]} className="rounded-full capitalize text-xs">
                        {booking.status}
                      </Badge>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4 pb-4 border-b">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tutor:</span>
                        <span className="font-medium">{booking.Tutor.Student.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{format(new Date(booking.startTime), "PP")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-medium">
                          {format(new Date(booking.startTime), "p")} – {format(new Date(booking.endTime), "p")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-bold text-green-600">${booking.totalPrice}</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${statusConfig[booking.status]?.bg}`}>
                        <StatusIcon className={`w-4 h-4 ${statusConfig[booking.status]?.color}`} />
                        <span className={`text-xs font-medium capitalize ${statusConfig[booking.status]?.color}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Results info */}
      {!isLoading && filtered.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> of <span className="font-semibold text-foreground">{bookings.length}</span> bookings
        </div>
      )}
    </div>
  )
}