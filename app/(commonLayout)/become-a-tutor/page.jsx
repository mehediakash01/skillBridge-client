"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle, DollarSign, Calendar, Users, Award, Globe, TrendingUp, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const BENEFITS = [
  { icon: DollarSign, title: "Set Your Own Rate", desc: "You decide what you charge. Whether it's $15/hr or $150/hr — it's entirely up to you.", color: "bg-green-50 text-green-600" },
  { icon: Calendar, title: "Work When You Want", desc: "Open and close availability slots on your own schedule. No minimum hours required.", color: "bg-blue-50 text-blue-600" },
  { icon: Globe, title: "Teach From Anywhere", desc: "All sessions happen via video call. Teach from home, a café, or anywhere with internet.", color: "bg-violet-50 text-violet-600" },
  { icon: Users, title: "Build Your Student Base", desc: "As you collect 5-star reviews your profile rises in search. Students keep coming back.", color: "bg-orange-50 text-orange-600" },
  { icon: Award, title: "No Platform Fees", desc: "Keep 100% of what students pay you. We don't take a cut — no hidden charges.", color: "bg-rose-50 text-rose-600" },
  { icon: TrendingUp, title: "Grow Your Reputation", desc: "Your public rating and review count build credibility that attracts more students.", color: "bg-cyan-50 text-cyan-600" },
]

const STEPS = [
  { n: "01", title: "Create Your Profile", desc: "Register as a tutor, fill in your bio, set your rate, choose your subjects." },
  { n: "02", title: "Set Your Schedule", desc: "Open availability slots in the weekly planner for days and times you're free." },
  { n: "03", title: "Get Booked", desc: "Students find you, pick a slot, and confirm. It shows up in your dashboard." },
  { n: "04", title: "Add Link & Teach", desc: "Add your Google Meet/Zoom link before the session. Teach, then mark complete." },
]

const REQUIREMENTS = [
  "Strong knowledge in at least one subject area",
  "Reliable internet connection for video calls",
  "A device with a working camera and microphone",
  "Commitment to showing up on time for booked sessions",
  "Willingness to communicate professionally with students",
]

const EARNINGS_EXAMPLES = [
  { rate: "$20", hours: "5 hrs/week", weekly: "$100", monthly: "$400" },
  { rate: "$40", hours: "10 hrs/week", weekly: "$400", monthly: "$1,600" },
  { rate: "$60", hours: "15 hrs/week", weekly: "$900", monthly: "$3,600" },
]

