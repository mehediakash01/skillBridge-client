import Link from "next/link";
import { ArrowRight, BadgeCheck, Brain, Globe, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const VALUES = [
  { icon: HeartHandshake, title: "Student First", desc: "We design around real learning needs, not platform complexity." },
  { icon: ShieldCheck, title: "Trust Built In", desc: "Verified sessions, honest reviews, and transparent tutor pricing." },
  { icon: Globe, title: "Global Access", desc: "Great tutoring should be available anywhere a student has a screen." },
  { icon: Brain, title: "AI-Assisted Discovery", desc: "LearnForge AI helps students find the right tutor faster." },
];

const FEATURES = [
  "Live 1-on-1 tutoring",
  "Real tutor profiles",
  "Smart search suggestions",
  "Personalized AI tutor matching",
  "Flexible booking and availability",
  "Student and tutor dashboards",
];

export default function AboutPage() {
  return (
    <div className="overflow-hidden bg-background" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,700;9..144,900&family=DM+Sans:wght@400;500;600;700&display=swap');.font-display{font-family:'Fraunces',serif}`}</style>

      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="container mx-auto max-w-5xl px-4 relative">
          <Badge variant="secondary" className="rounded-full px-4 mb-6">About LearnForge</Badge>
          <h1 className="font-display text-5xl md:text-7xl font-black leading-[1.02] tracking-tight max-w-4xl">
            A modern tutoring platform built for
            <span className="block italic font-light text-muted-foreground">focus, speed, and better matches.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-muted-foreground text-lg leading-relaxed">
            LearnForge connects students with expert tutors and now includes LearnForge AI to make discovery easier. It helps people move from a search idea to a real booking path with less friction.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="rounded-full px-6 gap-2">
              <Link href="/ai">
                Try LearnForge AI
                <Sparkles className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-6 gap-2">
              <Link href="/tutors">
                Browse Tutors
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-3xl border bg-background p-6 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-semibold text-lg mb-2">{item.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          <div>
            <Badge variant="secondary" className="rounded-full px-4 mb-5">What the platform does</Badge>
            <h2 className="font-display text-4xl md:text-5xl font-black leading-tight">
              Learn faster with a clean path from search to session.
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed max-w-2xl">
              The platform lets students browse tutors, review availability, and book sessions. The AI layer adds smart prompts, suggested searches, and personalized tutor matching based on the user&apos;s goal and context.
            </p>
          </div>

          <div className="rounded-3xl border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BadgeCheck className="w-5 h-5 text-primary" />
              <p className="font-semibold">Included experiences</p>
            </div>
            <ul className="grid gap-3">
              {FEATURES.map((item) => (
                <li key={item} className="flex items-center gap-3 rounded-2xl bg-muted/40 px-4 py-3 text-sm">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <Badge variant="secondary" className="rounded-full px-4 mb-5">Next step</Badge>
          <h2 className="font-display text-4xl md:text-5xl font-black">See the AI feature in action</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The AI page shows the live search and tutor match experience. If your Gemini key is set, it uses the API; otherwise the backend falls back to mock suggestions so the UI still works.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full px-6 gap-2">
            <Link href="/ai">
              Open AI Page
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}