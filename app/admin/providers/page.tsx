"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Plus, Search, Trash2, Edit, Eye } from "lucide-react"
import type { Provider } from "@/lib/types"
import { getAllProviders, deleteProvider } from "@/lib/firebase-service"
import { useToast } from "@/components/ui/use-toast"
import ProviderForm from "../../../components/admin/provider-form"
import ProviderDetails from "../../../components/admin/povider-details"
import AdminDrawer from "../../../components/admin/admin-drawer"


export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchProviders()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = providers.filter(
        (provider) =>
          provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredProviders(filtered)
    } else {
      setFilteredProviders(providers)
    }
  }, [searchQuery, providers])

  const fetchProviders = async () => {
    try {
      setLoading(true)
      const data = await getAllProviders()
      setProviders(data)
      setFilteredProviders(data)
    } catch (error) {
      console.error("Error fetching providers:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load providers",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this provider?")) {
      try {
        await deleteProvider(id)
        setProviders(providers.filter((provider) => provider.id !== id))
        toast({
          title: "Success",
          description: "Provider deleted successfully",
        })
      } catch (error) {
        console.error("Error deleting provider:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete provider",
        })
      }
    }
  }

  const handleViewDetails = (provider: Provider) => {
    setSelectedProvider(provider)
    setIsDetailsOpen(true)
  }

  const handleEdit = (provider: Provider) => {
    setSelectedProvider(provider)
    setIsFormOpen(true)
  }

  const handleFormClose = (refreshData = false) => {
    setIsFormOpen(false)
    setSelectedProvider(null)
    if (refreshData) {
      fetchProviders()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminDrawer
                    isDrawerOpen={isDrawerOpen}
                    toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
                  />
      <div className="px-10" style={{
        width: isDrawerOpen ? "calc(100% - 12rem)" : "calc(100% - 3.5rem)",
        marginLeft: isDrawerOpen ? "12rem" : "3.5rem",
      }}>
      <div  className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Providers</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedProvider(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Provider
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedProvider ? "Edit Provider" : "Add New Provider"}</DialogTitle>
            </DialogHeader>
            <ProviderForm provider={selectedProvider} onClose={handleFormClose} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search providers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Activities</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProviders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "No providers found matching your search" : "No providers found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredProviders.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium">{provider.name}</TableCell>
                  <TableCell>{provider.location}</TableCell>
                  <TableCell>{provider.activities}</TableCell>
                  <TableCell>{provider.rating}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(provider)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(provider)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(provider.id)}>
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

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Provider Details</DialogTitle>
          </DialogHeader>
          {selectedProvider && <ProviderDetails provider={selectedProvider} />}
        </DialogContent>
      </Dialog>
    </div>
    </div>
  )
}
