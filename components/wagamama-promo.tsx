import Image from "next/image"
import Link from "next/link"

export default function WagamamaPromo() {
  return (
    <section className="py-16 px-4 md:px-12 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <Image
              src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80"
              alt="Children eating at Wagamama"
              width={600}
              height={400}
              className="rounded-md w-full h-auto"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-700 mb-4">Happity Loves: wagamama</h2>
            <p className="text-gray-700 mb-6">
              wagamama go the extra mile for kids - from their activity sheets and crayon packs, to their katsu combo
              meals complete with mini chopsticks! Fresh, fun, balanced meals for the whole family... even the fussiest
              of eaters. This month, get a free coffee by downloading their Soul Club rewards app.
            </p>
            <Link
              href="#"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded"
            >
              FIND OUT MORE
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

