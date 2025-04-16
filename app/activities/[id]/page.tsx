"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  PoundSterlingIcon as Pound,
  ArrowLeft,
  Share2,
  Heart,
  Mail,
  Star,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getActivityById } from "@/lib/firebase-service"
import type { Activity } from "@/lib/types"

export default function ActivityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivityDetails = async () => {
      if (!params.id) return

      try {
        const activityData = await getActivityById(params.id as string)
        if (activityData) {
          setActivity(activityData as Activity)
        }
      } catch (error) {
        console.error("Error fetching activity details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivityDetails()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Activity not found</h1>
        <p className="mb-6">
          The activity you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/activities")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Activities
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-tr from-amber-50 to-purple-50 min-h-screen pb-12">
      {/* Header with image */}
      <div className="relative h-64 md:h-80 w-full bg-gradient-to-r from-purple-600 to-pink-500">
        {activity.image ? (
          <Image
            src={activity.image || "/placeholder.svg?height=800&width=1200"}
            alt={activity.name}
            fill
            className="object-cover opacity-60"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500" />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30" />

        <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-6">
          <Button
            variant="ghost"
            className="absolute top-4 left-4 text-white hover:bg-white/20"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-primary hover:bg-primary/90">
              {activity.category}
            </Badge>
            <Badge variant="outline" className="bg-white/80 text-black border-none">
              <MapPin className="h-3 w-3 mr-1" /> {activity.location?.city ?? "Unknown"}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {activity.name}
          </h1>

          {activity.provider && (
            <div className="flex items-center mt-2">
              <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2 bg-white">
                {activity.provider.image ? (
                  <Image
                    src={activity.provider.image}
                    alt={activity.provider.name || "Provider"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                    {activity.provider.name?.charAt(0) ?? "?"}
                  </div>
                )}
              </div>
              <span className="text-white">By {activity.provider.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Activity details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Status badge */}
            <div className="flex items-center">
              <Badge
                className={`
                  ${activity.status === "upcoming" ? "bg-blue-500" : ""}
                  ${activity.status === "ongoing" ? "bg-green-500" : ""}
                  ${activity.status === "completed" ? "bg-gray-500" : ""}
                  ${activity.status === "cancelled" ? "bg-red-500" : ""}
                `}
              >
                {activity.status
                  ? activity.status.charAt(0).toUpperCase() + activity.status.slice(1)
                  : "Unknown"}
              </Badge>
              <span className="ml-2 text-sm text-muted-foreground">
                Last updated: {new Date(activity.updatedAt).toLocaleDateString()}
              </span>
            </div>

            {/* Quick info cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoCard
                icon={<Calendar className="h-6 w-6 text-primary mb-2" />}
                title="Days Available"
                text={activity.days.join(", ")}
              />
              <InfoCard
                icon={<Clock className="h-6 w-6 text-primary mb-2" />}
                title="Times"
                text={activity.times.join(", ")}
              />
              <InfoCard
                icon={<Users className="h-6 w-6 text-primary mb-2" />}
                title="Age Range"
                text={activity.ageRange}
              />
              <InfoCard
                icon={<Pound className="h-6 w-6 text-primary mb-2" />}
                title="Price"
                text={activity.price}
              />
            </div>

            {/* Tabs for description, location, provider */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="provider">Provider</TabsTrigger>
              </TabsList>

              <TabsContent
                value="description"
                className="p-4 bg-white rounded-md mt-2 shadow-sm"
              >
                <div className="prose max-w-none whitespace-pre-line">
                  <h3 className="text-xl font-semibold mb-4">About this activity</h3>
                  {activity.description}
                </div>
              </TabsContent>

              <TabsContent
                value="location"
                className="p-4 bg-white rounded-md mt-2 shadow-sm"
              >
                <h3 className="text-xl font-semibold mb-4">Location</h3>
                <p className="mb-2">{activity.location.address}</p>
                <p className="text-muted-foreground">
                  {activity.location.city ?? "Unknown"}, {activity.location.postcode}
                </p>
                <div className="mt-4 aspect-video bg-gray-200 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Map view would be displayed here
                  </p>
                </div>
              </TabsContent>

              <TabsContent
                value="provider"
                className="p-4 bg-white rounded-md mt-2 shadow-sm"
              >
                {activity.provider ? (
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-200">
                        {activity.provider.image ? (
                          <Image
                            src={activity.provider.image}
                            alt={activity.provider.name || "Provider"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-500 text-xl">
                            {activity.provider.name?.charAt(0) ?? "?"}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {activity.provider.name}
                        </h3>
                        <p className="text-muted-foreground">Activity Provider</p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="mt-6 flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/providers/${activity.provider.id}`}>
                          View Profile
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="mr-2 h-4 w-4" /> Contact
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p>No provider information available.</p>
                )}
              </TabsContent>
            </Tabs>

            {activity.registeredUsers && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Registration Status</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">
                          {activity.registeredUsers.length}
                        </span>{" "}
                        of <span className="font-medium">{activity.capacity}</span>{" "}
                        spots filled
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{
                            width: `${
                              (activity.registeredUsers.length /
                                activity.capacity) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        activity.registeredUsers.length < activity.capacity
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {activity.registeredUsers.length < activity.capacity
                        ? "Spots Available"
                        : "Fully Booked"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right column - Booking and contact */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Book this activity</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Price:</span>
                    <span className="font-bold text-lg">{activity.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Next session:</span>
                    <span className="font-medium">
                      {activity.date} at {activity.time}
                    </span>
                  </div>
                  <Button className="w-full">Book Now</Button>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Heart className="mr-2 h-4 w-4" /> Save
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col items-center justify-center text-center">
        {icon}
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-xs text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  )
}
