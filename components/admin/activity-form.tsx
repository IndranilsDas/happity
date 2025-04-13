"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import type { Activity } from "@/lib/types"
import { uploadImage, getAllCategories, type CategoryFormat } from "@/lib/firebase-service"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  category: z.string().optional(),
  ageRange: z.string().min(1, { message: "Age range is required." }),
  price: z.string().min(1, { message: "Price is required." }),
  days: z.array(z.string()).min(1, { message: "At least one day is required." }),
  times: z.array(z.string()).min(1, { message: "At least one time is required." }),
  imageFile: z
    .any()
    .optional()
    .refine((f) => !f || (f instanceof File && f.size > 0), {
      message: "Please select a valid image file",
    }),
  featured: z.boolean().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface ActivityFormProps {
  activity?: Activity
  onSubmit: (data: Partial<Activity>) => Promise<void>
}

export default function ActivityForm({ activity, onSubmit }: ActivityFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<CategoryFormat[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: activity?.name ?? "",
      description: activity?.description ?? "",
      category: activity?.category ?? "",
      ageRange: activity?.ageRange ?? "",
      price: activity?.price ?? "",
      days: activity?.days ?? [],
      times: activity?.times ?? [],
      imageFile: undefined,
      featured: activity?.featured ?? false,
    },
  })

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
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue("imageFile", file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(values: FormValues) {
    setIsLoading(true)
    try {
      const payload: Partial<Activity> = {
        name: values.name,
        description: values.description,
        category: values.category,
        ageRange: values.ageRange,
        price: values.price,
        days: values.days,
        times: values.times,
        featured: values.featured,
      }

      if (values.imageFile instanceof File) {
        payload.image = await uploadImage(values.imageFile, "activities")
      }

      await onSubmit(payload)
      toast({
        title: "Success",
        description: activity ? "Activity updated" : "Activity created",
      })
      form.reset()
      setPreviewUrl(null)
      router.back()
    } catch (err) {
      console.error(err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save activity",
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
                    <select
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="">— none —</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormDescription>Pick one of your Firestore categories</FormDescription>
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
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. £12 per session" {...field} />
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
                    <Input
                      placeholder="e.g. Monday, Wednesday"
                      value={field.value.join(", ")}
                      onChange={(e) =>
                        field.onChange(e.target.value.split(",").map((s) => s.trim()))
                      }
                    />
                  </FormControl>
                  <FormDescription>Comma‑separated list</FormDescription>
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
                  <FormLabel>Times</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 10:00, 11:30"
                      value={field.value.join(", ")}
                      onChange={(e) =>
                        field.onChange(e.target.value.split(",").map((s) => s.trim()))
                      }
                    />
                  </FormControl>
                  <FormDescription>Comma‑separated list</FormDescription>
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
                    <input
                      type="checkbox"
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      className="h-4 w-4 rounded border"
                    />
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
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mt-2 w-32 h-32 object-cover rounded-md border"
                    />
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
              {isLoading ? (activity ? "Updating..." : "Creating...") : (activity ? "Update" : "Create")}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
