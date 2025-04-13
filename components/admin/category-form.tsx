"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form, FormControl, FormDescription, FormField, FormItem,
  FormLabel, FormMessage
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { uploadImage, createCategoryInFirestore, updateCategoryInFirestore } from "@/lib/firebase-service"

const formSchema = z.object({
  name: z.string().min(2, { message: "Category name must be at least 2 characters." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters." }), // New description validation
  imageFile: z
    .any()
    .optional()
    .refine((file) => !file || (file instanceof File && file.size > 0), {
      message: "Please select a valid image file",
    }),
})

type FormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
  category?: {
    id?: string
    name: string
    description?: string
    image?: string
  } | null
  onSubmit: () => void
}

export default function CategoryForm({ category, onSubmit }: CategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(category?.image || null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "", // Initialize description
      imageFile: undefined,
    },
  })

  useEffect(() => {
    if (category?.image) {
      setPreviewUrl(category.image)
    }
  }, [category])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue("imageFile", file)
      const localUrl = URL.createObjectURL(file)
      setPreviewUrl(localUrl)
    }
  }

  async function handleSubmit(values: FormValues) {
    setIsLoading(true)
    try {
      let imageUrl = category?.image || ""

      if (values.imageFile instanceof File) {
        imageUrl = await uploadImage(values.imageFile, "categories")
      }

      if (category?.id) {
        await updateCategoryInFirestore(category.id, {
          name: values.name,
          description: values.description,
          image: imageUrl,
        })
        toast({ title: "Updated", description: "Category updated successfully" })
      } else {
        await createCategoryInFirestore({
          name: values.name,
          description: values.description,
          image: imageUrl,
        })
        toast({ title: "Created", description: "Category created successfully" })
      }

      onSubmit()
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save category",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl><Input placeholder="e.g. Music, Art" {...field} /></FormControl>
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
                <Input placeholder="Provide a short description" {...field} />
              </FormControl>
              <FormMessage />
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
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md border mt-2"
                />
              )}
              <FormDescription>Optional: Upload an image</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : category ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
