"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { getActivitiesByCategory, categories } from "@/lib/data"
import type { Activity } from "@/lib/data"

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])
  const [category, setCategory] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.slug) {
      // Convert slug back to category name
      const slug = params.slug as string
      const categoryName = slug
        .split("-")
        .map((word) => word.toUpperCase())
        .join(" ")

      // Find the matching category
      const matchingCategory = categories.find(
        (cat) => cat.name === categoryName || cat.name.replace(/\s+/g, "-").toLowerCase() === slug,
      )

      if (matchingCategory) {
        setCategory(matchingCategory.name)
        const categoryActivities = getActivitiesByCategory(matchingCategory.name)
        setActivities(categoryActivities)
      } else {
        // Try to get activities by the slug converted to category name
        const activitiesBySlug = getActivitiesByCategory(categoryName)
        if (activitiesBySlug.length > 0) {
          setCategory(categoryName)
          setActivities(activitiesBySlug)
        }
      }
      setLoading(false)
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <button onClick={() => router.back()} className="flex items-center text-purple-700 hover:text-purple-800 mb-6">
        <ArrowLeft className="h-5 w-5 mr-1" />
        Back
      </button>

      <h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-8 text-center">
        {category || "Category"} Activities
      </h1>

      {activities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity) => (
            <Link key={activity.id} href={`/activities/${activity.id}`} className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform group-hover:shadow-lg">
                <div className="relative h-48">
                  <Image src={activity.image || "/placeholder.svg"} alt={activity.name} fill className="object-cover" />
                  {activity.featured && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-sm font-bold">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-purple-700 mb-2">{activity.name}</h3>
                  <p className="text-gray-600 mb-2">{activity.category}</p>
                  <p className="text-gray-700 mb-4">{activity.location.city}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-700 font-bold">{activity.price}</span>
                    <span className="text-gray-600 text-sm">{activity.ageRange}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No activities found in this category.</p>
          <Link
            href="/"
            className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-8 rounded"
          >
            BACK TO HOME
          </Link>
        </div>
      )}

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-purple-700 mb-6">Can't find what you're looking for?</h2>
        <p className="text-gray-600 mb-6">Try searching for activities near you or browse all our categories.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-8 rounded"
          >
            SEARCH ACTIVITIES
          </Link>
          <Link
            href="/list-activity"
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded"
          >
            LIST YOUR ACTIVITY
          </Link>
        </div>
      </div>
    </div>
  )
}

