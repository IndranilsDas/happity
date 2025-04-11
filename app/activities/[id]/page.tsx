"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getActivityById } from "@/lib/data"
import type { Activity } from "@/lib/data"
import { ArrowLeft, CalendarIcon, MapPin, Users, Heart } from "lucide-react"
import Calendar from "@/components/calendar"

export default function ActivityDetail() {
  const params = useParams()
  const router = useRouter()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")

  useEffect(() => {
    if (params.id) {
      const activityData = getActivityById(params.id as string)
      if (activityData) {
        setActivity(activityData)
      }
      setLoading(false)
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">Activity Not Found</h1>
        <p className="mb-8">The activity you're looking for doesn't exist or has been removed.</p>
        <Link
          href="/"
          className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-8 rounded"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <button onClick={() => router.back()} className="flex items-center text-purple-700 hover:text-purple-800 mb-6">
        <ArrowLeft className="h-5 w-5 mr-1" />
        Back to results
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-6">
            <Image src={activity.image || "/placeholder.svg"} alt={activity.name} fill className="object-cover" />
            {activity.featured && (
              <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                Featured
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-purple-700 mb-4">{activity.name}</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-1 text-purple-700" />
              {activity.location.city}
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-1 text-purple-700" />
              {activity.ageRange}
            </div>
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="h-5 w-5 mr-1 text-purple-700" />
              {activity.days.join(", ")}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-purple-700 mb-4">About This Activity</h2>
            <p className="text-gray-700 mb-6">{activity.description}</p>

            <h3 className="text-lg font-bold text-purple-700 mb-3">Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {activity.days.map((day, index) => (
                <div key={index} className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-purple-700" />
                  <span className="font-medium">{day}:</span>
                  <span className="ml-2">{activity.times.join(", ")}</span>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-bold text-purple-700 mb-3">Location</h3>
            <p className="text-gray-700 mb-2">{activity.location.address}</p>
            <p className="text-gray-700">
              {activity.location.city}, {activity.location.postcode}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-purple-700 mb-4">About the Provider</h2>
            <div className="flex items-center mb-4">
              <Image
                src={activity.provider.image || "/placeholder.svg"}
                alt={activity.provider.name}
                width={60}
                height={60}
                className="rounded-full mr-4"
              />
              <div>
                <h3 className="font-bold text-lg">{activity.provider.name}</h3>
                <Link href={`/providers/${activity.provider.id}`} className="text-purple-700 hover:underline">
                  View profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold text-purple-700 mb-4">Book This Activity</h2>
            <p className="text-2xl font-bold text-purple-700 mb-6">{activity.price}</p>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Select Date</h3>
              <Calendar availableDays={activity.days} onSelectDate={(date) => setSelectedDate(date)} />
              {selectedDate && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected:{" "}
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Select Time</h3>
              <select
                className="w-full p-3 border border-gray-300 rounded-md"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                <option value="">Choose a time</option>
                {activity.times.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Number of Children</h3>
              <select className="w-full p-3 border border-gray-300 rounded-md">
                <option value="1">1 child</option>
                <option value="2">2 children</option>
                <option value="3">3 children</option>
                <option value="4">4 children</option>
              </select>
            </div>

            <button
              className={`w-full font-bold py-3 px-4 rounded mb-4 ${
                selectedDate && selectedTime
                  ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
              disabled={!selectedDate || !selectedTime}
            >
              {selectedDate && selectedTime ? "BOOK NOW" : "SELECT DATE AND TIME"}
            </button>

            <button className="w-full flex items-center justify-center bg-white hover:bg-gray-50 text-purple-700 font-bold py-3 px-4 rounded border border-purple-700">
              <Heart className="h-5 w-5 mr-2" />
              Save to Favorites
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

