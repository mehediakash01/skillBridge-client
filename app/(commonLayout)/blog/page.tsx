import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Clock3, TrendingUp } from "lucide-react";

const POSTS = [
  { title: "How LearnForge AI helps students book faster", category: "Product", readTime: "4 min", excerpt: "A look at the smart search flow and why it reduces friction when finding a tutor." },
  { title: "5 ways to choose the right tutor", category: "Guide", readTime: "6 min", excerpt: "A short checklist for picking a tutor based on goals, style, and availability." },
  { title: "What makes a great online tutoring session", category: "Learning", readTime: "5 min", excerpt: "Practical advice for students and tutors to get the most out of every session." },
];

export default function BlogPage() {
  return (
    <div className="overflow-hidden bg-background" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,700;9..144,900&family=DM+Sans:wght@400;500;600;700&display=swap');.font-display{font-family:'Fraunces',serif}`}</style>

      <section className="pt-32 pb-16">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <Badge variant="secondary" className="rounded-full px-4 mb-5">Blog</Badge>
          <h1 className="font-display text-5xl md:text-6xl font-black leading-[1.02] tracking-tight">
            Ideas, updates, and learning tips
          </h1>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Share product updates, tutoring advice, and feature guides here. This page gives the app a real blog route instead of a dead link.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto max-w-6xl px-4 grid gap-5 lg:grid-cols-3">
          {POSTS.map((post) => (
            <article key={post.title} className="rounded-[2rem] border bg-muted/20 p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">{post.category}</span>
                <span className="flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" />{post.readTime}</span>
              </div>
              <h2 className="font-semibold text-2xl leading-tight mb-3">{post.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{post.excerpt}</p>
              <Link href="/ai" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-primary">
                Related feature
                <ArrowRight className="w-4 h-4" />
              </Link>
            </article>
          ))}
        </div>

        <div className="container mx-auto max-w-4xl px-4 mt-12">
          <div className="rounded-[2rem] border bg-background p-8 text-center shadow-sm">
            <TrendingUp className="w-6 h-6 mx-auto text-primary mb-4" />
            <h2 className="font-display text-3xl font-black">This is a good place for release notes too</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">Use this route for feature launches, new tutor categories, and product announcements.</p>
            <Button asChild className="mt-7 rounded-full px-6 gap-2">
              <Link href="/contact">
                Contact the team
                <BookOpen className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}