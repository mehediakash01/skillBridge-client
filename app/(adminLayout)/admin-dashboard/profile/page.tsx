"use client"

import { useState } from "react"
import { useSession } from "@/src/hooks/useSession"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Edit2, Save, X, Shield, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export default function AdminProfilePage() {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    department: "Operations",
    permissions: ["View All Stats", "Manage Bookings", "User Management", "Category Management"],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      department: "Operations",
      permissions: ["View All Stats", "Manage Bookings", "User Management", "Category Management"],
    })
    setIsEditing(false)
  }

  if (!session) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Admin Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your admin account and permissions
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Admin Information Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Administrator Information
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Full Name</label>
            {isEditing ? (
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                className="rounded-lg"
              />
            ) : (
              <p className="text-base text-muted-foreground bg-muted/30 p-3 rounded-lg">
                {formData.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Email Address</label>
            {isEditing ? (
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="admin@example.com"
                className="rounded-lg"
                disabled
              />
            ) : (
              <p className="text-base text-muted-foreground bg-muted/30 p-3 rounded-lg">
                {formData.email}
              </p>
            )}
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Department</label>
            {isEditing ? (
              <Input
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Operations"
                className="rounded-lg"
              />
            ) : (
              <p className="text-base text-muted-foreground bg-muted/30 p-3 rounded-lg">
                {formData.department}
              </p>
            )}
          </div>

          {/* Permissions */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Permissions</label>
            <div className="flex flex-wrap gap-2 bg-muted/30 p-3 rounded-lg">
              {formData.permissions.map((perm, idx) => (
                <Badge key={idx} className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  {perm}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2 rounded-lg flex-1"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="gap-2 rounded-lg flex-1"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Access Control Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Access Control
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Role</p>
              <p className="text-sm text-muted-foreground">Administrator</p>
            </div>
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Admin</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Access Level</p>
              <p className="text-sm text-muted-foreground">Full system access</p>
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Full Access</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Account Status</p>
              <p className="text-sm text-muted-foreground">Active and verified</p>
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-4">
          <div>
            <p className="font-medium mb-3">Change Password</p>
            <Button variant="outline" className="rounded-lg">
              Change Password
            </Button>
          </div>
          <Separator />
          <div>
            <p className="font-medium mb-3">Two-Factor Authentication</p>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">Enhance account security</p>
              <Badge variant="outline">Disabled</Badge>
            </div>
          </div>
          <Separator />
          <div>
            <p className="font-medium mb-3">Active Sessions</p>
            <p className="text-sm text-muted-foreground mb-3">Current session</p>
            <Button variant="outline" className="rounded-lg" disabled>
              Sign Out Other Sessions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log Card */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="font-medium">Last Login</p>
              <p className="text-muted-foreground">Today at 10:45 AM</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="font-medium">Total Logins This Month</p>
              <p className="text-muted-foreground">24 logins</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
