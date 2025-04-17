"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getUserBookings } from "@/lib/firebase-service"
import { Loader2, Calendar, Users, Clock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface Booking {
  id: string
  activityId: string
  activityTitle: string
  bookingDate: string
  participants: number
  status: "pending" | "confirmed" | "cancelled"
  createdAt: any // Firestore timestamp
}

export default function MyBookingsPage() {
  const router = useRouter()
  const { user, role, loading: authLoading } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Redirect if not logged in or not a customer
    if (!authLoading && (!user || role !== "customer")) {
      router.push("/login?redirect=" + encodeURIComponent("/my-bookings"))
      return
    }

    const fetchBookings = async () => {
      if (!user) return

      try {
        const userBookings = await getUserBookings(user.uid)
        setBookings(userBookings)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchBookings()
    }
  }, [user, role, authLoading, router])

  // Show loading state
  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Show message if no bookings
  if (bookings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No bookings found</AlertTitle>
          <AlertDescription>
            You haven't made any bookings yet.
            <button onClick={() => router.push("/")} className="ml-1 font-medium underline">
              Browse activities
            </button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-semibold">{booking.activityTitle}</h2>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{booking.bookingDate ? format(new Date(booking.bookingDate), "PPP") : "Date not specified"}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>
                  {booking.participants} {booking.participants === 1 ? "participant" : "participants"}
                </span>
              </div>

              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>
                  Booked on {booking.createdAt?.toDate ? format(booking.createdAt.toDate(), "PPP") : "Unknown date"}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => router.push(`/activity/${booking.activityId}`)}
                className="text-sm text-primary hover:underline"
              >
                View Activity
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
