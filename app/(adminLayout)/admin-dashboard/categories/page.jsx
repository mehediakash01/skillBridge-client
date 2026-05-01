"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getAdminCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/src/services/admin.service"
import { toast } from "sonner"
import { Plus, Trash2, Tag, Loader2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const categoryColors = [
  { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-600" },
  { bg: "bg-purple-50", border: "border-purple-200", icon: "text-purple-600" },
  { bg: "bg-pink-50", border: "border-pink-200", icon: "text-pink-600" },
  { bg: "bg-green-50", border: "border-green-200", icon: "text-green-600" },
  { bg: "bg-amber-50", border: "border-amber-200", icon: "text-amber-600" },
  { bg: "bg-cyan-50", border: "border-cyan-200", icon: "text-cyan-600" },
]

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient()
  const [newCategory, setNewCategory] = useState("")
  const [formOpenFor, setFormOpenFor] = useState(null)
  const [formState, setFormState] = useState({
    categoryName: "",
    description: "",
    icon: "",
    isTrending: false,
    learnerCount: 0,
    startingPrice: "",
    tags: "",
  })

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getAdminCategories,
  })

  const { mutate: addCategory, isPending: adding } = useMutation({
    mutationFn: (name) => createCategory({ categoryName: name }),
    onSuccess: () => {
      toast.success("Category created!")
      setNewCategory("")
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] })
    },
    onError: (err) => toast.error(err.message),
  })

  const { mutate: removeCategory, isPending: deleting } = useMutation({
    mutationFn: deleteCategory,
      const { mutate: saveCategory, isLoading: saving } = useMutation({
        mutationFn: ({ id, payload }) => updateCategory(id, payload),
        onSuccess: () => {
          toast.success("Category updated!")
          setFormOpenFor(null)
          queryClient.invalidateQueries({ queryKey: ["admin-categories"] })
        },
        onError: (err) => toast.error(err.message),
      })
    onSuccess: () => {
      toast.success("Category deleted")
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] })
    },
    onError: (err) => toast.error(err.message),
  })

  const handleAdd = () => {
    if (!newCategory.trim()) return toast.error("Category name is required")
    addCategory(newCategory.trim())
  }

  const openEdit = (cat) => {
    setFormOpenFor(cat.id)
    setFormState({
      categoryName: cat.categoryName || "",
      description: cat.description || "",
      icon: cat.icon || "",
      isTrending: !!cat.isTrending,
      learnerCount: cat.learnerCount || 0,
      startingPrice: cat.startingPrice || "",
      tags: (cat.tags && cat.tags.join(", ")) || "",
    })
  }

  const handleSave = (id) => {
    const payload = {
      categoryName: formState.categoryName,
      description: formState.description,
      icon: formState.icon,
      isTrending: formState.isTrending,
      learnerCount: Number(formState.learnerCount) || 0,
      startingPrice: formState.startingPrice,
      tags: formState.tags ? formState.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
    }
    saveCategory({ id, payload })
  }

  const getColorForIndex = (index) => categoryColors[index % categoryColors.length]

  const stats = [
    { label: "Total Categories", value: categories.length, icon: Tag, color: "from-blue-50 to-blue-100/50" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-500 mt-2">
          Manage and organize all subject categories available to tutors
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className={`border-0 bg-gradient-to-br ${stat.color} shadow-sm`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <Icon className="w-8 h-8 text-blue-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add new category */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-lg">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-base">Add New Category</CardTitle>
              <CardDescription>Create a new subject category for tutors</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="flex gap-3 flex-col sm:flex-row">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. Mathematics, Physics, English..."
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1 rounded-lg"
            />
            <Button 
              onClick={handleAdd} 
              disabled={adding || !newCategory.trim()}
              className="sm:w-auto w-full bg-blue-600 hover:bg-blue-700"
            >
              {adding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          All Categories
          {!isLoading && (
            <span className="text-gray-500 font-normal ml-2">({categories.length})</span>
          )}
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="p-3 bg-gray-100 rounded-lg mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No categories yet</p>
              <p className="text-gray-500 text-sm mt-1">Add your first category above to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, idx) => {
              const colors = getColorForIndex(idx)
              return (
                <Card 
                  key={cat.id} 
                  className={`border border-gray-200 shadow-sm hover:shadow-md transition-all ${colors.bg}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2.5 bg-white rounded-lg border ${colors.border}`}>
                        <Tag className={`w-5 h-5 ${colors.icon}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(cat)}>Edit</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                              disabled={deleting}
                              title="Delete category"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete "{cat.categoryName}"?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this category. Tutors who have this
                                subject assigned will lose it.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => removeCategory(cat.id)}
                              >
                                Yes, delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    {formOpenFor === cat.id ? (
                      <div className="space-y-3">
                        <Input value={formState.categoryName} onChange={(e) => setFormState(s => ({...s, categoryName: e.target.value}))} />
                        <Input value={formState.icon} onChange={(e) => setFormState(s => ({...s, icon: e.target.value}))} placeholder="Icon URL" />
                        <Input value={formState.learnerCount} onChange={(e) => setFormState(s => ({...s, learnerCount: e.target.value}))} type="number" placeholder="Learner count" />
                        <Input value={formState.startingPrice} onChange={(e) => setFormState(s => ({...s, startingPrice: e.target.value}))} type="number" placeholder="Starting price" />
                        <Input value={formState.tags} onChange={(e) => setFormState(s => ({...s, tags: e.target.value}))} placeholder="tags, comma separated" />
                        <Input value={formState.description} onChange={(e) => setFormState(s => ({...s, description: e.target.value}))} placeholder="Short description" />
                        <div className="flex gap-2">
                          <Button onClick={() => handleSave(cat.id)} disabled={saving}>Save</Button>
                          <Button variant="ghost" onClick={() => setFormOpenFor(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-gray-900">{cat.categoryName}</h3>
                        <p className="text-gray-500 text-sm mt-2">{cat.description || 'Subject category'}</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {!isLoading && categories.length > 0 && (
          <p className="text-gray-500 text-sm mt-4">
            Showing {categories.length} {categories.length === 1 ? "category" : "categories"}
          </p>
        )}
      </div>
    </div>
  )
}