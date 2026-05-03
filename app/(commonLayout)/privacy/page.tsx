import { Badge } from "@/components/ui/badge";

const SECTIONS = [
  { title: "What we collect", body: "Account details, booking data, and usage information needed to run the platform." },
  { title: "How we use it", body: "To match students with tutors, process bookings, and improve the product experience." },
  { title: "AI feature data", body: "Queries sent to LearnForge AI are forwarded to the backend to generate suggestions and tutor matches." },
  { title: "Your controls", body: "You can manage your account, update profile data, and request support for privacy questions." },
];

export default function PrivacyPage() {
  return (
    <div className="bg-background py-32" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,700;9..144,900&family=DM+Sans:wght@400;500;600;700&display=swap');.font-display{font-family:'Fraunces',serif}`}</style>
      <div className="container mx-auto max-w-4xl px-4">
        <Badge variant="secondary" className="rounded-full px-4 mb-5">Privacy Policy</Badge>
        <h1 className="font-display text-5xl md:text-6xl font-black tracking-tight">Privacy, in plain language</h1>
        <p className="mt-5 text-muted-foreground text-lg leading-relaxed">This page is a simple route placeholder for privacy content and can be expanded into your final policy text.</p>

        <div className="mt-10 grid gap-4">
          {SECTIONS.map((section) => (
            <section key={section.title} className="rounded-3xl border bg-muted/20 p-6">
              <h2 className="font-semibold text-lg mb-2">{section.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}