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
import { toast } from "sonner"
import { CalendarDays, Clock, Loader2, CheckCircle, Sparkles } from "lucide-react"
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
      toast.success("Booking confirmed!")

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
      setDate(undefined)
      setSlots([])
      setSelectedSlot(null)
      setNote("")
      setBooked(false)
    }
  }

  const availableCount = slots.filter((s) => s.available).length

  return (
    <>
      {/* Font import */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <button
            className="relative w-full group overflow-hidden rounded-xl py-4 px-6 font-medium text-sm tracking-wide transition-all"
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.03em",
              color: "#0a0a0a",
              boxShadow: "0 0 0 1px rgba(245,158,11,0.3), 0 4px 24px rgba(245,158,11,0.15)",
            }}
          >
            <span className="relative flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Book This Tutor
            </span>
            {/* Shimmer */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </button>
        </DialogTrigger>

        <DialogContent
          className="sm:max-w-lg border-0 p-0 overflow-hidden"
          style={{ background: "#111113" }}
        >
          {/* Top shimmer line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle
                className="flex items-center gap-2.5 text-xl text-white"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: 400 }}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 text-amber-400" />
                </div>
                Book a Session
              </DialogTitle>
            </DialogHeader>

            {/* ── Success state ── */}
            {booked ? (
              <div className="py-10 text-center space-y-5">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <div>
                  <p
                    className="text-2xl text-white"
                    style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: 400 }}
                  >
                    Booking Confirmed
                  </p>
                  <p className="text-sm text-zinc-500 mt-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Check your dashboard to view session details.
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setBooked(false)}
                    className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Book Another
                  </button>
                  <button
                    onClick={() => handleOpenChange(false)}
                    className="flex-1 py-3 rounded-xl text-sm font-medium text-zinc-900 transition-all"
                    style={{
                      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">

                {/* Step 1 — Date */}
                <div className="space-y-2.5">
                  <StepLabel step={1} label="Select a Date" icon={<CalendarDays className="w-3.5 h-3.5" />} />
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className={cn(
                          "w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl border transition-all text-sm",
                          date
                            ? "border-amber-400/40 bg-amber-400/5 text-white"
                            : "border-zinc-700 bg-zinc-800/50 text-zinc-500 hover:border-zinc-600"
                        )}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <CalendarDays className={cn("w-4 h-4 shrink-0", date ? "text-amber-400" : "text-zinc-600")} />
                        {date ? format(date, "EEEE, MMMM d, yyyy") : "Pick a date"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 border-zinc-700"
                      style={{ background: "#1a1a1d" }}
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => setDate(d)}
                        disabled={(day) => isBefore(day, startOfDay(new Date()))}
                        initialFocus
                        className="text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Step 2 — Time slots */}
                {date && (
                  <>
                    <Divider />
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <StepLabel step={2} label="Select a Time Slot" icon={<Clock className="w-3.5 h-3.5" />} />
                        {!slotsLoading && slots.length > 0 && (
                          <span
                            className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-2.5 py-1"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {availableCount} open
                          </span>
                        )}
                      </div>

                      {slotsLoading ? (
                        <div className="flex items-center justify-center py-8 gap-2.5 text-zinc-500">
                          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                          <span className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            Loading availability...
                          </span>
                        </div>
                      ) : slots.length === 0 ? (
                        <div className="py-8 text-center rounded-xl border border-dashed border-zinc-700">
                          <Clock className="w-8 h-8 mx-auto text-zinc-700 mb-2.5" />
                          <p className="text-sm font-medium text-zinc-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            No availability
                          </p>
                          <p className="text-xs text-zinc-600 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            No slots on {format(date, "EEEE")}. Try another day.
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
                                  "relative flex flex-col items-center justify-center rounded-xl border px-3 py-3.5 text-sm transition-all",
                                  slot.available
                                    ? isSelected
                                      ? "border-amber-400/60 bg-amber-400/10 text-amber-300"
                                      : "border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800 cursor-pointer"
                                    : "border-zinc-800 bg-zinc-900/30 text-zinc-700 cursor-not-allowed opacity-50"
                                )}
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              >
                                <span className={cn("font-semibold", isSelected && "text-amber-300")}>
                                  {formatUTCTime(slot.startTime)}
                                </span>
                                <span className={cn("text-xs mt-0.5", isSelected ? "text-amber-400/60" : "text-zinc-600")}>
                                  to {formatUTCTime(slot.endTime)}
                                </span>
                                {!slot.available && (
                                  <span className="absolute top-1.5 right-2 text-[10px] text-zinc-600 bg-zinc-800 rounded px-1.5 py-0.5 border border-zinc-700">
                                    Booked
                                  </span>
                                )}
                                {isSelected && (
                                  <div className="absolute top-1.5 right-2 w-4 h-4 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
                                    <CheckCircle className="w-2.5 h-2.5 text-amber-400" />
                                  </div>
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
                    <Divider />
                    <div className="space-y-2.5">
                      <StepLabel
                        step={3}
                        label={<>Add a Note <span className="text-zinc-600 font-normal">(optional)</span></>}
                      />
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Tell the tutor what you'd like to focus on..."
                        rows={3}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 text-zinc-200 placeholder-zinc-600 text-sm px-4 py-3 resize-none focus:outline-none focus:border-amber-400/40 focus:bg-zinc-800 transition-all"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </div>

                    {/* Summary */}
                    <div className="rounded-xl border border-zinc-800 bg-zinc-800/30 p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-zinc-600 uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          Date
                        </span>
                        <span className="text-sm font-medium text-zinc-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {format(date!, "PPP")}
                        </span>
                      </div>
                      <div className="h-px bg-zinc-800" />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-zinc-600 uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          Time
                        </span>
                        <span className="text-sm font-medium text-zinc-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {formatUTCTime(selectedSlot.startTime)} – {formatUTCTime(selectedSlot.endTime)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="relative w-full group overflow-hidden rounded-xl py-4 text-sm font-medium tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                        fontFamily: "'DM Sans', sans-serif",
                        color: "#0a0a0a",
                        boxShadow: "0 0 0 1px rgba(245,158,11,0.3), 0 4px 24px rgba(245,158,11,0.15)",
                      }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {loading ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</>
                        ) : (
                          "Confirm Booking"
                        )}
                      </span>
                      {!loading && (
                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      )}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Bottom shimmer line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ── Sub-components ─────────────────────────────────── */

function StepLabel({
  step,
  label,
  icon,
}: {
  step: number
  label: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-5 h-5 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-[10px] font-bold text-amber-400 shrink-0"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {step}
      </div>
      <span
        className="text-sm font-medium text-zinc-300 flex items-center gap-1.5"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {icon}
        {label}
      </span>
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
}