"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Atom, BadgeCheck, Braces, Code2, Cpu, FlaskConical, Layers3, PenTool, Plus, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type CategoryItem = {
  id: number
  categoryName: string
  description?: string | null
  icon?: string | null
  isTrending?: boolean | null
  learnerCount?: number | null
  startingPrice?: string | number | null
  tags?: string[] | null
}

type FilterKey = "All" | "Development" | "Science" | "Languages" | "Design"

const filterChips: FilterKey[] = ["All", "Development", "Science", "Languages", "Design"]

const subjectPatterns: Record<Exclude<FilterKey, "All">, RegExp[]> = {
  Development: [/react|next|node|js|javascript|typescript|web|programming|frontend|backend|full ?stack|css|html|sql|api/i],
  Science: [/physics|chemistry|biology|science|math|mathematics|calculus|algebra|statistics|data/i],
  Languages: [/english|spanish|french|german|language|grammar|writing|speaking|literature/i],
  Design: [/design|ui|ux|figma|branding|illustration|product design|motion|creative/i],
}

const icons = [Code2, Cpu, Atom, Braces, PenTool, Layers3, FlaskConical]
const badgeLabels = ["Trending", "45+ Tutors"]

function inferGroup(category: CategoryItem): FilterKey {
  const searchableText = [category.categoryName, category.description ?? "", ...(category.tags ?? [])]
    .join(" ")
    .toLowerCase()

  for (const [group, patterns] of Object.entries(subjectPatterns) as [Exclude<FilterKey, "All">, RegExp[]][]) {
    if (patterns.some((pattern) => pattern.test(searchableText))) {
      return group
    }
  }

  return "Development"
}

function getCardMeta(index: number, categoryName: string) {
  const iconIndex = Math.abs(categoryName.toLowerCase().split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % icons.length
  const accent = [
    { iconBg: "from-blue-500/15 to-blue-600/5", iconColor: "text-blue-600", ring: "group-hover:ring-blue-200" },
    { iconBg: "from-emerald-500/15 to-emerald-600/5", iconColor: "text-emerald-600", ring: "group-hover:ring-emerald-200" },
    { iconBg: "from-amber-500/15 to-amber-600/5", iconColor: "text-amber-600", ring: "group-hover:ring-amber-200" },
    { iconBg: "from-violet-500/15 to-violet-600/5", iconColor: "text-violet-600", ring: "group-hover:ring-violet-200" },
    { iconBg: "from-cyan-500/15 to-cyan-600/5", iconColor: "text-cyan-600", ring: "group-hover:ring-cyan-200" },
    { iconBg: "from-rose-500/15 to-rose-600/5", iconColor: "text-rose-600", ring: "group-hover:ring-rose-200" },
    { iconBg: "from-indigo-500/15 to-indigo-600/5", iconColor: "text-indigo-600", ring: "group-hover:ring-indigo-200" },
  ]

  return { ...accent[index % accent.length], Icon: icons[iconIndex], label: badgeLabels[index % badgeLabels.length] }
}

export function CategoryExplorer({ categories }: { categories: CategoryItem[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All")

  const preparedCategories = useMemo(
    () =>
      (Array.isArray(categories) ? categories : []).slice(0, 7).map((category, index) => ({
        ...category,
        group: inferGroup(category),
        meta: getCardMeta(index, category.categoryName || `Category ${index + 1}`),
      })),
    [categories]
  )

  const visibleCategories = activeFilter === "All"
    ? preparedCategories
    : preparedCategories.filter((category) => category.group === activeFilter)

  return (
    <section className="py-28 md:py-32 bg-white text-slate-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-6 mb-10">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 font-semibold font-jakarta">
              Subjects
            </Badge>
            <h2 className="font-jakarta text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950">
              Explore by <span className="text-slate-500">Category</span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed font-jakarta">
              Browse the most in-demand subjects on Skill Bridge. Each category card blends professional data, subtle motion, and clear social proof so learners can choose with confidence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {filterChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setActiveFilter(chip)}
                aria-pressed={activeFilter === chip}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 font-jakarta ${
                  activeFilter === chip
                    ? "border-slate-900 bg-slate-900 text-white shadow-[0_10px_30px_rgba(15,23,42,0.16)]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {visibleCategories.length > 0 ? (
            visibleCategories.map((cat) => {
              const title = cat.categoryName || "Typescript"
              const description =
                cat.description ||
                `Get matched with expert tutors for ${title}. Structured lessons, practical sessions, and flexible scheduling designed for real progress.`
              const learnerCount = cat.learnerCount ?? 1200
              const startingPrice = cat.startingPrice ?? 20
              const tags = Array.isArray(cat.tags) && cat.tags.length > 0 ? cat.tags.slice(0, 2) : ["#WebDev", "#BeginnerFriendly"]
              const meta = cat.meta
              const subjectLink = `/tutors?category=${cat.id}`

              return (
                <Link href={subjectLink} key={cat.id} className="group block">
                  <div className={`relative h-full rounded-[24px] border border-slate-200 bg-white p-5 md:p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] hover:border-slate-300 hover:ring-1 hover:ring-slate-200 ${meta.ring}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${meta.iconBg} border border-white shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]`}>
                        <meta.Icon className={`h-7 w-7 ${meta.iconColor}`} />
                      </div>

                      <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm font-jakarta">
                        {meta.label}
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <h3 className="font-jakarta text-xl font-extrabold tracking-tight text-slate-950">{title}</h3>
                      <p className="font-jakarta text-sm leading-6 text-slate-500 line-clamp-2">{description}</p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 font-jakarta">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 border-t border-slate-200 pt-4 flex items-center justify-between gap-3 text-sm font-jakarta">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span className="font-semibold text-slate-700">{(Number(learnerCount) / 1000).toFixed(1)}k Learners</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Starting from</p>
                        <p className="font-bold text-slate-950">${Number(startingPrice)}/hr</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="sm:col-span-2 lg:col-span-3 rounded-[24px] border border-slate-200 bg-slate-50 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-3 text-slate-700 font-jakarta font-semibold">
                <BadgeCheck className="h-5 w-5 text-emerald-600" />
                No subjects match this filter yet.
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-500 font-jakarta">
                Switch to another category or suggest a subject below and we’ll add a tutor path for it.
              </p>
            </div>
          )}

          <div className="lg:col-span-2 xl:col-span-1">
            <div className="relative h-full rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)] flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_35%)]" />
              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <Plus className="h-6 w-6 text-slate-900" />
                </div>
                <h3 className="font-jakarta text-2xl font-extrabold text-slate-950">Can’t find your subject?</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500 font-jakarta">
                  Suggest a subject or request a custom tutor. We’ll help you get the exact learning path you need.
                </p>
              </div>

              <div className="relative mt-8 rounded-2xl border border-white/70 bg-white p-4 shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 font-jakarta">Custom request</p>
                    <p className="mt-1 font-jakarta text-sm font-semibold text-slate-900">Request a Custom Tutor</p>
                  </div>
                  <Button className="rounded-full bg-slate-900 px-4 text-white hover:bg-slate-800 shadow-none">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}