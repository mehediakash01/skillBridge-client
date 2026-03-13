"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getMyBookings,
  cancelBooking,
  submitReview,
  type Booking,
} from "@/src/services/booking.service"
import { formatBookingDateUTC, formatBookingRangeUTC } from "@/src/lib/booking-time"
import { toast } from "sonner"
import { Star, ExternalLink, Loader2, CalendarDays, VideoOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link"

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  confirmed: "default",
  completed: "secondary",
  cancelled: "destructive",
  pending: "outline",
}

// ── LocalStorage key for tracking joined sessions ─────────
const joinedKey = (bookingId: string) => `joined_session_${bookingId}`

// ── Star Rating ───────────────────────────────────────────
function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              star <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  )
}

// ── Review Dialog ─────────────────────────────────────────
function ReviewDialog({ booking }: { booking: Booking }) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")

  const alreadyReviewed = booking.reviews && booking.reviews.length > 0

  const { mutate: submit, isPending } = useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      toast.success("Review submitted! Thank you for your feedback.")
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] })
      setOpen(false)
      setRating(0)
      setComment("")
    },
    onError: (err: Error) => toast.error(err.message),
  })

  // Already reviewed — show star badge only
  if (alreadyReviewed) {
    const review = booking.reviews[0]
    return (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-yellow-50 border border-yellow-100 rounded-full px-3 py-1">
        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
        <span className="font-medium text-yellow-700">{Number(review.rating).toFixed(1)}</span>
        <span className="text-yellow-600">reviewed</span>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 gap-1.5"
        >
          <Star className="w-3.5 h-3.5" />
          Leave Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How was your session?</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="font-medium text-sm">{booking.Tutor.bio}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatBookingDateUTC(booking.startTime)} ·{" "}
              {formatBookingRangeUTC(booking.startTime, booking.endTime)}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Your Rating</Label>
            <StarRating value={rating} onChange={setRating} />
            <p className="text-xs text-muted-foreground">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent!"}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Your Comment</Label>
            <Textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this tutor..."
            />
          </div>

          <Button onClick={() => {
            if (rating === 0) return toast.error("Please select a rating")
            if (!comment.trim()) return toast.error("Please write a comment")
            submit({ bookingId: booking.id, rating, comment: comment.trim() })
          }} disabled={isPending} className="w-full">
            {isPending
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>
              : "Submit Review"
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Actions cell logic ────────────────────────────────────
function BookingActions({
  booking,
  onCancel,
  cancelling,
}: {
  booking: Booking
  onCancel: (id: string) => void
  cancelling: boolean
}) {
  const [hasJoined, setHasJoined] = useState(false)

  // Read join state from localStorage on mount
  useEffect(() => {
    const joined = localStorage.getItem(joinedKey(booking.id))
    if (joined === "true") setHasJoined(true)
  }, [booking.id])

  const handleJoin = () => {
    // Mark as joined in localStorage
    localStorage.setItem(joinedKey(booking.id), "true")
    setHasJoined(true)
    window.open(booking.meetingLink!, "_blank", "noopener,noreferrer")
  }

  const alreadyReviewed = booking.reviews && booking.reviews.length > 0
  const hasMeetingLink = !!booking.meetingLink

  // ── CANCELLED ─────────────────────────────────────────
  if (booking.status === "cancelled") {
    return <span className="text-sm text-muted-foreground">—</span>
  }

  // ── COMPLETED ─────────────────────────────────────────
  if (booking.status === "completed") {
    return (
      <div className="flex items-center justify-end gap-2">
        {/* Meeting link expired */}
        {hasMeetingLink && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-full px-3 py-1 cursor-default">
                  <VideoOff className="w-3.5 h-3.5" />
                  Session ended
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>This session has been completed by the tutor</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {/* Review — available after completed */}
        <ReviewDialog booking={booking} />
      </div>
    )
  }

  // ── CONFIRMED ─────────────────────────────────────────
  return (
    <div className="flex items-center justify-end gap-2 flex-wrap">

      {/* Join button — only if link exists */}
      {hasMeetingLink ? (
        <Button
          size="sm"
          onClick={handleJoin}
          className="gap-1.5"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {hasJoined ? "Rejoin" : "Join Session"}
        </Button>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-full px-3 py-1 cursor-default">
                <VideoOff className="w-3.5 h-3.5" />
                Awaiting link
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tutor hasn't added a meeting link yet</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Review — only after joining */}
      {hasJoined && !alreadyReviewed && (
        <ReviewDialog booking={booking} />
      )}

      {/* Already reviewed badge */}
      {alreadyReviewed && <ReviewDialog booking={booking} />}

      {/* Cancel — only if tutor hasn't added a link yet */}
      {!hasMeetingLink && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Cancel
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
              <AlertDialogDescription>
                Your session on {formatBookingDateUTC(booking.startTime)} from{" "}
                {formatBookingRangeUTC(booking.startTime, booking.endTime)} will be cancelled.
                This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep it</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => onCancel(booking.id)}
                disabled={cancelling}
              >
                Yes, cancel
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────
export default function BookingsPage() {
  const queryClient = useQueryClient()

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
  })

  const { mutate: cancel, isPending: cancelling } = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      toast.success("Booking cancelled")
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const confirmed = bookings.filter((b) => b.status === "confirmed")
  const completed = bookings.filter((b) => b.status === "completed")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground mt-1">All your tutoring sessions in one place</p>
      </div>

      {/* Quick stats */}
      {!isLoading && bookings.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total", value: bookings.length },
            { label: "Upcoming", value: confirmed.length },
            { label: "Completed", value: completed.length },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-4 pb-4">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Sessions</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40 flex-1" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground">
              <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No bookings yet</p>
              <p className="text-sm mt-1">Browse tutors and book your first session</p>
              <Link href="/tutors">
                <Button variant="link" className="mt-2 h-auto p-0">Browse tutors →</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tutor</TableHead>
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
                    <TableCell className="font-medium">{booking.Tutor.bio}</TableCell>
                    <TableCell>{formatBookingDateUTC(booking.startTime)}</TableCell>
                    <TableCell className="text-sm">
                      {formatBookingRangeUTC(booking.startTime, booking.endTime)}
                    </TableCell>
                    <TableCell className="font-medium">${booking.totalPrice}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[booking.status]}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <BookingActions
                        booking={booking}
                        onCancel={cancel}
                        cancelling={cancelling}
                      />
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