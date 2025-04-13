"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { addProvider, updateProvider, uploadImage } from "@/lib/firebase-service"
import type { Provider } from "@/lib/types"

interface ProviderFormProps {
  provider?: Provider | null
  onClose: (refreshData?: boolean) => void
}

export default function ProviderForm({ provider, onClose }: ProviderFormProps) {
  const [formData, setFormData] = useState<Omit<Provider, "id">>({
    name: "",
    description: "",
    image: "",
    activities: 0,
    location: "",
    rating: 5,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (provider) {
      setFormData({
        name: provider.name,
        description: provider.description,
        image: provider.image,
        activities: provider.activities,
        location: provider.location,
        rating: provider.rating,
      })
      setImagePreview(provider.image)
    }
  }, [provider])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "activities" || name === "rating" ? Number(value) : value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)

      let imageUrl = formData.image

      // Upload image if a new one was selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "providers")
      }

      const providerData = {
        ...formData,
        image: imageUrl,
      }

      if (provider) {
        // Update existing provider
        await updateProvider(provider.id, providerData)
        toast({
          title: "Success",
          description: "Provider updated successfully",
        })
      } else {
        // Add new provider
        await addProvider(providerData)
        toast({
          title: "Success",
          description: "Provider added successfully",
        })
      }

      onClose(true) // Close form and refresh data
    } catch (error) {
      console.error("Error saving provider:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save provider",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Provider Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="activities">Number of Activities</Label>
          <Input
            id="activities"
            name="activities"
            type="number"
            min="0"
            value={formData.activities}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rating">Rating (0-5)</Label>
          <Input
            id="rating"
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Provider Image</Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("image")?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" /> Upload Image
          </Button>
          <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          <span className="text-sm text-muted-foreground">{imageFile ? imageFile.name : "No file selected"}</span>
        </div>
      </div>

      {imagePreview && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Image Preview</p>
          <div className="relative w-40 h-40 rounded-md overflow-hidden border">
            <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>{provider ? "Update" : "Add"} Provider</>
          )}
        </Button>
      </div>
    </form>
  )
}
