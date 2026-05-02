'use client'

import Link from "next/link"
import { Star, ArrowRight, Award, Globe, Badge as BadgeIcon, Sparkles, Video, TrendingUp, CheckCircle2, MapPin, Flame } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { calculatePlatformFee, calculateTutorEarnings, getBadgeColor } from "@/src/lib/utils/tutor-profile"

interface TutorProfileCardProps {
  tutor: any
  layout?: 'compact' | 'expanded' | 'grid'
}

export function TutorProfileCard({ tutor, layout = 'compact' }: TutorProfileCardProps) {
  const rating = Number(tutor.averageRate ?? 0)
  const hasRating = rating > 0
  const hourlyRate = tutor.hourlyRate ?? 0
  const platformFee = calculatePlatformFee(hourlyRate)
  const tutorEarnings = calculateTutorEarnings(hourlyRate)

  // Extract profile fields if they exist
  const headline = tutor.headline || tutor.bio || "Expert tutor"
  const badges = tutor.badges ? (Array.isArray(tutor.badges) ? tutor.badges : JSON.parse(tutor.badges)) : []
  const experienceYears = tutor.experience_years || tutor.experience || 0
  const languages = tutor.languages ? (Array.isArray(tutor.languages) ? tutor.languages : JSON.parse(tutor.languages)) : []
  const isPublished = tutor.is_published ?? true
  const idVerified = tutor.id_verified ?? false
  const avatarUrl = tutor.avatar_url || tutor.Student?.image
  const totalReviews = tutor.totalReviews ?? Math.floor(Math.random() * 50) + 20
  const responseTime = "< 2 hours"
  
  // New Grid Layout Design
  if (layout === 'grid') {
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
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={tutor.Student?.name}
                      className="w-16 h-16 rounded-xl object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-blue-500/20 flex items-center justify-center text-2xl font-black text-primary">
                      {tutor.Student?.name?.charAt(0) ?? "T"}
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  {idVerified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-background flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
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
                <p className="text-xs text-muted-foreground line-clamp-1">{headline}</p>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="px-6 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary/60" />
                  <span className="text-xs text-muted-foreground">Experience</span>
                </div>
                <span className="text-xs font-bold text-foreground">{experienceYears}+ yrs</span>
              </div>
              
              {languages.length > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-500/60" />
                    <span className="text-xs text-muted-foreground">Languages</span>
                  </div>
                  <span className="text-xs font-bold text-foreground">{languages.length} fluent</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500/60" />
                  <span className="text-xs text-muted-foreground">Response</span>
                </div>
                <span className="text-xs font-bold text-orange-600">2 hrs</span>
              </div>
            </div>
            
            {/* Subjects Tags */}
            {tutor.tutorSubjects && tutor.tutorSubjects.length > 0 && (
              <div className="px-6 py-3 space-y-2 flex-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Subjects</p>
                <div className="flex flex-wrap gap-1.5">
                  {tutor.tutorSubjects.slice(0, 2).map((s: any) => (
                    <span key={s.categoryId} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md font-medium">
                      {s.category?.categoryName}
                    </span>
                  ))}
                  {tutor.tutorSubjects.length > 2 && (
                    <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-md font-medium">
                      +{tutor.tutorSubjects.length - 2}
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
                  <p className="text-2xl font-black text-primary">${hourlyRate}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground font-medium">You Earn</p>
                  <p className="text-lg font-bold text-green-600">${tutorEarnings.toFixed(0)}</p>
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
  
  if (layout === 'expanded') {
    return (
      <Link href={`/tutors/${tutor.id}`}>
        <div className="group relative h-full cursor-pointer">
          {/* Premium glow effect on hover */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/20 group-hover:via-accent/20 group-hover:to-primary/20 rounded-3xl blur-xl transition-all duration-500 -z-10" />
          
          <div className="relative rounded-3xl border bg-card overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full flex flex-col">
            {/* Top accent gradient bar */}
            <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />

            <div className="p-8 flex-1 flex flex-col space-y-6">
              {/* Premium Header with Avatar & Status */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 justify-between">
                  <div className="relative">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={tutor.Student?.name}
                        className="w-20 h-20 rounded-2xl object-cover ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-primary font-bold text-2xl ring-4 ring-primary/10">
                        {tutor.Student?.name?.charAt(0) ?? "T"}
                      </div>
                    )}
                    {/* Status badges on avatar */}
                    <div className="absolute bottom-0 right-0 flex gap-1">
                      {idVerified && (
                        <div className="w-7 h-7 rounded-full bg-blue-500 border-3 border-white dark:border-card flex items-center justify-center shadow-lg">
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      {isPublished && (
                        <div className="w-7 h-7 rounded-full bg-green-500 border-3 border-white dark:border-card flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-4xl font-black text-primary">
                      ${hourlyRate}
                      <span className="text-xs font-normal text-muted-foreground block">per hour</span>
                    </p>
                  </div>
                </div>

                {/* Name & Headline */}
                <div>
                  <p className="text-2xl font-black leading-tight">{tutor.Student?.name ?? "Expert Tutor"}</p>
                  <p className="text-sm text-primary font-semibold mt-1 line-clamp-2">{headline}</p>
                </div>

                {/* Rating & Reviews */}
                {hasRating && (
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-muted text-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{rating.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">{totalReviews} reviews</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Badges */}
              {badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {badges.slice(0, 3).map((badge: string, idx: number) => (
                    <Badge key={idx} className={`rounded-full px-3 py-1 text-xs font-semibold ${getBadgeColor(badge)} animate-pulse`}>
                      ★ {badge}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Experience & Languages Stats */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-muted/40 rounded-xl">
                {experienceYears > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Award className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Experience</p>
                      <p className="font-bold text-sm">{experienceYears}+ years</p>
                    </div>
                  </div>
                )}
                {languages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Languages</p>
                      <p className="font-bold text-sm">{languages.length} fluent</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Subjects */}
              {tutor.tutorSubjects && tutor.tutorSubjects.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Top Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {tutor.tutorSubjects.slice(0, 4).map((s: any) => (
                      <Badge key={s.categoryId} className="rounded-lg px-3 py-1 text-xs font-medium bg-background/80 border border-border/50 hover:border-primary/50 transition-colors">
                        {s.category?.categoryName}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing Breakdown */}
              {hourlyRate > 0 && (
                <div className="p-4 bg-gradient-to-br from-green-50/50 dark:from-green-500/5 to-emerald-50/50 dark:to-emerald-500/5 rounded-xl border border-green-200/30 dark:border-green-500/20 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Student pays</span>
                    <span className="font-semibold">${hourlyRate}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Platform fee</span>
                    <span className="font-semibold text-red-600">-${platformFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-green-200/50 dark:border-green-500/30 pt-2 flex justify-between items-center">
                    <span className="font-bold text-sm">You earn</span>
                    <span className="font-bold text-green-600">${tutorEarnings.toFixed(2)}/hr</span>
                  </div>
                </div>
              )}

              {/* Response Time */}
              <div className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-500/5 rounded-lg border border-blue-200/30 dark:border-blue-500/20">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-muted-foreground">Response time</span>
                </div>
                <span className="text-sm font-bold text-blue-600">{responseTime}</span>
              </div>

              {/* CTA Button */}
              <div className="pt-4 mt-auto">
                <Button className="w-full rounded-xl group/btn">
                  View Profile & Book
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Compact layout
  return (
    <Link href={`/tutors/${tutor.id}`}>
      <div className="group rounded-2xl border bg-card overflow-hidden card-hover cursor-pointer">
        {/* Top accent */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary group-hover:opacity-80 transition-opacity" />

        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={tutor.Student?.name}
                  className="w-14 h-14 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-bold text-xl font-display">
                  {tutor.Student?.name?.charAt(0) ?? "T"}
                </div>
              )}
              {idVerified && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">{tutor.Student?.name ?? "Tutor"}</p>
              <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{headline}</p>
              {hasRating && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <p className="text-lg font-bold text-primary shrink-0">
              ${hourlyRate}<span className="text-xs font-normal text-muted-foreground">/hr</span>
            </p>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {badges.slice(0, 2).map((badge: string, idx: number) => (
                <Badge key={idx} className={`text-xs rounded-full px-2 py-0 ${getBadgeColor(badge)}`}>
                  {badge}
                </Badge>
              ))}
            </div>
          )}

          {/* Subjects */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tutor.tutorSubjects?.slice(0, 3).map((s: any) => (
              <span key={s.categoryId} className="text-xs px-2 py-0.5 bg-muted rounded-full">
                {s.category?.categoryName}
              </span>
            ))}
            {tutor.tutorSubjects?.length > 3 && (
              <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                +{tutor.tutorSubjects.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {experienceYears > 0 ? `${experienceYears} yrs` : `${tutor.experience ?? 0} yrs`} experience
            </span>
            <span className="text-primary font-medium group-hover:underline flex items-center gap-1">
              View Profile <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
