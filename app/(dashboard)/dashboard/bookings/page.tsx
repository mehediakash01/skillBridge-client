"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getMyBookings,
  cancelBooking,
  submitReview,
  type Booking,
} from "@/src/services/booking.service"
import { format } from "date-fns"
import { toast } from "sonner"
import { Star, ExternalLink, Loader2 } from "lucide-react"
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
import { CalendarDays } from "lucide-react"
import Link from "next/link"

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  confirmed: "default",
  completed: "secondary",
  cancelled: "destructive",
  pending: "outline",
}

// ── Star Rating Component ─────────────────────────────────
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
            className={`w-7 h-7 transition-colors ${
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
      toast.success("Review submitted!")
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] })
      setOpen(false)
      setRating(0)
      setComment("")
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const handleSubmit = () => {
    if (rating === 0) return toast.error("Please select a rating")
    if (!comment.trim()) return toast.error("Please write a comment")
    submit({ bookingId: booking.id, rating, comment: comment.trim() })
  }

  if (alreadyReviewed) {
    const review = booking.reviews[0]
    return (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span>{Number(review.rating).toFixed(1)} reviewed</span>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-200 hover:bg-yellow-50">
          <Star className="w-3.5 h-3.5 mr-1" />
          Review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Session with <span className="font-medium text-foreground">{booking.Tutor.bio}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(booking.startTime), "PPP")} ·{" "}
              {format(new Date(booking.startTime), "p")} –{" "}
              {format(new Date(booking.endTime), "p")}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div className="space-y-2">
            <Label>Comment</Label>
            <Textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was your session? Was the tutor helpful?"
            />
          </div>

          <Button onClick={handleSubmit} disabled={isPending} className="w-full">
            {isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>
            ) : (
              "Submit Review"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


const canReview = (booking: Booking) => {
  const alreadyReviewed = booking.reviews && booking.reviews.length > 0
  if (alreadyReviewed) return true 
  return (
    booking.status === "completed" ||
    (booking.status === "confirmed" && !!booking.meetingLink)
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground mt-1">All your tutoring sessions in one place</p>
      </div>

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
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground">
              <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No bookings yet</p>
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
                    <TableCell>{format(new Date(booking.startTime), "PPP")}</TableCell>
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
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        {/* Join Meeting button */}
                        {booking.meetingLink && booking.status === "confirmed" && (
                          <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="gap-1.5">
                              <ExternalLink className="w-3.5 h-3.5" />
                              Join
                            </Button>
                          </a>
                        )}

                        {/* Review button/badge */}
                        {canReview(booking) && (
                          <ReviewDialog booking={booking} />
                        )}

                        {/* Cancel button */}
                        {booking.status === "confirmed" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                                Cancel
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Your session on {format(new Date(booking.startTime), "PPP")} will be
                                  cancelled. This cannot be undone.
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
                        )}
                      </div>
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