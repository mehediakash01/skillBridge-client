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

export default function BookingForm({ tutorId }: Props) {
  const [date, setDate] = useState<Date | undefined>()
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  const [slots, setSlots] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  /* ---------------- Fetch Availability ---------------- */

 useEffect(() => {
  if (!date) return

  const fetchAvailability = async () => {
    try {
      const formatted = format(date, "yyyy-MM-dd")
      console.log("Tutor ID:", tutorId)
      console.log("Date:", formatted)

      const availability = await getAvailability(tutorId, formatted)

      console.log("Availability Response:", availability)

      if (!availability || availability.length === 0) {
        setSlots([])
        return
      }

      
    } catch (error: any) {
      console.error("Availability Error:", error)
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

      const [start, end] = selectedSlot.split("-")

      const startDateTime = new Date(date)
      const [sh, sm] = start.split(":")
      startDateTime.setHours(Number(sh))
      startDateTime.setMinutes(Number(sm))
      startDateTime.setSeconds(0)

      const endDateTime = new Date(date)
      const [eh, em] = end.split(":")
      endDateTime.setHours(Number(eh))
      endDateTime.setMinutes(Number(em))
      endDateTime.setSeconds(0)

      await createBooking({
        tutorId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        note,
      })

      toast.success("Booking successful!")

      // Reset form
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
                  onSelect={setDate}
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
              {slots.map((slot) => (
                <Button
                  key={slot}
                  type="button"
                  variant={selectedSlot === slot ? "default" : "outline"}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </Button>
              ))}
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
