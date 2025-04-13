"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Trash2, Edit } from "lucide-react"
import AdminDrawer from "@/components/admin/admin-drawer"
import CategoryForm from "@/components/admin/category-form"
import { useToast } from "@/components/ui/use-toast"
import { getAllCategories, deleteCategory } from "@/lib/firebase-service"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [filtered, setFiltered] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (!search) return setFiltered(categories)
    setFiltered(
      categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    )
  }, [search, categories])

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories()
      setCategories(data)
    } catch (err) {
      console.error(err)
      toast({ variant: "destructive", title: "Error", description: "Failed to load categories" })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return
    try {
      await deleteCategory(id)
      toast({ title: "Deleted", description: "Category deleted" })
      fetchCategories()
    } catch (err) {
      console.error(err)
      toast({ variant: "destructive", title: "Error", description: "Failed to delete category" })
    }
  }

  return (
    <div className="flex">
      <AdminDrawer
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
      />
      <div className="px-10" style={{
        width: isDrawerOpen ? "calc(100% - 12rem)" : "calc(100% - 3.5rem)",
        marginLeft: isDrawerOpen ? "12rem" : "3.5rem",
      }}>
        <div className="flex justify-between items-center my-4">
          <h1 className="text-3xl font-bold">Categories</h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelected(null)}>
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{selected ? "Edit Category" : "Add Category"}</DialogTitle></DialogHeader>
              <CategoryForm
                category={selected}
                onSubmit={() => {
                  setIsFormOpen(false)
                  fetchCategories()
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-sm mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Description</TableHead> {/* Add a column for description */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>
                      {cat.image && <img src={cat.image} className="w-12 h-12 rounded-md object-cover" />}
                    </TableCell>
                    <TableCell>{cat.description || "No description"}</TableCell> {/* Display description */}
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => {
                        setSelected(cat)
                        setIsFormOpen(true)
                      }}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
