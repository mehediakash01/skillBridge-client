"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import TutorCard from "@/components/modules/tutors/TutorCard"
import { Search, SlidersHorizontal, X, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react"

const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Newest" },
  { value: "hourlyRate-asc", label: "Price: Low → High" },
  { value: "hourlyRate-desc", label: "Price: High → Low" },
  { value: "experience-desc", label: "Most Experienced" },
  { value: "averageRate-desc", label: "Top Rated" },
]

function TutorCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <div className="h-1 bg-muted" />
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-8 w-14" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <div className="flex justify-between pt-2 border-t">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  )
}

function PageLoadingFallback() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-background border-b">
        <div className="container mx-auto max-w-7xl px-4 py-10">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => <TutorCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  )
}

// ── This inner component uses useSearchParams — must be inside Suspense ──
function TutorsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [tutors, setTutors] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const [localMin, setLocalMin] = useState(searchParams.get("minRate") || "")
  const [localMax, setLocalMax] = useState(searchParams.get("maxRate") || "")
  const [localExp, setLocalExp] = useState(searchParams.get("experience") || "")

  const page = searchParams.get("page") || "1"
  const experience = searchParams.get("experience") || ""
  const minRate = searchParams.get("minRate") || ""
  const maxRate = searchParams.get("maxRate") || ""
  const sortBy = searchParams.get("sortBy") || "createdAt"
  const sortOrder = searchParams.get("sortOrder") || "desc"

  const hasActiveFilters = !!(experience || minRate || maxRate)
  const currentSort = `${sortBy}-${sortOrder}`

  const fetchTutors = async () => {
    setLoading(true)
    const queryObject: Record<string, string> = { page, sortBy, sortOrder }
    if (experience) queryObject.experience = experience
    if (minRate) queryObject.minRate = minRate
    if (maxRate) queryObject.maxRate = maxRate

    const params = new URLSearchParams(queryObject).toString()
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
      const res = await fetch(`${backendUrl}/api/tutors?${params}`, { cache: "no-store" })
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      const result = data.data
      setTutors(result?.data ?? result ?? [])
      setTotalCount(result?.meta?.total ?? (result?.data ?? result ?? []).length)
    } catch {
      setTutors([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTutors()
  }, [searchParams])

  const updateQuery = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    router.push(`?${params.toString()}`)
  }

  const applyFilters = () => {
    updateQuery({
      minRate: localMin,
      maxRate: localMax,
      experience: localExp,
      page: "1",
    })
    setShowFilters(false)
  }

  const clearFilters = () => {
    setLocalMin("")
    setLocalMax("")
    setLocalExp("")
    updateQuery({ minRate: "", maxRate: "", experience: "", page: "1" })
  }

  const totalPages = Math.ceil(totalCount / 9)

  return (
    <div className="min-h-screen bg-muted/30">
      {/* ── Page header ─────────────────────────────── */}
      <div className="bg-background border-b">
        <div className="container mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Expert Tutors</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                Find Your Tutor
              </h1>
              {!loading && (
                <p className="text-muted-foreground mt-2 text-sm">
                  {totalCount > 0
                    ? <>{totalCount} tutor{totalCount !== 1 ? "s" : ""} available · Page {page} of {totalPages || 1}</>
                    : "No tutors match your filters"
                  }
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <Select
                value={currentSort}
                onValueChange={(value) => {
                  const [field, order] = value.split("-")
                  updateQuery({ sortBy: field, sortOrder: order, page: "1" })
                }}
              >
                <SelectTrigger className="w-48 rounded-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant={showFilters ? "default" : "outline"}
                className="rounded-full gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-accent" />
                )}
              </Button>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full gap-1.5 text-muted-foreground hover:text-foreground"
                  onClick={clearFilters}
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* ── Filter panel ────────────────────────── */}
          {showFilters && (
            <div className="mt-6 p-5 rounded-2xl border bg-card">
              <p className="text-sm font-semibold mb-4">Filter Tutors</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Min Rate ($/hr)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 10"
                    value={localMin}
                    onChange={(e) => setLocalMin(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Max Rate ($/hr)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 100"
                    value={localMax}
                    onChange={(e) => setLocalMax(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Min Experience (years)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 2"
                    value={localExp}
                    onChange={(e) => setLocalExp(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button onClick={applyFilters} className="rounded-full px-6">
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters} className="rounded-full px-6">
                  Reset
                </Button>
              </div>
            </div>
          )}

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {minRate && (
                <Badge variant="secondary" className="rounded-full gap-1.5 pr-1">
                  Min ${minRate}/hr
                  <button onClick={() => { setLocalMin(""); updateQuery({ minRate: "", page: "1" }) }} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {maxRate && (
                <Badge variant="secondary" className="rounded-full gap-1.5 pr-1">
                  Max ${maxRate}/hr
                  <button onClick={() => { setLocalMax(""); updateQuery({ maxRate: "", page: "1" }) }} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {experience && (
                <Badge variant="secondary" className="rounded-full gap-1.5 pr-1">
                  {experience}+ yrs experience
                  <button onClick={() => { setLocalExp(""); updateQuery({ experience: "", page: "1" }) }} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Tutors grid ─────────────────────────────── */}
      <div className="container mx-auto max-w-7xl px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => <TutorCardSkeleton key={i} />)}
          </div>
        ) : tutors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5">
              <GraduationCap className="w-9 h-9 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-bold mb-2">No tutors found</h3>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              Try adjusting your filters or clearing them to see all available tutors.
            </p>
            <Button onClick={clearFilters} variant="outline" className="rounded-full">
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        )}

        {/* ── Pagination ───────────────────────────── */}
        {!loading && tutors.length > 0 && (
          <div className="flex items-center justify-center gap-3 mt-14">
            <Button
              variant="outline"
              className="rounded-full w-10 h-10 p-0"
              disabled={Number(page) <= 1}
              onClick={() => updateQuery({ page: String(Number(page) - 1) })}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages || 1, 5) }, (_, i) => {
                const pageNum = i + 1
                const isCurrent = pageNum === Number(page)
                return (
                  <button
                    key={pageNum}
                    onClick={() => updateQuery({ page: String(pageNum) })}
                    className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              {(totalPages || 1) > 5 && (
                <span className="text-muted-foreground px-1">...</span>
              )}
            </div>

            <Button
              variant="outline"
              className="rounded-full w-10 h-10 p-0"
              disabled={Number(page) >= (totalPages || 1)}
              onClick={() => updateQuery({ page: String(Number(page) + 1) })}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Default export wraps TutorsContent in Suspense ─────────────────
// This is REQUIRED by Next.js when useSearchParams() is used in a client component
export default function TutorsPage() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <TutorsContent />
    </Suspense>
  )
}

const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Newest" },
  { value: "hourlyRate-asc", label: "Price: Low → High" },
  { value: "hourlyRate-desc", label: "Price: High → Low" },
  { value: "experience-desc", label: "Most Experienced" },
  { value: "averageRate-desc", label: "Top Rated" },
]

function TutorCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <div className="h-1 bg-muted" />
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-8 w-14" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <div className="flex justify-between pt-2 border-t">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  )
}

export default function TutorsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [tutors, setTutors] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Local filter state (applied on submit)
  const [localMin, setLocalMin] = useState(searchParams.get("minRate") || "")
  const [localMax, setLocalMax] = useState(searchParams.get("maxRate") || "")
  const [localExp, setLocalExp] = useState(searchParams.get("experience") || "")

  const page = searchParams.get("page") || "1"
  const experience = searchParams.get("experience") || ""
  const minRate = searchParams.get("minRate") || ""
  const maxRate = searchParams.get("maxRate") || ""
  const sortBy = searchParams.get("sortBy") || "createdAt"
  const sortOrder = searchParams.get("sortOrder") || "desc"

  const hasActiveFilters = !!(experience || minRate || maxRate)
  const currentSort = `${sortBy}-${sortOrder}`

  const fetchTutors = async () => {
    setLoading(true)
    const queryObject: Record<string, string> = { page, sortBy, sortOrder }
    if (experience) queryObject.experience = experience
    if (minRate) queryObject.minRate = minRate
    if (maxRate) queryObject.maxRate = maxRate

    const params = new URLSearchParams(queryObject).toString()
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
      const res = await fetch(`${backendUrl}/api/tutors?${params}`, { cache: "no-store" })
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      const result = data.data
      setTutors(result?.data ?? result ?? [])
      setTotalCount(result?.meta?.total ?? (result?.data ?? result ?? []).length)
    } catch {
      setTutors([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTutors()
  }, [searchParams])

  const updateQuery = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    router.push(`?${params.toString()}`)
  }

  const applyFilters = () => {
    updateQuery({
      minRate: localMin,
      maxRate: localMax,
      experience: localExp,
      page: "1",
    })
    setShowFilters(false)
  }

  const clearFilters = () => {
    setLocalMin("")
    setLocalMax("")
    setLocalExp("")
    updateQuery({ minRate: "", maxRate: "", experience: "", page: "1" })
  }

  const totalPages = Math.ceil(totalCount / 9)

  return (
    <div className="min-h-screen bg-muted/30">
      {/* ── Page header ─────────────────────────────── */}
      <div className="bg-background border-b">
        <div className="container mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Expert Tutors</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                Find Your Tutor
              </h1>
              {!loading && (
                <p className="text-muted-foreground mt-2 text-sm">
                  {totalCount > 0
                    ? <>{totalCount} tutor{totalCount !== 1 ? "s" : ""} available · Page {page} of {totalPages || 1}</>
                    : "No tutors match your filters"
                  }
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <Select
                value={currentSort}
                onValueChange={(value) => {
                  const [field, order] = value.split("-")
                  updateQuery({ sortBy: field, sortOrder: order, page: "1" })
                }}
              >
                <SelectTrigger className="w-48 rounded-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant={showFilters ? "default" : "outline"}
                className="rounded-full gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-accent" />
                )}
              </Button>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full gap-1.5 text-muted-foreground hover:text-foreground"
                  onClick={clearFilters}
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* ── Filter panel ────────────────────────── */}
          {showFilters && (
            <div className="mt-6 p-5 rounded-2xl border bg-card">
              <p className="text-sm font-semibold mb-4">Filter Tutors</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Min Rate ($/hr)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 10"
                    value={localMin}
                    onChange={(e) => setLocalMin(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Max Rate ($/hr)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 100"
                    value={localMax}
                    onChange={(e) => setLocalMax(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Min Experience (years)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 2"
                    value={localExp}
                    onChange={(e) => setLocalExp(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button onClick={applyFilters} className="rounded-full px-6">
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters} className="rounded-full px-6">
                  Reset
                </Button>
              </div>
            </div>
          )}

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {minRate && (
                <Badge variant="secondary" className="rounded-full gap-1.5 pr-1">
                  Min ${minRate}/hr
                  <button onClick={() => { setLocalMin(""); updateQuery({ minRate: "", page: "1" }) }} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {maxRate && (
                <Badge variant="secondary" className="rounded-full gap-1.5 pr-1">
                  Max ${maxRate}/hr
                  <button onClick={() => { setLocalMax(""); updateQuery({ maxRate: "", page: "1" }) }} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {experience && (
                <Badge variant="secondary" className="rounded-full gap-1.5 pr-1">
                  {experience}+ yrs experience
                  <button onClick={() => { setLocalExp(""); updateQuery({ experience: "", page: "1" }) }} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Tutors grid ─────────────────────────────── */}
      <div className="container mx-auto max-w-7xl px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => <TutorCardSkeleton key={i} />)}
          </div>
        ) : tutors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5">
              <GraduationCap className="w-9 h-9 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-bold mb-2">No tutors found</h3>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              Try adjusting your filters or clearing them to see all available tutors.
            </p>
            <Button onClick={clearFilters} variant="outline" className="rounded-full">
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        )}

        {/* ── Pagination ───────────────────────────── */}
        {!loading && tutors.length > 0 && (
          <div className="flex items-center justify-center gap-3 mt-14">
            <Button
              variant="outline"
              className="rounded-full w-10 h-10 p-0"
              disabled={Number(page) <= 1}
              onClick={() => updateQuery({ page: String(Number(page) - 1) })}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages || 1, 5) }, (_, i) => {
                const pageNum = i + 1
                const isCurrent = pageNum === Number(page)
                return (
                  <button
                    key={pageNum}
                    onClick={() => updateQuery({ page: String(pageNum) })}
                    className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              {(totalPages || 1) > 5 && (
                <span className="text-muted-foreground px-1">...</span>
              )}
            </div>

            <Button
              variant="outline"
              className="rounded-full w-10 h-10 p-0"
              disabled={Number(page) >= (totalPages || 1)}
              onClick={() => updateQuery({ page: String(Number(page) + 1) })}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}