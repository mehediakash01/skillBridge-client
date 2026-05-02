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
          className={`${w} ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-zinc-600"}`}
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
      <div className="flex items-center justify-center min-h-[60vh] bg-zinc-950">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto">
            <Users className="w-8 h-8 text-zinc-600" />
          </div>
          <h2 className="text-2xl font-semibold text-white" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
            Tutor not found
          </h2>
          <p className="text-zinc-500 text-sm">This profile doesn't exist or has been removed.</p>
          <Link href="/tutors">
            <button className="mt-2 text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1.5 mx-auto transition-colors">
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
    <div className="min-h-screen bg-zinc-950">
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      {/* ── Hero ─────────────────────────────────────── */}
      <div className="relative bg-zinc-950 border-b border-zinc-800/60 overflow-hidden">
        {/* Atmospheric background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(180,140,60,0.08),transparent)]" />
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-amber-500/3 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-800/30 rounded-full blur-3xl" />
          {/* Subtle dot grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, #a1a1aa 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="container mx-auto max-w-5xl px-6 py-14 relative">
          {/* Back link */}
          <Link
            href="/tutors"
            className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-zinc-500 hover:text-amber-400 mb-10 transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.12em" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Tutors
          </Link>

          <div className="flex flex-col sm:flex-row items-start gap-10">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="p-0.5 rounded-full bg-gradient-to-br from-amber-400/40 via-amber-600/20 to-transparent">
                <Avatar className="h-36 w-36 border-2 border-zinc-900">
                  <AvatarImage src={tutor.Student.image || ""} alt={tutor.Student.name} />
                  <AvatarFallback
                    className="text-5xl font-black bg-zinc-900 text-amber-400"
                    style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                  >
                    {tutor.Student.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              {/* Available badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 rounded-full px-3 py-1 whitespace-nowrap shadow-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-emerald-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Available
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="space-y-4">
                  <div>
                    <p
                      className="text-xs tracking-[0.2em] uppercase text-amber-500/80 mb-2"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Expert Tutor
                    </p>
                    <h1
                      className="text-5xl font-normal text-white tracking-tight leading-[1.05]"
                      style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                    >
                      {tutor.Student.name}
                    </h1>
                    <p className="text-zinc-500 text-sm mt-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {tutor.Student.email}
                    </p>
                  </div>

                  {hasRating ? (
                    <div className="flex items-center gap-3">
                      <StarDisplay rating={rating} size="md" />
                      <span className="font-semibold text-lg text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {rating.toFixed(1)}
                      </span>
                      <span className="text-zinc-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center text-xs font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1">
                      New Tutor
                    </span>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {tutor.tutorSubjects?.map((subject: any) => (
                      <span
                        key={subject.categoryId}
                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-zinc-900 text-zinc-300 border border-zinc-700/80 rounded-full font-medium"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <BookOpen className="w-3 h-3 text-amber-400" />
                        {subject.category?.categoryName}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price pill */}
                <div className="relative overflow-hidden bg-zinc-900 border border-zinc-700/80 px-7 py-5 rounded-2xl text-center shrink-0">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
                  <p
                    className="text-4xl font-normal text-amber-400 leading-none"
                    style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                  >
                    ${tutor.hourlyRate}
                  </p>
                  <p className="text-zinc-500 text-xs mt-1.5 tracking-wider uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    per hour
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Award, label: "Experience", value: `${tutor.experience} yrs` },
              { icon: BookOpen, label: "Subjects", value: tutor.tutorSubjects?.length ?? 0 },
              { icon: Users, label: "Total Sessions", value: totalSessions },
              { icon: CheckCircle, label: "Completed", value: completedSessions },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="relative group flex items-center gap-3 bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl px-5 py-4 overflow-hidden"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p
                      className="text-xl font-normal text-white leading-none"
                      style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="text-xs text-zinc-500 mt-0.5"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {stat.label}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────── */}
      <div className="container mx-auto max-w-5xl py-12 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left column ─────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* About */}
            <PremiumCard accentColor="amber">
              <SectionHeader icon={<MessageSquare className="w-4 h-4 text-amber-400" />} title="About" />
              <p className="text-zinc-400 leading-relaxed text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {tutor.bio || "This tutor hasn't added a bio yet."}
              </p>
            </PremiumCard>

            {/* Subjects */}
            {(tutor.tutorSubjects?.length ?? 0) > 0 && (
              <PremiumCard accentColor="blue">
                <SectionHeader icon={<BookOpen className="w-4 h-4 text-blue-400" />} title="Subjects Taught" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {tutor.tutorSubjects.map((subject: any) => (
                    <div
                      key={subject.categoryId}
                      className="flex items-center gap-2.5 bg-zinc-800/50 border border-zinc-700/60 rounded-xl px-3 py-2.5"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-400/10 border border-blue-400/20 flex items-center justify-center shrink-0">
                        <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-zinc-200" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {subject.category?.categoryName}
                      </span>
                    </div>
                  ))}
                </div>
              </PremiumCard>
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
                <PremiumCard accentColor="violet">
                  <SectionHeader icon={<Calendar className="w-4 h-4 text-violet-400" />} title="Teaching Schedule" />
                  <div className="flex flex-wrap gap-2 mb-5">
                    {DAY_ORDER.map((day) => (
                      <span
                        key={day}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                          activeDays.has(day)
                            ? "bg-violet-400/10 text-violet-300 border-violet-400/30"
                            : "bg-zinc-900/50 text-zinc-700 border-zinc-800 line-through"
                        }`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {DAY_SHORT[day]}
                      </span>
                    ))}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {DAY_ORDER.filter((d) => activeDays.has(d)).map((day) => (
                      <div key={day} className="rounded-xl border border-zinc-700/60 bg-zinc-800/40 px-4 py-3">
                        <p className="text-xs font-semibold text-violet-400 mb-1.5 tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {DAY_LABELS[day]}
                        </p>
                        <div className="space-y-1">
                          {grouped[day].map((slot, i) => (
                            <p key={i} className="text-xs text-zinc-400 flex items-center gap-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                              <Clock className="w-3 h-3 text-zinc-600 shrink-0" />
                              {fmt(slot.startTime)} – {fmt(slot.endTime)}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </PremiumCard>
              )
            })()}

            {/* What to Expect */}
            <PremiumCard accentColor="emerald">
              <SectionHeader icon={<Shield className="w-4 h-4 text-emerald-400" />} title="What to Expect" />
              <div className="grid sm:grid-cols-2 gap-3">
                {([
                  { Icon: Target, title: "1-on-1 session", desc: "Fully personalized, just you and the tutor", color: "text-violet-400 bg-violet-400/10 border-violet-400/20" },
                  { Icon: CalendarDays, title: "Flexible timing", desc: "Pick from the tutor's available slots", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
                  { Icon: Link2, title: "Video meeting link", desc: "Tutor shares a link before the session", color: "text-sky-400 bg-sky-400/10 border-sky-400/20" },
                  { Icon: Star, title: "Leave a review", desc: "Rate your session after attending", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
                  { Icon: XCircle, title: "Cancel anytime", desc: "Free cancellation before link is shared", color: "text-rose-400 bg-rose-400/10 border-rose-400/20" },
                  { Icon: RefreshCw, title: "Book again", desc: "Easily rebook your favourite tutors", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
                ] as const).map(({ Icon, title, desc, color }, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-800/40 border border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800/70 transition-all"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {title}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </PremiumCard>

            {/* Reviews */}
            {allReviews.length > 0 && (
              <PremiumCard accentColor="amber">
                <div className="flex items-center justify-between mb-6">
                  <SectionHeader icon={<Star className="w-4 h-4 text-amber-400 fill-amber-400" />} title="Student Reviews" noMargin />
                  {hasRating && (
                    <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1.5">
                      <StarDisplay rating={rating} />
                      <span className="text-sm font-semibold text-amber-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-amber-500/70" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        ({totalReviews})
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  {allReviews.slice(0, 5).map((review: any, i: number) => (
                    <div key={review.id ?? i}>
                      <div className="flex items-start gap-3.5">
                        <div
                          className="w-9 h-9 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0"
                          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                        >
                          {review.student?.name?.charAt(0) ?? "S"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1.5">
                            <p className="text-sm font-medium text-zinc-200" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                              {review.student?.name ?? "Student"}
                            </p>
                            <StarDisplay rating={Number(review.rating)} />
                          </div>
                          <p className="text-sm text-zinc-500 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            "{review.comment}"
                          </p>
                        </div>
                      </div>
                      {i < allReviews.slice(0, 5).length - 1 && (
                        <div className="mt-5 h-px bg-zinc-800" />
                      )}
                    </div>
                  ))}
                </div>
              </PremiumCard>
            )}
          </div>

          {/* ── Right column (sticky booking) ──────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Booking card */}
              <div className="relative overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-900 shadow-2xl shadow-black/40">
                {/* Top gold shimmer line */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
                <div className="p-6 space-y-5">
                  {/* Price */}
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="text-5xl font-normal text-amber-400 leading-none"
                        style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                      >
                        ${tutor.hourlyRate}
                      </span>
                      <span className="text-zinc-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        /hour
                      </span>
                    </div>
                    {hasRating && (
                      <div className="flex items-center gap-2 mt-2">
                        <StarDisplay rating={rating} />
                        <span className="text-sm font-medium text-zinc-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-zinc-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          · {totalReviews} reviews
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="h-px bg-zinc-800" />

                  {/* Details */}
                  <div className="space-y-3">
                    {[
                      { icon: Clock, text: "1 hour per session" },
                      { icon: Award, text: `${tutor.experience} years experience` },
                      { icon: BookOpen, text: `${tutor.tutorSubjects?.length ?? 0} subject${tutor.tutorSubjects?.length !== 1 ? "s" : ""}` },
                      { icon: Users, text: `${totalSessions} session${totalSessions !== 1 ? "s" : ""} total` },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-3 text-sm text-zinc-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5 text-zinc-500" />
                        </div>
                        {text}
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-zinc-800" />

                  <BookingForm tutorId={tutor.id} />
                </div>
                {/* Bottom gold shimmer line */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
              </div>

              {/* Trust card */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="space-y-2.5">
                  {[
                    { icon: Shield, text: "Secure booking" },
                    { icon: CheckCircle, text: "Cancel before link is shared" },
                    { icon: Star, text: "Review after attending" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-xs text-zinc-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <Icon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Shared sub-components ─────────────────────────── */

function PremiumCard({
  children,
  accentColor = "amber",
}: {
  children: React.ReactNode
  accentColor?: "amber" | "blue" | "violet" | "emerald"
}) {
  const gradients: Record<string, string> = {
    amber: "from-amber-400/40 via-amber-500/20 to-transparent",
    blue: "from-blue-400/40 via-blue-500/20 to-transparent",
    violet: "from-violet-400/40 via-violet-500/20 to-transparent",
    emerald: "from-emerald-400/40 via-emerald-500/20 to-transparent",
  }
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70">
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${gradients[accentColor]}`} />
      <div className="p-6">{children}</div>
    </div>
  )
}

function SectionHeader({
  icon,
  title,
  noMargin = false,
}: {
  icon: React.ReactNode
  title: string
  noMargin?: boolean
}) {
  return (
    <h2
      className={`flex items-center gap-2.5 text-base font-normal text-white ${noMargin ? "" : "mb-5"}`}
      style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
    >
      {icon}
      {title}
    </h2>
  )
}