import BookingForm from "@/components/modules/bookings/BookingForm"
import { getTutorById } from "@/src/services/tutor.service"
import {
  Star, Clock, BookOpen, Award, Users,
  CheckCircle, MessageSquare, ArrowLeft, Shield,
  Target, CalendarDays, Link2, XCircle, RefreshCw, Calendar
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface Props {
  params: Promise<{ id: string }>
}

function StarDisplay({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const w = size === "md" ? "w-5 h-5" : "w-4 h-4"
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${w} ${s <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  )
}

export default async function TutorDetailsPage({ params }: Props) {
  const { id } = await params
  const tutor = await getTutorById(id)

  if (!tutor || !tutor.Student) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Users className="w-7 h-7 text-muted-foreground/40" />
          </div>
          <h2 className="text-xl font-bold">Tutor not found</h2>
          <p className="text-muted-foreground text-sm">This profile doesn't exist or has been removed.</p>
          <Link href="/tutors">
            <button className="mt-2 text-sm text-primary hover:underline flex items-center gap-1 mx-auto">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to tutors
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const rating = Number(tutor.averageRate)
  const hasRating = rating > 0
  const allReviews = tutor.bookings
    ?.filter((b: any) => b.reviews?.length > 0)
    .flatMap((b: any) => b.reviews.map((r: any) => ({ ...r, student: b.Student }))) ?? []
  const totalReviews = allReviews.length
  const totalSessions = tutor.bookings?.length ?? 0
  const completedSessions = tutor.bookings?.filter((b: any) => b.status === "completed").length ?? 0

  return (
    <div className="min-h-screen bg-muted/30">
      {/* ── Hero ──────────────────────────────────────── */}
      <div className="relative bg-background border-b overflow-hidden">
        {/* Mesh background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.9_0_0)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.9_0_0)_1px,transparent_1px)] bg-size-[48px_48px] opacity-30" />
        </div>

        <div className="container mx-auto max-w-5xl px-4 py-12 relative">
          {/* Back link */}
          <Link href="/tutors" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            All Tutors
          </Link>

          <div className="flex flex-col sm:flex-row items-start gap-8">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={tutor.Student.image || ""} alt={tutor.Student.name} />
                <AvatarFallback
                  className="text-4xl font-black"
                  style={{ fontFamily: "'Fraunces', serif", background: "oklch(0.65 0.15 280 / 0.1)", color: "oklch(0.65 0.15 280)" }}
                >
                  {tutor.Student.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 flex items-center gap-1 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-green-700">Available</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-3">
                  <div>
                    <h1
                      className="text-4xl font-black tracking-tight leading-tight"
                      style={{ fontFamily: "'Fraunces', serif" }}
                    >
                      {tutor.Student.name}
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">{tutor.Student.email}</p>
                  </div>

                  {hasRating ? (
                    <div className="flex items-center gap-2">
                      <StarDisplay rating={rating} size="md" />
                      <span className="font-bold text-lg">{rating.toFixed(1)}</span>
                      <span className="text-muted-foreground text-sm">
                        ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
                      </span>
                    </div>
                  ) : (
                    <Badge variant="secondary" className="rounded-full">New Tutor</Badge>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {tutor.tutorSubjects?.map((subject: any) => (
                      <span
                        key={subject.categoryId}
                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1 bg-primary/8 text-primary border border-primary/10 rounded-full font-medium"
                      >
                        <BookOpen className="w-3 h-3" />
                        {subject.category?.categoryName}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price pill */}
                <div className="bg-primary text-primary-foreground px-6 py-4 rounded-2xl text-center shadow-lg shadow-primary/20 shrink-0">
                  <p className="text-3xl font-black" style={{ fontFamily: "'Fraunces', serif" }}>
                    ${tutor.hourlyRate}
                  </p>
                  <p className="text-primary-foreground/70 text-xs mt-0.5">per hour</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats strip */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Award, label: "Experience", value: `${tutor.experience} yrs`, color: "text-violet-600 bg-violet-50" },
              { icon: BookOpen, label: "Subjects", value: tutor.tutorSubjects?.length ?? 0, color: "text-blue-600 bg-blue-50" },
              { icon: Users, label: "Total Sessions", value: totalSessions, color: "text-green-600 bg-green-50" },
              { icon: CheckCircle, label: "Completed", value: completedSessions, color: "text-emerald-600 bg-emerald-50" },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="flex items-center gap-3 bg-white/80 backdrop-blur rounded-xl border px-4 py-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-lg font-bold leading-none">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────── */}
      <div className="container mx-auto max-w-5xl py-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left column ────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* About */}
            <Card className="overflow-hidden">
              <div className="h-1 bg-linear-to-r from-primary to-accent" />
              <CardContent className="pt-6 pb-6">
                <h2 className="font-bold text-base mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  About
                </h2>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {tutor.bio || "This tutor hasn't added a bio yet."}
                </p>
              </CardContent>
            </Card>

            {/* Subjects */}
            {(tutor.tutorSubjects?.length ?? 0) > 0 && (
              <Card className="overflow-hidden">
                <div className="h-1 bg-linear-to-r from-blue-400 to-primary" />
                <CardContent className="pt-6 pb-6">
                  <h2 className="font-bold text-base mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Subjects Taught
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {tutor.tutorSubjects.map((subject: any) => (
                      <div
                        key={subject.categoryId}
                        className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2.5 border"
                      >
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <BookOpen className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-sm font-medium">
                          {subject.category?.categoryName}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Teaching Schedule */}
            {(tutor.availabilities?.length ?? 0) > 0 && (() => {
              const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const
              const DAY_LABELS: Record<string, string> = {
                mon: "Monday", tue: "Tuesday", wed: "Wednesday",
                thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday",
              }
              const DAY_SHORT: Record<string, string> = {
                mon: "Mon", tue: "Tue", wed: "Wed",
                thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
              }
              const activeDays = new Set(tutor.availabilities.map((a: any) => a.dayOfWeek))
              const grouped: Record<string, { startTime: string; endTime: string }[]> = {}
              for (const a of tutor.availabilities) {
                if (!grouped[a.dayOfWeek]) grouped[a.dayOfWeek] = []
                grouped[a.dayOfWeek].push({ startTime: a.startTime, endTime: a.endTime })
              }
              const fmt = (t: string) => {
                const [h, m] = t.split(":").map(Number)
                const ampm = h >= 12 ? "PM" : "AM"
                const hour = h % 12 || 12
                return `${hour}:${String(m).padStart(2, "0")} ${ampm}`
              }
              return (
                <Card className="overflow-hidden">
                  <div className="h-1 bg-linear-to-r from-indigo-400 to-violet-500" />
                  <CardContent className="pt-6 pb-6">
                    <h2 className="font-bold text-base mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      Teaching Schedule
                    </h2>
                    {/* Day pills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {DAY_ORDER.map((day) => (
                        <span
                          key={day}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                            activeDays.has(day)
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : "bg-muted/40 text-muted-foreground/40 border-muted line-through"
                          }`}
                        >
                          {DAY_SHORT[day]}
                        </span>
                      ))}
                    </div>
                    {/* Time slots per active day */}
                    <div className="grid sm:grid-cols-2 gap-2">
                      {DAY_ORDER.filter((d) => activeDays.has(d)).map((day) => (
                        <div key={day} className="rounded-xl border bg-muted/30 px-3 py-2.5">
                          <p className="text-xs font-bold text-indigo-700 mb-1">{DAY_LABELS[day]}</p>
                          <div className="space-y-0.5">
                            {grouped[day].map((slot, i) => (
                              <p key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3 shrink-0" />
                                {fmt(slot.startTime)} – {fmt(slot.endTime)}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })()}

            {/* What to expect */}
            <Card className="overflow-hidden">
              <div className="h-1 bg-linear-to-r from-green-400 to-emerald-500" />
              <CardContent className="pt-6 pb-6">
                <h2 className="font-bold text-base mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  What to Expect
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {([
                    { Icon: Target,      title: "1-on-1 session",     desc: "Fully personalized, just you and the tutor",    color: "text-violet-600 bg-violet-50" },
                    { Icon: CalendarDays,title: "Flexible timing",    desc: "Pick from the tutor's available slots",        color: "text-blue-600 bg-blue-50" },
                    { Icon: Link2,       title: "Video meeting link", desc: "Tutor shares a link before the session",       color: "text-sky-600 bg-sky-50" },
                    { Icon: Star,        title: "Leave a review",     desc: "Rate your session after attending",           color: "text-yellow-600 bg-yellow-50" },
                    { Icon: XCircle,     title: "Cancel anytime",     desc: "Free cancellation before link is shared",     color: "text-red-500 bg-red-50" },
                    { Icon: RefreshCw,   title: "Book again",         desc: "Easily rebook your favourite tutors",         color: "text-green-600 bg-green-50" },
                  ] as const).map(({ Icon, title, desc, color }, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            {allReviews.length > 0 && (
              <Card className="overflow-hidden">
                <div className="h-1 bg-linear-to-r from-yellow-400 to-orange-400" />
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-base flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      Student Reviews
                    </h2>
                    {hasRating && (
                      <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 rounded-full px-3 py-1">
                        <StarDisplay rating={rating} />
                        <span className="text-sm font-bold text-yellow-700">{rating.toFixed(1)}</span>
                        <span className="text-xs text-yellow-600">({totalReviews})</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {allReviews.slice(0, 5).map((review: any, i: number) => (
                      <div key={review.id ?? i}>
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                            {review.student?.name?.charAt(0) ?? "S"}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold">{review.student?.name ?? "Student"}</p>
                              <StarDisplay rating={Number(review.rating)} />
                            </div>
                            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                              "{review.comment}"
                            </p>
                          </div>
                        </div>
                        {i < allReviews.slice(0, 5).length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ── Right column (sticky booking) ─────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <Card className="overflow-hidden shadow-lg shadow-primary/8">
                <div className="h-1.5 bg-linear-to-r from-primary via-accent to-primary" />
                <CardContent className="pt-6 pb-6 space-y-5">
                  {/* Price */}
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span
                        className="text-4xl font-black text-primary"
                        style={{ fontFamily: "'Fraunces', serif" }}
                      >
                        ${tutor.hourlyRate}
                      </span>
                      <span className="text-muted-foreground text-sm">/hour</span>
                    </div>
                    {hasRating && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <StarDisplay rating={rating} />
                        <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">· {totalReviews} reviews</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Details */}
                  <div className="space-y-2.5">
                    {[
                      { icon: Clock, text: "1 hour per session" },
                      { icon: Award, text: `${tutor.experience} years experience` },
                      { icon: BookOpen, text: `${tutor.tutorSubjects?.length ?? 0} subject${tutor.tutorSubjects?.length !== 1 ? "s" : ""}` },
                      { icon: Users, text: `${totalSessions} session${totalSessions !== 1 ? "s" : ""} total` },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        {text}
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <BookingForm tutorId={tutor.id} />
                </CardContent>
              </Card>

              {/* Trust card */}
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="space-y-2">
                    {[
                      { icon: Shield, text: "Secure booking" },
                      { icon: CheckCircle, text: "Cancel before link is shared" },
                      { icon: Star, text: "Review after attending" },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Icon className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        {text}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}