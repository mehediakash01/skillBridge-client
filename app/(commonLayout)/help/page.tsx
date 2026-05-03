import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CircleHelp, Sparkles } from "lucide-react";

const TOPICS = [
  { q: "How do I find a tutor?", a: "Use the Tutors page or the AI page to narrow down options by subject and goal." },
  { q: "Can I use LearnForge AI without an account?", a: "Yes. You can open the AI page from the public site and test the flow immediately." },
  { q: "What if the AI is not responding?", a: "The backend falls back to mock suggestions when GEMINI_API_KEY is missing, so the UI still works." },
  { q: "Where do I manage my bookings?", a: "Logged-in students use the dashboard, while tutors manage sessions in the tutor portal." },
];

export default function HelpPage() {
  return (
    <div className="overflow-hidden bg-background" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,700;9..144,900&family=DM+Sans:wght@400;500;600;700&display=swap');.font-display{font-family:'Fraunces',serif}`}</style>

      <section className="pt-32 pb-16 text-center">
        <div className="container mx-auto max-w-4xl px-4">
          <Badge variant="secondary" className="rounded-full px-4 mb-5">Help / Support</Badge>
          <h1 className="font-display text-5xl md:text-6xl font-black leading-[1.02] tracking-tight">Get answers quickly</h1>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            This page gives students and tutors a single support entry point, including the AI feature and the main product flows.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto max-w-4xl px-4 grid gap-4">
          {TOPICS.map((item) => (
            <div key={item.q} className="rounded-3xl border bg-muted/20 p-6">
              <p className="font-semibold text-lg mb-2 flex items-center gap-2"><CircleHelp className="w-5 h-5 text-primary" />{item.q}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="rounded-[2rem] border bg-background p-8 md:p-10 shadow-sm text-center">
            <Sparkles className="w-6 h-6 mx-auto text-primary mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-black">Still stuck? Start with the AI page.</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              It&apos;s the fastest route to a tutor search suggestion, especially if you already know the subject or learning goal.
            </p>
            <Button asChild className="mt-7 rounded-full px-6 gap-2">
              <Link href="/ai">
                Open LearnForge AI
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}