import Link from "next/link"
import { getTutors } from "@/src/services/tutor.service"
import { ArrowRight, Star, BookOpen, Award, CheckCircle, Clock, Globe, Zap, Shield, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

async function getCategories() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
    const res = await fetch(`${backendUrl}/api/categories`, { cache: "no-store" })
    if (!res.ok) return []
    const data = await res.json()
    return data.data ?? []
  } catch {
    return []
  }
}


// ── Floating badge component ──────────────────────────────
function FloatingBadge({ text, className }: { text: string; className: string }) {
  return (
    <div className={`absolute px-3 py-1.5 bg-white rounded-full shadow-lg border text-xs font-semibold flex items-center gap-1.5 ${className}`}>
      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      {text}
    </div>
  )
}

// ── Step card ─────────────────────────────────────────────
function StepCard({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-px rounded-2xl bg-linear-to-b from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative rounded-2xl border bg-card p-8 h-full">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
          <span className="text-xl font-bold text-primary font-serif">{number}</span>
        </div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

// ── Feature card ──────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, accent }: { icon: any; title: string; desc: string; accent: string }) {
  return (
    <div className="flex gap-4 p-5 rounded-xl hover:bg-muted/50 transition-colors">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-1">{title}</h4>
        <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

// ── Testimonial ───────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Aisha Rahman", role: "University Student", text: "I went from failing calculus to acing my finals in 6 weeks. The 1-on-1 sessions made all the difference.", rating: 5, subject: "Mathematics", avatar: "AR" },
  { name: "Marcus Chen", role: "Working Professional", text: "Found an incredible Python tutor who fit my schedule perfectly. Worth every penny for the career boost.", rating: 5, subject: "Programming", avatar: "MC" },
  { name: "Priya Sharma", role: "High School Student", text: "My English writing improved dramatically. My tutor gave feedback that my school teachers never had time for.", rating: 5, subject: "English", avatar: "PS" },
  { name: "David Okafor", role: "Parent", text: "Booked sessions for my daughter and watched her confidence soar. The platform is incredibly easy to use.", rating: 5, subject: "Science", avatar: "DO" },
]

// ── FAQ ───────────────────────────────────────────────────
const FAQS = [
  { q: "How does booking work?", a: "Browse tutors, select a date, choose an available time slot, and confirm. Your tutor will share a meeting link before the session." },
  { q: "Can I cancel a booking?", a: "Yes — you can cancel anytime before the tutor adds a meeting link. Once a link is shared, the session is committed." },
  { q: "How do I leave a review?", a: "After joining your session, a Review button appears in your dashboard. You can rate and comment once per session." },
  { q: "How are tutors vetted?", a: "Tutors create profiles with their experience, subjects, and hourly rates. Student reviews build their public rating over time." },
  { q: "What subjects are available?", a: "We cover a wide range — from academic subjects like Math, Science and English to professional skills like Programming and Business." },
]

export default async function LandingPage() {
  const [tutors, categories] = await Promise.all([
    getTutors({ limit: 6, sortBy: "averageRate", sortOrder: "desc" }),
    getCategories(),
  ])

  const tutorList = Array.isArray(tutors?.data) ? tutors.data : Array.isArray(tutors) ? tutors : []
  const categoryList = Array.isArray(categories) ? categories.slice(0, 10) : []

  return (
    <div className="overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300&family=DM+Sans:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', Georgia, serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-delay { animation: float 4s ease-in-out 1.5s infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, oklch(0.65 0.15 280), oklch(0.85 0.2 70), oklch(0.65 0.15 280));
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .mesh-bg {
          background-image:
            radial-gradient(at 20% 30%, oklch(0.65 0.15 280 / 0.15) 0px, transparent 50%),
            radial-gradient(at 80% 20%, oklch(0.85 0.2 70 / 0.1) 0px, transparent 50%),
            radial-gradient(at 60% 80%, oklch(0.75 0.12 160 / 0.08) 0px, transparent 50%);
        }
        .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -12px rgb(0 0 0 / 0.12); }
      `}</style>

      {/* ── 1. HERO ──────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center mesh-bg">
        {/* Decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.9_0_0)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.9_0_0)_1px,transparent_1px)] bg-size-[64px_64px] opacity-40" />

        <div className="container mx-auto max-w-6xl px-4 relative z-10 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
                <Zap className="w-3.5 h-3.5" />
                The smarter way to learn
              </div>

              <h1 className="font-display text-6xl lg:text-7xl font-black leading-none tracking-tight">
                Find Your
                <span className="block shimmer-text">Perfect Tutor.</span>
                <span className="block font-light italic text-foreground/70">Learn Anything.</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                Connect with expert tutors for live 1-on-1 sessions. Browse by subject, book instantly, and start learning today — on your schedule.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/tutors">
                  <Button size="lg" className="rounded-full px-8 h-13 text-base gap-2 shadow-lg shadow-primary/25">
                    Find a Tutor
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="rounded-full px-8 h-13 text-base gap-2">
                    <Play className="w-4 h-4 fill-current" />
                    Become a Tutor
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div>
                  <p className="text-2xl font-bold font-display">500+</p>
                  <p className="text-xs text-muted-foreground">Active Tutors</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <p className="text-2xl font-bold font-display">10k+</p>
                  <p className="text-xs text-muted-foreground">Sessions Completed</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-xs text-muted-foreground ml-1">4.9 avg rating</p>
                </div>
              </div>
            </div>

            {/* Right — visual card stack */}
            <div className="relative hidden lg:block h-130">
              {/* Main card */}
              <div className="absolute top-8 left-8 right-0 bg-white rounded-3xl shadow-2xl border p-6 animate-float">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-bold text-lg font-display">S</div>
                    <div>
                      <p className="font-semibold text-sm">Sarah Johnson</p>
                      <p className="text-xs text-muted-foreground">Mathematics Expert</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-0 text-xs">Available</Badge>
                </div>
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                  <span className="text-xs text-muted-foreground ml-1">5.0 (128 reviews)</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {["Calculus","Algebra","Statistics"].map(s => (
                    <span key={s} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-lg">$35<span className="text-sm font-normal text-muted-foreground">/hr</span></p>
                  <Button size="sm" className="rounded-full">Book Now</Button>
                </div>
              </div>

              {/* Session card */}
              <div className="absolute bottom-12 -left-4 bg-white rounded-2xl shadow-xl border p-4 w-56 animate-float-delay">
                <p className="text-xs text-muted-foreground mb-2">Upcoming Session</p>
                <p className="font-semibold text-sm mb-1">Python Basics</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  Today at 3:00 PM
                </div>
                <div className="mt-3 h-1.5 bg-primary/10 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-primary rounded-full" />
                </div>
              </div>

              {/* Floating badges */}
              <FloatingBadge text="Just booked a session" className="top-2 right-0 animate-float" />
              <FloatingBadge text="Review submitted ⭐" className="bottom-32 right-4 animate-float-delay" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. STATS MARQUEE ─────────────────────────────── */}
      <section className="bg-primary py-5 overflow-hidden">
        <div className="flex gap-12 items-center whitespace-nowrap text-primary-foreground/80 text-sm font-medium">
          {[
            "📚 Expert 1-on-1 Tutoring",
            "⚡ Book in Under 2 Minutes",
            "🌍 100% Online Sessions",
            "⭐ 4.9 Average Rating",
            "🔒 Cancel Anytime",
            "🎯 Any Subject, Any Level",
            "📚 Expert 1-on-1 Tutoring",
            "⚡ Book in Under 2 Minutes",
            "🌍 100% Online Sessions",
            "⭐ 4.9 Average Rating",
            "🔒 Cancel Anytime",
            "🎯 Any Subject, Any Level",
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-12">
              {item}
              {i < 11 && <span className="opacity-40">·</span>}
            </span>
          ))}
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ──────────────────────────────── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 rounded-full px-4">How It Works</Badge>
            <h2 className="font-display text-5xl font-black mb-4">
              Start Learning in
              <span className="italic font-light"> Minutes</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Our streamlined process gets you connected with the right tutor — fast.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { n: "01", title: "Browse Tutors", desc: "Search by subject, filter by price or experience. View full profiles, ratings and reviews." },
              { n: "02", title: "Pick a Time Slot", desc: "Select a date on the tutor's calendar and choose from their available time slots." },
              { n: "03", title: "Join Your Session", desc: "Receive a meeting link from your tutor and join your live 1-on-1 video session." },
              { n: "04", title: "Review & Repeat", desc: "Leave a review after your session and book again to keep your learning momentum." },
            ].map((s) => <StepCard key={s.n} number={s.n} title={s.title} desc={s.desc} />)}
          </div>
        </div>
      </section>

      {/* ── 4. CATEGORIES ────────────────────────────────── */}
      <section className="py-28 bg-muted/40">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4">
            <div>
              <Badge variant="secondary" className="mb-4 rounded-full px-4">Subjects</Badge>
              <h2 className="font-display text-5xl font-black">
                Explore by
                <span className="italic font-light"> Category</span>
              </h2>
            </div>
            <Link href="/tutors">
              <Button variant="outline" className="rounded-full gap-2">
                All Subjects <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {categoryList.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {categoryList.map((cat: any, i: number) => {
                const colors = [
                  "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100",
                  "bg-violet-50 text-violet-700 border-violet-100 hover:bg-violet-100",
                  "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100",
                  "bg-green-50 text-green-700 border-green-100 hover:bg-green-100",
                  "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100",
                  "bg-cyan-50 text-cyan-700 border-cyan-100 hover:bg-cyan-100",
                  "bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100",
                  "bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100",
                ]
                const sizes = ["text-lg px-6 py-3", "text-base px-5 py-2.5", "text-sm px-4 py-2"]
                const color = colors[i % colors.length]
                const size = sizes[i % sizes.length]
                return (
                  <Link href={`/tutors?category=${cat.id}`} key={cat.id}>
                    <div className={`inline-flex items-center gap-2 rounded-full border font-medium transition-colors cursor-pointer ${color} ${size}`}>
                      <BookOpen className="w-4 h-4" />
                      {cat.categoryName}
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {["Mathematics", "Physics", "Chemistry", "Biology", "English", "Programming", "History", "Economics"].map((s) => (
                <Link href="/tutors" key={s}>
                  <div className="inline-flex items-center gap-2 rounded-full border font-medium px-5 py-2.5 text-base bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 transition-colors cursor-pointer">
                    <BookOpen className="w-4 h-4" />
                    {s}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 5. FEATURED TUTORS ───────────────────────────── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4">
            <div>
              <Badge variant="secondary" className="mb-4 rounded-full px-4">Top Rated</Badge>
              <h2 className="font-display text-5xl font-black">
                Meet Our
                <span className="italic font-light"> Expert Tutors</span>
              </h2>
            </div>
            <Link href="/tutors">
              <Button variant="outline" className="rounded-full gap-2">
                Browse All <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorList.slice(0, 6).map((tutor: any) => {
              const rating = Number(tutor.averageRate ?? 0)
              const hasRating = rating > 0
              return (
                <Link href={`/tutors/${tutor.id}`} key={tutor.id}>
                  <div className="group rounded-2xl border bg-card overflow-hidden card-hover cursor-pointer">
                    {/* Top accent */}
                    <div className="h-1.5 bg-linear-to-r from-primary via-accent to-primary bg-size-[200%_auto] group-hover:bg-right transition-all duration-700" />

                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative shrink-0">
                          {tutor.Student?.image ? (
                            <img
                              src={tutor.Student.image}
                              alt={tutor.Student?.name}
                              className="w-14 h-14 rounded-2xl object-cover"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-bold text-xl font-display">
                              {tutor.Student?.name?.charAt(0) ?? "T"}
                            </div>
                          )}
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate">{tutor.Student?.name ?? "Tutor"}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{tutor.bio ?? "Expert tutor"}</p>
                          {hasRating && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium">{rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-lg font-bold text-primary shrink-0">
                          ${tutor.hourlyRate}<span className="text-xs font-normal text-muted-foreground">/hr</span>
                        </p>
                      </div>

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
                          {tutor.experience} yrs experience
                        </span>
                        <span className="text-primary font-medium group-hover:underline flex items-center gap-1">
                          View Profile <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}

            {tutorList.length === 0 && [...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border bg-card p-6 opacity-50">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <div className="h-5 bg-muted rounded-full w-16" />
                  <div className="h-5 bg-muted rounded-full w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. WHY SKILLBRIDGE ───────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-accent/5" />
        <div className="container mx-auto max-w-6xl px-4 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="secondary" className="mb-4 rounded-full px-4">Why SkillBridge</Badge>
              <h2 className="font-display text-5xl font-black mb-6 leading-tight">
                Everything You Need
                <span className="italic font-light block">to Learn Better</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
                We've built every feature around the real needs of students and tutors — from instant booking to seamless video sessions and honest reviews.
              </p>
              <Link href="/register">
                <Button className="rounded-full px-8 gap-2">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-1">
              {[
                { icon: Zap, title: "Instant Booking", desc: "No back-and-forth emails. See availability in real-time and confirm in one click.", accent: "bg-yellow-100 text-yellow-600" },
                { icon: Globe, title: "100% Online", desc: "All sessions via video call. Learn from home, the library, or anywhere in the world.", accent: "bg-blue-100 text-blue-600" },
                { icon: Shield, title: "Safe & Transparent", desc: "Verified tutors, public reviews, and full booking history in your dashboard.", accent: "bg-green-100 text-green-600" },
                { icon: Star, title: "Quality Guaranteed", desc: "Every tutor is rated by real students. Only the best rise to the top of search.", accent: "bg-violet-100 text-violet-600" },
                { icon: Clock, title: "Flexible Schedule", desc: "Tutors set their own availability. Find someone who fits your timetable perfectly.", accent: "bg-orange-100 text-orange-600" },
                { icon: CheckCircle, title: "No Lock-in", desc: "Cancel before a meeting link is shared. Pay per session, no subscriptions.", accent: "bg-rose-100 text-rose-600" },
              ].map((f) => <FeatureCard key={f.title} {...f} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. TESTIMONIALS ──────────────────────────────── */}
      <section className="py-28 bg-muted/40">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 rounded-full px-4">Student Stories</Badge>
            <h2 className="font-display text-5xl font-black">
              Real Results,
              <span className="italic font-light"> Real Students</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border p-6 card-hover">
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-bold text-sm font-display">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role} · {t.subject}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ───────────────────────────────────────── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 rounded-full px-4">FAQ</Badge>
            <h2 className="font-display text-5xl font-black">
              Common
              <span className="italic font-light"> Questions</span>
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-xl border bg-card overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <span className="font-display font-bold text-primary text-sm mt-0.5 shrink-0">Q{i + 1}</span>
                    <div>
                      <p className="font-semibold text-sm mb-2">{faq.q}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. CTA ───────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary/90 to-primary/80" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,white/5_1px,transparent_1px),linear-gradient(to_bottom,white/5_1px,transparent_1px)] bg-size-[48px_48px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

        <div className="container mx-auto max-w-4xl px-4 relative text-center">
          <p className="text-primary-foreground/70 font-medium mb-4 uppercase tracking-widest text-sm">
            Ready to start?
          </p>
          <h2 className="font-display text-6xl font-black text-white mb-6 leading-tight">
            Your Next Breakthrough
            <span className="italic font-light block opacity-80">is One Session Away</span>
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Join thousands of students already learning smarter with SkillBridge. Find your tutor today — no commitment required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tutors">
              <Button size="lg" variant="secondary" className="rounded-full px-10 h-14 text-base gap-2 shadow-xl">
                Browse Tutors
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-base   hover:bg-white/10 gap-2">
                Sign Up Free
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mt-12 text-primary-foreground/60 text-sm">
            {["No subscription fees", "Cancel anytime", "Free to register"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}