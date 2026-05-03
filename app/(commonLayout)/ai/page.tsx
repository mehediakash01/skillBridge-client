// import { LearnForgeAi } from "@/components/LearnForgeAi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Brain, Search, Sparkles } from "lucide-react";

const STEPS = [
  { icon: Search, title: "Describe your goal", desc: "Type what you want to learn or the kind of tutor you need." },
  { icon: Sparkles, title: "Get AI suggestions", desc: "The backend returns smart search ideas or tutor match titles." },
  { icon: Brain, title: "Move to booking", desc: "Use the suggestions to jump into tutor discovery faster." },
];

export default function AiPage() {
  return (
    <div className="overflow-hidden bg-background" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,700;9..144,900&family=DM+Sans:wght@400;500;600;700&display=swap');.font-display{font-family:'Fraunces',serif}`}</style>

      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="container mx-auto max-w-4xl px-4 relative text-center">
          <Badge variant="secondary" className="rounded-full px-4 mb-5">LearnForge AI</Badge>
          <h1 className="font-display text-5xl md:text-7xl font-black leading-[1.02] tracking-tight">
            Find the right tutor
            <span className="block italic font-light text-muted-foreground">with a little help from AI.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-muted-foreground text-lg leading-relaxed">
            This page explains the feature and lets users test it directly. When Gemini is configured on the server, requests go to the live model. If not, the backend returns mock recommendations so the UI still demonstrates the flow.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild size="lg" className="rounded-full px-6 gap-2">
              <Link href="#ai-tool">
                Try the tool
                <Sparkles className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-6 gap-2">
              <Link href="/help">
                Need help?
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="rounded-3xl border bg-muted/20 p-6 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Step {index + 1}</p>
                <h2 className="font-semibold text-lg mb-2">{step.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* <section id="ai-tool" className="py-16 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4">
          <LearnForgeAi />
        </div>
      </section> */}
    </div>
  );
}