"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import TutorCard from "@/components/modules/tutors/TutorCard"


export default function TutorsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [tutors, setTutors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const page = searchParams.get("page") || "1"
  const experience = searchParams.get("experience") || ""
  const minRate = searchParams.get("minRate") || ""
  const maxRate = searchParams.get("maxRate") || ""
  const sortBy = searchParams.get("sortBy") || "createdAt"
  const sortOrder = searchParams.get("sortOrder") || "desc"

 const fetchTutors = async () => {
  setLoading(true)

  const queryObject = {
    page,
    experience,
    minRate,
    maxRate,
    sortBy,
    sortOrder,
  }

 
  const cleanParams = Object.fromEntries(
    Object.entries(queryObject).filter(
      ([_, value]) => value !== "" && value !== undefined
    )
  )

  const params = new URLSearchParams(cleanParams as any).toString()

  const res = await fetch(
    `http://localhost:5000/api/tutors?${params}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    const text = await res.text()
    console.error("Server error:", text)
    setLoading(false)
    return
  }

  const data = await res.json()

console.log(data);
  setTutors(data.data?.data || data.data || [])
  setLoading(false)
}

  useEffect(() => {
    fetchTutors()
  }, [searchParams])

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Browse Tutors</h1>

      {/* Filters */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">

        <Input
          placeholder="Min Rate"
          type="number"
          defaultValue={minRate}
          onBlur={(e) => updateQuery("minRate", e.target.value)}
        />

        <Input
          placeholder="Max Rate"
          type="number"
          defaultValue={maxRate}
          onBlur={(e) => updateQuery("maxRate", e.target.value)}
        />

        <Input
          placeholder="Experience (years)"
          type="number"
          defaultValue={experience}
          onBlur={(e) => updateQuery("experience", e.target.value)}
        />

        <Select
          defaultValue={`${sortBy}-${sortOrder}`}
          onValueChange={(value) => {
            const [field, order] = value.split("-")
            updateQuery("sortBy", field)
            updateQuery("sortOrder", order)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hourlyRate-asc">Price Low → High</SelectItem>
            <SelectItem value="hourlyRate-desc">Price High → Low</SelectItem>
            <SelectItem value="experience-desc">Experience High</SelectItem>
            <SelectItem value="createdAt-desc">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tutors Grid */}
      {loading ? (
        <p>Loading...</p>
      ) : tutors.length === 0 ? (
        <p>No tutors found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-10 gap-4">
        <Button
          variant="outline"
          disabled={Number(page) <= 1}
          onClick={() =>
            updateQuery("page", String(Number(page) - 1))
          }
        >
          Previous
        </Button>

        <span className="flex items-center">
          Page {page}
        </span>

        <Button
          variant="outline"
          onClick={() =>
            updateQuery("page", String(Number(page) + 1))
          }
        >
          Next
        </Button>
      </div>
    </div>
  )
}