export default function BecomeATutorPage() {
  return (
    <div className="overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,900;1,9..144,300&family=DM+Sans:wght@400;500;600&display=swap');.font-display{font-family:'Fraunces',serif}`}</style>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-150 h-150 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,white/5_1px,transparent_1px),linear-gradient(to_bottom,white/5_1px,transparent_1px)] bg-size-[48px_48px] opacity-40" />
        </div>

        <div className="container mx-auto max-w-6xl px-4 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-white text-sm font-medium mb-6">
                💼 Tutor Program
              </div>
              <h1 className="font-display text-6xl font-black text-white leading-[1.05] mb-6">
                Share What
                <span className="block italic font-light opacity-80">You Know.</span>
                <span className="block">Earn Doing It.</span>
              </h1>
              <p className="text-primary-foreground/70 text-lg leading-relaxed mb-8 max-w-md">
                Turn your expertise into income. Set your own schedule, your own rate, and teach students who genuinely want to learn from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8 gap-2 shadow-xl">
                    Start Teaching Today <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="rounded-full px-8 border-white/30  hover:bg-white/10">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats card */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { value: "500+", label: "Active Tutors", icon: "👨‍🏫" },
                { value: "$0", label: "Platform Fees", icon: "💰" },
                { value: "4.9★", label: "Avg Rating", icon: "⭐" },
                { value: "100%", label: "Schedule Control", icon: "🗓️" },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-6 text-center">
                  <span className="text-4xl mb-3 block">{s.icon}</span>
                  <p className="text-3xl font-black text-white font-display">{s.value}</p>
                  <p className="text-white/60 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits ──────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 rounded-full px-4">Why Teach Here</Badge>
            <h2 className="font-display text-5xl font-black">
              Everything in Your
              <span className="italic font-light"> Control</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b) => {
              const Icon = b.icon
              return (
                <div key={b.title} className="group p-6 rounded-2xl border bg-card hover:shadow-md transition-all hover:-translate-y-1">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${b.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base mb-2">{b.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Earnings estimator ────────────────────────── */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 rounded-full px-4">Earning Potential</Badge>
            <h2 className="font-display text-5xl font-black">
              See What You Could
              <span className="italic font-light"> Earn</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm">
              These are estimates based on consistent weekly sessions. Your actual earnings depend on your rate and availability.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {EARNINGS_EXAMPLES.map((e, i) => (
              <div key={e.rate} className={`rounded-2xl border p-7 text-center space-y-4 ${i === 1 ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02]" : "bg-background"}`}>
                <div>
                  <p className={`text-sm font-medium mb-1 ${i === 1 ? "text-primary-foreground/70" : "text-muted-foreground"}`}>Hourly Rate</p>
                  <p className={`text-5xl font-black font-display ${i === 1 ? "text-white" : "text-foreground"}`}>{e.rate}</p>
                </div>
                <Separator className={i === 1 ? "bg-white/20" : ""} />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={i === 1 ? "text-primary-foreground/70" : "text-muted-foreground"}>Hours / week</span>
                    <span className="font-semibold">{e.hours}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={i === 1 ? "text-primary-foreground/70" : "text-muted-foreground"}>Weekly</span>
                    <span className="font-semibold">{e.weekly}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className={i === 1 ? "text-primary-foreground/70" : "text-muted-foreground"}>Monthly est.</span>
                    <span className="text-base">{e.monthly}</span>
                  </div>
                </div>
                {i === 1 && (
                  <div className="text-xs text-primary-foreground/60 pt-1">Most popular tier</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to start ──────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 rounded-full px-4">Getting Started</Badge>
            <h2 className="font-display text-5xl font-black">
              Up and Running
              <span className="italic font-light"> Today</span>
            </h2>
          </div>

          <div className="space-y-4">
            {STEPS.map((step, i) => (
              <div key={step.n} className="flex items-start gap-5 p-6 rounded-2xl border bg-card hover:shadow-sm transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
                  <span className="text-primary-foreground font-black font-display">{i + 1}</span>
                </div>
                <div>
                  <h3 className="font-bold mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:flex ml-auto items-center self-center text-muted-foreground/30">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Requirements ──────────────────────────────── */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4 rounded-full px-4">Who Can Apply</Badge>
              <h2 className="font-display text-4xl font-black mb-4">
                What We
                <span className="italic font-light"> Look For</span>
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We don't require formal teaching credentials. If you know your subject deeply and can communicate it clearly, you're the kind of tutor students want.
              </p>
            </div>
            <div className="space-y-3">
              {REQUIREMENTS.map((r) => (
                <div key={r} className="flex items-start gap-3 bg-background rounded-xl border p-4">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <p className="text-sm">{r}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,white/5_1px,transparent_1px),linear-gradient(to_bottom,white/5_1px,transparent_1px)] bg-size-[40px_40px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />
        <div className="container mx-auto max-w-3xl px-4 text-center relative">
          <p className="text-primary-foreground/60 uppercase tracking-widest text-xs font-medium mb-4">
            Start today — it's free
          </p>
          <h2 className="font-display text-5xl font-black text-white mb-6">
            Ready to Start
            <span className="italic font-light block opacity-80">Teaching?</span>
          </h2>
          <p className="text-primary-foreground/70 mb-10 max-w-md mx-auto leading-relaxed">
            Create your free tutor profile in minutes. Set your rate, list your subjects, open your schedule, and start receiving bookings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-10 h-14 text-base gap-2 shadow-xl">
                Create Tutor Profile
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/tutors">
              <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-base border-white/30  hover:bg-white/10 gap-2">
                <BookOpen className="w-4 h-4" />
                Browse Existing Tutors
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-10 text-primary-foreground/50 text-sm">
            {["Free to sign up", "No platform fees", "100% schedule control"].map((t) => (
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