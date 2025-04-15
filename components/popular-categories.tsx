"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getCategories } from "../lib/firebase-service"
import type { Category } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Prompt } from "next/font/google"



const schoolbell = Prompt({
  weight: "400",
  subsets: ["latin"],
})


export default function PopularCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const categoriesData = await getCategories()
        setCategories(categoriesData)
        setError(null)
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("Failed to load categories. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="w-full py-12 text-center">
        <div className="animate-pulse">Loading categories...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full py-12 text-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <section className={`w-full py-12 px-4 md:px-6`}>
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-purple-700">
          MOST POPULAR CATEGORIES
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((category) => (
            <Link
              href={`/categories/${category.id}`}
              key={category.id}
              className="block transition-transform hover:scale-105"
            >
              <Card className="w-64 h-64 overflow-hidden border-0 rounded-xl shadow-md">
                <div className="relative w-full h-full">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-purple-300 w-full h-full" />
                  )}
                  <div className="absolute inset-0 bg-purple-900/60 flex items-center justify-center">
                    <CardContent className="p-0">
                      <h3 className="text-white text-2xl font-bold text-center">
                        {category.name.toUpperCase()}
                      </h3>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
