"use client"

import { TutorListItem } from "@/src/types"
import Link from "next/link"

interface Props {
  tutor: TutorListItem
}

export default function TutorCard({ tutor }: Props) {

  return (
    <div className="border rounded-xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={tutor.Student?.image || "/avatar.jpg"}
          alt={tutor.Student?.name}
          className="w-14 h-14 rounded-full object-cover"
        />

        <div>
          <h3 className="font-semibold text-lg">
            {tutor.Student?.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {tutor.experience} years experience
          </p>
        </div>
      </div>
<div className="flex flex-wrap gap-2 mb-3">
  {(tutor.tutorSubjects || []).map((s) => (
    <span
      key={s.category.id}
      className="text-xs bg-gray-100 px-2 py-1 rounded"
    >
      {s.category.categoryName}
    </span>
  ))}
</div>


      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
        {tutor.bio}
      </p>

      <div className="flex justify-between items-center">
        <span className="font-semibold">
          ${tutor.hourlyRate}/hr
        </span>

        <Link
          href={`/tutors/${tutor.id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          View Profile
        </Link>
      </div>
    </div>
  )
}
