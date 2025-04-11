import Link from "next/link"
import { cities } from "@/lib/data"

export default function LocationsList() {
  // Split cities into 4 columns
  const columns = [[], [], [], []]
  cities.forEach((city, index) => {
    const columnIndex = index % 4
    columns[columnIndex].push(city)
  })

  return (
    <section className="py-16 px-4 md:px-12 bg-purple-700 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
          Happity lists birth, baby & toddler classes all over the UK.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="space-y-4">
              {column.map((city, locIndex) => (
                <Link
                  key={locIndex}
                  href={`/cities/${city.name.toLowerCase()}`}
                  className="block font-bold hover:underline"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/search"
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded"
          >
            SEARCH NEAR YOU
          </Link>
        </div>
      </div>
    </section>
  )
}

