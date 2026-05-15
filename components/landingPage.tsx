import Link from "next/link"
import { getTutors } from "@/src/services/tutor.service"
import { CategoryExplorer } from "@/components/CategoryExplorer"
import { TutorProfileCard } from "@/components/TutorProfileCard"
import { ArrowRight, Star, BookOpen, Award, CheckCircle, Clock, Globe, Zap, Shield, ChevronRight, Play, Video, Calendar, Target, GraduationCap, HeartHandshake, ShieldCheck, Search, Sparkles, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import * as motion from "framer-motion/client"

async function getCategories() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://skill-bridge-server-tau.vercel.app"
    const res = await fetch(`${backendUrl}/api/categories`, { cache: "no-store" })
    if (!res.ok) return []
    const data = await res.json()
    return data.data ?? []
  } catch {
    return []
  }
}


// ΓöÇΓöÇ Shared Animation Variants ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const fadeUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};
const stagger: any = {
  visible: { transition: { staggerChildren: 0.1 } }
};

// ΓöÇΓöÇ Floating badge component ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
function FloatingBadge({ text, className, delay = 0 }: { text: string; className: string; delay?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={`absolute px-4 py-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/40 dark:border-zinc-800 text-sm font-semibold flex items-center gap-2 ${className}`}
    >
      <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse" />
      {text}
    </motion.div>
  )
}

// ΓöÇΓöÇ Step card ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
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

// ΓöÇΓöÇ Feature card ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
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

// ΓöÇΓöÇ Testimonial ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const TESTIMONIALS = [
  { name: "Aisha Rahman", role: "University Student", text: "I went from failing calculus to acing my finals in 6 weeks. The 1-on-1 sessions made all the difference.", rating: 5, subject: "Mathematics", avatar: "AR" },
  { name: "Marcus Chen", role: "Working Professional", text: "Found an incredible Python tutor who fit my schedule perfectly. Worth every penny for the career boost.", rating: 5, subject: "Programming", avatar: "MC" },
  { name: "Priya Sharma", role: "High School Student", text: "My English writing improved dramatically. My tutor gave feedback that my school teachers never had time for.", rating: 5, subject: "English", avatar: "PS" },
  { name: "David Okafor", role: "Parent", text: "Booked sessions for my daughter and watched her confidence soar. The platform is incredibly easy to use.", rating: 5, subject: "Science", avatar: "DO" },
]

