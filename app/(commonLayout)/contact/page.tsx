import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone, Sparkles } from "lucide-react";

const CONTACT_OPTIONS = [
  { icon: Mail, title: "Email support", value: "hello@learnforge.com", href: "mailto:hello@learnforge.com" },
  { icon: Phone, title: "Phone", value: "+1 (555) 000-0000", href: "tel:+15550000000" },
  { icon: MapPin, title: "Location", value: "Remote-first · Global", href: "#" },
];

export default function ContactPage() {
  return (
    <div className="overflow-hidden bg-background" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,700;9..144,900&family=DM+Sans:wght@400;500;600;700&display=swap');.font-display{font-family:'Fraunces',serif}`}</style>

      <section className="pt-32 pb-16">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <Badge variant="secondary" className="rounded-full px-4 mb-5">Contact</Badge>
          <h1 className="font-display text-5xl md:text-6xl font-black leading-[1.02] tracking-tight">
            Talk to the LearnForge team
          </h1>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Questions about tutors, bookings, LearnForge AI, or account access? Reach out and we&apos;ll point you in the right direction.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto max-w-5xl px-4 grid gap-4 md:grid-cols-3">
          {CONTACT_OPTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <a key={item.title} href={item.href} className="rounded-3xl border bg-muted/20 p-6 hover:bg-muted/40 transition-colors">
                <Icon className="w-5 h-5 text-primary mb-4" />
                <h2 className="font-semibold text-lg mb-1">{item.title}</h2>
                <p className="text-sm text-muted-foreground">{item.value}</p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="rounded-[2rem] border bg-background p-8 md:p-10 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <p className="font-semibold">Fastest path</p>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-black leading-tight">
              Try the AI page first for tutor discovery.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              If you&apos;re exploring the platform, the AI page can help you find the right tutor or search term in seconds.
            </p>
            <div className="mt-7">
              <Button asChild className="rounded-full gap-2 px-6">
                <Link href="/ai">
                  Open LearnForge AI
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}