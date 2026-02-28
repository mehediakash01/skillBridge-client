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
  DollarSign, Briefcase, CheckCircle2, Circle, Mail, Shield, Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
  const [editingName, setEditingName] = useState(false)

  // ── Tutor info state ───────────────────────────────────
  const [bio, setBio] = useState("")
  const [hourlyRate, setHourlyRate] = useState("")
  const [experience, setExperience] = useState("")
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [saved, setSaved] = useState(false)

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
      setSaved(true)
      setEditingName(false)
      toast.success("Account updated!")
      setTimeout(() => setSaved(false), 3000)
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
  const initials = (name || user?.name || "T").charAt(0).toUpperCase()
  const isDirty = name !== (user?.name ?? "") || avatarUrl !== (user?.image ?? "")

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your tutor information and profile visible to students
        </p>
      </div>

      {/* ── Hero Profile Card ─────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden border bg-card">
        <div className="h-28 bg-linear-to-r from-primary via-primary/80 to-accent relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,white/5_1px,transparent_1px),linear-gradient(to_bottom,white/5_1px,transparent_1px)] bg-size-[24px_24px]" />
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-12 mb-5">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback
                  className="text-3xl font-black bg-primary/10 text-primary"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 flex items-center justify-center bg-black/55 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {uploading
                  ? <Loader2 className="w-6 h-6 text-white animate-spin" />
                  : <Camera className="w-6 h-6 text-white" />
                }
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

              {!uploading && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full border-2 border-background flex items-center justify-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}>
                  <Camera className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              )}
            </div>

            <Badge variant="secondary" className="rounded-full capitalize px-3">
              Tutor
            </Badge>
          </div>

          <div>
            <p className="text-xl font-bold">{user?.name || "Your Name"}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-muted-foreground">Active account</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Display Name ──────────────────────────────────── */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Display Name</p>
              <p className="text-xs text-muted-foreground">How you appear to students</p>
            </div>
          </div>
          {!editingName && (
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5 text-muted-foreground hover:text-foreground rounded-xl"
              onClick={() => setEditingName(true)}
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </Button>
          )}
        </div>

        <div className="px-6 py-5">
          {editingName ? (
            <div className="space-y-3">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="h-11 rounded-xl"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleSaveAccount()}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="rounded-xl gap-1.5"
                  onClick={handleSaveAccount}
                  disabled={savingAccount || !name.trim()}
                >
                  {savingAccount
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving...</>
                    : <><CheckCircle2 className="w-3.5 h-3.5" />Save Name</>
                  }
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-xl"
                  onClick={() => { setName(user?.name ?? ""); setEditingName(false) }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="font-medium">{user?.name || <span className="text-muted-foreground">Not set</span>}</p>
              {saved && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Saved
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Email Address ─────────────────────────────────── */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="px-6 py-5 flex items-center gap-2 border-b">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-sm">Email Address</p>
            <p className="text-xs text-muted-foreground">Used for login and notifications</p>
          </div>
        </div>
        <div className="px-6 py-5 flex items-center justify-between">
          <p className="font-medium text-sm">{user?.email}</p>
          <Badge variant="outline" className="text-xs rounded-full gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Verified
          </Badge>
        </div>
        <div className="px-6 pb-5">
          <p className="text-xs text-muted-foreground bg-muted/50 rounded-xl px-3 py-2.5">
            🔒 Email changes aren't supported yet. Contact support if you need to update it.
          </p>
        </div>
      </div>

      {/* ── Profile Photo ─────────────────────────────────── */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="px-6 py-5 flex items-center gap-2 border-b">
          <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
            <Camera className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <p className="font-semibold text-sm">Profile Photo</p>
            <p className="text-xs text-muted-foreground">JPG or PNG, max 5MB</p>
          </div>
        </div>
        <div className="px-6 py-5 flex items-center gap-5">
          <Avatar className="h-16 w-16 border-2 border-muted">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Uploading...</>
                : <><Camera className="w-3.5 h-3.5" />Change Photo</>
              }
            </Button>
          </div>
        </div>
      </div>

      {/* ── Bio Section ────────────────────────────────────── */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="px-6 py-5 flex items-center gap-2 border-b">
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <p className="font-semibold text-sm">Bio</p>
            <p className="text-xs text-muted-foreground">How students perceive you</p>
          </div>
        </div>
        <div className="px-6 py-5 space-y-3">
          {isLoading ? (
            <Skeleton className="h-24 w-full rounded-lg" />
          ) : (
            <>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your teaching style, background, and what makes your sessions effective..."
                className="resize-none rounded-xl min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground text-right">
                {bio.length} / 500
              </p>
            </>
          )}
        </div>
      </div>

      {/* ── Hourly Rate & Experience ───────────────────────── */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="px-6 py-5 flex items-center gap-2 border-b">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-sm">Pricing & Experience</p>
            <p className="text-xs text-muted-foreground">Set your rates and availability</p>
          </div>
        </div>
        <div className="px-6 py-5 space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rate" className="text-xs font-medium">Hourly Rate (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input
                    id="rate"
                    type="number"
                    min={1}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="25"
                    className="pl-7 rounded-xl h-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp" className="text-xs font-medium">Years of Experience</Label>
                <Input
                  id="exp"
                  type="number"
                  min={0}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="3"
                  className="rounded-xl h-10"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Subjects Section ───────────────────────────────── */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="font-semibold text-sm">Subjects</p>
              <p className="text-xs text-muted-foreground">Select what you teach</p>
            </div>
          </div>
          {selectedCategoryIds.length > 0 && (
            <Badge variant="secondary" className="text-xs rounded-full">
              {selectedCategoryIds.length} selected
            </Badge>
          )}
        </div>

        <div className="px-6 py-5">
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
                      "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition-all text-left",
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
        </div>
      </div>

      {/* ── Account Security ──────────────────────────────── */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="px-6 py-5 flex items-center gap-2 border-b">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
            <Shield className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-sm">Account Security</p>
            <p className="text-xs text-muted-foreground">Your account status</p>
          </div>
        </div>
        <div className="px-6 py-5 space-y-3">
          {[
            { label: "Email verified", done: true },
            { label: "Account active", done: true },
            { label: "Two-factor authentication", done: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              {item.done
                ? <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Enabled
                  </span>
                : <Badge variant="outline" className="text-xs rounded-full text-muted-foreground">
                    Not set up
                  </Badge>
              }
            </div>
          ))}
        </div>
      </div>

      {/* ── Save button ────────────────────────────────── */}
      <Button
        onClick={handleSaveTutorInfo}
        disabled={savingTutor || isLoading}
        className="w-full rounded-xl h-11 gap-2"
        size="lg"
      >
        {savingTutor
          ? <><Loader2 className="w-4 h-4 animate-spin" />Saving Profile...</>
          : <><CheckCircle2 className="w-4 h-4" />Save Tutor Profile</>
        }
      </Button>

      {/* ── Unsaved changes indicator ─────────────────────── */}
      {isDirty && !editingName && (
        <div className="sticky bottom-4">
          <div className="bg-background/90 backdrop-blur border rounded-2xl p-4 shadow-lg flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">You have unsaved changes</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => {
                  setName(user?.name ?? "")
                  setAvatarUrl(user?.image ?? "")
                }}
              >
                Discard
              </Button>
              <Button
                size="sm"
                className="rounded-xl gap-1.5"
                onClick={handleSaveAccount}
                disabled={savingAccount || uploading}
              >
                {savingAccount
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving...</>
                  : <><CheckCircle2 className="w-3.5 h-3.5" />Save Changes</>
                }
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}