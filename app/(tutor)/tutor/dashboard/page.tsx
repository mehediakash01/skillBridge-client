"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getTutorBookings, completeBooking } from "@/src/services/tutor.service"
import { cancelBooking } from "@/src/services/booking.service"
import { format } from "date-fns"
import { toast } from "sonner"
import { CalendarDays, CheckCircle, Clock, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  confirmed: "default",
  completed: "secondary",
  cancelled: "destructive",
  pending: "outline",
}

export default function TutorSessionsPage() {
  const queryClient = useQueryClient()

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

  const stats = [
    { label: "Upcoming", value: confirmed.length, icon: Clock, color: "text-blue-600" },
    { label: "Completed", value: completed.length, icon: CheckCircle, color: "text-green-600" },
    { label: "Total", value: bookings.length, icon: CalendarDays, color: "text-purple-600" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Sessions</h1>
        <p className="text-muted-foreground mt-1">Manage your tutoring sessions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
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

      {/* Sessions table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">All Sessions</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40 flex-1" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground">
              <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No sessions yet</p>
              <p className="text-sm mt-1">Sessions will appear here once students book you</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={booking.Student.image ?? ""} />
                          <AvatarFallback>
                            {booking.Student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{booking.Student.name}</p>
                          <p className="text-xs text-muted-foreground">{booking.Student.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(booking.startTime), "PPP")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(booking.startTime), "p")} –{" "}
                      {format(new Date(booking.endTime), "p")}
                    </TableCell>
                    <TableCell>${booking.totalPrice}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[booking.status]}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {booking.status === "confirmed" && (
                        <div className="flex items-center justify-end gap-2">
                          {/* Complete */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                                Complete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Mark as completed?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will mark the session with {booking.Student.name} on{" "}
                                  {format(new Date(booking.startTime), "PPP")} as completed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => complete(booking.id)}
                                  disabled={completing}
                                >
                                  Yes, complete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          {/* Cancel */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                                Cancel
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel this session?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will cancel the session with {booking.Student.name}. This cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Keep it</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => cancel(booking.id)}
                                  disabled={cancelling}
                                >
                                  Yes, cancel
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
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