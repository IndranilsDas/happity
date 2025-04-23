// app/admin/providers/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Search, Trash2, Edit, Eye, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import AdminDrawer from "@/components/admin/admin-drawer"
import ProviderDetails from "@/components/admin/provider-details"
import ProviderForm from "@/components/admin/provider-form"

import type { Provider } from "@/lib/types"
import {
  getProviders,
  deleteProvider,
} from "@/lib/firebase-service"

export default function ProvidersPage() {
  const { toast } = useToast()

  const [providers, setProviders] = useState<Provider[]>([])
  const [filtered, setFiltered] = useState<Provider[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>("")
  const [selected, setSelected] = useState<Provider | null>(null)
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true)

  // Fetch once on mount
  useEffect(() => {
    load()
  }, [])

  // Re‐filter when search or list changes
  useEffect(() => {
    if (search.trim()) {
      const q = search.toLowerCase()
      setFiltered(
        providers.filter((u) =>
          [u.fullName, u.email].some((f) =>
            f.toLowerCase().includes(q)
          )
        )
      )
    } else {
      setFiltered(providers)
    }
  }, [search, providers])

  async function load() {
    setLoading(true)
    try {
      const list = await getProviders()
      setProviders(list)
      setFiltered(list)
    } catch (e) {
      console.error(e)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load providers",
      })
    } finally {
      setLoading(false)
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this provider?")) return
    try {
      await deleteProvider(id)
      setProviders((prev) => prev.filter((u) => u.id !== id))
      toast({ title: "Deleted", description: "Provider removed" })
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Delete failed",
      })
    }
  }

  function openEdit(u: Provider | null = null) {
    setSelected(u)
    setIsFormOpen(true)
  }

  function openDetails(u: Provider) {
    setSelected(u)
    setIsDetailsOpen(true)
  }

  return (
    <div className="flex">
      <AdminDrawer
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
      />
      <div
        className="px-10 py-10"
        style={{
          width: isDrawerOpen
            ? "calc(100% - 12rem)"
            : "calc(100% - 3.5rem)",
          marginLeft: isDrawerOpen ? "12rem" : "3.5rem",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Providers</h1>
          <Button onClick={() => openEdit()}>
            <Plus className="mr-2 h-4 w-4" /> Add Provider
          </Button>
        </div>

        <div className="relative max-w-sm mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search providers..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <Loader2 className="animate-spin mx-auto h-5 w-5" />
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {search
                      ? "No providers match your search"
                      : "No providers found"}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.fullName}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      {u.emailVerified ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDetails(u)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(u)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(u.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add/Edit Form */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selected ? "Edit Provider" : "Add Provider"}</DialogTitle>
            </DialogHeader>
            <ProviderForm
              provider={selected}
              onClose={(saved?: boolean) => {
                setIsFormOpen(false)
                setSelected(null)
                if (saved) load()
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Provider Details</DialogTitle>
            </DialogHeader>
            {selected && <ProviderDetails provider={selected} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
