"use client"

import { useState, useEffect } from "react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Search, Trash2, Edit, Eye } from "lucide-react"
import type { Activity } from "../../../lib/types"
import {
  getAllActivities,
  deleteActivity,
  updateActivity,
  addActivity,
} from "../../../lib/firebase-service"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import ActivityForm from "../../../components/admin/activity-form"
import ActivityDetails from "../../../components/admin/activity-details"
import AdminDrawer from "../../../components/admin/admin-drawer"

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const { toast } = useToast()


  const {user,role} = useAuth()
  console.log("USER:",user,"ROLE:",role,"##############")
  useEffect(() => {
    fetchActivities()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = activities.filter(
        (activity) =>
          activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.location.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredActivities(filtered)
    } else {
      setFilteredActivities(activities)
    }
  }, [searchQuery, activities])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const data = await getAllActivities()
      setActivities(data)
      setFilteredActivities(data)
    } catch (error) {
      console.error("Error fetching activities:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load activities",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      try {
        await deleteActivity(id)
        setActivities((prev) => prev.filter((a) => a.id !== id))
        toast({
          title: "Success",
          description: "Activity deleted successfully",
        })
      } catch (error) {
        console.error("Error deleting activity:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete activity",
        })
      }
    }
  }

  const handleViewDetails = (activity: Activity) => {
    setSelectedActivity(activity)
    setIsDetailsOpen(true)
  }

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (formData: Partial<Activity>) => {
    try {
      const requiredFields = ["name", "category", "location", "time", "date", "price", "ageRange"]
      const missingField = requiredFields.find((field) => !(formData as any)[field])

      if (missingField) {
        toast({
          variant: "destructive",
          title: "Missing Field",
          description: `The field "${missingField}" is required.`,
        })
        return
      }

      if (selectedActivity) {
        await updateActivity(selectedActivity.id, formData)
        toast({ title: "Updated", description: "Activity updated successfully" })
      } else {
        await addActivity(formData as Omit<Activity, "id">)
        toast({ title: "Created", description: "Activity added successfully" })
      }

      setIsFormOpen(false)
      setSelectedActivity(null)
      fetchActivities()
    } catch (err) {
      console.error(err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save activity",
      })
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
    <div className="space-y-6 flex">
      <AdminDrawer
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
      />
      <div
        className="px-10"
        style={{
          width: isDrawerOpen ? "calc(100% - 12rem)" : "calc(100% - 3.5rem)",
          marginLeft: isDrawerOpen ? "12rem" : "3.5rem",
        }}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Activities</h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedActivity(null)}>
                <Plus className="mr-2 h-4 w-4" /> Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedActivity ? "Edit Activity" : "Add New Activity"}
                </DialogTitle>
              </DialogHeader>
              <ActivityForm activity={selectedActivity!} onSubmit={handleFormSubmit} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search activities..."
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
                <TableHead>Category</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Age Range</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchQuery
                      ? "No activities found matching your search"
                      : "No activities found"}
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
                      {activity.featured ? (
                        <Badge>Yes</Badge>
                      ) : (
                        <Badge variant="outline">No</Badge>
                      )}
                    </TableCell>
                    <TableCell>{activity.ageRange}</TableCell>
                    <TableCell>{activity?.location?.city ?? "Unknown"}</TableCell>
                    <TableCell>{activity.price}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(activity)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(activity)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(activity.id)}
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
