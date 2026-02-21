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
