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
import {
  Camera, Loader2, User, BookOpen,
  DollarSign, Briefcase, CheckCircle2, Circle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/src/lib/utils"

export default function TutorProfilePage() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession()
  const user = session?.user

  // ── Account state ──────────────────────────────────────
  const [name, setName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [savingAccount, setSavingAccount] = useState(false)

  // ── Tutor info state ───────────────────────────────────
  const [bio, setBio] = useState("")
  const [hourlyRate, setHourlyRate] = useState("")
  const [experience, setExperience] = useState("")
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
  const [profileLoaded, setProfileLoaded] = useState(false)

  // Populate account from session
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

  // ✅ Pre-fill tutor info from DB — only once on first load
  useEffect(() => {
    if (profile && !profileLoaded) {
      setBio(profile.bio ?? "")
      setHourlyRate(String(profile.hourlyRate ?? ""))
      setExperience(String(profile.experience ?? ""))
      // ✅ Pre-select saved subjects
      setSelectedCategoryIds(
        profile.tutorSubjects?.map((s: any) => s.categoryId) ?? []
      )
      setProfileLoaded(true)
    }
  }, [profile, profileLoaded])

  // ── Image upload ───────────────────────────────────────
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUrl(URL.createObjectURL(file))
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      if (!res.ok) throw new Error("Upload failed")
      const { url } = await res.json()
      setAvatarUrl(url)
      toast.success("Photo updated")
    } catch {
      toast.error("Failed to upload image")
      setAvatarUrl(user?.image ?? "")
    } finally {
      setUploading(false)
    }
  }

  // ── Save account ───────────────────────────────────────
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

  // ── Save tutor info ────────────────────────────────────
  const { mutate: saveTutorInfo, isPending: savingTutor } = useMutation({
    mutationFn: updateTutorProfile,
    onSuccess: () => {
      toast.success("Profile saved!")
      // ✅ Invalidate so subjects refresh from DB
      queryClient.invalidateQueries({ queryKey: ["tutor-profile"] })
      setProfileLoaded(false) // allow re-fill on next fetch
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const handleSaveTutorInfo = () => {
    if (!bio.trim()) return toast.error("Bio is required")
    if (!hourlyRate || isNaN(Number(hourlyRate)) || Number(hourlyRate) <= 0)
      return toast.error("Enter a valid hourly rate")
    if (!experience || isNaN(Number(experience)) || Number(experience) < 0)
      return toast.error("Enter valid years of experience")
    if (selectedCategoryIds.length === 0)
      return toast.error("Select at least one subject")

    saveTutorInfo({
      bio: bio.trim(),
      hourlyRate: Number(hourlyRate),
      experience: Number(experience),
      categoryIds: selectedCategoryIds, // ✅ sent to backend
    })
  }

  const toggleCategory = (id: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const isLoading = profileLoading || catsLoading

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your account and tutor information visible to students
        </p>
      </div>

      {/* ── Section 1: Account ─────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Account
          </h2>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-6">
            {/* Avatar upload */}
            <div className="flex items-center gap-5">
              <div
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Avatar className="h-20 w-20 border-2 border-muted">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                    {(name || "T").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  {uploading
                    ? <Loader2 className="w-5 h-5 text-white animate-spin" />
                    : <Camera className="w-5 h-5 text-white" />
                  }
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 h-7 text-xs"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Change photo"}
                </Button>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  value={user?.email ?? ""}
                  disabled
                  className="bg-muted text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
            </div>

            <Button
              onClick={handleSaveAccount}
              disabled={savingAccount || uploading}
              className="w-full"
            >
              {savingAccount
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                : "Save Account"
              }
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* ── Section 2: Tutor Info ──────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Tutor Information
          </h2>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-5">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ) : (
              <>
                {/* Bio */}
                <div className="space-y-1.5">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your teaching style, background, and what makes your sessions effective..."
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {bio.length} / 500
                  </p>
                </div>

                {/* Rate & Experience */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="rate" className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      Hourly Rate (USD)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                      <Input
                        id="rate"
                        type="number"
                        min={1}
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        placeholder="25"
                        className="pl-7"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="exp" className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      Years of Experience
                    </Label>
                    <Input
                      id="exp"
                      type="number"
                      min={0}
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="3"
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </section>

      {/* ── Section 3: Subjects ───────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Subjects
            </h2>
          </div>
          {selectedCategoryIds.length > 0 && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {selectedCategoryIds.length} selected
            </span>
          )}
        </div>

        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-11 w-full rounded-lg" />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No categories available. Ask admin to add some.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => {
                  const selected = selectedCategoryIds.includes(cat.id)
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-all text-left",
                        selected
                          ? "border-primary bg-primary/5 text-primary font-medium"
                          : "border-border hover:border-primary/30 hover:bg-muted text-foreground"
                      )}
                    >
                      {selected
                        ? <CheckCircle2 className="w-4 h-4 shrink-0 text-primary" />
                        : <Circle className="w-4 h-4 shrink-0 text-muted-foreground" />
                      }
                      {cat.categoryName}
                    </button>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* ── Save button ────────────────────────────────── */}
      <Button
        onClick={handleSaveTutorInfo}
        disabled={savingTutor || isLoading}
        className="w-full"
        size="lg"
      >
        {savingTutor
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving Profile...</>
          : "Save Tutor Profile"
        }
      </Button>
    </div>
  )
}