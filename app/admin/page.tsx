"use client"

import type React from "react"

import { useState } from "react"
import AdminDrawer from "../../components/admin/admin-drawer"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "../../lib/auth-context"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <AdminDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
        <div className={`transition-all duration-300 ${isDrawerOpen ? "ml-48" : "ml-14"}`}>
          <main className="p-4">{children}</main>
        </div>
        <Toaster />
      </div>
    </AuthProvider>
  )
}
