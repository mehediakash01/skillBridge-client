"use client"

import { useQuery } from "@tanstack/react-query"
import { getAdminStats } from "@/src/services/admin.service"
import { Users, BookOpen, CheckCircle, Tag, DollarSign, GraduationCap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const statCards = (data: any) => [
  { label: "Total Users", value: data?.totalUsers, icon: Users, color: "text-blue-600" },
  { label: "Total Tutors", value: data?.totalTutors, icon: GraduationCap, color: "text-purple-600" },
  { label: "Total Students", value: data?.totalStudents, icon: BookOpen, color: "text-indigo-600" },
  { label: "Total Bookings", value: data?.totalBookings, icon: CheckCircle, color: "text-green-600" },
  { label: "Completed Sessions", value: data?.completedBookings, icon: CheckCircle, color: "text-emerald-600" },
  { label: "Categories", value: data?.totalCategories, icon: Tag, color: "text-orange-600" },
  { label: "Total Revenue", value: data ? `$${data.totalRevenue.toFixed(2)}` : null, icon: DollarSign, color: "text-yellow-600" },
]

export default function AdminOverviewPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-muted-foreground mt-1">Platform-wide statistics at a glance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards(data).map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-16 mt-1" />
                    ) : (
                      <p className="text-3xl font-bold mt-1">{stat.value ?? 0}</p>
                    )}
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}