"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../lib/auth-context"
import { getActivityById } from "../../../lib/firebase-service"
import { BookingForm } from "../../../components/customers/booking-form"
import type { Activity } from "@/lib/types"
import { createBooking } from "../../../lib/firebase-service"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function BookingPage({ params }: { params: { activityId: string } }) {
  const { activityId } = params
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
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [activityId])

  useEffect(() => {
    // Redirect if not logged in or not a customer
    if (!authLoading && (!user || role !== "customer")) {
      router.push("/login?redirect=" + encodeURIComponent(`/booking/${activityId}`))
    }
  }, [user, role, authLoading, router, activityId])

  const handleBookingSubmit = async (formData: any) => {
    if (!user || !activity) return

    setSubmitting(true)

    try {
      // Create booking with user and activity data
      await createBooking({
        ...formData,
        userId: user.uid,
        userName: user.displayName || formData.name,
        userEmail: user.email || formData.email,
        activityId: activityId,
        activityTitle: activity.name,
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
        <h1 className="text-2xl font-bold text-red-600">Activity not found</h1>
        <p className="mt-2">The activity you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Book: {activity.name}</h1>

        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <div className="flex items-center gap-4">
            {activity.image && (
              <img
                src={activity.image || "/placeholder.svg"}
                alt={activity.name}
                className="w-20 h-20 object-cover rounded-md"
              />
            )}
            <div>
              <h2 className="font-semibold">{activity.name}</h2>
              <p className="text-sm text-gray-600">
        {activity.location.address},&nbsp;
        {activity.location.city}&nbsp;
        {activity.location.postcode}
      </p>
              <p className="text-sm font-medium mt-1">{activity.price ? `£${activity.price}` : "Free"}</p>
            </div>
          </div>
        </div>

        {submitting ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Processing your booking...</span>
          </div>
        ) : (
          <BookingForm onSubmit={handleBookingSubmit} />
        )}
      </div>
    </div>
  )
}
