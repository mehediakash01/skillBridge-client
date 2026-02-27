"use client"

import { TutorListItem } from "@/src/types"
import Link from "next/link"
import { Star, Award, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Props {
  tutor: TutorListItem
}

export default function TutorCard({ tutor }: Props) {
  const rating = Number(tutor.averageRate ?? 0)
  const hasRating = rating > 0

  return (
    <Link href={`/tutors/${tutor.id}`}>
      <div className="group relative rounded-2xl border bg-card overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/8 cursor-pointer h-full flex flex-col">
        {/* Top gradient accent */}
        <div className="h-1 bg-linear-to-r from-primary via-accent to-primary bg-size-[200%_auto] group-hover:bg-right transition-all duration-700" />

        <div className="p-6 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-start gap-4 mb-5">
            <div className="relative shrink-0">
              {tutor.Student?.image ? (
                <img
                  src={tutor.Student.image}
                  alt={tutor.Student?.name}
                  className="w-14 h-14 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {tutor.Student?.name?.charAt(0) ?? "T"}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base truncate">{tutor.Student?.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Award className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground">
                  {tutor.experience} yr{tutor.experience !== 1 ? "s" : ""} experience
                </span>
              </div>
              {hasRating ? (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-semibold">{rating.toFixed(1)}</span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground mt-1 block">New tutor</span>
              )}
            </div>

            <div className="text-right shrink-0">
              <p className="text-xl font-bold text-primary">${tutor.hourlyRate}</p>
              <p className="text-xs text-muted-foreground">/hr</p>
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed flex-1">
            {tutor.bio || "Expert tutor ready to help you succeed."}
          </p>

          {/* Subjects */}
          {(tutor.tutorSubjects?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {tutor.tutorSubjects?.slice(0, 3).map((s) => (
                <span
                  key={s.category.id}
                  className="text-xs px-2.5 py-1 bg-primary/8 text-primary rounded-full font-medium"
                >
                  {s.category.categoryName}
                </span>
              ))}
              {(tutor.tutorSubjects?.length ?? 0) > 3 && (
                <span className="text-xs px-2.5 py-1 bg-muted text-muted-foreground rounded-full">
                  +{(tutor.tutorSubjects?.length ?? 0) - 3} more
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-muted-foreground">Available</span>
            </div>
            <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              View Profile <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}