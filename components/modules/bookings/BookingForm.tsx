"use client"

import { useEffect, useState } from "react"
import { format, isBefore, startOfDay } from "date-fns"
import { createBooking } from "@/src/services/booking.service"
import { getAvailability } from "@/src/services/getAvailability.service"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { CalendarDays, Clock, Loader2, CheckCircle } from "lucide-react"
import { cn } from "@/src/lib/utils"

interface Props {
  tutorId: string
}

interface Slot {
  id: string
  startTime: string
  endTime: string
  available: boolean
}


const formatUTCTime = (isoString: string) => {
  const date = new Date(isoString)
  const hours = date.getUTCHours().toString().padStart(2, "0")
  const minutes = date.getUTCMinutes().toString().padStart(2, "0")
  const h = date.getUTCHours()
  const ampm = h >= 12 ? "PM" : "AM"
  const h12 = h % 12 || 12
  return `${h12}:${minutes} ${ampm}`
}

export default function BookingForm({ tutorId }: Props) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>()
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [booked, setBooked] = useState(false)

  const fetchSlots = async (selectedDate: Date) => {
    try {
      setSlotsLoading(true)
      const formatted = format(selectedDate, "yyyy-MM-dd")
      const availability = await getAvailability(tutorId, formatted)
      setSlots(availability ?? [])
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch availability")
      setSlots([])
    } finally {
      setSlotsLoading(false)
    }
  }

  useEffect(() => {
    if (!date) return
    setSelectedSlot(null)
    setSlots([])
    fetchSlots(date)
  }, [date, tutorId])

  const handleSubmit = async () => {
    if (!date) return toast.error("Please select a date")
    if (!selectedSlot) return toast.error("Please select a time slot")

    try {
      setLoading(true)
      await createBooking({
        tutorId,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        note,
      })

      setBooked(true)
      toast.success("Booking successful!")

      // Refresh slots
      const formatted = format(date, "yyyy-MM-dd")
      const updated = await getAvailability(tutorId, formatted)
      setSlots(updated ?? [])
      setSelectedSlot(null)
      setNote("")
    } catch (error: any) {
      toast.error(error.message || "Failed to book session")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (val: boolean) => {
    setOpen(val)
    if (!val) {
      // Reset on close
      setDate(undefined)
      setSlots([])
      setSelectedSlot(null)
      setNote("")
      setBooked(false)
    }
  }

  const availableCount = slots.filter((s) => s.available).length

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          Book This Tutor
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Book a Session
          </DialogTitle>
        </DialogHeader>

        {/* Success state */}
        {booked ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />
            <div>
              <p className="text-lg font-semibold">Booking Confirmed!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Check your dashboard to view session details.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setBooked(false)}>
                Book Another
              </Button>
              <Button className="flex-1" onClick={() => handleOpenChange(false)}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">

            {/* Step 1 — Date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <CalendarDays className="w-4 h-4" />
                Step 1 — Select a Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="w-4 h-4 mr-2" />
                    {date ? format(date, "EEEE, MMMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => setDate(d)}
                    disabled={(day) => isBefore(day, startOfDay(new Date()))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Step 2 — Time slots */}
            {date && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm font-medium">
                      <Clock className="w-4 h-4" />
                      Step 2 — Select a Time Slot
                    </span>
                    {!slotsLoading && slots.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {availableCount} available
                      </Badge>
                    )}
                  </Label>

                  {slotsLoading ? (
                    <div className="flex items-center justify-center py-6 text-muted-foreground gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Loading slots...</span>
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="py-6 text-center rounded-lg border border-dashed">
                      <Clock className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                      <p className="text-sm font-medium">No availability</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        This tutor has no slots on {format(date, "EEEE")}. Try another day.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {slots.map((slot) => {
                        const isSelected = selectedSlot?.id === slot.id
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => setSelectedSlot(slot)}
                            className={cn(
                              "relative flex flex-col items-center justify-center rounded-lg border px-3 py-3 text-sm transition-all",
                              slot.available
                                ? isSelected
                                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                  : "border-border hover:border-primary/50 hover:bg-muted cursor-pointer"
                                : "border-dashed bg-muted/30 text-muted-foreground cursor-not-allowed opacity-60"
                            )}
                          >
                            <span className="font-semibold">
                              {formatUTCTime(slot.startTime)}
                            </span>
                            <span className={cn(
                              "text-xs mt-0.5",
                              isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                            )}>
                              to {formatUTCTime(slot.endTime)}
                            </span>
                            {!slot.available && (
                              <span className="absolute top-1.5 right-2 text-xs bg-muted rounded px-1">
                                Booked
                              </span>
                            )}
                            {isSelected && (
                              <CheckCircle className="absolute top-1.5 right-2 w-3.5 h-3.5" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Step 3 — Note + Confirm */}
            {selectedSlot && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Step 3 — Add a Note <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Tell the tutor what you'd like to focus on..."
                    rows={3}
                  />
                </div>

                {/* Summary */}
                <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{format(date!, "PPP")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium">
                      {formatUTCTime(selectedSlot.startTime)} – {formatUTCTime(selectedSlot.endTime)}
                    </span>
                  </div>
                </div>

                <Button onClick={handleSubmit} disabled={loading} className="w-full" size="lg">
                  {loading
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Booking...</>
                    : "Confirm Booking"
                  }
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}