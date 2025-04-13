"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon, Clock, MapPin, Users, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

import type { Activity } from "@/lib/types"

interface ActivityDetailsProps {
  activity: Activity & {
    registeredUsers?: string[]
    capacity: number
    date: string
    time: string
    status: "upcoming" | "ongoing" | "completed" | "cancelled"
    createdAt: string
    updatedAt: string
  }
  onDelete?: (id: string) => Promise<void>
}

export default function ActivityDetails({ activity, onDelete }: ActivityDetailsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800",
    ongoing: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  }

  const handleEdit = () => {
    router.push(`/admin/activities/edit/${activity.id}`)
  }

  const handleDelete = async () => {
    if (!onDelete) return

    try {
      setIsDeleting(true)
      await onDelete(activity.id)
      toast({
        title: "Activity deleted",
        description: "The activity has been successfully deleted.",
      })
      router.push("/admin/activities")
    } catch (error) {
      console.error("Error deleting activity:", error)
      toast({
        title: "Error",
        description: "Failed to delete the activity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      {activity.image && (
        <div className="relative h-48 w-full">
          <Image src={activity.image || "/placeholder.svg"} alt={activity.name} fill className="object-cover" />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{activity.name}</CardTitle>
          <Badge className={statusColors[activity.status]}>
            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{activity.description}</p>

        <Separator />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <span>{format(new Date(activity.date), "MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span>{activity.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span>
              {activity.location.address}, {activity.location.city} {activity.location.postcode}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span>
              {activity.registeredUsers?.length || 0} / {activity.capacity} participants
            </span>
          </div>
        </div>

        {activity.registeredUsers && activity.registeredUsers.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="mb-2 font-medium">Registered Users</h3>
              <div className="rounded-md border">
                <div className="p-4">
                  <p>{activity.registeredUsers.length} users registered</p>
                  {/* You could add a list of users here if needed */}
                </div>
              </div>
            </div>
          </>
        )}

        <Separator />

        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <p>Created: {format(new Date(activity.createdAt), "MMM d, yyyy")}</p>
          </div>
          <div>
            <p>Updated: {format(new Date(activity.updatedAt), "MMM d, yyyy")}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>

        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the activity and remove it from our
                  servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  )
}