// ΓöÇΓöÇ FAQ ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const FAQS = [
  { q: "How does booking work?", a: "Browse tutors, select a date, choose an available time slot, and confirm. Your tutor will share a meeting link before the session." },
  { q: "Can I cancel a booking?", a: "Yes ΓÇö you can cancel anytime before the tutor adds a meeting link. Once a link is shared, the session is committed." },
  { q: "How do I leave a review?", a: "After joining your session, a Review button appears in your dashboard. You can rate and comment once per session." },
  { q: "How are tutors vetted?", a: "Tutors create profiles with their experience, subjects, and hourly rates. Student reviews build their public rating over time." },
  { q: "What subjects are available?", a: "We cover a wide range ΓÇö from academic subjects like Math, Science and English to professional skills like Programming and Business." },
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
          background: linear-gradient(110deg, #111 20%, #4338ca 40%, #4338ca 60%, #111 80%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        @media (prefers-color-scheme: dark) {
          .shimmer-text {
             background: linear-gradient(110deg, #fff 20%, #818cf8 40%, #818cf8 60%, #fff 80%);
          }
        }
        .mesh-bg {
          background-color: transparent;
          background-image: 
            radial-gradient(at 10% 20%, hsl(var(--primary) / 0.08) 0px, transparent 50%),
            radial-gradient(at 90% 10%, hsl(var(--accent) / 0.08) 0px, transparent 50%),
            radial-gradient(at 50% 80%, hsl(var(--primary) / 0.05) 0px, transparent 50%);
        }
        .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -12px rgb(0 0 0 / 0.12); }
      `}</style>

      {/* ΓöÇΓöÇ 1. HERO ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-blue-500/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="container mx-auto max-w-7xl px-4 md:px-8 relative z-10 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial="hidden" animate="visible" variants={stagger}
              className="space-y-10"
            >
              <motion.div variants={fadeUp}>
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary backdrop-blur-md">
                  <Zap className="w-4 h-4 fill-primary/20" />
                  The smarter way to master new skills
                </div>
              </motion.div>

              <motion.h1 variants={fadeUp} className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.05] tracking-tight text-foreground">
                Unlock Your
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-primary via-blue-500 to-primary bg-[length:200%_auto] animate-[shimmer_4s_linear_infinite] pb-2 shimmer-text">Full Potential.</span>
                <span className="block font-light italic text-muted-foreground mt-2">Learn Anything.</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl font-body">
                Connect with world-class experts for live 1-on-1 sessions. Achieve your goals on your schedule, entirely online.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/tutors" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto rounded-full px-10 h-14 text-base font-semibold gap-3 shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300">
                    Find your Expert
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/how-it-works" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-10 h-14 text-base font-semibold gap-3 border-border bg-background/50 backdrop-blur-sm hover:bg-muted transition-all duration-300">
                    <Play className="w-4 h-4 fill-current text-primary" />
                    See how it works
                  </Button>
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-6 border-t border-border/60">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=e2e8f0`} alt="Student" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-background bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center relative z-10">+2k</div>
                </div>
                <div>
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">From 1,000+ verified students</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Visual Composition */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
               className="relative hidden lg:block h-[40rem]"
               style={{ perspective: "1000px" }}
            >
              <div className="absolute inset-0 transition-transform duration-700 hover:rotate-y-[-5deg] hover:rotate-x-[5deg]">
                
                {/* Main Glass Card */}
                <div className="absolute top-12 left-10 right-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 dark:border-zinc-800/50 p-8 transform rotate-2 hover:rotate-0 transition-all duration-500 z-10 text-foreground">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=c0aede" className="w-16 h-16 rounded-[1.25rem] object-cover shadow-sm bg-primary/20" alt="Tutor" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-[3px] border-white dark:border-zinc-900 flex items-center justify-center">
                          <Sparkles className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-xl">Sarah Johnson</p>
                        <p className="text-sm text-primary font-semibold tracking-wide">Expert Machine Learning Instructor</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">4.9</span>
                          <span className="text-xs text-muted-foreground">(47 reviews)</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-100/80 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-0 rounded-full px-4 py-1 font-semibold whitespace-nowrap ml-2">Available</Badge>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-blue-100/80 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-0 rounded-full px-3 py-0.5 text-xs font-semibold">Verified</Badge>
                    <Badge className="bg-purple-100/80 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-0 rounded-full px-3 py-0.5 text-xs font-semibold">Top 1%</Badge>
                    <Badge className="bg-amber-100/80 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-0 rounded-full px-3 py-0.5 text-xs font-semibold">Fast Responder</Badge>
                  </div>
                  
                  <div className="bg-gradient-to-br from-primary/5 to-transparent p-4 rounded-2xl mb-5 border border-primary/10 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Pricing & Earnings</p>
                        <p className="font-bold text-2xl">$50<span className="text-sm font-normal text-muted-foreground">/hr</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Your Cost</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between gap-3">
                            <span className="text-muted-foreground">You pay:</span>
                            <span className="font-semibold">$50</span>
                          </div>
                          <div className="flex justify-between gap-3 text-red-600">
                            <span>Fee (12%):</span>
                            <span className="font-semibold">-$6</span>
                          </div>
                          <div className="border-t border-border pt-1 flex justify-between gap-3 text-green-600 font-semibold">
                            <span>Tutor gets:</span>
                            <span>$44</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Languages & Experience */}
                  <div className="flex gap-4 mb-4 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="w-4 h-4 text-primary" />
                      <span><span className="font-semibold text-foreground">3</span> languages</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Award className="w-4 h-4 text-primary" />
                      <span><span className="font-semibold text-foreground">8+</span> years exp.</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                     <p className="text-sm font-semibold text-muted-foreground">Top Expertise</p>
                    {["Deep Learning", "Python", "Data Science"].map((subject, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-background/50 hover:border-primary/30 transition-colors group cursor-default">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="font-semibold text-sm">{subject}</span>
                        </div>
                        <ChevronRight className="w-3 h-3 text-primary opacity-50" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Secondary Mini Card: Calendar */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute bottom-10 right-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] border border-white/50 dark:border-zinc-800/50 p-5 w-72 z-20 translate-y-12"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-bold text-sm">Next Availability</p>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 flex justify-between items-center text-sm font-medium shadow-inner">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-primary font-bold">Today, 3:00 PM</span>
                      </div>
                      <Badge variant="default" className="shadow-md">Book</Badge>
                    </div>
                    <div className="p-3 bg-muted rounded-xl flex justify-between items-center text-sm font-medium border border-border/50">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Tomorrow, 10:00 AM</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Background decorative blob behind cards */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[80px] -z-10 animate-pulse"></div>
              </div>

              {/* Floating Badges */}
              <FloatingBadge text="Session confirmed ≡ƒÄë" className="-top-4 right-10 z-30" delay={0.6} />
              <FloatingBadge text="Γ¡É 5-Star Review" className="bottom-24 -left-6 z-30" delay={0.8} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ΓöÇΓöÇ 2. STATS MARQUEE ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
      <section className="bg-primary/5 border-y border-primary/10 py-6 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
        <motion.div 
          className="flex gap-16 items-center whitespace-nowrap text-primary text-sm font-bold tracking-widest uppercase hover:text-primary"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
          style={{ width: "fit-content" }}
        >
          {[...Array(2)].fill([
            "≡ƒôÜ Expert 1-on-1 Tutoring",
            "ΓÜí Book in Under 2 Minutes",
            "≡ƒîì 100% Online Sessions",
            "Γ¡É 4.9 Average Rating",
            "≡ƒöÆ Cancel Anytime",
            "≡ƒÄ» Any Subject, Any Level"
          ]).flat().map((item, i) => (
            <span key={i} className="flex items-center gap-16">
              {item}
              <span className="opacity-30">┬╖</span>
            </span>
          ))}
        </motion.div>
      </section>

      {/* ΓöÇΓöÇ 2.5 TRUSTED BY & SOCIAL PROOF ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--muted)/0.5),transparent)] pointer-events-none" />
        <div className="container mx-auto max-w-6xl px-4 text-center relative z-10">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-10"
          >
            Trusted by students from top institutions worldwide
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
            className="flex flex-wrap justify-center items-center gap-12 md:gap-24 flex-col md:flex-row text-muted-foreground transition-colors duration-300"
          >
            <div className="text-2xl font-display font-bold flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-500"><GraduationCap className="w-8 h-8"/> Stanford</div>
            <div className="text-2xl font-display font-black flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-500 tracking-tight"><Target className="w-8 h-8"/> MIT</div>
            <div className="text-2xl font-display font-black tracking-tighter grayscale hover:grayscale-0 transition-all duration-500">HARVARD</div>
            <div className="text-2xl font-display font-bold italic grayscale hover:grayscale-0 transition-all duration-500">Cambridge</div>
            <div className="text-2xl font-display font-bold uppercase tracking-widest grayscale hover:grayscale-0 transition-all duration-500">Oxford</div>
          </motion.div>
        </div>
      </section>

      {/* ΓöÇΓöÇ 3. HOW IT WORKS (Upgraded) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
      <section className="py-32 bg-muted/30 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none" />
        
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border/50 text-sm font-semibold text-primary shadow-sm hover:shadow-md transition-shadow">
              <Zap className="w-4 h-4" />
              Simple Process
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-black tracking-tight text-foreground">
              Start Learning in
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 mt-2 pb-2"> Three Simple Steps</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
              Our streamlined process connects you with world-class experts instantly. Zero friction, just pure learning.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                n: "01", 
                title: "Find Your Expert", 
                desc: "Filter by subject, price, and availability. Read verified reviews from real students.", 
                icon: 'Search',
                gradient: "from-blue-500/20 to-cyan-500/20",
                iconColor: "text-blue-500",
                borderColor: "group-hover:border-blue-500/30"
              },
              { 
                n: "02", 
                title: "Book Instantly", 
                desc: "Choose a time that works for you from the tutor's live calendar and confirm your booking.", 
                icon: 'Calendar',
                gradient: "from-purple-500/20 to-pink-500/20",
                iconColor: "text-purple-500",
                borderColor: "group-hover:border-purple-500/30"
              },
              { 
                n: "03", 
                title: "Start Learning", 
                desc: "Join the live video session immediately. Get personalized coaching and achieve your goals.", 
                icon: 'Video',
                gradient: "from-green-500/20 to-emerald-500/20",
                iconColor: "text-green-500",
                borderColor: "group-hover:border-green-500/30"
              }
            ].map((s, idx) => (
              <motion.div 
                key={s.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className={"group relative bg-background rounded-3xl p-8 border border-border/60 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden " + s.borderColor}
              >
                {/* Background Glow on hover */}
                <div className={"absolute inset-0 bg-gradient-to-br " + s.gradient + " opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div className={"w-14 h-14 rounded-2xl bg-muted/80 flex items-center justify-center border border-border group-hover:scale-110 transition-transform duration-500 bg-background " + s.iconColor}>
                      {s.icon === 'Search' && <Search className="w-7 h-7" />}
                      {s.icon === 'Calendar' && <Calendar className="w-7 h-7" />}
                      {s.icon === 'Video' && <Video className="w-7 h-7" />}
                    </div>
                    <span className="text-5xl font-black text-muted-foreground/10 group-hover:text-primary/20 transition-colors duration-500">{s.n}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-foreground">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{s.desc}</p>
                </div>
                
                {/* Decorative bottom line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      <CategoryExplorer categories={categoryList} />

      {/* ═══ 5. FEATURED TUTORS - NEW MODERN GRID DESIGN ═══ */}
      <section className="py-28 bg-background relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Discover Expert Tutors</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black leading-tight mb-4">
              Meet Skilled
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                Educators
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Choose from thousands of verified tutors. All are background-checked, highly-rated, and ready to help you succeed.
            </p>
          </motion.div>

          {/* Tutors Grid - 4 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {tutorList.slice(0, 8).map((tutor: any, idx: number) => (
              <motion.div
                key={tutor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <TutorProfileCard tutor={tutor} layout="grid" />
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {tutorList.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl border bg-card p-6 opacity-40">
                  <div className="w-12 h-12 bg-muted rounded-xl mb-4" />
                  <div className="h-5 bg-muted rounded w-2/3 mb-2" />
                  <div className="h-3 bg-muted rounded w-full mb-2" />
                  <div className="h-3 bg-muted rounded w-4/5" />
                </div>
              ))}
            </div>
          )}

          {/* Trust Badge Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 py-12 border-t border-border/50 space-y-8"
          >
            <h3 className="text-center text-2xl font-bold">Why Choose Our Tutors?</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-7 h-7 text-blue-600" />
                </div>
                <h4 className="font-bold text-sm">Verified</h4>
                <p className="text-xs text-muted-foreground">Background checked professionals</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-yellow-500/10 rounded-xl flex items-center justify-center mx-auto">
                  <Star className="w-7 h-7 text-yellow-600 fill-current" />
                </div>
                <h4 className="font-bold text-sm">Highly Rated</h4>
                <p className="text-xs text-muted-foreground">4.9/5 average rating</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto">
                  <Award className="w-7 h-7 text-green-600" />
                </div>
                <h4 className="font-bold text-sm">Certified</h4>
                <p className="text-xs text-muted-foreground">Experts in their fields</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto">
                  <TrendingUp className="w-7 h-7 text-purple-600" />
                </div>
                <h4 className="font-bold text-sm">Results</h4>
                <p className="text-xs text-muted-foreground">Students improve quickly</p>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 flex justify-center"
          >
            <Link href="/tutors">
              <Button size="lg" className="rounded-xl px-10 h-13 text-base font-semibold gap-2 shadow-lg shadow-primary/30">
                Explore All Tutors
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ΓöÇΓöÇ 5.5 THE LEARNING EXPERIENCE ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
      <section className="py-28 bg-gradient-to-b from-background to-muted/40 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-6xl px-4 relative z-10">
          {/* Premium Student Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-16 space-y-4">
              <Badge className="bg-blue-100/80 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-0 rounded-full px-4 py-2 font-semibold justify-center">
                <Star className="w-4 h-4 mr-2 fill-current" />
                Trusted by Students
              </Badge>
              <h3 className="font-display text-5xl font-black">
                What Students Say
              </h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "Emily Chen",
                  role: "Pre-med Student",
                  text: "My tutor helped me go from a C to an A in organic chemistry. The personalized approach made all the difference.",
                  rating: 5,
                  subject: "Chemistry"
                },
                {
                  name: "Marcus Johnson",
                  role: "Career Switcher",
                  text: "Learned Python in just 8 weeks with my tutor. Now I landed my first dev job thanks to SkillBridge!",
                  rating: 5,
                  subject: "Programming"
                },
                {
                  name: "Priya Patel",
                  role: "GMAT Prep",
                  text: "Scored 720 on my GMAT. The structure and accountability from my tutor was exactly what I needed.",
                  rating: 5,
                  subject: "GMAT"
                },
                {
                  name: "David Martinez",
                  role: "High School Freshman",
                  text: "Math used to terrify me. Now I actually enjoy it! My tutor made it so easy to understand.",
                  rating: 5,
                  subject: "Mathematics"
                }
              ].map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                      {testimonial.subject}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Why Our Tutors Excel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            {/* Visual Side */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-primary/10 rounded-[2.5rem] transform -rotate-3 scale-105" />
              <div className="relative bg-white dark:bg-zinc-900 rounded-3xl p-2 shadow-2xl border">
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl aspect-square flex flex-col items-center justify-center relative overflow-hidden p-8">
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                      <Award className="w-12 h-12 text-primary" />
                    </div>
                    <div>
                      <p className="text-5xl font-black text-primary">98%</p>
                      <p className="text-sm text-muted-foreground mt-2">Student Satisfaction Rate</p>
                    </div>
                    <div className="pt-8 space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-left">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                        <span>Expert verified backgrounds</span>
                      </div>
                      <div className="flex items-center gap-2 text-left">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                        <span>Continuous training</span>
                      </div>
                      <div className="flex items-center gap-2 text-left">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                        <span>Real-time feedback</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Side */}
            <div className="space-y-8">
              <Badge variant="secondary" className="rounded-full px-4 w-fit">Excellence Standards</Badge>
              <h2 className="font-display text-5xl font-black leading-tight">
                Why Our Tutors
                <span className="italic font-light block">Stand Out</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                SkillBridge maintains the highest standards for tutor quality through rigorous verification, continuous professional development, and comprehensive student feedback systems.
              </p>

              <div className="space-y-4">
                {[
                  { icon: ShieldCheck, title: "Verified Expertise", desc: "All tutors verified with background checks and credential validation" },
                  { icon: Award, title: "Proven Track Record", desc: "Average 4.9/5 rating from thousands of verified student reviews" },
                  { icon: TrendingUp, title: "Results Guaranteed", desc: "Students see measurable improvement within 6-8 weeks on average" },
                  { icon: Globe, title: "Global Talent Pool", desc: "Access world-class educators from top universities and institutions" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-border/50 hover:border-primary/30 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/tutors">
                <Button size="lg" className="rounded-full px-8 gap-2">
                  Discover Our Tutors <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ΓöÇΓöÇ 6. WHY SKILLBRIDGE ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
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
                We've built every feature around the real needs of students and tutors ΓÇö from instant booking to seamless video sessions and honest reviews.
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

      {/* ΓöÇΓöÇ 6.5 BECOME A TUTOR ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
      <section className="py-24 bg-zinc-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[20rem] h-[20rem] bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="container mx-auto max-w-6xl px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Badge className="bg-white/10 text-white hover:bg-white/20 border-white/5 border rounded-full px-4">For Educators</Badge>
              <h2 className="font-display text-5xl font-black leading-tight">
                Share your knowledge.<br/>
                <span className="italic font-light text-primary-foreground/80">Earn on your terms.</span>
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed max-w-md">
                Join our global community of expert tutors. Set your own hourly rates, choose when you want to work, and make a real impact on students' lives around the world.
              </p>

              <ul className="space-y-4">
                {[
                  "Set your own schedule and pricing",
                  "No minimum hours required",
                  "Guaranteed payments for your sessions",
                  "Build your reputation with reviews"
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    {text}
                  </li>
                ))}
              </ul>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Link href="/become-a-tutor">
                  <Button size="lg" className="bg-white text-black hover:bg-zinc-200 rounded-full px-8 h-12">
                    Apply as a Tutor
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="link" className="text-white hover:text-white/80 h-12">
                    Learn more
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="w-full max-w-sm relative">
                <div className="absolute inset-0 bg-linear-to-tr from-primary/40 to-blue-500/40 rounded-3xl blur-2xl transform scale-110 opacity-50" />
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative shadow-2xl">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-zinc-500 text-sm font-medium mb-1">Total Earnings</p>
                      <p className="text-4xl font-display font-bold">$4,250</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-0">+14% this month</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-zinc-400 mb-2">Recent Sessions</p>
                    {[
                      { s: "Advanced React", t: "2 hrs", p: "$80" },
                      { s: "Algebra Intro", t: "1 hr", p: "$35" },
                      { s: "Business English", t: "1.5 hrs", p: "$60" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center"><BookOpen className="w-4 h-4 text-zinc-400"/></div>
                          <div>
                            <p className="font-medium text-sm text-zinc-200">{item.s}</p>
                            <p className="text-xs text-zinc-500">{item.t}</p>
                          </div>
                        </div>
                        <p className="font-bold text-sm">{item.p}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ΓöÇΓöÇ 7. TESTIMONIALS ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
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
                    <p className="text-xs text-muted-foreground">{t.role} ┬╖ {t.subject}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ΓöÇΓöÇ 8. FAQ ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
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

      {/* ΓöÇΓöÇ 9. CTA ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
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
            Join thousands of students already learning smarter with SkillBridge. Find your tutor today ΓÇö no commitment required.
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
