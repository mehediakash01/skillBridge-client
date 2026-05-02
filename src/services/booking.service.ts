
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://skill-bridge-server-tau.vercel.app"
const BASE_URL = `${BACKEND_URL}/api`

export interface Tutor {
  id: string
  bio: string
  hourlyRate: string
  averageRate: string
  experience: number
  studentId: string
}

export interface Review {
  id: string
  bookingId: string
  rating: number
  comment: string
}

export interface Booking {
  id: string
  studentId: string
  tutorId: string
  totalPrice: string
  startTime: string
  endTime: string
  status: "confirmed" | "completed" | "cancelled" | "pending"
  meetingLink?: string | null
  Tutor: Tutor
  reviews: Review[]
}

export const createBooking = async (payload: {
  tutorId: string
  startTime: string
  endTime: string
  note?: string
}) => {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Failed to create booking")
  }
  return res.json()
}
export const getMyBookings = async (): Promise<Booking[]> => {
  const res = await fetch(`${BASE_URL}/bookings/me`, { credentials: "include" })
  if (!res.ok) throw new Error("Failed to fetch bookings")
  const data = await res.json()
  return data.data
}
export const cancelBooking = async (bookingId: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/bookings/${bookingId}/cancel`, {
    method: "PATCH",
    credentials: "include",
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Failed to cancel booking")
  }
}

export const submitReview = async (payload: {
  bookingId: string
  rating: number
  comment: string
}) => {
  const res = await fetch(`${BASE_URL}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Failed to submit review")
  }
  return res.json()
}

export const getReviewByBookingId = async (bookingId: string): Promise<Review | null> => {
  const res = await fetch(`${BASE_URL}/reviews/${bookingId}`, { credentials: "include" })
  if (!res.ok) return null
  const data = await res.json()
  return data.data
}