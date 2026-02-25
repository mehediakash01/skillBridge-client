"use client"

import { useState, useRef } from "react"
import { useSession } from "@/src/hooks/useSession"
import { authClient } from "@/src/lib/auth-client"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Camera, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ProfilePage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const user = session?.user

  const [name, setName] = useState(user?.name ?? "")
  const [avatarUrl, setAvatarUrl] = useState(user?.image ?? "")
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Handle image file selection → upload to Cloudinary via API route
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview immediately
    const preview = URL.createObjectURL(file)
    setAvatarUrl(preview)

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")

      const { url } = await res.json()
      setAvatarUrl(url)
      toast.success("Image uploaded")
    } catch (err) {
      toast.error("Failed to upload image")
      setAvatarUrl(user?.image ?? "") // revert preview
    } finally {
      setUploading(false)
    }
  }

  // Save name + image via Better Auth
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty")
      return
    }

    try {
      setSaving(true)

      await authClient.updateUser({
        name: name.trim(),
        image: avatarUrl || undefined,
      })

      // Refresh session so sidebar reflects new name/avatar
      queryClient.invalidateQueries({ queryKey: ["session"] })
      toast.success("Profile updated!")
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal information
        </p>
      </div>

      {/* Avatar card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile Picture</CardTitle>
          <CardDescription>
            Click the avatar to upload a new photo
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-2xl">
                  {(name || user?.name || "S").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Overlay button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {uploading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Camera className="w-5 h-5 text-white" />
                )}
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
        </CardContent>
      </Card>

      {/* Info card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
          <CardDescription>Update your display name</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-4">
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user?.email ?? ""}
              disabled
              className="bg-muted text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed here
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving || uploading}
            className="w-full"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}