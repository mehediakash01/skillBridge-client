import BookingForm from "@/components/modules/bookings/BookingForm"
import { getTutorById } from "@/src/services/tutor.service"

interface Props {
  params: Promise<{ id: string }>
}

export default async function TutorDetailsPage({ params }: Props) {
  const { id } = await params

  const tutor = await getTutorById(id)

  if (!tutor || !tutor.Student) {
    return <div className="text-center py-20">Tutor not found</div>
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      
      {/* Header Section */}
      <div className="flex items-center gap-6 mb-8">
        <img
          src={tutor.Student.image || "/avatar.png"}
          alt={tutor.Student.name}
          className="w-24 h-24 rounded-full object-cover"
        />

        <div>
          <h1 className="text-3xl font-bold">
            {tutor.Student.name}
          </h1>
          <p className="text-gray-600">
            {tutor.experience} years experience
          </p>
          <p className="text-lg font-semibold">
            ${tutor.hourlyRate}/hr
          </p>
          <p className="text-yellow-500">
            ⭐ {tutor.averageRate || "No rating yet"}
          </p>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">About</h2>
        <p className="text-gray-700">
          {tutor.bio || "No bio available"}
        </p>
      </div>

      {/* Subjects */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Subjects</h2>
        <div className="flex flex-wrap gap-3">
          {tutor.tutorSubjects?.map((subject: any,indx) => (
            <span
              key={indx}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
            >
              {subject.category?.name}
            </span>
          ))}
        </div>
      </div>

      {/* Booking Button */}
   <div className="mt-10 w-fit">
  <BookingForm tutorId={tutor.id} />
</div>


    </div>
  )
}
