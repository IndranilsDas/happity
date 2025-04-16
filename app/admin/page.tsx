"use client"

import { useState, useEffect } from "react"
import { BarChart3, Calendar, DollarSign, MapPin, Star, Users, ActivityIcon, TrendingUp, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import type { Activity } from "@/lib/types"
import { getAllActivities } from "@/lib/firebase-service"
import AdminDrawer from "@/components/admin/admin-drawer"

export default function AdminDashboard() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const { toast } = useToast()
  const { user, role } = useAuth()

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const data = await getAllActivities()
      setActivities(data)
    } catch (error) {
      console.error("Error fetching activities:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load activities",
      })
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const totalActivities = activities.length
  const featuredActivities = activities.filter((a) => a.featured).length
  const totalRevenue = activities.reduce((sum, activity) => sum + (Number.parseFloat(activity.price) || 0), 0)

  // Get unique categories and providers
  const uniqueCategories = new Set(activities.map((a) => a.category))
  const uniqueProviders = new Set(activities.map((a) => a.provider?.id).filter(Boolean))
  const uniqueLocations = new Set(activities.map((a) => a.location?.city).filter(Boolean))

  // Get category distribution
  const categoryDistribution = activities.reduce(
    (acc, activity) => {
      const category = activity.category
      acc[category] = (acc[category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Sort categories by count
  const sortedCategories = Object.entries(categoryDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Get recent activities
  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex">
      <AdminDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} />
      <div
        className="p-8 space-y-6"
        style={{
          width: isDrawerOpen ? "calc(100% - 12rem)" : "calc(100% - 3.5rem)",
          marginLeft: isDrawerOpen ? "12rem" : "3.5rem",
        }}
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Overview of all activities and statistics</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              <ActivityIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalActivities}</div>
              <p className="text-xs text-muted-foreground">
                {totalActivities > 0 ? `${featuredActivities} featured` : "No activities"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Avg. ${(totalActivities ? totalRevenue / totalActivities : 0).toFixed(2)} per activity
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueCategories.size}</div>
              <p className="text-xs text-muted-foreground">
                {uniqueCategories.size > 0 ? "Unique activity categories" : "No categories"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Providers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueProviders.size}</div>
              <p className="text-xs text-muted-foreground">
                {uniqueProviders.size > 0 ? "Active service providers" : "No providers"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Top Categories</CardTitle>
              <CardDescription>Distribution of activities by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedCategories.map(([category, count]) => (
                  <div key={category} className="flex items-center">
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{category}</span>
                        <span className="text-sm font-medium">{count} activities</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${(count / totalActivities) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
                {sortedCategories.length === 0 && (
                  <p className="text-sm text-muted-foreground">No categories available</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Additional metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Locations</p>
                    <p className="text-sm text-muted-foreground">{uniqueLocations.size} unique cities</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Featured</p>
                    <p className="text-sm text-muted-foreground">
                      {featuredActivities} activities ({Math.round((featuredActivities / totalActivities) * 100) || 0}%)
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">This Month</p>
                    <p className="text-sm text-muted-foreground">
                      {
                        activities.filter((a) => {
                          const date = new Date(a.date)
                          const now = new Date()
                          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
                        }).length
                      }{" "}
                      new activities
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Avg. Price</p>
                    <p className="text-sm text-muted-foreground">
                      ${(totalActivities ? totalRevenue / totalActivities : 0).toFixed(2)} per activity
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest activities added to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Featured</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No activities found
                    </TableCell>
                  </TableRow>
                ) : (
                  recentActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.name}</TableCell>
                      <TableCell>{activity.category}</TableCell>
                      <TableCell>{activity.location?.city || "Unknown"}</TableCell>
                      <TableCell>${activity.price}</TableCell>
                      <TableCell>
                        {activity.featured ? <Badge>Yes</Badge> : <Badge variant="outline">No</Badge>}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
