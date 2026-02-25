"use client"

import { useQuery } from "@tanstack/react-query"
import { getMyBookings } from "@/src/services/booking.service"
import { useSession } from "@/src/hooks/useSession"
import { CalendarDays, CheckCircle, Clock, XCircle } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
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

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  confirmed: "default",
  completed: "secondary",
  cancelled: "destructive",
}

export default function DashboardPage() {
  const { data: session } = useSession()

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
  })

  const confirmed = bookings.filter((b) => b.status === "confirmed")
  const completed = bookings.filter((b) => b.status === "completed")
  const cancelled = bookings.filter((b) => b.status === "cancelled")
  const upcoming = confirmed.slice(0, 3)

  const stats = [
    { label: "Upcoming", value: confirmed.length, icon: Clock, color: "text-blue-600" },
    { label: "Completed", value: completed.length, icon: CheckCircle, color: "text-green-600" },
    { label: "Cancelled", value: cancelled.length, icon: XCircle, color: "text-red-500" },
    { label: "Total Sessions", value: bookings.length, icon: CalendarDays, color: "text-purple-600" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {session?.user?.name ?? "Student"} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your tutoring sessions
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-12 mt-1" />
                    ) : (
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    )}
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Upcoming sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">Upcoming Sessions</CardTitle>
          <Link href="/dashboard/bookings">
            <Button variant="ghost" size="sm">View all</Button>
          </Link>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-60" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : upcoming.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No upcoming sessions.</p>
              <Link href="/tutors">
                <Button variant="link" className="mt-1 h-auto p-0">
                  Browse tutors →
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {upcoming.map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 p-5">
                  <Avatar>
                    <AvatarFallback>{booking.Tutor.bio.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{booking.Tutor.bio}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(booking.startTime), "PPP")} ·{" "}
                      {format(new Date(booking.startTime), "p")} –{" "}
                      {format(new Date(booking.endTime), "p")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-semibold">${booking.totalPrice}</span>
                    <Badge variant={statusVariant[booking.status]}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}