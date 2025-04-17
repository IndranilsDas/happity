"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomDatePicker } from "@/components/ui/date-picker"

import { uploadImage, getAllCategories, getAllProviders, type CategoryFormat } from "@/lib/firebase-service"
import type { Activity, Provider } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    category: z.string().min(1, { message: "Category is required." }),
    ageRange: z.string().min(1, { message: "Age range is required." }),
    price: z.number().nonnegative({ message: "Price must be a positive number." }),
    has_range: z.boolean().default(false),
    start_date: z.date().optional(),
    end_date: z.date().optional(),
    imageFile: z
      .any()
      .optional()
      .refine((f) => !f || (f instanceof File && f.size > 0), {
        message: "Please select a valid image file",
      }),
    featured: z.boolean().default(false),
    days: z.array(z.string()).min(1, { message: "At least one day is required." }),
    times: z.array(z.string()).min(1, { message: "At least one time is required." }),
    provider: z.string().min(1, { message: "Please select a provider." }),
    // Add location fields
    address: z.string().min(1, { message: "Address is required." }),
    city: z.string().min(1, { message: "City is required." }),
    postcode: z.string().min(1, { message: "Postcode is required." }),
  })
  .refine((data) => !data.has_range || (data.start_date && data.end_date && data.start_date <= data.end_date), {
    message: "Start and end date are required and must be valid when range is enabled.",
    path: ["start_date"],
  })

type FormValues = z.infer<typeof formSchema>

interface ActivityFormProps {
  activity?: Activity
  onSubmit?: (data: Partial<Activity>) => Promise<void>
}

