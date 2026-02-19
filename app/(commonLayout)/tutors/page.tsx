import { getTutors } from "@/src/services/tutor.service"
import TutorCard from "@/components/modules/tutors/TutorCard"

export default async function TutorsPage() {
  const tutors = await getTutors()
console.log(tutors);
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">
        Browse Tutors
      </h1>

      {tutors.length === 0 ? (
        <p>No tutors available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      )}
    </div>
  )
}
