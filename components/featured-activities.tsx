"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getAllActivities } from "@/lib/firebase-service"
import type { Activity } from "@/lib/types"

export default function FeaturedActivities() {
  const [featuredActivities, setFeaturedActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const all = await getAllActivities()
        // If you have an `featured` boolean in your Activity docs:
        const featured = all.filter((a) => (a as any).featured)
        // Otherwise, just pick the first 6:
        // const featured = all.slice(0, 6)
        setFeaturedActivities(featured)
      } catch (err) {
        console.error("Error loading activities", err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  if (loading) {
    return <p className="text-center py-10">Loading featured activities…</p>
  }

  if (featuredActivities.length === 0) {
    return <p className="text-center py-10">No featured activities found.</p>
  }

  return (
    <section className="py-16 px-4 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-purple-700 mb-8 text-center py-10">
          FEATURED ACTIVITIES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredActivities.map((activity) => (
            <Link
              key={activity.id}
              href={`/activities/${activity.id}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform group-hover:shadow-lg">
                <div className="relative h-48">
                  <Image
                    src={activity.image || "/placeholder.svg"}
                    alt={activity.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-sm font-bold">
                    Featured
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-purple-700 mb-2">
                    {activity.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{activity.category}</p>
                  <p className="text-gray-700 mb-4">
                    {activity.location?.city || "Unknown"}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-700 font-bold">
                      {activity.price}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {activity.ageRange}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/activities"
            className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-8 rounded-full"
          >
            VIEW ALL ACTIVITIES
          </Link>
        </div>
      </div>
    </section>
  )
}
