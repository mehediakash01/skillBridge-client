"use client"

import { useQuery } from "@tanstack/react-query"
import { getAdminBookings } from "@/src/services/admin.service"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { CalendarDays } from "lucide-react"

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  confirmed: "default",
  completed: "secondary",
  cancelled: "destructive",
  pending: "outline",
}

export default function AdminBookingsPage() {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: getAdminBookings,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bookings</h1>
        <p className="text-muted-foreground mt-1">All bookings across the platform</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            All Bookings{" "}
            {!isLoading && (
              <span className="text-muted-foreground font-normal">({bookings.length})</span>
            )}
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
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
          ) : bookings.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground">
              <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No bookings yet</p>
            </div>
          ) : (
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
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
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
                    <TableCell className="font-medium">${booking.totalPrice}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[booking.status]}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}