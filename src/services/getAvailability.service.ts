
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://skill-bridge-server-tau.vercel.app";

export const getAvailability = async (tutorId: string, date: string) => {
  const res = await fetch(
    `${BACKEND_URL}/api/availability/${tutorId}/availability?date=${date}`,
  )

  const data = await res.json()
  return data.data
}
