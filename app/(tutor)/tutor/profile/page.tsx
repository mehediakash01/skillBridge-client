"use client"

import { useEffect, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getMyTutorProfile,
  updateTutorProfile,
  getCategories,
} from "@/src/services/tutor.service"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function TutorProfilePage() {
  const queryClient = useQueryClient()

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["tutor-profile"],
    queryFn: getMyTutorProfile,
  })

  const { data: categories = [], isLoading: catsLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  })

  const [bio, setBio] = useState("")
  const [hourlyRate, setHourlyRate] = useState("")
  const [experience, setExperience] = useState("")
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])

  // Populate form once profile loads
  useEffect(() => {
    if (profile) {
      setBio(profile.bio ?? "")
      setHourlyRate(String(profile.hourlyRate ?? ""))
      setExperience(String(profile.experience ?? ""))
      setSelectedCategoryIds(
        profile.tutorSubjects?.map((s) => s.categoryId) ?? []
      )
    }
  }, [profile])

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: updateTutorProfile,
    onSuccess: () => {
      toast.success("Profile updated!")
      queryClient.invalidateQueries({ queryKey: ["tutor-profile"] })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const toggleCategory = (id: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const handleSave = () => {
    if (!bio.trim()) return toast.error("Bio is required")
    if (!hourlyRate || isNaN(Number(hourlyRate)) || Number(hourlyRate) <= 0)
      return toast.error("Enter a valid hourly rate")
    if (!experience || isNaN(Number(experience)) || Number(experience) < 0)
      return toast.error("Enter valid experience years")

    save({
      bio: bio.trim(),
      hourlyRate: Number(hourlyRate),
      experience: Number(experience),
      categoryIds: selectedCategoryIds,
    })
  }

  const isLoading = profileLoading || catsLoading

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">
          Update your tutor profile visible to students
        </p>
      </div>

      {/* Basic info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
          <CardDescription>Your bio, rate and experience</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-5">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell students about yourself, your teaching style, expertise..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rate">Hourly Rate ($)</Label>
                  <Input
                    id="rate"
                    type="number"
                    min={1}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="e.g. 25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exp">Years of Experience</Label>
                  <Input
                    id="exp"
                    type="number"
                    min={0}
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 3"
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Subjects */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subjects</CardTitle>
          <CardDescription>
            Select the subjects you teach. Selected subjects are highlighted.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-7 w-20 rounded-full" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const selected = selectedCategoryIds.includes(cat.id)
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                  >
                    <Badge
                      variant={selected ? "default" : "outline"}
                      className="cursor-pointer text-sm px-3 py-1"
                    >
                      {cat.categoryName}
                    </Badge>
                  </button>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving || isLoading} className="w-full">
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Profile"
        )}
      </Button>
    </div>
  )
}