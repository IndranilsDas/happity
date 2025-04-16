'use client'
import { Inter } from "next/font/google"
import { useEffect } from "react"
import "./globals.css"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { usePathname, useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Walter_Turncoat } from "next/font/google"

const walterTurncoat = Walter_Turncoat({
  weight: "400",
  subsets: ["latin"],
})

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <AuthWrapper>{children}</AuthWrapper>
      </AuthProvider>
    </html>
  )
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isAdminOrProvider = pathname.startsWith("/admin") || pathname.startsWith("/provider")

  useEffect(() => {
    if (loading) return

    if (pathname.startsWith("/admin") && role !== "admin") {
      router.push("/")
    }
    if (pathname.startsWith("/provider") && role !== "provider") {
      router.push("/")
    }

    if (pathname.startsWith("/protected") && !user) {
      router.push("/sign-up")
    }
  }, [user, role, loading, pathname, router])

  if (loading) {
    return (
      <body className={`${inter.className} bg-white text-gray-900`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </body>
    )
  }

  return (
    <body className={`${isAdminOrProvider ? inter.className : walterTurncoat.className} bg-white text-gray-900`}>
      {!isAdminOrProvider &&
        !pathname.startsWith("/sign-up") &&
        !pathname.startsWith("/sign-in") && <Header />}
      <main>{children}</main>
      {!isAdminOrProvider &&
        !pathname.startsWith("/sign-up") &&
        !pathname.startsWith("/sign-in") && <Footer />}
    </body>
  )
}
