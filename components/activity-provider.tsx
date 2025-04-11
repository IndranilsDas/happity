import Link from "next/link"

export default function ActivityProvider() {
  return (
    <section className="py-16 px-4 md:px-12 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-6">ACTIVITY PROVIDER? LET US HELP</h2>
            <p className="text-gray-700 mb-6">
              Listing with Happity is completely free, and it takes less than 3 minutes to register.
            </p>
            <Link
              href="#"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded"
            >
              LIST FOR FREE
            </Link>
          </div>
          <div className="md:w-1/2">
            <p className="text-gray-700 mb-6">
              With 2.6m parents using Happity, we are the UK&apos;s most-loved platform for finding baby and toddler
              classes.
            </p>
            <p className="text-gray-700 mb-6">
              Whether you want help reaching more families, need a booking system, or are just getting started,
              we&apos;re here to support your journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

