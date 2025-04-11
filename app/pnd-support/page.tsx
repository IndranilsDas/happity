import Link from "next/link"
import Image from "next/image"
import { pndResources } from "@/lib/data"

export default function PndSupportPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-4">Postnatal Depression Support</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          If you or someone you know is suffering from postnatal depression, loneliness, or other mental health issues
          after becoming a parent, we want to help. Our PND and Mental Wellness resources are here to support you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <Image
            src="https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="Mother and baby"
            width={600}
            height={400}
            className="rounded-lg w-full h-auto"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-purple-700 mb-4">What is Postnatal Depression?</h2>
          <p className="text-gray-700 mb-4">
            Postnatal depression (PND) is a type of depression that many parents experience after having a baby. It's a
            common problem, affecting more than 1 in 10 women within a year of giving birth. It can also affect fathers
            and partners. PND can start any time in the first year after giving birth and may develop suddenly or
            gradually. The symptoms can include persistent feelings of sadness, lack of enjoyment and interest in the
            wider world, lack of energy, trouble sleeping, and difficulty bonding with your baby. It's important to
            remember that having PND doesn't mean you're a bad parent or that you don't love your baby. It's a
            recognized mental health condition that can be treated with the right support.
          </p>

          <h3 className="text-xl font-bold text-purple-700 mb-3">When to Seek Help</h3>
          <p className="text-gray-700 mb-4">
            If you experience symptoms of depression for most of the day, every day, for more than two weeks, you should
            seek help. Talk to your GP, health visitor, or contact one of the support organizations listed below.
          </p>

          <h3 className="text-xl font-bold text-purple-700 mb-3">Remember</h3>
          <p className="text-gray-700">
            You're not alone in this. Many parents go through similar experiences, and help is available. Reaching out
            is the first step toward feeling better.
          </p>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold text-purple-700 mb-8 text-center">Helpful Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pndResources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-purple-700 mb-3">{resource.title}</h3>
              <p className="text-gray-700 mb-4">{resource.description}</p>
              <Link href={resource.link} className="text-purple-700 hover:text-purple-800 font-medium hover:underline">
                Read more →
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-purple-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">Support Organizations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-purple-700 mb-2">Association for Post Natal Illness</h3>
            <p className="text-gray-700 mb-3">Support for mothers suffering from postnatal illness</p>
            <p className="text-purple-700 font-medium">0808 123 4567</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-purple-700 mb-2">Mind</h3>
            <p className="text-gray-700 mb-3">Mental health charity offering information and support</p>
            <p className="text-purple-700 font-medium">0300 123 3393</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-purple-700 mb-2">Samaritans</h3>
            <p className="text-gray-700 mb-3">Confidential support for people in distress</p>
            <p className="text-purple-700 font-medium">116 123 (free 24-hour helpline)</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-700 mb-6">Find Local Support Groups</h2>
        <p className="text-gray-700 mb-8 max-w-3xl mx-auto">
          Connecting with other parents who understand what you're going through can be incredibly helpful. Find local
          support groups and activities that can help you build a supportive community.
        </p>
        <Link
          href="/"
          className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded"
        >
          FIND ACTIVITIES NEAR YOU
        </Link>
      </div>
    </div>
  )
}

