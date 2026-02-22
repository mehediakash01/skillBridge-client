"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/src/lib/utils"

interface Props {
  tutorId: string
}

export default function BookingForm({ tutorId }: Props) {
  const [date, setDate] = useState<Date | undefined>()
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  const handleBooking = async () => {
    if (!date) return alert("Please select a date")

    setLoading(true)

    const res = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tutorId,
        date,
        note,
      }),
    })

    const data = await res.json()

    setLoading(false)

    if (!res.ok) {
      alert(data.message || "Booking failed")
      return
    }

    alert("Booking created successfully 🎉")
  }

  return (
    <div className="space-y-4 mt-8 border p-6 rounded-xl">
      <h3 className="text-xl font-semibold">Book a Session</h3>

      {/* Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Textarea
        placeholder="Add note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <Button
        className="w-full"
        disabled={loading}
        onClick={handleBooking}
      >
        {loading ? "Booking..." : "Book Now"}
      </Button>
    </div>
  )
}
