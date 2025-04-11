import Link from "next/link"
import { Facebook, Instagram, Mail } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-purple-700 text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Join the conversation</h3>
            <div className="flex space-x-4 mb-6">
              <Link href="#" className="bg-white hover:bg-gray-200 text-purple-700 p-3 rounded-full">
                <Instagram size={24} />
              </Link>
              <Link href="#" className="bg-white hover:bg-gray-200 text-purple-700 p-3 rounded-full">
                <Mail size={24} />
              </Link>
              <Link href="#" className="bg-white hover:bg-gray-200 text-purple-700 p-3 rounded-full">
                <Facebook size={24} />
              </Link>
            </div>
            <div className="mt-8">
              <Image
                src="/placeholder.svg?height=50&width=120"
                alt="Analytics by Heap"
                width={120}
                height={50}
                className="h-auto"
              />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:underline">
                  Terms & privacy policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Cookies policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Invest
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Partners & press
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">For Providers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:underline">
                  Log in
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  List an activity
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Franchises for sale
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Take bookings
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Help centre
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-purple-600 text-sm">
          <p>
            © 2025 Happity Ltd. All rights reserved. By using this site you agree to our terms and conditions and
            privacy policy. This site uses cookies.
          </p>
        </div>
      </div>
    </footer>
  )
}

