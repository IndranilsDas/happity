"use client"

import Image from "next/image"
import Link from "next/link"
import { User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "../lib/auth-context"  // adjust path to your AuthContext file

export default function Header() {
  const router = useRouter()
  const { user, role, loading } = useAuth()

  const handleProfileClick = () => {
    if (user && role === "customer") {
      router.push(`/profile/${user.uid}`)
    }
  }

  return (
    <>
      
      <header className="flex justify-between items-center px-4 md:px-12 py-2 bg-white">
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
          <Link href="#" className="text-gray-700 hover:text-purple-700 font-medium text-sm">
            FIND AN ACTIVITY
          </Link>
          <Link href="#" className="text-gray-700 hover:text-purple-700 font-medium text-sm">
            PND SUPPORT
          </Link>
          <Link href="#" className="text-gray-700 hover:text-purple-700 font-medium text-sm">
            BLOG
          </Link>
          <Link href="#" className="text-gray-700 hover:text-purple-700 font-medium text-sm">
            OFFERS
          </Link>
          <Link href="#" className="text-gray-700 hover:text-purple-700 font-medium text-sm">
            ABOUT
          </Link>
          <Link href="#" className="bg-yellow-400 hover:bg-purple-500 text-black hover:text-white duration-300 px-4 py-2 rounded font-medium text-sm">
            ADD ACTIVITY
          </Link>
          {loading ? (
            <span className="text-gray-400">Loading...</span>
          ) : role === "customer" && user ? (
            <button onClick={handleProfileClick} className="text-purple-700">
              <User size={24} />
            </button>
          ) : null}
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
