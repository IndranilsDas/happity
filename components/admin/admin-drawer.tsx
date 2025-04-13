"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Menu, Activity, Users, MapPin, Tag, FileText, LogOut } from 'lucide-react'
import { useAuth } from "../../lib/auth-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function AdminDrawer({ 
  isDrawerOpen, 
  toggleDrawer 
}: { 
  isDrawerOpen: boolean
  toggleDrawer: () => void 
}) {
  const { logout } = useAuth()
  const pathname = usePathname()

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: Home,
    },
    {
      name: "Activities",
      href: "/admin/activities",
      icon: Activity,
    },
    {
      name: "Providers",
      href: "/admin/providers",
      icon: Users,
    },
    {
      name: "Cities",
      href: "/admin/cities",
      icon: MapPin,
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: Tag,
    },
    {
      name: "PND Resources",
      href: "/admin/resources",
      icon: FileText,
    },
  ]

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gray-900 text-white shadow-lg transition-all duration-300 z-40 flex flex-col justify-between ${
        isDrawerOpen ? "w-48" : "w-14"
      }`}
    >
      {/* Top Section: Header + Menu Items */}
      <div>
        {/* Drawer Toggle Button */}
        <button
          onClick={toggleDrawer}
          className="absolute -right-3 top-4 bg-gray-700 text-white p-1 rounded-full shadow-md focus:outline-none"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {isDrawerOpen && <h2 className="text-lg font-semibold">Admin</h2>}
        </div>

        {/* Menu Items */}
        <ul className="flex flex-col justify-start space-y-2 p-4">
          {menuItems.map((item) => (
            <li key={item.name} className="group">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 p-2 rounded transition ${
                        pathname === item.href
                          ? "bg-gray-700 text-white"
                          : "text-gray-200 hover:bg-gray-700"
                      }`}
                    >
                      <span className="transition-transform duration-300">
                        <item.icon className={`h-5 w-5 ${!isDrawerOpen ? "mx-auto" : ""}`} />
                      </span>
                      {isDrawerOpen && <span>{item.name}</span>}
                    </Link>
                  </TooltipTrigger>
                  {!isDrawerOpen && (
                    <TooltipContent side="right">
                      {item.name}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Section: Sign Out Button */}
      <div className="p-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={logout}
                className="flex items-center space-x-3 text-gray-200 hover:bg-gray-700 p-2 rounded transition w-full"
              >
                <span className="transition-transform duration-300">
                  <LogOut className={`h-5 w-5 ${!isDrawerOpen ? "mx-auto" : ""}`} />
                </span>
                {isDrawerOpen && <span>Sign Out</span>}
              </button>
            </TooltipTrigger>
            {!isDrawerOpen && (
              <TooltipContent side="right">
                Sign Out
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
