import { getTutorById } from "@/src/services/tutor.service"

interface Props {
  params: Promise<{ id: string }>
}

export default async function TutorDetailsPage({ params }: Props) {
  const { id } = await params

  const tutor = await getTutorById(id)
console.log("tutor data",tutor);
  if (!tutor || !tutor.Student) {
    return <div>Tutor not found</div>
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={tutor.Student.image || "/avatar.png"}
          alt={tutor.Student.name}
          className="w-24 h-24 rounded-full object-cover"
        />

        <div>
          <h1 className="text-3xl font-bold">
            {tutor.Student.name}
          </h1>
          <p>{tutor.experience} years experience</p>
          <p>${tutor.hourlyRate}/hr</p>
        </div>
      </div>
    </div>
  )
}
