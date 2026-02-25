import { env } from "../env"

// export const createBooking = async (payload: {
//    tutorId: string
//   startTime: string
//   endTime: string
//   note?: string
// }) => {
//   const res = await fetch(`http://localhost:5000/api/bookings`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include", 
//     body: JSON.stringify(payload),
//   })

//   if (!res.ok) {
//     const error = await res.json()
//     throw new Error(error.message || "Failed to create booking")
//   }

//   return res.json()
// }


const BASE_URL = "http://localhost:5000/api"

export interface Tutor {
  id: string
  bio: string
  hourlyRate: string
  averageRate: string
  experience: number
  studentId: string
}

export interface Booking {
  id: string
  studentId: string
  tutorId: string
  totalPrice: string
  startTime: string
  endTime: string
  status: "confirmed" | "completed" | "cancelled"
  Tutor: Tutor
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
  const res = await fetch(`${BASE_URL}/bookings/me`, {
    credentials: "include",
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Failed to fetch bookings")
  }

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