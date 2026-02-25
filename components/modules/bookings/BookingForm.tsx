"use client"

import { useEffect, useState } from "react"
import { format, isBefore, startOfDay } from "date-fns"
import { createBooking } from "@/src/services/booking.service"
import { getAvailability } from "@/src/services/getAvailability.service"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"

interface Props {
  tutorId: string
}

interface Slot {
  id: string
  startTime: string
  endTime: string
  available: boolean
}

export default function BookingForm({ tutorId }: Props) {
  const [date, setDate] = useState<Date | undefined>()
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  /* ---------------- Fetch Availability ---------------- */

  useEffect(() => {
    if (!date) return

    const fetchAvailability = async () => {
      try {
        const formatted = format(date, "yyyy-MM-dd")

        const availability = await getAvailability(tutorId, formatted)

        if (!availability || availability.length === 0) {
          setSlots([])
          return
        }

        setSlots(availability)
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch availability"
        )
      }
    }

    fetchAvailability()
  }, [date, tutorId])

  /* ---------------- Submit Booking ---------------- */

  const handleSubmit = async () => {
    if (!date) {
      toast.error("Please select a date")
      return
    }

    if (!selectedSlot) {
      toast.error("Please select a time slot")
      return
    }

    try {
      setLoading(true)

      const startDateTime = new Date(selectedSlot.startTime)
      const endDateTime = new Date(selectedSlot.endTime)

      await createBooking({
        tutorId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        note,
      })

      toast.success("Booking successful!")

      // refresh slots after booking
      const formatted = format(date, "yyyy-MM-dd")
      const updated = await getAvailability(tutorId, formatted)
      setSlots(updated)

      setSelectedSlot(null)
      setNote("")
    } catch (error: any) {
      toast.error(error.message || "Failed to book session")
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          Book This Tutor
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Session</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          {/* Date Picker */}
          <div>
            <Label>Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full mt-2">
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d)
                    setSelectedSlot(null)
                  }}
                  disabled={(day) =>
                    isBefore(day, startOfDay(new Date()))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Slots */}
          <div>
            <Label>Select Time Slot</Label>

            {date && slots.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                No availability on this day
              </p>
            )}

            <div className="grid grid-cols-3 gap-2 mt-2">
              {slots.map((slot) => {
                const start = new Date(slot.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })

                const end = new Date(slot.endTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })

                return (
                  <Button
                    key={slot.id}
                    type="button"
                    disabled={!slot.available}
                    variant={
                      selectedSlot?.id === slot.id ? "default" : "outline"
                    }
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {start} - {end}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Note */}
          <div>
            <Label>Note (optional)</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
