"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getTutorBookings, completeBooking } from "@/src/services/tutor.service"
import { cancelBooking } from "@/src/services/booking.service"
import { format, differenceInDays, isPast } from "date-fns"
import { toast } from "sonner"
import { CalendarDays, CheckCircle2, Clock, Link2, Loader2, User, DollarSign, TrendingUp, AlertCircle, Video, Calendar } from "lucide-react"
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

const BASE_URL = "http://localhost:5000/api"

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  confirmed: "default",
  completed: "secondary",
  cancelled: "destructive",
  pending: "outline",
}

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
            <p className="text-sm font-medium">{format(new Date(booking.startTime), "MMM dd, yyyy")}</p>
            {nextSession && daysUntil >= 0 && (
              <p className="text-xs text-blue-600 mt-1">{daysUntil === 0 ? "Today" : `In ${daysUntil} days`}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">Time</p>
            <p className="text-sm font-medium">{format(new Date(booking.startTime), "h:mm a")} - {format(new Date(booking.endTime), "h:mm a")}</p>
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
  const totalEarnings = bookings.reduce((sum, b) => sum + (b.status === "completed" ? Number(b.totalPrice) : 0), 0)
  const pendingEarnings = confirmed.reduce((sum, b) => sum + Number(b.totalPrice), 0)

  const stats = [
    { label: "Upcoming Sessions", value: confirmed.length, icon: Clock, color: "from-blue-50 to-blue-100/50", accent: "text-blue-600" },
    { label: "Completed Sessions", value: completed.length, icon: CheckCircle2, color: "from-green-50 to-green-100/50", accent: "text-green-600" },
    { label: "Total Earnings", value: `$${totalEarnings}`, icon: DollarSign, color: "from-purple-50 to-purple-100/50", accent: "text-purple-600" },
    { label: "Pending Earnings", value: `$${pendingEarnings}`, icon: TrendingUp, color: "from-amber-50 to-amber-100/50", accent: "text-amber-600" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sessions Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage and track all your tutoring sessions</p>
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
                    <Skeleton className="h-8 w-20 mt-2" />
                  ) : (
                    <p className="text-2xl lg:text-3xl font-bold mt-2">{stat.value}</p>
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

      {/* Upcoming Sessions Section */}
      {confirmed.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Upcoming Sessions</h2>
              <p className="text-sm text-muted-foreground mt-1">{confirmed.length} session{confirmed.length !== 1 ? "s" : ""} waiting for you</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {confirmed.map((booking: any) => (
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

      {/* Completed Sessions Section */}
      {completed.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Completed Sessions</h2>
              <p className="text-sm text-muted-foreground mt-1">{completed.length} session{completed.length !== 1 ? "s" : ""} completed</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {completed.map((booking: any) => (
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

      {/* Empty State */}
      {isLoading === false && bookings.length === 0 && (
        <div className="rounded-2xl border border-dashed bg-card p-16 text-center">
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

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      )}
    </div>
  )
}