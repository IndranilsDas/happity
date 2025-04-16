"use client"

import { useEffect, useState } from "react"
import { Activity, DollarSign, Users, BarChart, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import type { Activity as ActivityType } from "@/lib/types"
import { getAllActivities } from "@/lib/firebase-service"
import ProviderDrawer from "@/components/provider/provider-drawer"

export default function ProviderDashboard() {
  const [activities, setActivities] = useState<ActivityType[]>([])
  const [loading, setLoading] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.uid) {
      fetchActivities()
    }
  }, [user])

  const fetchActivities = async () => {
    setLoading(true)
    try {
      const all = await getAllActivities()
      const mine = all.filter((a) => a.provider?.id === user?.uid)
      setActivities(mine)
    } catch (err) {
      console.error("Error fetching activities:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch activities",
      })
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const totalActivities = activities.length
  const totalRevenue = activities.reduce((sum, activity) => sum + (Number(activity.price) || 0), 0)
  const categoryCounts = activities.reduce(
    (acc, activity) => {
      const category = activity.category || "Uncategorized"
      acc[category] = (acc[category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex bg-gradient-to-tr from-amber-200 to-purple-300 min-h-screen">
      <ProviderDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} />
      <div
        className="p-6 space-y-6"
        style={{
          width: isDrawerOpen ? "calc(100% - 12rem)" : "calc(100% - 3.5rem)",
          marginLeft: isDrawerOpen ? "12rem" : "3.5rem",
        }}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalActivities}</div>
              <p className="text-xs text-muted-foreground">Activities you've created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Combined price of all activities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topCategory}</div>
              <p className="text-xs text-muted-foreground">
                {topCategory !== "None" ? `${categoryCounts[topCategory]} activities` : "No categories"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(categoryCounts).length}</div>
              <p className="text-xs text-muted-foreground">Unique activity categories</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Activity Categories</CardTitle>
              <CardDescription>Distribution of your activities by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <div key={category} className="flex items-center">
                    <div className="w-full max-w-md">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{category}</span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-purple-500 h-2.5 rounded-full"
                          style={{ width: `${(count / totalActivities) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Your most recently added activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${activity.price} • {activity.category}
                      </p>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && <p className="text-sm text-muted-foreground">No activities found</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
