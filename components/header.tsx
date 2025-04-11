import Image from "next/image"
import Link from "next/link"
import { User } from "lucide-react"

export default function Header() {
  return (
    <>
      <div className="bg-yellow-400 py-3 text-center">
        <p className="text-sm md:text-base">FREE COFFEE AT WAGAMAMA 🔵</p>
        <p className="text-sm md:text-base">
          Download their new rewards app Soul Club and enjoy a free Grind coffee 🛒 T&C&apos;s apply,
          <Link href="#" className="underline ml-1">
            head to wagamama.
          </Link>
        </p>
      </div>
      <header className="flex justify-between items-center px-4 md:px-12 py-4 bg-white">
        <Link href="/" className="flex items-center">
          <Image
            src="/placeholder.svg?height=60&width=200"
            alt="Happity Logo"
            width={200}
            height={60}
            className="h-12 w-auto"
          />
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#" className="text-gray-700 hover:text-purple-700 font-medium">
            FIND AN ACTIVITY
          </Link>
          <Link href="#" className="text-gray-700 hover:text-purple-700 font-medium">
            PND SUPPORT
          </Link>
          <Link href="#" className="text-gray-700 hover:text-purple-700 font-medium">
            BLOG
          </Link>
          <Link href="#" className="text-gray-700 hover:text-purple-700 font-medium">
            OFFERS
          </Link>
          <Link href="#" className="text-gray-700 hover:text-purple-700 font-medium">
            ABOUT
          </Link>
          <Link href="#" className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded font-medium">
            ADD ACTIVITY
          </Link>
          <Link href="#" className="text-purple-700">
            <User size={24} />
          </Link>
        </nav>
        <div className="md:hidden">
          {/* Mobile menu button would go here */}
          <button className="text-purple-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </header>
    </>
  )
}

