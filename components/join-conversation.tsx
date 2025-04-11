import Link from "next/link"
import { Facebook, Instagram } from "lucide-react"

export default function JoinConversation() {
  return (
    <section className="py-16 px-4 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-6">JOIN THE CONVERSATION!</h2>
            <p className="text-gray-700 mb-6">
              Our community of parents and providers is what Happity is all about and we want you to be involved.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full">
                <Facebook size={24} />
              </Link>
              <Link href="#" className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full">
                <Instagram size={24} />
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0">
                <svg viewBox="0 0 300 300" width="100%" height="100%">
                  <path
                    d="M40,20 C10,20 10,50 10,80 L10,180 C10,220 30,240 70,240 L180,240 C230,240 250,220 250,170 L250,80 C250,40 230,20 190,20 L40,20 Z"
                    fill="#FF3E96"
                    stroke="#FF3E96"
                    strokeWidth="10"
                  />
                  <path
                    d="M70,240 C60,280 40,290 10,290 C40,270 50,260 50,240"
                    fill="#FF3E96"
                    stroke="#FF3E96"
                    strokeWidth="10"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <p className="text-white text-4xl md:text-5xl font-bold leading-tight">
                  lets talk
                  <br />
                  about
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

