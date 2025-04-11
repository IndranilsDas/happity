import Image from "next/image"
import Link from "next/link"

export default function CommunitySection() {
  return (
    <section className="py-16 px-4 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-12 text-center">
          YOUR LOCAL BABY AND TODDLER COMMUNITY
        </h2>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <Image
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
              alt="Happity Team"
              width={600}
              height={400}
              className="rounded-md w-full h-auto"
            />
          </div>
          <div className="md:w-1/2">
            <h3 className="text-xl md:text-2xl font-bold text-purple-700 mb-4">ABOUT US</h3>
            <p className="text-gray-700 mb-6">
              Created by two mums who both experienced loneliness and isolation after giving birth, Happity is your
              go-to site for finding birth, baby and toddler activities where you live. Now staffed by a small but
              mighty team of parents (and some not-parents!), we&apos;re on a mission to end parent loneliness once and
              for all. We&apos;re so happy you found us!
            </p>
            <Link
              href="#"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded"
            >
              READ MORE
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

