import Image from "next/image"

export default function HappityAwards() {
  return (
    <section className="py-16 px-4 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">HAPPITY AWARDS</h2>
        <div className="flex justify-center space-x-8">
          <Image
            src="/placeholder.svg?height=150&width=150"
            alt="Award 1"
            width={150}
            height={150}
            className="h-auto"
          />
          <Image
            src="/placeholder.svg?height=150&width=150"
            alt="Award 2"
            width={150}
            height={150}
            className="h-auto"
          />
        </div>
      </div>
    </section>
  )
}

