import Link from "next/link"
import Image from "next/image"
import { categories } from "@/lib/data"

export default function PopularCategories() {
  return (
    <section className="py-16 px-4 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-12 text-center">MOST POPULAR CATEGORIES</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="relative group overflow-hidden rounded-md h-40"
            >
              <div className="absolute inset-0 bg-purple-700 opacity-60 group-hover:opacity-70 transition-opacity"></div>
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                width={300}
                height={160}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold text-center">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

