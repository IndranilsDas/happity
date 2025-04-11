import Image from "next/image"
import Link from "next/link"

export default function PndSupport() {
  return (
    <section className="py-16 px-4 md:px-12 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <Image
              src="https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="Mother and baby"
              width={600}
              height={400}
              className="rounded-md w-full h-auto"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-700 mb-4">PND SUPPORT</h2>
            <p className="text-gray-700 mb-6">
              If you or someone you know is suffering from postnatal depression, loneliness, or other mental health
              issues after becoming a parent, we want to help. Our PND and Mental Wellness pages contain a number of
              useful resources, phone numbers, and articles.
            </p>
            <Link
              href="#"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded"
            >
              GO TO RESOURCES
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

