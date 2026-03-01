import { TutorListItem, TutorProfileDetails } from "@/src/types"
import { env } from "../env"


export const getTutors = async (queryParams?: Record<string, any>) => {
  const cleanParams = Object.fromEntries(
    Object.entries(queryParams || {}).filter(
      ([_, value]) => value !== "" && value !== undefined
    )
  )

  const params = new URLSearchParams(cleanParams as any).toString()

  const res = await fetch(
    `${env.BACKEND_URL}/api/tutors?${params}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    const text = await res.text()
    console.error("API Error:", text)
    throw new Error("Failed to fetch tutors")
  }

  const data = await res.json()
  return data.data
}



export async function getTutorById(
  id: string
): Promise<TutorProfileDetails> {
  const res = await fetch(
    `${env.BACKEND_URL}/api/tutors/${id}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch tutor")
  }
  const result = await res.json();

  return result.data
}


const BASE_URL = "https://skill-bridge-server-tau.vercel.app/api"

export interface Category {
  id: number
  categoryName: string
}

export interface TutorSubject {
  tutorId: string
  categoryId: number
  category: Category
}

export interface TutorProfile {
  id: string
  bio: string
  hourlyRate: number
  averageRate: number
  experience: number
  studentId: string
  tutorSubjects: TutorSubject[]
  availabilities: any[]
}

export interface TutorBooking {
  id: string
  studentId: string
  tutorId: string
  totalPrice: string
  startTime: string
  endTime: string
  status: "confirmed" | "completed" | "cancelled" | "pending"
  Student: {
    id: string
    name: string
    email: string
    image: string | null
  }
}

export type AvailabilityGroup = Record<
  string,
  { startTime: string; endTime: string }[]
>

// ── Profile ──────────────────────────────────────────────

export const getMyTutorProfile = async (): Promise<TutorProfile> => {
  const res = await fetch(`${BASE_URL}/tutors/profile/me`, {
    credentials: "include",
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to fetch tutor profile")
  }
  const data = await res.json()
  return data.data
}

export const updateTutorProfile = async (payload: {
  bio: string
  hourlyRate: number
  experience: number
  categoryIds: number[]
}) => {
  const res = await fetch(`${BASE_URL}/tutors/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to update profile")
  }
  return res.json()
}

// ── Availability ──────────────────────────────────────────

export const getMyAvailability = async (): Promise<AvailabilityGroup> => {
  
  const res = await fetch(`${BASE_URL}/tutors/availability`, {
    credentials: "include",
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to fetch availability")
  }
  const data = await res.json()
  return data.data
}

export const updateAvailability = async (
  slots: { dayOfWeek: string; startTime: string; endTime: string }[]
) => {
  const res = await fetch(`${BASE_URL}/tutors/availability`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ slots }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to update availability")
  }
  return res.json()
}

// ── Bookings ─────────────────────────────────────────────

export const getTutorBookings = async (): Promise<TutorBooking[]> => {
  const res = await fetch(`${BASE_URL}/bookings/tutor`, {
    credentials: "include",
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to fetch bookings")
  }
  const data = await res.json()
  return data.data
}

export const completeBooking = async (bookingId: string) => {
  const res = await fetch(`${BASE_URL}/bookings/${bookingId}/complete`, {
    method: "PATCH",
    credentials: "include",
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to complete booking")
  }
  return res.json()
}

// ── Categories ───────────────────────────────────────────

export const getCategories = async (): Promise<Category[]> => {
  const res = await fetch(`${BASE_URL}/categories`, {
    credentials: "include",
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to fetch categories")
  }
  const data = await res.json()
  return data.data
}