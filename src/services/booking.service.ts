import { env } from "../env"

export const createBooking = async (payload: {
   tutorId: string
  startTime: string
  endTime: string
  note?: string
}) => {
  const res = await fetch(`http://localhost:5000/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", 
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Failed to create booking")
  }

  return res.json()
}
