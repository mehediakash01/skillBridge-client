import { Badge } from "@/components/ui/badge";

const TERMS = [
  { title: "Use the service responsibly", body: "Do not abuse the platform, attempt unauthorized access, or post false information." },
  { title: "Bookings and payments", body: "Bookings are between students and tutors, and tutor pricing is shown before confirmation." },
  { title: "AI feature", body: "LearnForge AI is provided to help with discovery, and output can be approximate or incomplete." },
  { title: "Changes", body: "We may update platform features, routes, or policies as the product evolves." },
];

export default function TermsPage() {
  return (
    <div className="bg-background py-32" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,700;9..144,900&family=DM+Sans:wght@400;500;600;700&display=swap');.font-display{font-family:'Fraunces',serif}`}</style>
      <div className="container mx-auto max-w-4xl px-4">
        <Badge variant="secondary" className="rounded-full px-4 mb-5">Terms of Service</Badge>
        <h1 className="font-display text-5xl md:text-6xl font-black tracking-tight">The rules of the platform</h1>
        <p className="mt-5 text-muted-foreground text-lg leading-relaxed">This route gives you a real terms page instead of a broken footer link.</p>

        <div className="mt-10 grid gap-4">
          {TERMS.map((item) => (
            <section key={item.title} className="rounded-3xl border bg-muted/20 p-6">
              <h2 className="font-semibold text-lg mb-2">{item.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}