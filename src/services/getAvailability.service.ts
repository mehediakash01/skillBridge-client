

export const getAvailability = async (tutorId: string, date: string) => {
  const res = await fetch(
    `https://skill-bridge-server-tau.vercel.app/api/availability/${tutorId}?date=${date}`
  )

  const data = await res.json()
  return data.data
}
