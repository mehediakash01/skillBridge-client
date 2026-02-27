import Link from "next/link"
import { GraduationCap, Twitter, Linkedin, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const FOOTER_LINKS = {
  Platform: [
    { label: "Find Tutors", href: "/tutors" },
    { label: "Browse Subjects", href: "/tutors" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Become a Tutor", href: "/become-a-tutor" },
    { label: "Pricing", href: "/become-a-tutor#earnings" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Press", href: "/press" },
    { label: "Contact", href: "/contact" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Student Guide", href: "/how-it-works" },
    { label: "Tutor Guide", href: "/become-a-tutor" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
}

const SOCIALS = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
]

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "English", "Programming", "Biology", "History", "Economics"]

export default function Footer() {
  return (
    <footer className="bg-foreground text-background" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,900;1,9..144,300&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* ── Top CTA strip ─────────────────────────────── */}
      <div className="border-b border-white/10">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-lg" style={{ fontFamily: "'Fraunces', serif" }}>
                Ready to start learning?
              </p>
              <p className="text-background/60 text-sm mt-0.5">
                Join thousands of students already on SkillBridge.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                href="/tutors"
                className="px-5 py-2.5 rounded-xl bg-white text-foreground text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                Browse Tutors
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main columns ──────────────────────────────── */}
      <div className="container mx-auto max-w-7xl px-4 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand col */}
          <div className="col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span
                className="text-xl font-black text-background"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                SkillBridge
              </span>
            </Link>
            <p className="text-background/60 text-sm leading-relaxed max-w-xs">
              The modern platform connecting ambitious students with expert tutors for live 1-on-1 sessions. Learn anything, on your schedule.
            </p>

            {/* Contact info */}
            <div className="space-y-2">
              {[
                { icon: Mail, text: "hello@skillbridge.com" },
                { icon: Phone, text: "+1 (555) 000-0000" },
                { icon: MapPin, text: "Remote-first · Global" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-xs text-background/50">
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-background/70" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="text-xs font-bold uppercase tracking-widest text-background/40 mb-5">
                {title}
              </p>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-background/60 hover:text-background transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Popular subjects */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-xs font-bold uppercase tracking-widest text-background/40 mb-4">
            Popular Subjects
          </p>
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map((s) => (
              <Link
                key={s}
                href="/tutors"
                className="text-xs px-3 py-1.5 rounded-full bg-white/8 text-background/60 hover:bg-white/15 hover:text-background transition-colors"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="container mx-auto max-w-7xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-background/40">
            © {new Date().getFullYear()} SkillBridge. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-background/40">
            <span>🌍</span>
            <span>Available worldwide · All sessions online</span>
          </div>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Cookies"].map((t) => (
              <Link
                key={t}
                href={`/${t.toLowerCase()}`}
                className="text-xs text-background/40 hover:text-background/70 transition-colors"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}