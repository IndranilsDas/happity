"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Search, Trash2, Edit, Eye } from "lucide-react"
import type { Activity } from "@/lib/types"
import { getAllActivities, deleteActivity, updateActivity, addActivity } from "@/lib/firebase-service"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import ActivityForm from "@/components/admin/activity-form"
import ActivityDetails from "@/components/admin/activity-details"
import AdminDrawer from "@/components/admin/admin-drawer"

export default function ActivitiesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, role } = useAuth()

  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  
  console.log("User, role:", user, role)
  useEffect(() => {
    fetchActivities()
  }, [])



  useEffect(() => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      setFilteredActivities(
        activities.filter((a) =>
          [a.name, a.category, a.location.city, a.status]
            .filter(Boolean)
            .some((field) => field!.toLowerCase().includes(q)),
        ),
      )
    } else {
      setFilteredActivities(activities)
    }
  }, [searchQuery, activities])

  async function fetchActivities() {
    try {
      setLoading(true)
      const data = await getAllActivities()

      // Ensure all activities have the required fields
      const processedData = data.map((activity) => ({
        ...activity,
        name: activity.name || "Unnamed Activity",
        category: activity.category || "Uncategorized",
        featured: activity.featured ?? false,
        status: activity.status || "unknown",
        ageRange: activity.ageRange || "All ages",
        price: activity.price || "0",
        location: activity.location || { city: "Unknown", address: "", postcode: "" },
      }))

      setActivities(processedData)
      setFilteredActivities(processedData)
    } catch (error) {
      console.error("Error fetching activities:", error)
      toast({ variant: "destructive", title: "Error", description: "Failed to load activities" })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this activity?")) return
    try {
      await deleteActivity(id)
      setActivities((prev) => prev.filter((a) => a.id !== id))
      toast({ title: "Deleted", description: "Activity removed" })
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Delete failed" })
    }
  }

  function handleViewDetails(activity: Activity) {
    setSelectedActivity(activity)
    setIsDetailsOpen(true)
  }

  function handleEdit(activity: Activity) {
    setSelectedActivity(activity)
    setIsFormOpen(true)
  }

  async function handleFormSubmit(data: Partial<Activity>) {
    try {
      if (selectedActivity) {
        await updateActivity(selectedActivity.id, data)
        toast({ title: "Updated", description: "Activity updated" })
      } else {
        await addActivity(data as Omit<Activity, "id">)
        toast({ title: "Created", description: "Activity added" })
      }
      setIsFormOpen(false)
      setSelectedActivity(null)
      fetchActivities()
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Save failed" })
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
    <div className="flex">
      <AdminDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} />

      <div
        className="px-10 py-10"
        style={{
          width: isDrawerOpen ? "calc(100% - 12rem)" : "calc(100% - 3.5rem)",
          marginLeft: isDrawerOpen ? "12rem" : "3.5rem",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Activities</h1>
          <Button
            onClick={() => {
              setSelectedActivity(null)
              setIsFormOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Activity
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search activities..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Age Range</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "No activities match your search" : "No activities found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{activity.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {activity.featured ? <Badge>Yes</Badge> : <Badge variant="outline">No</Badge>}
                    </TableCell>
                    <TableCell>{activity.ageRange}</TableCell>
                    <TableCell>{activity.location?.city || "Unknown"}</TableCell>

                    <TableCell>{activity.price}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          activity.status === "completed"
                            ? "default"
                            : activity.status === "ongoing"
                              ? "secondary"
                              : activity.status === "upcoming"
                                ? "outline"
                                : "destructive"
                        }
                      >
                        {activity.status || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(activity)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(activity)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(activity.id!)}>
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

        {/* Add/Edit Activity Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedActivity ? "Edit Activity" : "Add New Activity"}</DialogTitle>
            </DialogHeader>
            <ActivityForm
              activity={selectedActivity!}
              onSubmit={async (data) => {
                await handleFormSubmit(data)
                setIsFormOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Activity Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Activity Details</DialogTitle>
            </DialogHeader>
            {selectedActivity && <ActivityDetails activity={selectedActivity} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
