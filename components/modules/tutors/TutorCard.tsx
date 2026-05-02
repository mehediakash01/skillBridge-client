"use client"

import { TutorListItem } from "@/src/types"
import Link from "next/link"
import { Star, Award, ArrowRight, CheckCircle2, Globe, Flame } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Props {
  tutor: TutorListItem
}

export default function TutorCard({ tutor }: Props) {
  const rating = Number(tutor.averageRate ?? 0)
  const hasRating = rating > 0

  return (
    <Link href={`/tutors/${tutor.id}`}>
      <div className="group relative h-full">
        {/* Card Container */}
        <div className="relative rounded-2xl overflow-hidden h-full bg-gradient-to-br from-background via-background to-muted/20 border border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 flex flex-col">
          
          {/* Premium Top Accent */}
          <div className="h-1 w-full bg-gradient-to-r from-primary via-blue-500 to-primary" />
          
          {/* Avatar Section */}
          <div className="relative pt-6 px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="relative">
                {/* Avatar with ring */}
                {tutor.Student?.image ? (
                  <img
                    src={tutor.Student.image}
                    alt={tutor.Student?.name}
                    className="w-16 h-16 rounded-xl object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-blue-500/20 flex items-center justify-center text-2xl font-black text-primary">
                    {tutor.Student?.name?.charAt(0) ?? "T"}
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-background flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              </div>
              
              {/* Rating Badge */}
              {hasRating && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg border border-yellow-200/30 dark:border-yellow-500/20">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500">{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            {/* Name and Title */}
            <div className="mt-4 space-y-1">
              <h3 className="font-bold text-base leading-tight line-clamp-1">{tutor.Student?.name ?? "Expert Tutor"}</h3>
              <p className="text-xs text-muted-foreground line-clamp-1">{tutor.bio || "Expert tutor"}</p>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-primary/60" />
                <span className="text-xs text-muted-foreground">Experience</span>
              </div>
              <span className="text-xs font-bold text-foreground">{tutor.experience}+ yrs</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500/60" />
                <span className="text-xs text-muted-foreground">Response</span>
              </div>
              <span className="text-xs font-bold text-orange-600">2 hrs</span>
            </div>
          </div>
          
          {/* Subjects Tags */}
          {(tutor.tutorSubjects?.length ?? 0) > 0 && (
            <div className="px-6 py-3 space-y-2 flex-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Subjects</p>
              <div className="flex flex-wrap gap-1.5">
                {tutor.tutorSubjects?.slice(0, 2).map((s) => (
                  <span key={s.category.id} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md font-medium">
                    {s.category?.categoryName}
                  </span>
                ))}
                {(tutor.tutorSubjects?.length ?? 0) > 2 && (
                  <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-md font-medium">
                    +{(tutor.tutorSubjects?.length ?? 0) - 2}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Pricing Section */}
          <div className="px-6 py-4 border-t border-border/40 space-y-3 mt-auto">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Hourly Rate</p>
                <p className="text-2xl font-black text-primary">${tutor.hourlyRate}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground font-medium">Status</p>
                <p className="text-sm font-bold text-green-600">Available</p>
              </div>
            </div>
            
            {/* CTA Button */}
            <button className="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold text-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 group/btn">
              View Profile
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}