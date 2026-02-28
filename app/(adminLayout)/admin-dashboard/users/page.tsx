"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAdminUsers, updateUserStatus } from "@/src/services/admin.service"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import { Users, Search, Shield, GraduationCap, BookOpen, CheckCircle2, AlertCircle } from "lucide-react"

const roleConfig: Record<string, { icon: any, color: string, bg: string }> = {
  ADMIN: { icon: Shield, color: "text-red-600", bg: "bg-red-50" },
  TUTOR: { icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
  STUDENT: { icon: GraduationCap, color: "text-green-600", bg: "bg-green-50" },
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string | null>(null)

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAdminUsers,
  })

  const { mutate: toggleBan, isPending } = useMutation({
    mutationFn: updateUserStatus,
    onSuccess: (_, vars) => {
      toast.success(`User ${vars.isBanned ? "banned" : "unbanned"} successfully`)
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  // Filter users based on search and role
  const filtered = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = !roleFilter || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  // Calculate stats
  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "from-blue-50 to-blue-100/50" },
    { label: "Tutors", value: users.filter(u => u.role === "TUTOR").length, icon: BookOpen, color: "from-purple-50 to-purple-100/50" },
    { label: "Students", value: users.filter(u => u.role === "STUDENT").length, icon: GraduationCap, color: "from-green-50 to-green-100/50" },
    { label: "Active", value: users.filter(u => !u.isBanned).length, icon: CheckCircle2, color: "from-emerald-50 to-emerald-100/50" },
  ]

  const UserCard = ({ user }: { user: typeof users[0] }) => {
    const config = roleConfig[user.role]
    const RoleIcon = config.icon
    return (
      <Card className="border-0 shadow-sm hover:shadow-md transition-all">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* User header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={user.image ?? ""} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <Badge variant={user.isBanned ? "destructive" : "secondary"} className="flex-shrink-0">
                {user.isBanned ? "Banned" : "Active"}
              </Badge>
            </div>

            {/* Role and status */}
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${config.bg}`}>
                <RoleIcon className={`w-4 h-4 ${config.color}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">{user.role}</span>
            </div>

            {/* Joined date */}
            <div className="text-xs text-gray-500">
              Joined {format(new Date(user.createdAt), "PP")}
            </div>

            {/* Action button */}
            {user.role !== "ADMIN" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2"
                    disabled={isPending}
                  >
                    {user.isBanned ? "Unban User" : "Ban User"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {user.isBanned ? "Unban" : "Ban"} {user.name}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {user.isBanned
                        ? `This will restore ${user.name}'s access to the platform.`
                        : `This will prevent ${user.name} from accessing the platform.`
                      }
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className={user.isBanned ? "" : "bg-red-600 hover:bg-red-700"}
                      onClick={() => toggleBan({ userId: user.id, isBanned: !user.isBanned })}
                      disabled={isPending}
                    >
                      Yes, {user.isBanned ? "unban" : "ban"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 mt-2">Manage all platform users and their access</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className={`border-0 bg-gradient-to-br ${stat.color} shadow-sm`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <Icon className="w-8 h-8 opacity-20 text-gray-900" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-lg border-gray-200"
              />
            </div>

            {/* Role Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={roleFilter === null ? "default" : "outline"}
                size="sm"
                onClick={() => setRoleFilter(null)}
                className="rounded-lg"
              >
                All
              </Button>
              {["ADMIN", "TUTOR", "STUDENT"].map((role) => {
                const config = roleConfig[role]
                const RoleIcon = config.icon
                return (
                  <Button
                    key={role}
                    variant={roleFilter === role ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRoleFilter(role)}
                    className="rounded-lg"
                  >
                    <RoleIcon className="w-3.5 h-3.5 mr-2" />
                    {role}
                  </Button>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List/Table */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          All Users
          {!isLoading && <span className="text-gray-500 font-normal ml-2">({filtered.length})</span>}
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="p-3 bg-gray-100 rounded-lg mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No users found</p>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block border-0 rounded-lg shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="text-gray-700 font-semibold">User</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Role</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Joined</TableHead>
                    <TableHead className="text-right text-gray-700 font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((user) => {
                    const config = roleConfig[user.role]
                    const RoleIcon = config.icon
                    return (
                      <TableRow key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={user.image ?? ""} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded ${config.bg}`}>
                              <RoleIcon className={`w-4 h-4 ${config.color}`} />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{user.role}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isBanned ? "destructive" : "secondary"}>
                            {user.isBanned ? "Banned" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {format(new Date(user.createdAt), "PP")}
                        </TableCell>
                        <TableCell className="text-right">
                          {user.role !== "ADMIN" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant={user.isBanned ? "outline" : "destructive"}
                                  disabled={isPending}
                                >
                                  {user.isBanned ? "Unban" : "Ban"}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    {user.isBanned ? "Unban" : "Ban"} {user.name}?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {user.isBanned
                                      ? `This will restore ${user.name}'s access to the platform.`
                                      : `This will prevent ${user.name} from accessing the platform.`
                                    }
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className={user.isBanned ? "" : "bg-red-600 hover:bg-red-700"}
                                    onClick={() => toggleBan({ userId: user.id, isBanned: !user.isBanned })}
                                    disabled={isPending}
                                  >
                                    Yes, {user.isBanned ? "unban" : "ban"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>

            {/* Results counter */}
            <p className="text-gray-500 text-sm mt-4">
              Showing {filtered.length} of {users.length} {users.length === 1 ? "user" : "users"}
            </p>
          </>
        )}
      </div>
    </div>
  )
}