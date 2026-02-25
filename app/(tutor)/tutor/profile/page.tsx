"use client"

import { useEffect, useRef, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getMyTutorProfile,
  updateTutorProfile,
  getCategories,
} from "@/src/services/tutor.service"
import { authClient } from "@/src/lib/auth-client"
import { useSession } from "@/src/hooks/useSession"
import { toast } from "sonner"
import { Camera, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function TutorProfilePage() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession()
  const user = session?.user

  // ── Account state (Better Auth) ──────────────────────
  const [name, setName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [savingAccount, setSavingAccount] = useState(false)

  // ── Tutor info state ─────────────────────────────────
  const [bio, setBio] = useState("")
  const [hourlyRate, setHourlyRate] = useState("")
  const [experience, setExperience] = useState("")
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])

  useEffect(() => {
    if (user) {
      setName(user.name ?? "")
      setAvatarUrl(user.image ?? "")
    }
  }, [user])

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["tutor-profile"],
    queryFn: getMyTutorProfile,
  })

  const { data: categories = [], isLoading: catsLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  })

  useEffect(() => {
    if (profile) {
      setBio(profile.bio ?? "")
      setHourlyRate(String(profile.hourlyRate ?? ""))
      setExperience(String(profile.experience ?? ""))
      setSelectedCategoryIds(profile.tutorSubjects?.map((s) => s.categoryId) ?? [])
    }
  }, [profile])

  // ── Image upload → Cloudinary ─────────────────────────
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarUrl(URL.createObjectURL(file)) // instant preview

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", { method: "POST", body: formData })
      if (!res.ok) throw new Error("Upload failed")

      const { url } = await res.json()
      setAvatarUrl(url)
      toast.success("Image uploaded")
    } catch {
      toast.error("Failed to upload image")
      setAvatarUrl(user?.image ?? "")
    } finally {
      setUploading(false)
    }
  }

  // ── Save account ──────────────────────────────────────
  const handleSaveAccount = async () => {
    if (!name.trim()) return toast.error("Name cannot be empty")
    try {
      setSavingAccount(true)
      await authClient.updateUser({ name: name.trim(), image: avatarUrl || undefined })
      queryClient.invalidateQueries({ queryKey: ["session"] })
      toast.success("Account updated!")
    } catch (err: any) {
      toast.error(err?.message || "Failed to update account")
    } finally {
      setSavingAccount(false)
    }
  }

  // ── Save tutor info ───────────────────────────────────
  const { mutate: saveTutorInfo, isPending: savingTutor } = useMutation({
    mutationFn: updateTutorProfile,
    onSuccess: () => {
      toast.success("Tutor profile updated!")
      queryClient.invalidateQueries({ queryKey: ["tutor-profile"] })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const handleSaveTutorInfo = () => {
    if (!bio.trim()) return toast.error("Bio is required")
    if (!hourlyRate || isNaN(Number(hourlyRate)) || Number(hourlyRate) <= 0)
      return toast.error("Enter a valid hourly rate")
    if (!experience || isNaN(Number(experience)) || Number(experience) < 0)
      return toast.error("Enter valid years of experience")

    saveTutorInfo({
      bio: bio.trim(),
      hourlyRate: Number(hourlyRate),
      experience: Number(experience),
      categoryIds: selectedCategoryIds,
    })
  }

  const toggleCategory = (id: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const isLoading = profileLoading || catsLoading

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and tutor information
        </p>
      </div>

      {/* ── Account ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
          <CardDescription>Update your name and profile photo</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-5">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-2xl">
                  {(name || "T").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {uploading
                  ? <Loader2 className="w-5 h-5 text-white animate-spin" />
                  : <Camera className="w-5 h-5 text-white" />
                }
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Change photo"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email ?? ""} disabled className="bg-muted text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          <Button onClick={handleSaveAccount} disabled={savingAccount || uploading} className="w-full">
            {savingAccount
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
              : "Save Account"
            }
          </Button>
        </CardContent>
      </Card>

      {/* ── Tutor Info ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tutor Information</CardTitle>
          <CardDescription>Visible to students when browsing tutors</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-5">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
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
                  placeholder="Tell students about your teaching style, expertise..."
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

      {/* ── Subjects ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subjects</CardTitle>
          <CardDescription>Tap to select the subjects you teach</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-7 w-20 rounded-full" />)}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const selected = selectedCategoryIds.includes(cat.id)
                return (
                  <button key={cat.id} type="button" onClick={() => toggleCategory(cat.id)}>
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

      <Button
        onClick={handleSaveTutorInfo}
        disabled={savingTutor || isLoading}
        className="w-full"
        size="lg"
      >
        {savingTutor
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
          : "Save Tutor Profile"
        }
      </Button>
    </div>
  )
}