export default function AdminActivityForm({ activity, onSubmit }: ActivityFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(activity?.image || null)
  const [categories, setCategories] = useState<CategoryFormat[]>([])
  const [providers, setProviders] = useState<Provider[]>([])

  // Initialize form with default values or activity data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: activity
      ? {
          name: activity.name,
          description: activity.description,
          category: activity.category,
          ageRange: activity.ageRange,
          price: activity.price ? Number.parseFloat(activity.price) : 0,
          has_range: false,
          days: activity.days || [],
          times: activity.times || [],
          featured: activity.featured || false,
          imageFile: undefined,
          provider: activity.provider?.id || "me",
          // Add location fields with default values from activity
          address: activity.location?.address || "",
          city: activity.location?.city || "",
          postcode: activity.location?.postcode || "",
        }
      : {
          name: "",
          description: "",
          category: "",
          ageRange: "",
          price: 0,
          has_range: false,
          days: [],
          times: [],
          featured: false,
          imageFile: undefined,
          provider: "me", // Default to current admin
          // Add empty location fields
          address: "",
          city: "",
          postcode: "",
        },
  })

  // Load categories
  useEffect(() => {
    getAllCategories()
      .then(setCategories)
      .catch((err) => {
        console.error("Failed to load categories", err)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load categories",
        })
      })
  }, [toast])

  // Load providers
  useEffect(() => {
    getAllProviders()
      .then(setProviders)
      .catch((err) => {
        console.error("Failed to load providers", err)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load providers",
        })
      })
  }, [toast])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue("imageFile", file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  // Improve the handleSubmit function to handle errors better
  async function handleSubmit(values: FormValues) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to create an activity",
      })
      return
    }

    setIsLoading(true)
    try {
      // Build the base payload from the form values
      const payload: Partial<Activity> = {
        name: values.name,
        description: values.description,
        category: values.category,
        ageRange: values.ageRange,
        price: values.price.toString(),
        days: values.days,
        times: values.times,
        featured: values.featured,
        // Add location object
        location: {
          address: values.address || "",
          city: values.city || "",
          postcode: values.postcode || "",
        },
        status: "completed", // Set status to completed for admin-created activities
      }

      // Upload the image if provided
      if (values.imageFile instanceof File) {
        try {
          payload.image = await uploadImage(values.imageFile, "activities")
        } catch (imageError) {
          console.error("Image upload failed:", imageError)
          toast({
            variant: "destructive",
            title: "Warning",
            description: "Image upload failed, but activity will be created without an image",
          })
        }
      }

      // Determine the provider object
      if (values.provider === "me") {
        // Use the current admin as provider
        payload.provider = {
          id: user.uid,
          name: user.displayName || "Admin",
          image: user.photoURL || "",
        }
      } else {
        // Find the selected provider from the loaded providers list
        const selectedProvider = providers.find((p) => p.id === values.provider)
        if (selectedProvider) {
          payload.provider = {
            id: selectedProvider.id,
            name: selectedProvider.name,
            image: selectedProvider.image || "",
          }
        }
      }

      // Handle date range if enabled
      if (values.has_range && values.start_date && values.end_date) {
        payload.date = `${values.start_date.toLocaleDateString()} - ${values.end_date.toLocaleDateString()}`
      }

      console.log("Submitting activity payload:", payload)

      if (onSubmit) {
        await onSubmit(payload)
      }

      toast({
        title: "Success",
        description: activity ? "Activity updated" : "Activity created",
      })
      form.reset()
      setPreviewUrl(null)
      router.back()
    } catch (err) {
      console.error("Activity submission error:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save activity. Please check console for details.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{activity ? "Edit Activity" : "New Activity"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Baby Yoga" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the activity..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Dropdown */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full rounded-md border border-input bg-background px-3 py-2">
                      <option value="">— Select a category —</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Age Range */}
            <FormField
              control={form.control}
              name="ageRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age Range</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 0-12 months" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 12"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value === "" ? "" : Number.parseFloat(e.target.value)
                        field.onChange(value)
                      }}
                      value={field.value == null ? "" : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Fields */}
            <div className="space-y-4 border rounded-md p-4">
              <h3 className="font-medium">Location</h3>

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Postcode */}
              <FormField
                control={form.control}
                name="postcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postcode</FormLabel>
                    <FormControl>
                      <Input placeholder="Postcode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Provider Dropdown - ADMIN ONLY */}
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* "me" option for the admin */}
                      <SelectItem value="me">Me (Admin)</SelectItem>
                      {/* Map each provider from the loaded list */}
                      {providers.map((prov) => (
                        <SelectItem key={prov.id} value={prov.id}>
                          {prov.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select who will provide this activity</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Range Toggle */}
            <FormField
              control={form.control}
              name="has_range"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>Has Date Range?</FormLabel>
                </FormItem>
              )}
            />

            {/* Start Date */}
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <CustomDatePicker
                      disabled={!form.watch("has_range")}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Date */}
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <CustomDatePicker
                      disabled={!form.watch("has_range")}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Days */}
            <FormField
              control={form.control}
              name="days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Days</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <label key={day} className="flex items-center gap-2">
                          <Switch
                            checked={field.value?.includes(day)}
                            onCheckedChange={(checked) => {
                              const value = field.value || []
                              field.onChange(checked ? [...value, day] : value.filter((d) => d !== day))
                            }}
                          />
                          {day}
                        </label>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Times */}
            <FormField
              control={form.control}
              name="times"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Slots</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      {field.value?.map((time, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <Input
                            value={time}
                            onChange={(e) => {
                              const newTimes = [...(field.value || [])]
                              newTimes[idx] = e.target.value
                              field.onChange(newTimes)
                            }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => field.onChange((field.value || []).filter((_, i) => i !== idx))}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button type="button" size="sm" onClick={() => field.onChange([...(field.value || []), ""])}>
                        Add Time Slot
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Featured Toggle */}
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>Featured</FormLabel>
                </FormItem>
              )}
            />

            {/* Image Upload with Preview */}
            <FormField
              control={form.control}
              name="imageFile"
              render={() => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={handleImageChange} />
                  </FormControl>
                  <FormDescription>Optional: pick an image from your device</FormDescription>
                  {previewUrl && (
                    <div className="mt-2">
                      <Image
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="object-cover rounded-md border"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (activity ? "Updating..." : "Creating...") : activity ? "Update" : "Create"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
