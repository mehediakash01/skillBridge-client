"use client"

import { useEffect, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getMyAvailability, updateAvailability } from "@/src/services/tutor.service"
import { toast } from "sonner"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const DAYS = [
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
  { value: "fri", label: "Friday" },
  { value: "sat", label: "Saturday" },
  { value: "sun", label: "Sunday" },
]

interface Slot {
  startTime: string
  endTime: string
}

type SlotMap = Record<string, Slot[]>

export default function TutorAvailabilityPage() {
  const queryClient = useQueryClient()

  const { data: availability, isLoading } = useQuery({
    queryKey: ["tutor-availability"],
    queryFn: getMyAvailability,
  })

  const [slots, setSlots] = useState<SlotMap>({})

  // Populate from API
  useEffect(() => {
    if (availability) {
      setSlots(availability)
    }
  }, [availability])

  const addSlot = (day: string) => {
    setSlots((prev) => ({
      ...prev,
      [day]: [...(prev[day] ?? []), { startTime: "09:00", endTime: "10:00" }],
    }))
  }

  const removeSlot = (day: string, index: number) => {
    setSlots((prev) => ({
      ...prev,
      [day]: prev[day]?.filter((_, i) => i !== index) ?? [],
    }))
  }

  const updateSlot = (
    day: string,
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setSlots((prev) => ({
      ...prev,
      [day]: prev[day]?.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      ) ?? [],
    }))
  }

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: updateAvailability,
    onSuccess: () => {
      toast.success("Availability updated!")
      queryClient.invalidateQueries({ queryKey: ["tutor-availability"] })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const handleSave = () => {
    const allSlots: { dayOfWeek: string; startTime: string; endTime: string }[] = []

    for (const day of Object.keys(slots)) {
      const daySlots = slots[day] ?? []
      for (const slot of daySlots) {
        if (!slot.startTime || !slot.endTime) {
          toast.error(`Fill in all times for ${day}`)
          return
        }
        if (slot.startTime >= slot.endTime) {
          toast.error(`End time must be after start time on ${day}`)
          return
        }
        allSlots.push({ dayOfWeek: day, startTime: slot.startTime, endTime: slot.endTime })
      }
    }

    save(allSlots)
  }

  const totalSlots = Object.values(slots).reduce((sum, s) => sum + s.length, 0)

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Availability</h1>
          <p className="text-muted-foreground mt-1">
            Set your weekly schedule. Students will only see these slots when booking.
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {totalSlots} slot{totalSlots !== 1 ? "s" : ""} set
        </Badge>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {DAYS.map(({ value: day, label }) => {
            const daySlots = slots[day] ?? []
            return (
              <Card key={day}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-sm font-semibold">{label}</CardTitle>
                      {daySlots.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {daySlots.length} slot{daySlots.length !== 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addSlot(day)}
                      className="h-8 gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add slot
                    </Button>
                  </div>
                </CardHeader>

                {daySlots.length > 0 && (
                  <>
                    <Separator />
                    <CardContent className="pt-4 space-y-3">
                      {daySlots.map((slot, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) =>
                                updateSlot(day, index, "startTime", e.target.value)
                              }
                              className="w-36"
                            />
                            <span className="text-muted-foreground text-sm">to</span>
                            <Input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) =>
                                updateSlot(day, index, "endTime", e.target.value)
                              }
                              className="w-36"
                            />
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeSlot(day, index)}
                            className="text-red-500 hover:bg-red-50 hover:text-red-600 h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </>
                )}
              </Card>
            )
          })}
        </div>
      )}

      <Button
        onClick={handleSave}
        disabled={saving || isLoading}
        className="w-full"
        size="lg"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Availability"
        )}
      </Button>
    </div>
  )
}