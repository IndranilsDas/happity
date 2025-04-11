import Link from "next/link"

export default function Newsletter() {
  return (
    <section className="py-16 px-4 md:px-12 bg-purple-700 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">GET OUR NEWSLETTER!</h2>
            <p className="mb-6">
              For the best classes in your area, plus activity ideas, parenting tips, offers, and more, sign-up to the
              Happity newsletter.
            </p>
            <Link
              href="#"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded w-full text-center"
            >
              SIGN UP
            </Link>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">KNOW ABOUT A GREAT CLASS?</h2>
            <p className="mb-6">
              Become a Happity Local Expert, and earn vouchers when you tell us about classes in your area! It&apos;s
              quick and easy to get started.
            </p>
            <Link
              href="#"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded w-full text-center"
            >
              FIND OUT MORE
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

