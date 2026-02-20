import { TutorListItem, TutorProfileDetails } from "@/src/types"
import { env } from "../env"
export async function getTutors(): Promise<TutorListItem[]> {
  const res = await fetch(
    `${env.BACKEND_URL}/api/tutors`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch tutors")
  }

  const result = await res.json()


  return result.data
}

export async function getTutorById(
  id: string
): Promise<TutorProfileDetails> {
  const res = await fetch(
    `${env.BACKEND_URL}/tutors/${id}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch tutor")
  }
  const result = await res.json();

  return result.data
}
