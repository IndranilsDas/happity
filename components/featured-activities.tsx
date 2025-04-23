"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { getAllActivities } from "@/lib/firebase-service"
import type { Activity } from "@/lib/types"
import { Gloria_Hallelujah } from "next/font/google"
import { MdLocationPin } from "react-icons/md"
import { DynaPuff } from "next/font/google"

const gloriahallelujah = Gloria_Hallelujah({
  subsets: ["latin"],
  weight: "400",
})

const dynapuff = DynaPuff({
  subsets: ["latin"],
  weight: "400",
})

// Create a motion‐wrapped Link to apply hover animations on the <a> itself
const MotionLink = motion(Link)

export default function FeaturedActivities() {
  const [featuredActivities, setFeaturedActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const all = await getAllActivities()
        const featured = all.filter((a: any) => a.featured)
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
  if (!featuredActivities.length) {
    return <p className="text-center py-10">No featured activities found.</p>
  }

  return (
    <section className="py-16 px-4 md:px-12 bg-white bg-[url('/images/clouds.jpg')] bg-cover bg-no-repeat">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <h2
          className={`
            inline-block 
            text-3xl md:text-4xl 
            font-bold text-white
            py-4 px-6 
            rounded-md mb-12 mx-auto
            ${dynapuff.className}
          `}
        >
          FEATURED ACTIVITIES
        </h2>

        {/* Activity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredActivities.map((activity) => (
            <Link key={activity.id} href={`/activities/${activity.id}`}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer overflow-hidden rounded-2xl bg-white/50 backdrop-blur-lg shadow-lg transition-shadow hover:shadow-2xl"
              >
                {/* Image + Featured Badge */}
                <div className="relative h-48">
                  <Image
                    src={activity.image || "/placeholder.svg"}
                    alt={activity.name}
                    fill
                    className="object-cover"
                  />
                  <span
                    className="absolute top-3 left-3 bg-yellow-500 px-2 py-1 text-xs font-semibold uppercase text-white rounded"
                  >
                    Featured
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3
                    className={`mb-2 text-2xl font-bold text-purple-700 ${dynapuff.className}`}
                  >
                    {activity.name}
                  </h3>

                  <span className="mb-3 inline-block rounded-full bg-purple-100 px-3 py-1 text-sm uppercase text-purple-700">
                    {activity.category}
                  </span>

                  <p className="mb-4 flex items-center text-gray-600">
                    <MdLocationPin className="mr-1 text-purple-500" />
                    {activity.location?.city || "Unknown"}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-md font-bold text-black">
                    ₹{activity.price}
                    </span>
                    <span className="rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-800">
                      {activity.ageRange}
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* View All Activities Button */}
        <div className="mt-12 text-center">
          <MotionLink
            href="/activities"
            whileHover={{ scale: 1.1 }}
            className="inline-block rounded-full bg-purple-700 px-8 py-3 font-bold text-white transition-colors hover:bg-purple-800"
          >
            VIEW ALL ACTIVITIES
          </MotionLink>
        </div>
      </div>
    </section>
  )
}
