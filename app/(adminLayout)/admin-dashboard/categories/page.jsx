"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getAdminCategories,
  createCategory,
  deleteCategory,
} from "@/src/services/admin.service"
import { toast } from "sonner"
import { Plus, Trash2, Tag, Loader2 } from "lucide-react"
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

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient()
  const [newCategory, setNewCategory] = useState("")

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getAdminCategories,
  })

  const { mutate: addCategory, isPending: adding } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Category created!")
      setNewCategory("")
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] })
    },
    onError: (err) => toast.error(err.message),
  })

  const { mutate: removeCategory, isPending: deleting } = useMutation({
    mutationFn: deleteCategory,
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

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-muted-foreground mt-1">
          Manage subject categories available to tutors
        </p>
      </div>

      {/* Add new category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Category</CardTitle>
          <CardDescription>Create a new subject category</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. Mathematics, Physics, English..."
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1"
            />
            <Button onClick={handleAdd} disabled={adding}>
              {adding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories list */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            All Categories{" "}
            {!isLoading && (
              <span className="text-muted-foreground font-normal">({categories.length})</span>
            )}
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              <Tag className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No categories yet. Add one above.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-1.5 bg-muted rounded-full pl-3 pr-1 py-1"
                >
                  <span className="text-sm font-medium">{cat.categoryName}</span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="rounded-full p-1 hover:bg-red-100 hover:text-red-600 transition-colors"
                        disabled={deleting}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}