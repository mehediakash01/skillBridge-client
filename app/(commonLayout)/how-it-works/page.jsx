import Link from "next/link"
import { ArrowRight, CheckCircle, Star, Clock, Shield, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const STEPS_STUDENT = [
  {
    number: "01",
    icon: "🔍",
    title: "Browse & Filter Tutors",
    desc: "Search by subject, filter by price, experience level, or rating. Every tutor shows their full profile, subjects, bio, and real student reviews.",
    detail: ["Filter by price range", "Sort by experience or rating", "See full tutor profiles", "Read verified student reviews"],
  },
  {
    number: "02",
    icon: "📅",
    title: "Pick a Date & Time Slot",
    desc: "Click a date on the tutor's calendar to see their live availability. Choose from open time slots that fit your schedule and confirm instantly.",
    detail: ["Real-time availability", "No back-and-forth emails", "Instant confirmation", "1-hour sessions per slot"],
  },
  {
    number: "03",
    icon: "🔗",
    title: "Receive Your Meeting Link",
    desc: "Before your session, your tutor adds a Google Meet or Zoom link directly to your booking. You'll see a 'Join Session' button appear in your dashboard.",
    detail: ["Google Meet or Zoom", "Link appears in dashboard", "Join directly from browser", "Cancel free if link not sent"],
  },
  {
    number: "04",
    icon: "⭐",
    title: "Learn, Then Leave a Review",
    desc: "Attend your live 1-on-1 session and learn. Afterwards, your dashboard unlocks a review button so you can rate and comment on your experience.",
    detail: ["Private 1-on-1 video call", "Leave a star rating", "Write a comment", "Reviews help other students"],
  },
]

const STEPS_TUTOR = [
  {
    number: "01",
    icon: "📝",
    title: "Create Your Profile",
    desc: "Sign up as a tutor, add your bio, teaching experience, hourly rate, and the subjects you teach. Your profile is your storefront.",
    detail: ["Set your own hourly rate", "List all subjects you teach", "Write your teaching bio", "Upload a profile photo"],
  },
  {
    number: "02",
    icon: "🗓️",
    title: "Set Your Availability",
    desc: "Use the weekly availability builder to mark which days and times you're free to teach. Students can only book slots you've opened.",
    detail: ["Weekly schedule builder", "Add multiple slots per day", "Update anytime", "Block off days you're busy"],
  },
  {
    number: "03",
    icon: "🔔",
    title: "Receive Bookings",
    desc: "When a student books you, it appears in your dashboard under Sessions. You'll see the student's name, date, time, and any note they left.",
    detail: ["Booking appears instantly", "See student's note", "View full session details", "Manage from dashboard"],
  },
  {
    number: "04",
    icon: "🎥",
    title: "Add a Meeting Link & Teach",
    desc: "Before the session, add your Google Meet or Zoom link to the booking. Students join via the link, you teach, and then mark the session complete.",
    detail: ["Add Google Meet or Zoom link", "Student joins from dashboard", "Mark session as complete", "Earn your hourly rate"],
  },
]

const FAQS = [
  { q: "Do I need to subscribe to book sessions?", a: "No. SkillBridge is completely free to join. You only pay for sessions you book, at the tutor's stated hourly rate." },
  { q: "Can I cancel a booking?", a: "Yes. You can cancel a confirmed booking for free as long as the tutor hasn't added a meeting link yet." },
  { q: "What video platform do sessions use?", a: "Tutors provide their own meeting link — usually Google Meet or Zoom. You join directly from the 'Join Session' button in your dashboard." },
  { q: "How do I know a tutor is good?", a: "Every tutor builds a public rating from real student reviews. You can see their average score and read individual comments before booking." },
  { q: "Can I be both a student and a tutor?", a: "Not with the same account — you register as one or the other. Create a separate account if you'd like to do both." },
]

export default function HowItWorksPage() {
  return (
    <div className="overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,900;1,9..144,300&family=DM+Sans:wght@400;500;600&display=swap');.font-display{font-family:'Fraunces',serif}`}</style>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 bg-background overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.9_0_0)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.9_0_0)_1px,transparent_1px)] bg-size-[48px_48px] opacity-30" />
        </div>
        <div className="container mx-auto max-w-4xl px-4 text-center relative">
          <Badge variant="secondary" className="mb-6 rounded-full px-4">How It Works</Badge>
          <h1 className="font-display text-6xl font-black leading-[1.05] mb-6">
            Simple, Fast,
            <span className="block italic font-light text-muted-foreground mt-1">Effective Learning</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed mb-10">
            From browsing tutors to attending your first session, the whole process takes less than 5 minutes to set up.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tutors">
              <Button size="lg" className="rounded-full px-8 gap-2 shadow-lg shadow-primary/20">
                Find a Tutor <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="rounded-full px-8">
                Become a Tutor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── For Students ──────────────────────────────── */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-4 py-1.5 mb-4">
              🎓 For Students
            </div>
            <h2 className="font-display text-5xl font-black">
              Book a Session in
              <span className="italic font-light"> 4 Steps</span>
            </h2>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-linear-to-r from-transparent via-border to-transparent" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS_STUDENT.map((step, i) => (
                <div key={step.number} className="relative group">
                  <div className="bg-background rounded-2xl border p-6 h-full hover:shadow-lg transition-shadow">
                    {/* Number + emoji */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-black text-primary font-serif">{step.number}</span>
                      </div>
                      <span className="text-3xl">{step.icon}</span>
                    </div>
                    <h3 className="font-bold text-base mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{step.desc}</p>
                    <ul className="space-y-1.5">
                      {step.detail.map((d) => (
                        <li key={d} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {i < 3 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full items-center justify-center z-10">
                      <ArrowRight className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── For Tutors ────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-sm font-medium bg-violet-50 text-violet-700 border border-violet-100 rounded-full px-4 py-1.5 mb-4">
              👨‍🏫 For Tutors
            </div>
            <h2 className="font-display text-5xl font-black">
              Start Earning in
              <span className="italic font-light"> 4 Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {STEPS_TUTOR.map((step, i) => (
              <div key={step.number} className="group flex gap-5 p-6 rounded-2xl border bg-card hover:shadow-md transition-shadow">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                    <span className="text-xl font-black text-primary-foreground font-serif">{i + 1}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{step.icon}</span>
                    <h3 className="font-bold">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">{step.desc}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {step.detail.map((d) => (
                      <div key={d} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust + Stats ─────────────────────────────── */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Clock, label: "Avg booking time", value: "< 2 min", color: "bg-blue-50 text-blue-600" },
              { icon: Shield, label: "Cancel policy", value: "Free anytime", color: "bg-green-50 text-green-600" },
              { icon: Video, label: "Session format", value: "Live video", color: "bg-violet-50 text-violet-600" },
              { icon: Star, label: "Avg tutor rating", value: "4.9 / 5.0", color: "bg-yellow-50 text-yellow-600" },
            ].map((s) => (
              <div key={s.label} className="bg-background rounded-2xl border p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 rounded-full px-4">FAQ</Badge>
            <h2 className="font-display text-5xl font-black">
              Still have
              <span className="italic font-light"> questions?</span>
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-xl border bg-card p-5">
                <div className="flex gap-3">
                  <span className="font-display font-black text-primary text-sm shrink-0 mt-0.5">Q{i + 1}</span>
                  <div>
                    <p className="font-semibold text-sm mb-2">{faq.q}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,white/5_1px,transparent_1px),linear-gradient(to_bottom,white/5_1px,transparent_1px)] bg-size-[40px_40px]" />
        <div className="container mx-auto max-w-3xl px-4 text-center relative">
          <h2 className="font-display text-5xl font-black text-white mb-4">
            Ready to start?
          </h2>
          <p className="text-primary-foreground/70 mb-8 leading-relaxed">
            Join thousands of students and tutors already on SkillBridge. Sign up free, no subscription required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tutors">
              <Button size="lg" variant="secondary" className="rounded-full px-8 gap-2">
                Browse Tutors <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="rounded-full px-8 border-white/30 text-white hover:bg-white/10">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}