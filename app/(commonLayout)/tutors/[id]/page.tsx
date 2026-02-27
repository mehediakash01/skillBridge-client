import BookingForm from "@/components/modules/bookings/BookingForm"
import { getTutorById } from "@/src/services/tutor.service"
import { Star, Clock, BookOpen, Award, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

interface Props {
  params: Promise<{ id: string }>
}

export default async function TutorDetailsPage({ params }: Props) {
  const { id } = await params
  const tutor = await getTutorById(id)

  if (!tutor || !tutor.Student) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Tutor not found</h2>
          <p className="text-muted-foreground mt-2">This tutor profile doesn't exist.</p>
        </div>
      </div>
    )
  }

  const rating = Number(tutor.averageRate)
  const hasRating = rating > 0
  const totalReviews = tutor.bookings?.filter((b: any) => b.reviews?.length > 0).length ?? 0

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero banner */}
      <div className="bg-white border-b">
        <div className="container mx-auto max-w-5xl py-10 px-4">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <Avatar className="h-28 w-28 border-4 border-white shadow-md shrink-0">
              <AvatarImage src={tutor.Student.image || ""} alt={tutor.Student.name} />
              <AvatarFallback className="text-3xl font-bold">
                {tutor.Student.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{tutor.Student.name}</h1>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {tutor.Student.email}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-2">
                    {hasRating ? (
                      <>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${
                                s <= Math.round(rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
                        <span className="text-muted-foreground text-sm">
                          ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground text-sm">No reviews yet</span>
                    )}
                  </div>

                  {/* Subjects */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tutor.tutorSubjects?.map((subject: any) => (
                      <Badge key={subject.categoryId} variant="secondary">
                        {subject.category?.categoryName}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <p className="text-3xl font-bold text-primary">${tutor.hourlyRate}</p>
                  <p className="text-muted-foreground text-sm">per hour</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-5xl py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Award, label: "Experience", value: `${tutor.experience} yrs` },
                { icon: BookOpen, label: "Subjects", value: tutor.tutorSubjects?.length ?? 0 },
                { icon: Users, label: "Sessions", value: tutor.bookings?.length ?? 0 },
              ].map((stat) => {
                const Icon = stat.icon
                return (
                  <Card key={stat.label}>
                    <CardContent className="pt-5 pb-5 text-center">
                      <Icon className="w-5 h-5 mx-auto text-primary mb-2" />
                      <p className="text-xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* About */}
            <Card>
              <CardContent className="pt-6 pb-6">
                <h2 className="text-lg font-semibold mb-3">About</h2>
                <Separator className="mb-4" />
                <p className="text-muted-foreground leading-relaxed">
                  {tutor.bio || "This tutor hasn't added a bio yet."}
                </p>
              </CardContent>
            </Card>

            {/* Subjects detail */}
            <Card>
              <CardContent className="pt-6 pb-6">
                <h2 className="text-lg font-semibold mb-3">Subjects Taught</h2>
                <Separator className="mb-4" />
                {tutor.tutorSubjects?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {tutor.tutorSubjects.map((subject: any) => (
                      <div
                        key={subject.categoryId}
                        className="flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-lg px-3 py-2"
                      >
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">
                          {subject.category?.categoryName}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No subjects listed</p>
                )}
              </CardContent>
            </Card>

            {/* What to expect */}
            <Card>
              <CardContent className="pt-6 pb-6">
                <h2 className="text-lg font-semibold mb-3">What to Expect</h2>
                <Separator className="mb-4" />
                <div className="space-y-3">
                  {[
                    { icon: "✅", text: "1-on-1 personalized session via video call" },
                    { icon: "📅", text: "Flexible scheduling based on tutor availability" },
                    { icon: "🔗", text: "Tutor will share a meeting link before the session" },
                    { icon: "⭐", text: "Leave a review after attending your session" },
                    { icon: "❌", text: "Cancel anytime before the meeting link is shared" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-base">{item.icon}</span>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            {tutor.bookings?.some((b: any) => b.reviews?.length > 0) && (
              <Card>
                <CardContent className="pt-6 pb-6">
                  <h2 className="text-lg font-semibold mb-3">Student Reviews</h2>
                  <Separator className="mb-4" />
                  <div className="space-y-4">
                    {tutor.bookings
                      .filter((b: any) => b.reviews?.length > 0)
                      .slice(0, 5)
                      .map((b: any) =>
                        b.reviews.map((review: any) => (
                          <div key={review.id} className="space-y-1">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= Number(review.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-muted-foreground ml-1">
                                {Number(review.rating).toFixed(1)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                            <Separator />
                          </div>
                        ))
                      )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right — booking card (sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <Card>
                <CardContent className="pt-6 pb-6 space-y-4">
                  <div>
                    <p className="text-2xl font-bold">${tutor.hourlyRate}<span className="text-base font-normal text-muted-foreground">/hr</span></p>
                    {hasRating && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">· {totalReviews} reviews</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>1 hour per session</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 shrink-0" />
                      <span>{tutor.experience} years of experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 shrink-0" />
                      <span>{tutor.tutorSubjects?.length ?? 0} subject{tutor.tutorSubjects?.length !== 1 ? "s" : ""}</span>
                    </div>
                  </div>

                  <Separator />

                  <BookingForm tutorId={tutor.id} />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground text-center leading-relaxed">
                     Secure booking · Cancel before link is shared · Review after session
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}