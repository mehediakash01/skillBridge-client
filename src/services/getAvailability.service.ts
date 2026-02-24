

export const getAvailability = async (tutorId: string, date: string) => {
  const res = await fetch(
    `http://localhost:5000/api/availability/${tutorId}?date=${date}`
  )

  const data = await res.json()
  return data.data
}
