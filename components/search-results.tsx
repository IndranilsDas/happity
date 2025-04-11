"use client"

import Link from "next/link"
import Image from "next/image"
import type { Activity } from "@/lib/data"
import { ArrowLeft } from "lucide-react"

interface SearchResultsProps {
  results: Activity[]
  query: string
  onClearSearch: () => void
}

export default function SearchResults({ results, query, onClearSearch }: SearchResultsProps) {
  return (
    <section className="py-16 px-4 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <button onClick={onClearSearch} className="flex items-center text-purple-700 hover:text-purple-800 mr-4">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-purple-700">
            {results.length > 0
              ? `Search Results${query ? ` for "${query}"` : ""}`
              : `No results found${query ? ` for "${query}"` : ""}`}
          </h2>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((activity) => (
              <Link key={activity.id} href={`/activities/${activity.id}`} className="group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform group-hover:shadow-lg">
                  <div className="relative h-48">
                    <Image
                      src={activity.image || "/placeholder.svg"}
                      alt={activity.name}
                      fill
                      className="object-cover"
                    />
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
            <p className="text-gray-600 mb-4">We couldn't find any activities matching your search.</p>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or browse our popular categories below.
            </p>
            <Link
              href="/activities"
              className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-8 rounded"
            >
              BROWSE ALL ACTIVITIES
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

