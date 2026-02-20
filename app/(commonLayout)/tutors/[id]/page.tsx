import { getTutorById } from "@/src/services/tutor.service"

interface Props {
  params: { id: string }
}

export default async function TutorDetailsPage({ params }: Props) {
  const tutor = await getTutorById(params.id)

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
          <p className="text-gray-500">
            {tutor.experience} years experience
          </p>
          <p className="mt-2 font-semibold">
            ${tutor.hourlyRate}/hr
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">About</h2>
      <p className="text-gray-600 mb-6">
        {tutor.bio}
      </p>

      <h2 className="text-xl font-semibold mb-2">Subjects</h2>
      <div className="flex flex-wrap gap-2">
        {tutor.tutorSubjects.map((s) => (
          <span
            key={s.category.id}
            className="bg-gray-100 px-3 py-1 rounded"
          >
            {s.category.categoryName}
          </span>
        ))}
      </div>
    </div>
  )
}
