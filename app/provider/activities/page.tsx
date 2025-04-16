"use client"

import { useEffect, useState } from "react"
import { Plus, Loader2, Search, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import type { Activity } from "@/lib/types"
import {
  getAllActivities,
  deleteActivity,
  updateActivity,
  addActivity,
} from "@/lib/firebase-service"
import ActivityForm from "@/components/provider/providers-activity-form"
import ProviderDrawer from "@/components/provider/provider-drawer"
import { getUserById } from "@/lib/firebase-service"
export default function ProviderActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const { toast } = useToast()
  const { user } = useAuth()
 useEffect(() => {
     if (user?.uid) {
       getUserById(user.uid)
         .then((data) => {
           if (data) {
             setUserData(data)
           } else {
             console.error("User data not found")
           }
         })
         .catch((err) => {
           console.error("Failed to load user data", err)
         })
     }
   }, [user])
  useEffect(() => {
    if (user?.uid) {
      fetchActivities()
    }
  }, [user])

  useEffect(() => {
    if (searchQuery) {
      const filtered = activities.filter((activity) =>
        activity.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredActivities(filtered)
    } else {
      setFilteredActivities(activities)
    }
  }, [searchQuery, activities])

  const fetchActivities = async () => {
    setLoading(true)
    try {
      const all = await getAllActivities()
      const mine = all.filter((a) => a.provider?.id === user?.uid)
      setActivities(mine)
      setFilteredActivities(mine)
    } catch (err) {
      console.error("Error fetching activities:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch activities",
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
        toast({ title: "Deleted", description: "Activity removed" })
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete activity",
        })
      }
    }
  }

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (data: Partial<Activity>) => {
    if (!user) return
    console.log("user",user,userData)
    try {
      const payload = {
        ...data,
        provider: {
          id: user.uid,
          name: userData?.fullName || "Unnamed Provider",
          image: userData?.image || user.photoURL || "",
        },
      }

      if (selectedActivity) {
        await updateActivity(selectedActivity.id, payload)
        toast({ title: "Updated", description: "Activity updated" })
      } else {
        await addActivity(payload as Omit<Activity, "id">)
        toast({ title: "Created", description: "Activity created" })
      }

      setIsFormOpen(false)
      setSelectedActivity(null)
      fetchActivities()
    } catch (err) {
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
    <div className="flex bg-gradient-to-tr from-amber-200 to-purple-300 h-screen">
    <ProviderDrawer isDrawerOpen={isDrawerOpen}
        toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}/>
    <div className="p-6 space-y-6" style={{
          width: isDrawerOpen ? "calc(100% - 12rem)" : "calc(100% - 3.5rem)",
          marginLeft: isDrawerOpen ? "12rem" : "3.5rem",
        }}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Activities</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedActivity(null)}>
              <Plus className="mr-2 h-4 w-4" /> New Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedActivity ? "Edit Activity" : "Add Activity"}
              </DialogTitle>
            </DialogHeader>
            <ActivityForm
              activity={selectedActivity ?? undefined}
              onSubmit={handleFormSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search your activities..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Age Range</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredActivities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No activities found
                </TableCell>
              </TableRow>
            ) : (
              filteredActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.name}</TableCell>
                  <TableCell>{activity.category}</TableCell>
                  <TableCell>${activity.price}</TableCell>
                  <TableCell>{activity.ageRange}</TableCell>
                  <TableCell>{activity.provider?.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(activity)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(activity.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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
