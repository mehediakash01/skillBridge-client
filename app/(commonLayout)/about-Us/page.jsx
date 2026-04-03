import Link from "next/link"
import { ArrowRight, Target, Heart, Zap, Globe, BookOpen, TrendingUp, CheckCircle, GraduationCap, Lightbulb, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const STATS = [
  { value: "500+", label: "Expert Tutors", sub: "Across all major subjects" },
  { value: "10,000+", label: "Sessions Completed", sub: "And counting every day" },
  { value: "4.9/5", label: "Average Rating", sub: "From verified student reviews" },
  { value: "50+", label: "Subjects Covered", sub: "Academic & professional skills" },
]

const VALUES = [
  {
    icon: Target,
    title: "Purposeful Learning",
    desc: "We believe every session should have a clear goal. Our platform is built around intentional, focused 1-on-1 teaching — not passive content consumption.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Heart,
    title: "Student-First Design",
    desc: "Every feature we build starts with a simple question: does this make learning easier? From booking to reviewing, we obsess over the student experience.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    desc: "No hidden fees, no fake reviews. Tutors set real rates. Students leave real feedback. Everything on LearnForge is honest, open, and accountable.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Zap,
    title: "Radical Simplicity",
    desc: "Learning is hard enough without a complicated platform. We've removed every unnecessary step between a student's need and a tutor's expertise.",
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    icon: Globe,
    title: "Global Access",
    desc: "Geography shouldn't determine the quality of your education. Our 100% online model means world-class tutoring is available to anyone, anywhere.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: TrendingUp,
    title: "Tutor Empowerment",
    desc: "We believe educators deserve to be treated as professionals. Tutors set their own rates, own their schedules, and keep 100% of what they earn.",
    color: "bg-orange-50 text-orange-600",
  },
]

const MILESTONES = [
  { year: "2022", title: "LearnForge Founded", desc: "Started with a simple idea: connect students directly with real experts, with no middlemen and no fluff." },
  { year: "2023", title: "First 100 Tutors", desc: "Reached our first hundred verified tutors across mathematics, sciences, and programming subjects." },
  { year: "2023", title: "1,000 Sessions Milestone", desc: "Celebrated the platform's first thousand completed student sessions with an average rating of 4.8 stars." },
  { year: "2024", title: "Global Expansion", desc: "Students and tutors from over 30 countries started using LearnForge for live online learning sessions." },
  { year: "2025", title: "10,000+ Sessions", desc: "Crossed ten thousand completed sessions and launched the admin platform, tutor profiles, and review system." },
  { year: "2026", title: "Platform 2.0", desc: "Full redesign, meeting link integration, real-time availability, and a dramatically improved booking experience." },
]

const TEAM = [
  { name: "Alex Morgan", role: "Co-Founder & CEO", bio: "Former educator and EdTech founder. Passionate about removing barriers to quality education worldwide.", initials: "AM", color: "from-blue-400 to-blue-600" },
  { name: "Sofia Chen", role: "Co-Founder & CTO", bio: "Full-stack engineer with 10+ years experience. Built LearnForge's platform from the ground up.", initials: "SC", color: "from-violet-400 to-violet-600" },
  { name: "James Okafor", role: "Head of Tutors", bio: "Ex-teacher turned product lead. Ensures every tutor on our platform delivers an exceptional experience.", initials: "JO", color: "from-green-400 to-green-600" },
  { name: "Priya Nair", role: "Head of Design", bio: "UX designer focused on making complex workflows feel effortless. If it's beautiful here, it's Priya.", initials: "PN", color: "from-rose-400 to-rose-600" },
]

const WHAT_MAKES_DIFFERENT = [
  { title: "No subscription", desc: "Pay per session only. No monthly fees, no lock-in, no pressure to keep paying." },
  { title: "Zero platform fees", desc: "Tutors keep 100% of what students pay. We earn nothing from transactions — ever." },
  { title: "Real reviews only", desc: "Reviews are tied to verified sessions. No fake testimonials, no incentivized ratings." },
  { title: "Cancel with confidence", desc: "Students can cancel for free before a meeting link is added. No awkward policies." },
  { title: "Live 1-on-1 only", desc: "We don't sell pre-recorded courses. Every session is live, personal, and real-time." },
  { title: "Tutor-set pricing", desc: "Tutors decide what they're worth. Students see exactly what they'll pay before booking." },
]

export default function AboutPage() {
  return (
    <div className="overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300&family=DM+Sans:wght@400;500;600&display=swap');.font-display{font-family:'Fraunces',serif}`}</style>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 bg-background overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-125 h-125 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.9_0_0)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.9_0_0)_1px,transparent_1px)] bg-size-[48px_48px] opacity-30" />
        </div>

        <div className="container mx-auto max-w-4xl px-4 text-center relative">
          <Badge variant="secondary" className="mb-6 rounded-full px-4">About LearnForge</Badge>
          <h1
            className="text-6xl lg:text-7xl font-black leading-[1.02] mb-6 tracking-tight"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            We Exist to Make
            <span className="block italic font-light text-muted-foreground mt-1">
              Great Teaching Accessible
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            LearnForge is an online tutoring platform built on a simple belief — every student deserves direct access to a real expert, not a pre-recorded video or a crowded classroom. We make that possible.
          </p>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────── */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-black text-white mb-1" style={{ fontFamily: "'Fraunces', serif" }}>
                  {s.value}
                </p>
                <p className="text-white font-semibold text-sm">{s.label}</p>
                <p className="text-primary-foreground/50 text-xs mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="secondary" className="mb-5 rounded-full px-4">Our Mission</Badge>
              <h2 className="font-display text-5xl font-black leading-tight mb-6">
                Democratize Access to
                <span className="italic font-light block mt-1">Expert Knowledge</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                For too long, quality tutoring has been reserved for students who could afford premium agencies or happened to live near the right people. Geography, budget, and circumstance shouldn't determine who gets a great education.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-5">
                LearnForge removes those barriers. By connecting students directly with independent tutors — fully online, with transparent pricing set by the tutors themselves — we create a marketplace where great teaching reaches anyone who needs it.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We're not just a booking tool. We're building an ecosystem where educators are respected, students are empowered, and learning is genuinely personal.
              </p>
            </div>

            {/* Visual */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Lightbulb, title: "Our Vision", desc: "A world where anyone can learn anything from the best possible teacher — regardless of where they live.", color: "bg-yellow-50 border-yellow-100" },
                { icon: Target, title: "Our Mission", desc: "Make expert 1-on-1 tutoring affordable, accessible, and effortlessly bookable for every student.", color: "bg-blue-50 border-blue-100" },
                { icon: Heart, title: "Our Promise", desc: "To students: real tutors, honest reviews, fair prices. To tutors: full independence, zero platform fees.", color: "bg-rose-50 border-rose-100" },
                { icon: Globe, title: "Our Reach", desc: "Built to work globally — students and tutors from any country, timezone, or background are welcome.", color: "bg-green-50 border-green-100" },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className={`rounded-2xl border p-5 ${item.color}`}>
                    <Icon className="w-6 h-6 mb-3 text-foreground/70" />
                    <p className="font-bold text-sm mb-2">{item.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────── */}
      <section className="py-28 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-5 rounded-full px-4">Our Values</Badge>
            <h2 className="font-display text-5xl font-black">
              What We Stand
              <span className="italic font-light"> For</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm">
              These aren't just words on a wall. They're the filters we run every product decision through.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map((v) => {
              const Icon = v.icon
              return (
                <div key={v.title} className="bg-background rounded-2xl border p-7 hover:shadow-md transition-all hover:-translate-y-1">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${v.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base mb-2">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── What Makes Us Different ───────────────────── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-5 rounded-full px-4">Why LearnForge</Badge>
            <h2 className="font-display text-5xl font-black">
              Built Different,
              <span className="italic font-light"> On Purpose</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHAT_MAKES_DIFFERENT.map((item) => (
              <div key={item.title} className="flex gap-4 p-5 rounded-xl border hover:bg-muted/40 transition-colors">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────── */}
      <section className="py-28 bg-muted/30">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-5 rounded-full px-4">Our Journey</Badge>
            <h2 className="font-display text-5xl font-black">
              How We Got
              <span className="italic font-light"> Here</span>
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-4.75 top-3 bottom-3 w-0.5 bg-border" />
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/20 relative z-10">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
                    </div>
                  </div>
                  <div className="bg-background rounded-2xl border p-5 flex-1 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-primary bg-primary/10 rounded-full px-2.5 py-0.5">
                        {m.year}
                      </span>
                      <h3 className="font-bold text-sm">{m.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-5 rounded-full px-4">The Team</Badge>
            <h2 className="font-display text-5xl font-black">
              The People
              <span className="italic font-light"> Behind It</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm">
              A small, focused team of educators, engineers, and designers — all obsessed with making learning better.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map((member) => (
              <div key={member.name} className="group rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                <div className={`h-2 bg-linear-to-r ${member.color}`} />
                <div className="p-6">
                  <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${member.color} flex items-center justify-center text-white font-black text-xl mb-4`}>
                    {member.initials}
                  </div>
                  <p className="font-bold">{member.name}</p>
                  <p className="text-xs text-primary font-medium mt-0.5 mb-3">{member.role}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For educators & students ──────────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="rounded-2xl border bg-background p-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-black mb-3">For Students</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Whether you're struggling with calculus, prepping for exams, or learning to code — you'll find a tutor on LearnForge who's perfect for you. Real profiles, real reviews, real results.
              </p>
              <Link href="/tutors">
                <Button className="rounded-full gap-2">
                  Find a Tutor <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl border bg-primary p-8">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-5">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-2xl font-black text-white mb-3">For Educators</h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
                If you have expertise worth sharing, LearnForge gives you the tools to turn it into income — on your own terms. No agency cuts, no rigid contracts. Just you, your students, and your schedule.
              </p>
              <Link href="/become-a-tutor">
                <Button variant="secondary" className="rounded-full gap-2">
                  Become a Tutor <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden bg-muted/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,white/5_1px,transparent_1px),linear-gradient(to_bottom,white/5_1px,transparent_1px)] bg-size-[40px_40px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="container mx-auto max-w-3xl px-4 text-center relative">
          <h2 className="font-display text-5xl font-black  mb-5">
            Join the LearnForge
            <span className="italic font-light opacity-70 block mt-1">Community</span>
          </h2>
          <p className=" mb-10 max-w-md mx-auto leading-relaxed">
            Thousands of students and tutors are already on the platform. Come learn with us — or teach with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tutors">
              <Button size="lg" className="rounded-full px-10 h-13 gap-2 shadow-xl">
                Start Learning <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/become-a-tutor">
              <Button size="lg" variant="outline" className="rounded-full px-10 h-13 border-white/20  hover:bg-white/10">
                Start Teaching
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}