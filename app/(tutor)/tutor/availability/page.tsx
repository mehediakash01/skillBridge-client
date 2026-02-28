"use client"

import { useEffect, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getMyAvailability, updateAvailability } from "@/src/services/tutor.service"
import { toast } from "sonner"
import { Plus, Trash2, Loader2, Clock, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

const DAYS = [
  { value: "mon", label: "Monday", color: "from-blue-50 to-blue-100/50", icon: "📅", accent: "bg-blue-50 border-blue-200" },
  { value: "tue", label: "Tuesday", color: "from-cyan-50 to-cyan-100/50", icon: "📅", accent: "bg-cyan-50 border-cyan-200" },
  { value: "wed", label: "Wednesday", color: "from-teal-50 to-teal-100/50", icon: "📅", accent: "bg-teal-50 border-teal-200" },
  { value: "thu", label: "Thursday", color: "from-green-50 to-green-100/50", icon: "📅", accent: "bg-green-50 border-green-200" },
  { value: "fri", label: "Friday", color: "from-amber-50 to-amber-100/50", icon: "🎉", accent: "bg-amber-50 border-amber-200" },
  { value: "sat", label: "Saturday", color: "from-orange-50 to-orange-100/50", icon: "☀️", accent: "bg-orange-50 border-orange-200" },
  { value: "sun", label: "Sunday", color: "from-rose-50 to-rose-100/50", icon: "🌙", accent: "bg-rose-50 border-rose-200" },
]

interface Slot {
  startTime: string
  endTime: string
}

type SlotMap = Record<string, Slot[]>

function calculateDuration(startTime: string, endTime: string): string {
  if (!startTime || !endTime) return "0h"
  const [startH, startM] = startTime.split(":").map(Number)
  const [endH, endM] = endTime.split(":").map(Number)
  const durationMins = (endH * 60 + endM) - (startH * 60 + startM)
  if (durationMins < 60) return `${durationMins}m`
  const hours = Math.floor(durationMins / 60)
  const mins = durationMins % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

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
  const totalHours = Object.values(slots).reduce((sum, daySlots) => {
    return sum + daySlots.reduce((daySum, slot) => {
      const [startH, startM] = slot.startTime.split(":").map(Number)
      const [endH, endM] = slot.endTime.split(":").map(Number)
      const durationMins = (endH * 60 + endM) - (startH * 60 + startM)
      return daySum + (durationMins / 60)
    }, 0)
  }, 0)

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Availability</h1>
        <p className="text-muted-foreground mt-2">
          Set your weekly schedule. Students will only see these time slots when booking lessons with you.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Slots</p>
              <p className="text-3xl font-bold mt-2">{totalSlots}</p>
              <p className="text-xs text-muted-foreground mt-1">availability slots set</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Hours Available</p>
              <p className="text-3xl font-bold mt-2">{totalHours.toFixed(1)}h</p>
              <p className="text-xs text-muted-foreground mt-1">per week</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Days Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DAYS.map(({ value: day, label, color, icon, accent }) => {
            const daySlots = slots[day] ?? []
            const dayHours = daySlots.reduce((sum, slot) => {
              const [startH, startM] = slot.startTime.split(":").map(Number)
              const [endH, endM] = slot.endTime.split(":").map(Number)
              const durationMins = (endH * 60 + endM) - (startH * 60 + startM)
              return sum + (durationMins / 60)
            }, 0)

            return (
              <div key={day} className="rounded-2xl border bg-card overflow-hidden hover:shadow-md transition-shadow">
                {/* Day Header */}
                <div className={`bg-gradient-to-r ${color} border-b px-6 py-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <h3 className="font-bold text-base">{label}</h3>
                      {daySlots.length > 0 && (
                        <p className="text-xs text-muted-foreground">{dayHours.toFixed(1)}h available</p>
                      )}
                    </div>
                  </div>
                  {daySlots.length > 0 && (
                    <Badge variant="secondary" className="rounded-full text-xs">
                      {daySlots.length}
                    </Badge>
                  )}
                </div>

                {/* Slots or Empty State */}
                <div className="p-4 space-y-3">
                  {daySlots.length === 0 ? (
                    <div className="py-6 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-xl bg-muted mb-3 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">No slots added</p>
                      <p className="text-xs text-muted-foreground mt-1">Add your first time slot</p>
                    </div>
                  ) : (
                    <>
                      {daySlots.map((slot, index) => (
                        <div key={index} className={`${accent} rounded-xl p-4 border flex items-center gap-3 group`}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) =>
                                  updateSlot(day, index, "startTime", e.target.value)
                                }
                                className="w-28 h-9 text-sm rounded-lg"
                              />
                              <span className="text-sm text-muted-foreground font-medium">to</span>
                              <Input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) =>
                                  updateSlot(day, index, "endTime", e.target.value)
                                }
                                className="w-28 h-9 text-sm rounded-lg"
                              />
                              <span className="text-xs font-medium text-muted-foreground ml-1 whitespace-nowrap">
                                {calculateDuration(slot.startTime, slot.endTime)}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeSlot(day, index)}
                            className="text-red-500 hover:bg-red-100 hover:text-red-600 h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* Add Slot Button */}
                <div className="px-4 pb-4 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addSlot(day)}
                    className="w-full h-9 gap-2 rounded-xl text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add slot
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Save Button */}
      <div className="sticky bottom-4 flex gap-3">
        <Button
          onClick={handleSave}
          disabled={saving || isLoading}
          className="flex-1 rounded-xl h-12 gap-2"
          size="lg"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Save Availability
            </>
          )}
        </Button>
      </div>
    </div>
  )
}