"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getActivityById, createBooking } from "@/lib/firebase-service"
import { BookingForm } from "../../../components/customers/booking-form"
import type { Activity } from "@/lib/types"
import { Loader2, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ActivityDetailPage() {
  const params = useParams()
  const activityId = params.id as string
  const router = useRouter()
  const { user, role, loading: authLoading } = useAuth()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const activityData = await getActivityById(activityId)
        setActivity(activityData)
      } catch (error) {
        console.error("Error fetching activity:", error)
        toast({
          title: "Error",
          description: "Failed to load activity details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (activityId) {
      fetchActivity()
    }
  }, [activityId])

  // Check if user is logged in and has customer role
  const isCustomer = user && role === "customer"
  
  console.log("User in activity-detail:", user,role)

  const handleBookingSubmit = async (formData: any) => {
    if (!user || !activity) return

    setSubmitting(true)

    try {
      // Create booking with user and activity data
      await createBooking({
        userId: user.uid,
        userName: formData.name || user.displayName || "",
        userEmail: formData.email || user.email || "",
        phone: formData.phone,
        babyAge: formData.babyAge,
        activityId: activityId,
        activityTitle: activity.name,
        bookingDate: formData.bookingDate,
        participants: formData.participants,
        status: "pending",
        createdAt: new Date(),
      })

      toast({
        title: "Booking Successful",
        description: "Your booking has been submitted successfully.",
      })

      // Redirect to booking confirmation or user bookings page
      router.push("/my-bookings")
    } catch (error) {
      console.error("Error creating booking:", error)
      toast({
        title: "Booking Failed",
        description: "There was an error submitting your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Show loading state
  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Show error if activity not found
  if (!activity) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Activity not found</AlertTitle>
          <AlertDescription>The activity you're looking for doesn't exist or has been removed.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{activity.name}</h1>
          <p className="text-gray-600 mt-2">{activity.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {activity.image && (
              <img
                src={activity.image || "/placeholder.svg"}
                alt={activity.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}

            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Activity Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{activity.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Age Range:</span>
                  <span className="font-medium">{activity.ageRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">{activity.price ? `£${activity.price}` : "Free"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">
                  {activity.location?.address ?? "Unknown Address"},{" "}
                  {activity.location?.city ?? "Unknown City"}
                </span>

                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Provider:</span>
                  <span className="font-medium">{activity.provider.name}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Book This Activity</h2>

              {!user && (
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Login Required</AlertTitle>
                  <AlertDescription>
                    Please{" "}
                    <button
                      onClick={() => router.push(`/sign-up`)}
                      className="font-medium underline"
                    >
                      sign-up
                    </button>{" "}
                    to book this activity.
                  </AlertDescription>
                </Alert>
              )}

              {user && !isCustomer && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Customer Account Required</AlertTitle>
                  <AlertDescription>
                    Only customers can book activities. Your account is registered as a {role}.
                  </AlertDescription>
                </Alert>
              )}

              {isCustomer &&
                (submitting ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Processing your booking...</span>
                  </div>
                ) : (
                  <BookingForm onSubmit={handleBookingSubmit} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
