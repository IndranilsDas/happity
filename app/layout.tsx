'use client'
import { Inter } from "next/font/google"
import { useEffect } from "react"
import "./globals.css"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { usePathname, useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AuthWrapper>{children}</AuthWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return

    // Redirect rules
    if (pathname.startsWith("/admin") && role !== "admin") {
      router.push("/")
    }
    if (pathname.startsWith("/protected") && !user) {
      router.push("/sign-up")
    }
  }, [user, role, loading, pathname, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <>
      {!pathname.startsWith("/admin") && <Header />}
      <main className="min-h-[calc(100vh-140px)]">{children}</main>
      {!pathname.startsWith("/admin") && <Footer />}
    </>
  )
}