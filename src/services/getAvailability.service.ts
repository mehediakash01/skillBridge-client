

export const getAvailability = async (tutorId: string, date: string) => {
  const res = await fetch(
    `${process.env.API_URL || "https://skill-bridge-server-tau.vercel.app/api"}/tutors/${tutorId}/availability?date=${date}`,
  )

  const data = await res.json()
  return data.data
}
