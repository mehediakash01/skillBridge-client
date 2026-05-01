const BASE_URL = "/api/admin"
const API_BASE = "/api"

export interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  isBanned: boolean
  image: string | null
  createdAt: string
}

export interface AdminBooking {
  id: string
  studentId: string
  tutorId: string
  totalPrice: string
  startTime: string
  endTime: string
  status: "confirmed" | "completed" | "cancelled" | "pending"
  Student: { id: string; name: string; email: string; image: string | null }
  Tutor: {
    id: string
    bio: string
    hourlyRate: string
    Student: { id: string; name: string; email: string }
  }
}

export interface AdminStats {
  totalUsers: number
  totalTutors: number
  totalStudents: number
  totalBookings: number
  completedBookings: number
  totalCategories: number
  totalRevenue: number
}

export interface Category {
  id: number
  categoryName: string
}

// ── Stats ─────────────────────────────────────────────────

export const getAdminStats = async (): Promise<AdminStats> => {
  const res = await fetch(`${BASE_URL}/users/stats`, { credentials: "include" })
  if (!res.ok) throw new Error("Failed to fetch stats")
  const data = await res.json()
  return data.data
}

// ── Users ─────────────────────────────────────────────────

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const res = await fetch(`${BASE_URL}/users`, { credentials: "include" })
  if (!res.ok) throw new Error("Failed to fetch users")
  const data = await res.json()
  return data.data
}

export const updateUserStatus = async ({
  userId,
  isBanned,
}: {
  userId: string
  isBanned: boolean
}) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ isBanned }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to update user status")
  }
  return res.json()
}

// ── Bookings ──────────────────────────────────────────────

export const getAdminBookings = async (): Promise<AdminBooking[]> => {
  const res = await fetch(`${BASE_URL}/users/bookings`, { credentials: "include" })
  if (!res.ok) throw new Error("Failed to fetch bookings")
  const data = await res.json()
  return data.data
}

// ── Categories ────────────────────────────────────────────

export const getAdminCategories = async (): Promise<Category[]> => {
  const res = await fetch(`${API_BASE}/categories`, { credentials: "include" })
  if (!res.ok) throw new Error("Failed to fetch categories")
  const data = await res.json()
  return data.data
}

export const createCategory = async (payload: { categoryName: string; description?: string; icon?: string; isTrending?: boolean; learnerCount?: number; startingPrice?: number | string; tags?: string[] }) => {
  const res = await fetch(`${API_BASE}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to create category")
  }
  return res.json()
}

export const deleteCategory = async (id: number) => {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to delete category")
  }
  return res.json()
}

export const updateCategory = async (id: number, payload: { categoryName?: string; description?: string; icon?: string; isTrending?: boolean; learnerCount?: number; startingPrice?: number | string; tags?: string[] }) => {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to update category")
  }
  return res.json()
}